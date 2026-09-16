const HOME_PORTAL_VERSION = '2026-09-16.1';

function installHomePortal() {
  const home = document.getElementById('homeScreen');
  if (!home || home.dataset.portalVersion === HOME_PORTAL_VERSION) return;
  home.dataset.portalVersion = HOME_PORTAL_VERSION;

  const style = document.createElement('style');
  style.dataset.homePortal = HOME_PORTAL_VERSION;
  style.textContent = `
#homeScreen { display:none;padding:0 1.5vw 1vh;align-items:center;justify-content:center; }
#homeScreen.screen-active { display:flex; }
.home-portal { width:min(1180px,94vw);height:min(640px,100%);display:flex;flex-direction:column;justify-content:center;gap:2.2vh;position:relative; }
.home-heading { display:flex;align-items:flex-end;justify-content:space-between;gap:2vw;padding:0 .6vw; }
.home-heading .eyebrow { flex:0 0 auto;margin:0 0 5px; }
.home-heading h1 { margin:0;color:var(--forest-deep);font-size:clamp(36px,3.7vw,60px);line-height:1;font-weight:900;letter-spacing:-1.5px; }
.home-heading p { margin:.65vh 0 0;color:#557a6b;font-size:clamp(14px,1.2vw,19px);font-weight:800; }
.mode-grid { display:grid;grid-template-columns:minmax(310px,1.22fr) repeat(2,minmax(190px,1fr));grid-template-rows:repeat(2,minmax(140px,1fr));gap:clamp(12px,1.4vw,20px);min-height:0;flex:1;max-height:470px; }
.mode-card { position:relative;overflow:hidden;border:3px solid rgba(255,255,255,.74);border-radius:30px;background:rgba(255,255,255,.84);box-shadow:0 12px 30px rgba(39,90,69,.11);padding:clamp(15px,1.7vw,24px);display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:5px;text-align:right;color:var(--forest-deep);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease,border-color .18s ease;isolation:isolate; }
.mode-card::after { content:"";position:absolute;inset:auto -12% -42% 28%;height:65%;border-radius:50%;background:rgba(255,255,255,.35);z-index:-1;transform:rotate(-8deg); }
#homeScreen .mode-card:focus,#homeScreen .mode-card.tv-focus { transform:scale(1.035);box-shadow:0 0 0 7px rgba(255,255,255,.96),0 0 0 13px rgba(255,194,77,.88),0 20px 42px rgba(39,90,69,.22);z-index:12;outline:none; }
.mode-card-featured { grid-row:1 / 3;justify-content:flex-end;padding:clamp(22px,2.3vw,34px);background:linear-gradient(150deg,#e8fbff 0%,#c9f1f7 46%,#b7e7ee 100%);border-color:rgba(255,255,255,.9); }
.mode-card-stories { background:linear-gradient(150deg,#fff2dc,#ffe0bf); }
.mode-card-math { background:linear-gradient(150deg,#e7f6de,#cfeabc); }
.mode-card-letters { background:linear-gradient(150deg,#f2e9ff,#dfcff7); }
.mode-card-puzzles { background:linear-gradient(150deg,#fff4bf,#ffe39a); }
.mode-copy { position:relative;z-index:3;display:flex;flex-direction:column;gap:4px;max-width:100%; }
.mode-copy strong { font-size:clamp(21px,1.75vw,29px);line-height:1.05;font-weight:900; }
.mode-card-featured .mode-copy strong { font-size:clamp(29px,2.7vw,44px); }
.mode-copy small { color:#527866;font-size:clamp(12px,1.02vw,16px);font-weight:800;line-height:1.3; }
.mode-card-featured .mode-copy small { font-size:clamp(14px,1.22vw,19px); }
.mode-action { position:absolute;left:clamp(18px,1.8vw,26px);bottom:clamp(20px,2vw,30px);padding:9px 16px;border-radius:999px;background:#f47f4e;color:#fff;font-size:clamp(14px,1.15vw,18px);font-weight:900;box-shadow:0 6px 0 #d96539;z-index:4; }
.mode-badge { position:absolute;top:13px;left:13px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.72);color:#537565;font-size:clamp(10px,.85vw,13px);font-weight:900;z-index:4; }
.mode-art { position:absolute;z-index:1;pointer-events:none; }
.mode-art-bubbles { inset:5% 4% auto auto;width:86%;height:62%; }
.mode-bubble { position:absolute;border-radius:50%;border:4px solid rgba(255,255,255,.72);background:rgba(99,199,224,.5);box-shadow:inset -12px -15px 22px rgba(44,139,164,.16),inset 8px 9px 14px rgba(255,255,255,.42); }
.mode-bubble-main { width:min(76%,250px);aspect-ratio:1;right:8%;top:0;background:linear-gradient(145deg,rgba(152,228,241,.93),rgba(99,199,224,.7));display:grid;place-items:center; }
.mode-bubble-a { width:17%;aspect-ratio:1;left:5%;top:16%; }
.mode-bubble-b { width:10%;aspect-ratio:1;left:22%;top:5%;background:rgba(255,210,111,.7); }
.mode-mascot { width:78%;height:78%;display:grid;place-items:center; }
.mode-mascot .game-art { width:100%;height:100%; }
.mode-symbol { position:absolute;top:18%;right:clamp(16px,1.8vw,26px);height:46%;min-height:58px;display:flex;align-items:center;justify-content:center;color:#315b50;font-weight:900;font-size:clamp(34px,3.4vw,54px);opacity:.92;z-index:1; }
.mode-symbol-math,.mode-symbol-letters { letter-spacing:3px; }
.mode-symbol-book { width:82px;height:62px;gap:4px;transform:rotate(-3deg); }
.mode-symbol-book i { display:block;width:38px;height:58px;background:rgba(255,255,255,.84);border:4px solid #d98359;border-radius:7px 3px 3px 7px;box-shadow:inset 0 -8px 0 rgba(217,131,89,.08); }
.mode-symbol-book i:last-child { transform:scaleX(-1); }
.mode-symbol-puzzle { width:72px;height:72px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:5px; }
.mode-symbol-puzzle i { display:block;border-radius:9px;background:#e9ad43;box-shadow:inset 0 -5px 0 rgba(132,87,24,.11); }
.mode-symbol-puzzle i:nth-child(2),.mode-symbol-puzzle i:nth-child(3){background:#72b969}
.section-notice { position:absolute;left:50%;bottom:-8px;transform:translate(-50%,18px) scale(.96);display:flex;align-items:center;gap:10px;padding:10px 17px;border-radius:18px;background:#214f42;color:#fff;box-shadow:0 12px 30px rgba(24,70,55,.25);opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;z-index:40;white-space:nowrap; }
.section-notice.show { opacity:1;transform:translate(-50%,0) scale(1); }
.section-notice strong { color:#ffe16e;font-size:15px; }
.section-notice span { font-size:14px;font-weight:800; }
@media (min-aspect-ratio:4/3) and (max-height:650px){
  .home-portal{gap:10px}
  .home-heading h1{font-size:clamp(32px,3.4vw,46px)}
  .home-heading p{margin-top:4px;font-size:13px}
  .home-heading .eyebrow{padding:5px 11px;font-size:11px}
  .mode-grid{gap:10px;max-height:350px;grid-template-rows:repeat(2,minmax(118px,1fr))}
  .mode-card{border-radius:23px;padding:13px 16px}
  .mode-card-featured{padding:18px 22px}
  .mode-bubble-main{width:min(66%,190px)}
  .mode-art-bubbles{height:58%}
  .mode-copy strong{font-size:clamp(18px,1.65vw,23px)}
  .mode-card-featured .mode-copy strong{font-size:clamp(25px,2.45vw,34px)}
  .mode-copy small{font-size:11px}
  .mode-card-featured .mode-copy small{font-size:13px}
  .mode-symbol{top:12%;height:42%;font-size:clamp(30px,3vw,42px)}
  .mode-action{bottom:18px;padding:7px 13px}
}
@media (max-aspect-ratio:4/3){
  .home-portal{width:min(900px,92vw)}
  .home-heading{align-items:center}
  .mode-grid{grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,minmax(125px,1fr));max-height:none}
  .mode-card-featured{grid-column:1 / 3;grid-row:auto;min-height:180px}
  .mode-art-bubbles{width:43%;height:88%;right:auto;left:4%;top:6%}
  .mode-copy{max-width:57%}
  .mode-card-featured .mode-copy{max-width:55%}
}`;
  document.head.appendChild(style);

  home.innerHTML = `
    <div class="home-portal">
      <div class="home-heading">
        <span class="eyebrow">تعلم • لعب • قصص</span>
        <div>
          <h1 id="homeTitle">ماذا نلعب اليوم؟</h1>
          <p>اختر مغامرتك بالريموت واضغط OK.</p>
        </div>
      </div>

      <div class="mode-grid" aria-label="أقسام سفاري الفقاعات">
        <button class="mode-card mode-card-featured mode-card-bubbles focusable" id="startButton" type="button" data-focusable data-autofocus>
          <span class="mode-art mode-art-bubbles" aria-hidden="true">
            <span class="mode-bubble mode-bubble-main"><span class="mode-mascot" data-mascot-art="lion"></span></span>
            <span class="mode-bubble mode-bubble-a"></span><span class="mode-bubble mode-bubble-b"></span>
          </span>
          <span class="mode-copy">
            <strong>مغامرة الفقاعات</strong>
            <small>حيوانات • ألوان • أرقام • أشكال</small>
          </span>
          <span class="mode-action">ابدأ</span>
        </button>

        <button class="mode-card mode-card-stories focusable" type="button" data-home-section="stories" data-focusable>
          <span class="mode-badge">قريبًا</span>
          <span class="mode-symbol mode-symbol-book" aria-hidden="true"><i></i><i></i></span>
          <span class="mode-copy"><strong>قصص تفاعلية</strong><small>حكايات مصورة بصوت وحركة</small></span>
        </button>

        <button class="mode-card mode-card-math focusable" type="button" data-home-section="math" data-focusable>
          <span class="mode-badge">قريبًا</span>
          <span class="mode-symbol mode-symbol-math" aria-hidden="true">+ −</span>
          <span class="mode-copy"><strong>رياضيات ممتعة</strong><small>جمع • طرح • مقارنة • عد</small></span>
        </button>

        <button class="mode-card mode-card-letters focusable" type="button" data-home-section="letters" data-focusable>
          <span class="mode-badge">قريبًا</span>
          <span class="mode-symbol mode-symbol-letters" aria-hidden="true">أ ب</span>
          <span class="mode-copy"><strong>الحروف والكلمات</strong><small>حروف • صور • كلمات وأصوات</small></span>
        </button>

        <button class="mode-card mode-card-puzzles focusable" type="button" data-home-section="puzzles" data-focusable>
          <span class="mode-badge">قريبًا</span>
          <span class="mode-symbol mode-symbol-puzzle" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="mode-copy"><strong>ألغاز وتحديات</strong><small>أنماط • ترتيب • تفكير بصري</small></span>
        </button>
      </div>

      <div class="section-notice" id="sectionNotice" role="status" aria-live="polite" aria-hidden="true">
        <strong id="sectionNoticeTitle">قريبًا</strong>
        <span id="sectionNoticeText">هذا القسم قيد التجهيز.</span>
      </div>
    </div>`;

  const notice = document.getElementById('sectionNotice');
  const noticeTitle = document.getElementById('sectionNoticeTitle');
  const noticeText = document.getElementById('sectionNoticeText');
  const labels = {
    stories: ['قصص تفاعلية', 'نجهز أولى الحكايات المصورة المتحركة.'],
    math: ['رياضيات ممتعة', 'سيضم الجمع والطرح والمقارنة والعد.'],
    letters: ['الحروف والكلمات', 'سيضم الحروف والصور والكلمات والأصوات.'],
    puzzles: ['ألغاز وتحديات', 'سيضم الأنماط والترتيب والتحديات البصرية.']
  };
  let timer = 0;
  home.querySelectorAll('[data-home-section]').forEach(card => {
    card.addEventListener('click', () => {
      const content = labels[card.dataset.homeSection] || ['قريبًا', 'هذا القسم قيد التجهيز.'];
      noticeTitle.textContent = content[0];
      noticeText.textContent = content[1];
      notice.classList.add('show');
      notice.setAttribute('aria-hidden', 'false');
      clearTimeout(timer);
      timer = setTimeout(() => {
        notice.classList.remove('show');
        notice.setAttribute('aria-hidden', 'true');
      }, 2200);
    });
  });
}

