const params = new URLSearchParams(location.search);
const product = catalog.find((item) => item.id === params.get("id"));
const element = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function renderProduct(item) {
  document.title = item.name + " | ZNT Boutique";
  element("product-name").textContent = item.name;
  element("breadcrumb-name").textContent = item.name;
  element("product-category").textContent = item.category;
  element("product-color").textContent = item.color;
  element("product-fit").textContent = item.fit;
  element("product-price").textContent = money.format(item.price);
  element("color-swatch").style.backgroundColor = item.swatch;

  const categoryLink = element("category-link");
  categoryLink.href = "lancamentos.html?categoria=" + encodeURIComponent(item.category);
  categoryLink.textContent = item.category;

  const fitDetails = element("fit-details");
  for (const [title, value] of Object.entries(item.details)) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = title;
    description.textContent = value;
    row.append(term, description);
    fitDetails.append(row);
  }

  const image = element("product-photo");
  const photos = item.images?.length ? item.images : ['assets/' + item.id + '.jpg'];
  image.src = photos[0];
  image.alt = item.name;
  const photo = image.parentElement;
  const photoOptions = document.querySelector('.photo-options');
  photoOptions.hidden = photos.length < 2;
  document.querySelector('.product-gallery').classList.toggle('single-photo', photos.length < 2);
  photos.forEach((src, index) => {
    const button = document.createElement('button');
    const thumb = document.createElement('img');
    button.type = 'button';
    button.setAttribute('aria-label', 'Foto ' + (index + 1) + ' de ' + item.name);
    button.setAttribute('aria-pressed', String(index === 0));
    thumb.src = src;
    thumb.alt = '';
    button.append(thumb);
    button.addEventListener('click', () => {
      image.src = src;
      hideHoverZoom();
      photoOptions.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    });
    photoOptions.append(button);
  });
  const lens = document.querySelector('.zoom-lens');
  const zoomPanel = document.querySelector('.hover-zoom');
  const hoverEnabled = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1000px)');
  function hideHoverZoom() { lens.hidden = true; zoomPanel.hidden = true; }
  photo.addEventListener('pointermove', event => {
    if (!hoverEnabled.matches || event.pointerType === 'touch' || !image.naturalWidth || event.target.closest('button')) {
      hideHoverZoom();
      return;
    }
    const rect = photo.getBoundingClientRect();
    const summary = document.querySelector('.product-summary').getBoundingClientRect();
    const factor = 2.5;
    const top = Math.max(16, rect.top);
    const width = summary.width;
    const height = Math.min(rect.height, innerHeight - top - 24);
    if (height < 120) { hideHoverZoom(); return; }
    const lensWidth = Math.min(width / factor, rect.width);
    const lensHeight = Math.min(height / factor, rect.height);
    const x = Math.max(0, Math.min(rect.width - lensWidth, event.clientX - rect.left - lensWidth / 2));
    const y = Math.max(0, Math.min(rect.height - lensHeight, event.clientY - rect.top - lensHeight / 2));
    // Match the object-fit: cover crop used by the main photograph.
    const cover = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const drawnWidth = image.naturalWidth * cover;
    const drawnHeight = image.naturalHeight * cover;
    Object.assign(lens.style, { width: lensWidth + 'px', height: lensHeight + 'px', left: x + 'px', top: y + 'px' });
    Object.assign(zoomPanel.style, {
      left: summary.left + 'px', top: top + 'px', width: width + 'px', height: height + 'px',
      backgroundImage: 'url("' + image.src + '")',
      backgroundSize: (drawnWidth * factor) + 'px ' + (drawnHeight * factor) + 'px',
      backgroundPosition: (-(x + (drawnWidth - rect.width) / 2) * factor) + 'px ' + (-(y + (drawnHeight - rect.height) / 2) * factor) + 'px'
    });
    lens.hidden = false;
    zoomPanel.hidden = false;
  });
  photo.addEventListener('pointerleave', hideHoverZoom);
  window.addEventListener('scroll', hideHoverZoom, { passive: true });
  window.addEventListener('resize', hideHoverZoom);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideHoverZoom(); });
  const photoDialog = element("photo-dialog");
  const openPhoto = () => {
    hideHoverZoom();
    const zoomImage = element("zoom-photo");
    zoomImage.src = image.src;
    zoomImage.alt = item.name;
    photoDialog.showModal();
  };
  element('open-zoom').addEventListener('click', openPhoto);
  image.addEventListener('click', openPhoto);
  photoDialog.addEventListener("click", (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });

  const fromListing = params.get("tamanho");
  let selectedSize = item.sizes.includes(fromListing) ? fromListing : "";
  const purchaseStatus = element("purchase-status");
  const copySelection = element("copy-selection");
  const purchaseLink = document.querySelector('.product-buy');

  function displaySize() {
    element("selected-size").textContent = selectedSize;
    element("selection-summary").textContent = selectedSize
      ? item.color + " · Tamanho " + selectedSize
      : "Escolha seu tamanho para continuar com a ZNT.";
    copySelection.disabled = !selectedSize;
    const message = 'Olá! Tenho interesse em ' + item.name + ', cor ' + item.color
      + (selectedSize ? ', tamanho ' + selectedSize : '') + '. Pode confirmar a disponibilidade e as condições do pedido?';
    purchaseLink.href = 'https://wa.me/5517981082833?text=' + encodeURIComponent(message);
    purchaseLink.setAttribute('aria-disabled', String(!selectedSize));
  }

  purchaseLink.addEventListener('click', event => {
    if (selectedSize) return;
    event.preventDefault();
    purchaseStatus.textContent = 'Selecione um tamanho para continuar.';
    element('product-sizes').querySelector('input').focus();
  });

  for (const size of item.sizes) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.className = "sr-only";
    input.name = "size";
    input.value = size;
    input.checked = size === selectedSize;
    input.addEventListener("change", () => {
      selectedSize = size;
      purchaseStatus.textContent = "";
      displaySize();
    });
    label.append(input, size);
    element("product-sizes").append(label);
  }
  displaySize();

  copySelection.addEventListener("click", async () => {
    const selection = item.name + " · " + item.color + " · Tamanho " + selectedSize;
    try {
      await navigator.clipboard.writeText(selection);
      purchaseStatus.textContent = "Seleção copiada. Cole no atendimento da ZNT.";
    } catch {
      purchaseStatus.textContent = selection;
    }
  });

  const favoriteButton = element("product-favorite");
  let favoriteIds = [];
  try {
    const saved = JSON.parse(localStorage.getItem("znt-favorites") ?? "[]");
    if (Array.isArray(saved)) favoriteIds = saved;
  } catch {
    // The current page can still track the selection.
  }
  function displayFavorite() {
    const saved = favoriteIds.includes(item.id);
    favoriteButton.setAttribute("aria-pressed", saved);
    favoriteButton.lastChild.textContent = saved ? " Favoritado" : " Favoritar";
    favoriteButton.querySelector("span").textContent = saved ? "♥" : "♡";
  }
  favoriteButton.addEventListener("click", () => {
    favoriteIds = favoriteIds.includes(item.id)
      ? favoriteIds.filter((id) => id !== item.id)
      : [...favoriteIds, item.id];
    try {
      localStorage.setItem("znt-favorites", JSON.stringify(favoriteIds));
    } catch {
      // Keep the selection in memory when storage is unavailable.
    }
    displayFavorite();
    window.updateFavoriteCount?.();
    purchaseStatus.textContent = favoriteIds.includes(item.id) ? 'Peça salva em Meus favoritos, no menu superior.' : 'Peça removida dos favoritos.';
  });
  displayFavorite();

  const relatedProducts = element("related-products");
  for (const other of catalog.filter(({ id }) => id !== item.id)) {
    const card = document.createElement("a");
    const picture = document.createElement("img");
    const name = document.createElement("strong");
    const price = document.createElement("span");
    card.className = "related-card";
    card.href = "produto.html?id=" + encodeURIComponent(other.id);
    picture.src = "assets/" + other.id + ".jpg";
    picture.alt = "";
    picture.loading = "lazy";
    name.textContent = other.name;
    price.textContent = money.format(other.price);
    card.append(picture, name, price);
    relatedProducts.append(card);
  }

  element("product-content").hidden = false;
}

if (product) renderProduct(product);
else element("missing").hidden = false;

