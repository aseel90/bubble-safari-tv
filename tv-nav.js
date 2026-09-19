const HOME_PORTAL_VERSION = '2026-09-19.1';

function installHomePortal() {
  const home = document.getElementById('homeScreen');
  if (!home) return;
  home.dataset.portalVersion = HOME_PORTAL_VERSION;
  if (home.dataset.portalWired === HOME_PORTAL_VERSION) return;
  home.dataset.portalWired = HOME_PORTAL_VERSION;

  const notice = document.getElementById('sectionNotice');
  const noticeTitle = document.getElementById('sectionNoticeTitle');
  const noticeText = document.getElementById('sectionNoticeText');
  if (!notice || !noticeTitle || !noticeText) return;

  const labels = {
    math: ['رياضيات ممتعة', 'سيضم الجمع والطرح والمقارنة والعد.'],
    letters: ['الحروف والكلمات', 'سيضم الحروف والصور والكلمات والأصوات.'],
    puzzles: ['ألغاز وتحديات', 'سيضم الأنماط والترتيب والتحديات البصرية.']
  };

  let timer = 0;
  home.querySelectorAll('[data-home-section]').forEach(card => {
    if (card.dataset.homeSection === 'stories') return;
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

export const TV_NAV_VERSION = '1.5.0';

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