installHomePortal();

export const TV_NAV_VERSION = '1.4.0';

export function normalizeTvKey(event) {
  const code = event.keyCode || event.which || 0;
  let key = event.key;
  if (code === 19 || code === 38) key = 'ArrowUp';
  if (code === 20 || code === 40) key = 'ArrowDown';
  if (code === 21 || code === 37) key = 'ArrowLeft';
  if (code === 22 || code === 39) key = 'ArrowRight';
  if (code === 23 || code === 66 || code === 13) key = 'Enter';
  if (code === 4 || code === 27) key = 'BrowserBack';
  return key;
}

export function createTvNavigation({ getActiveScreen, onBack }) {
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  if (typeof window !== 'undefined') window.__bubbleTvNavVersion = TV_NAV_VERSION;

  function setFocus(el) {
    $$('.tv-focus').forEach(node => node.classList.remove('tv-focus'));
    if (!el) return;
    el.classList.add('tv-focus');
    try { el.focus({ preventScroll: true }); } catch { el.focus(); }
  }

  function focusFirst(root) {
    if (!root) return;
    const target = root.querySelector('[data-autofocus][data-focusable]:not([disabled])') || root.querySelector('[data-focusable]:not([disabled])');
    if (target) setFocus(target);
  }

  function isVisibleFocusable(el) {
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  }

  function activeFocusables() {
    const active = getActiveScreen();
    if (!active) return [];
    const local = $$('[data-focusable]:not([disabled])', active);
    const globals = $$('#settingsButton[data-focusable]:not([disabled]), #soundButton[data-focusable]:not([disabled])', document);
    return [...new Set([...local, ...globals])].filter(isVisibleFocusable);
  }

  function spatialNavigate(direction) {
    const items = activeFocusables();
    if (!items.length) return;
    const current = items.includes(document.activeElement) ? document.activeElement : document.querySelector('.tv-focus');
    if (!current || !items.includes(current)) return setFocus(items[0]);

    const from = current.getBoundingClientRect();
    const fx = from.left + from.width / 2;
    const fy = from.top + from.height / 2;
    let best = null;
    let bestScore = Infinity;

    items.forEach(item => {
      if (item === current) return;
      const rect = item.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - fx;
      const dy = rect.top + rect.height / 2 - fy;
      const valid =
        (direction === 'left' && dx < -8) || (direction === 'right' && dx > 8) ||
        (direction === 'up' && dy < -8) || (direction === 'down' && dy > 8);
      if (!valid) return;
      const primary = (direction === 'left' || direction === 'right') ? Math.abs(dx) : Math.abs(dy);
      const secondary = (direction === 'left' || direction === 'right') ? Math.abs(dy) : Math.abs(dx);
      const score = primary + secondary * 2.2;
      if (score < bestScore) { bestScore = score; best = item; }
    });
    if (best) setFocus(best);
  }

  function ensureFocus() {
    const active = getActiveScreen();
    if (!active) return;
    const current = document.activeElement;
    if (current && current.matches?.('[data-focusable]') && (active.contains(current) || current.matches('#settingsButton, #soundButton')) && isVisibleFocusable(current)) return;
    focusFirst(active);
  }

  document.addEventListener('keydown', event => {
    const key = normalizeTvKey(event);

    const handled = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape','Backspace','BrowserBack'];
    if (handled.includes(key)) event.preventDefault();
    if (key === 'ArrowLeft') spatialNavigate('left');
    if (key === 'ArrowRight') spatialNavigate('right');
    if (key === 'ArrowUp') spatialNavigate('up');
    if (key === 'ArrowDown') spatialNavigate('down');
    if (key === 'Enter' || key === ' ') {
      const el = document.activeElement;
      if (el && el.matches('[data-focusable]')) {
        el.click();
        setTimeout(ensureFocus, 30);
      } else {
        const active = getActiveScreen();
        const fallback = active?.querySelector('[data-autofocus][data-focusable]:not([disabled])') ||
          active?.querySelector('[data-focusable]:not([disabled])');
        if (fallback) {
          setFocus(fallback);
          fallback.click();
          setTimeout(ensureFocus, 30);
        }
      }
    }
    if (key === 'Escape' || key === 'Backspace' || key === 'BrowserBack') {
      onBack();
      setTimeout(ensureFocus, 30);
    }
  }, { passive: false });

  document.addEventListener('focusin', event => {
    if (event.target.matches('[data-focusable]')) setFocus(event.target);
  });

  window.addEventListener('pageshow', () => setTimeout(ensureFocus, 0));
  window.addEventListener('focus', () => setTimeout(ensureFocus, 0));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(ensureFocus, 0);
  });

  return { setFocus, focusFirst, ensureFocus };
}
