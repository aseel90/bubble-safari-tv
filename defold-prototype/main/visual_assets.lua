-- Embedded native art for the representative ocean prototype.
local M = {}

local SOURCES = {
    require "main.visual_asset_data_bg",
    require "main.visual_asset_data_animals",
    require "main.visual_asset_data_text",
    require "main.visual_asset_data_misc",
}

local B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local DECODE = {}
for i = 1, #B64 do DECODE[B64:byte(i)] = i - 1 end

local function decode_base64(data)
    local out = {}
    local n = #data
    local o = 1
    for i = 1, n, 4 do
        local b1, b2, b3, b4 = data:byte(i, i + 3)
        local a = DECODE[b1] or 0
        local b = DECODE[b2] or 0
        local c = (b3 == 61 or not b3) and 0 or (DECODE[b3] or 0)
        local d = (b4 == 61 or not b4) and 0 or (DECODE[b4] or 0)
        local value = a * 262144 + b * 4096 + c * 64 + d
        out[o] = string.char(math.floor(value / 65536) % 256); o = o + 1
        if b3 and b3 ~= 61 then out[o] = string.char(math.floor(value / 256) % 256); o = o + 1 end
        if b4 and b4 ~= 61 then out[o] = string.char(value % 256); o = o + 1 end
    end
    return table.concat(out)
end

M.info = {}

local function install_one(name, encoded)
    local bytes = decode_base64(encoded)
    local img = image.load(bytes, { premultiply_alpha = true })
    assert(img, "Unable to decode embedded UI texture: " .. name)
    local texture_id = "bs_" .. name
    local ok, code = gui.new_texture(texture_id, img.width, img.height, img.type, img.buffer, false)
    if not ok and code ~= gui.RESULT_TEXTURE_ALREADY_EXISTS then
        error("Unable to create GUI texture " .. texture_id .. " code=" .. tostring(code))
    end
    M.info[name] = { id = texture_id, width = img.width, height = img.height }
end

function M.install()
    for _, source in ipairs(SOURCES) do
        for name, encoded in pairs(source) do install_one(name, encoded) end
    end
    SOURCES = nil
    collectgarbage("collect")
    return M.info
end

function M.get(name)
    return assert(M.info[name], "Missing UI texture: " .. tostring(name))
end

return M
