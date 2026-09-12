local M = {}

local ENDPOINT = "https://bubble-safari-benchmark-ingest.aseelsalah266.workers.dev/report"
local FRAME_BIN_MS = 0.5
local FRAME_MAX_BIN = 200 -- 0..100 ms, with overflow folded into the last bin
local MAX_EVENT_SAMPLES = 256

local function now_ms()
    return socket and socket.gettime and socket.gettime() * 1000 or os.clock() * 1000
end

local function copy_and_sort(values)
    local copy = {}
    for i = 1, #values do copy[i] = values[i] end
    table.sort(copy)
    return copy
end

local function percentile(values, p)
    if #values == 0 then return 0 end
    local sorted = copy_and_sort(values)
    local index = math.ceil((p / 100) * #sorted)
    index = math.max(1, math.min(#sorted, index))
    return sorted[index]
end

local function avg(sum, count)
    if count == 0 then return 0 end
    return sum / count
end

local function append_bounded(values, value, max_count)
    if #values < max_count then values[#values + 1] = value end
end

local function histogram_add(histogram, value_ms)
    local index = math.floor(value_ms / FRAME_BIN_MS)
    index = math.max(0, math.min(FRAME_MAX_BIN, index))
    histogram[index] = (histogram[index] or 0) + 1
end

local function histogram_percentile(histogram, count, p)
    if count <= 0 then return 0 end
    local target = math.ceil((p / 100) * count)
    local seen = 0
    for index = 0, FRAME_MAX_BIN do
        seen = seen + (histogram[index] or 0)
        if seen >= target then return index * FRAME_BIN_MS end
    end
    return FRAME_MAX_BIN * FRAME_BIN_MS
end

local function make_id(prefix)
    local wall = os.time() or 0
    local mono = math.floor(now_ms() * 1000) % 1000000000
    return string.format("%s-%d-%09d", prefix, wall, mono)
end

local function load_or_create_install_id(path)
    local saved = sys.load(path)
    if saved and saved.install_id and saved.install_id ~= "" then
        return saved.install_id
    end
    local install_id = make_id("install")
    sys.save(path, { install_id = install_id })
    return install_id
end

local function engine_version()
    if sys.get_engine_info then
        local info = sys.get_engine_info()
        if info and info.version then return tostring(info.version) end
    end
    return "unknown"
end

function M.new()
    local install_path = sys.get_save_file("bubble-safari-tv", "telemetry-install")
    local pending_path = sys.get_save_file("bubble-safari-tv", "telemetry-pending")
    local sys_info = sys.get_sys_info({ ignore_secure = true })

    local t = {
        endpoint = ENDPOINT,
        install_path = install_path,
        pending_path = pending_path,
        install_id = load_or_create_install_id(install_path),
        session_id = make_id("session"),
        app_variant = "defold",
        app_version = sys.get_config_string("project.version", "unknown"),
        package_name = sys.get_config_string("android.package", "unknown"),
        engine_version = engine_version(),
        sys_info = sys_info,
        started_ms = now_ms(),
        started_unix = os.time() or 0,
        sequence = 0,
        inflight = false,
        frames = { count = 0, sum_ms = 0, max_ms = 0, slow_16_67 = 0, slow_25 = 0, histogram = {} },
        inputs = { count = 0, sum_ms = 0, max_ms = 0, samples = {} },
        transitions = { count = 0, sum_ms = 0, max_ms = 0, samples = {} },
        answers = { total = 0, correct = 0, wrong = 0 },
        questions_visible = 0,
        focus_changes = 0,
        settings_opens = 0,
        startup_internal_ms = 0,
        gc_start_kb = collectgarbage("count"),
        gc_peak_kb = collectgarbage("count"),
        last_send_status = "never",
    }
    return t
end

function M.record_frame(t, dt_ms)
    local f = t.frames
    f.count = f.count + 1
    f.sum_ms = f.sum_ms + dt_ms
    f.max_ms = math.max(f.max_ms, dt_ms)
    if dt_ms > 16.67 then f.slow_16_67 = f.slow_16_67 + 1 end
    if dt_ms > 25 then f.slow_25 = f.slow_25 + 1 end
    histogram_add(f.histogram, dt_ms)
    local gc = collectgarbage("count")
    if gc > t.gc_peak_kb then t.gc_peak_kb = gc end
end

function M.record_input(t, handled_ms)
    local x = t.inputs
    x.count = x.count + 1
    x.sum_ms = x.sum_ms + handled_ms
    x.max_ms = math.max(x.max_ms, handled_ms)
    append_bounded(x.samples, handled_ms, MAX_EVENT_SAMPLES)
end

function M.record_transition(t, ms)
    local x = t.transitions
    x.count = x.count + 1
    x.sum_ms = x.sum_ms + ms
    x.max_ms = math.max(x.max_ms, ms)
    append_bounded(x.samples, ms, MAX_EVENT_SAMPLES)
end

function M.record_answer(t, correct)
    t.answers.total = t.answers.total + 1
    if correct then t.answers.correct = t.answers.correct + 1 else t.answers.wrong = t.answers.wrong + 1 end
end

function M.record_question(t)
    t.questions_visible = t.questions_visible + 1
end

function M.record_focus(t)
    t.focus_changes = t.focus_changes + 1
end

function M.record_settings_open(t)
    t.settings_opens = t.settings_opens + 1
end

function M.set_startup(t, ms)
    t.startup_internal_ms = ms
end

local function snapshot(t, reason)
    local f = t.frames
    local i = t.inputs
    local q = t.transitions
    local gc_now = collectgarbage("count")
    local uptime_ms = math.max(0, now_ms() - t.started_ms)
    local fps = 0
    if f.sum_ms > 0 then fps = math.min(60, 1000 / (f.sum_ms / math.max(1, f.count))) end

    return {
        schema = 1,
        reason = reason,
        sequence = t.sequence,
        sent_unix = os.time() or 0,
        session_id = t.session_id,
        device_id = t.install_id,
        app_variant = t.app_variant,
        app_version = t.app_version,
        package_name = t.package_name,
        engine_version = t.engine_version,
        device = {
            manufacturer = t.sys_info.manufacturer or "unknown",
            model = t.sys_info.device_model or "unknown",
            system_name = t.sys_info.system_name or "unknown",
            system_version = t.sys_info.system_version or "unknown",
            api_version = t.sys_info.api_version or "unknown",
            device_language = t.sys_info.device_language or t.sys_info.language or "unknown",
            territory = t.sys_info.territory or "unknown",
        },
        session = {
            started_unix = t.started_unix,
            uptime_ms = uptime_ms,
            startup_internal_ms = t.startup_internal_ms,
            questions_visible = t.questions_visible,
            focus_changes = t.focus_changes,
            settings_opens = t.settings_opens,
        },
        frames = {
            count = f.count,
            avg_ms = avg(f.sum_ms, f.count),
            p50_ms = histogram_percentile(f.histogram, f.count, 50),
            p95_ms = histogram_percentile(f.histogram, f.count, 95),
            p99_ms = histogram_percentile(f.histogram, f.count, 99),
            max_ms = f.max_ms,
            fps_estimate = fps,
            slow_over_16_67 = f.slow_16_67,
            slow_over_25 = f.slow_25,
            slow_over_25_pct = f.count > 0 and (f.slow_25 * 100 / f.count) or 0,
            histogram_bin_ms = FRAME_BIN_MS,
        },
        input_handler = {
            count = i.count,
            avg_ms = avg(i.sum_ms, i.count),
            p95_ms = percentile(i.samples, 95),
            max_ms = i.max_ms,
            note = "app-handler-time-not-input-to-photon",
        },
        question_transition = {
            count = q.count,
            avg_ms = avg(q.sum_ms, q.count),
            p95_ms = percentile(q.samples, 95),
            max_ms = q.max_ms,
        },
        answers = t.answers,
        lua_memory = {
            gc_start_kb = t.gc_start_kb,
            gc_now_kb = gc_now,
            gc_peak_kb = math.max(t.gc_peak_kb, gc_now),
            gc_delta_kb = gc_now - t.gc_start_kb,
            note = "lua-heap-only-not-total-android-pss",
        },
    }
end

local function save_pending(t, payload)
    sys.save(t.pending_path, { payload = payload, saved_unix = os.time() or 0 })
end

local function clear_pending(t)
    sys.save(t.pending_path, {})
end

local function post_payload(t, payload, is_pending)
    if t.inflight then return false end
    t.inflight = true
    local headers = {
        ["Content-Type"] = "application/json",
        ["Accept"] = "application/json",
        ["X-Bubble-Safari-Client"] = "defold-prototype",
    }
    http.request(t.endpoint, "POST", function(_, _, response)
        t.inflight = false
        local ok = response and response.status and response.status >= 200 and response.status < 300
        if ok then
            t.last_send_status = "ok:" .. tostring(response.status)
            if is_pending then clear_pending(t) end
            print("BS_TELEMETRY sent status=" .. tostring(response.status))
        else
            local status = response and response.status or 0
            t.last_send_status = "failed:" .. tostring(status)
            save_pending(t, payload)
            print("BS_TELEMETRY failed status=" .. tostring(status))
        end
    end, headers, payload)
    return true
end

function M.flush_pending(t)
    local saved = sys.load(t.pending_path)
    if saved and saved.payload and saved.payload ~= "" then
        return post_payload(t, saved.payload, true)
    end
    return false
end

function M.send(t, reason)
    if t.inflight then return false end
    t.sequence = t.sequence + 1
    local payload = json.encode(snapshot(t, reason))
    return post_payload(t, payload, false)
end

function M.final(t)
    -- Best effort. Periodic sends mean the session is still represented if Android kills
    -- the process before this final network callback completes.
    M.send(t, "session_end")
end

return M
