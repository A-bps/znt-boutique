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
  wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  document.body.appendChild(wa);
})();
