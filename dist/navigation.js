(() => {
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('menu');
  const menuButton = document.querySelector('.menu-toggle');
  const clothes = document.querySelector('.clothing-menu');
  const clothesButton = document.querySelector('.clothing-toggle');
  const categories = document.getElementById('clothing-categories');
  const setClothes = open => {
    categories.hidden = !open;
    clothesButton.setAttribute('aria-expanded', String(open));
  };
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (!open) setClothes(false);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  clothesButton.addEventListener('click', () => setClothes(categories.hidden));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    if (!clothes.contains(event.target)) setClothes(false);
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!categories.hidden) { setClothes(false); clothesButton.focus(); }
    else if (menu.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });
  new ResizeObserver(() => document.body.style.setProperty('--header-height', header.offsetHeight + 'px')).observe(header);
  let previous = Math.max(scrollY, 0);
  window.addEventListener('scroll', () => {
    const current = Math.max(scrollY, 0);
    if (current <= 8) header.classList.remove('is-hidden-on-scroll');
    else if (Math.abs(current - previous) < 6) return;
    else {
      const down = current > previous;
      header.classList.toggle('is-hidden-on-scroll', down);
      if (down && !header.querySelector(':focus-visible')) setMenu(false);
    }
    previous = current;
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden-on-scroll'));
  window.updateFavoriteCount = () => {
    let count = 0;
    try {
      const saved = JSON.parse(localStorage.getItem('znt-favorites') || '[]');
      if (Array.isArray(saved)) count = catalog.filter(item => saved.includes(item.id)).length;
    } catch { /* The catalog remains usable without browser storage. */ }
    document.querySelectorAll('.favorite-count').forEach(node => node.textContent = count);
    document.querySelectorAll('.header-favorites').forEach(node => node.setAttribute('aria-label', 'Meus favoritos, ' + count + (count === 1 ? ' peça' : ' peças')));
  };
  window.addEventListener('storage', window.updateFavoriteCount);
  window.addEventListener('pageshow', window.updateFavoriteCount);
  window.updateFavoriteCount();
})();
