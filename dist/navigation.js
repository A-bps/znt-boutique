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

  // Botão flutuante do WhatsApp, presente em todas as páginas.
  const wa = document.createElement('a');
  wa.className = 'whatsapp-float';
  wa.href = 'https://wa.me/5517981082833?text=' + encodeURIComponent('Olá! Vim pelo site da ZNT Boutique.');
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Falar com a ZNT pelo WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="currentColor"><path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.18 1.6 6L4 29l8.17-1.57a12.03 12.03 0 0 0 5.87 1.5h.01C24.7 28.93 30 23.6 30 16.97 30 10.4 24.7 3 16.04 3zm0 22.9a10 10 0 0 1-5.1-1.4l-.37-.22-4.85.93.97-4.72-.24-.38a9.9 9.9 0 0 1-1.52-5.27c0-5.5 4.5-9.97 10.04-9.97 5.4 0 9.78 4.4 9.78 9.8 0 5.5-4.4 9.23-8.7 9.23zm5.5-7.45c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.3 1.28.5 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/></svg>';
  document.body.appendChild(wa);
})();
