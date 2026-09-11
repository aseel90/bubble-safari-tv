export function createTvNavigation({ getActiveScreen, onBack }) {
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

  function activeFocusables() {
    const active = getActiveScreen();
    if (!active) return [];
    return $$('[data-focusable]:not([disabled])', active).filter(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
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

  document.addEventListener('keydown', event => {
    const code = event.keyCode || event.which || 0;
    let key = event.key;
    if (code === 19) key = 'ArrowUp';
    if (code === 20) key = 'ArrowDown';
    if (code === 21) key = 'ArrowLeft';
    if (code === 22) key = 'ArrowRight';
    if (code === 23) key = 'Enter';
    if (code === 4) key = 'BrowserBack';

    const handled = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape','Backspace','BrowserBack'];
    if (handled.includes(key)) event.preventDefault();
    if (key === 'ArrowLeft') spatialNavigate('left');
    if (key === 'ArrowRight') spatialNavigate('right');
    if (key === 'ArrowUp') spatialNavigate('up');
    if (key === 'ArrowDown') spatialNavigate('down');
    if (key === 'Enter' || key === ' ') {
      const el = document.activeElement;
      if (el && el.matches('[data-focusable]')) el.click();
    }
    if (key === 'Escape' || key === 'Backspace' || key === 'BrowserBack') onBack();
  }, { passive: false });

  document.addEventListener('focusin', event => {
    if (event.target.matches('[data-focusable]')) setFocus(event.target);
  });

  return { setFocus, focusFirst };
}
