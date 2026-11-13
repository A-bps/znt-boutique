const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const normalize = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const byId = (id) => document.getElementById(id);
const productList = byId("products");
const template = byId("product-template");
const search = byId("search");
const sizeFilter = byId("size-filter");
const sort = byId("sort");
const favoriteFilter = byId("favorites");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const favorites = new Set();
let selectedCategory = "Todos";
let showFavorites = new URLSearchParams(location.search).get('favoritos') === '1';

try {
  const saved = JSON.parse(localStorage.getItem("znt-favorites") ?? "[]");
  if (Array.isArray(saved)) {
    catalog.filter((product) => saved.includes(product.id)).forEach((product) => favorites.add(product.id));
  }
} catch {
  // Keep favorites usable when storage is unavailable.
}

for (const size of new Set(catalog.flatMap((product) => product.sizes))) {
  sizeFilter?.add(new Option(size, size));
}

function updateCatalog() {
  const query = normalize(search.value.trim());
  let visibleCount = 0;
  for (const { product, card, searchable } of cards) {
    card.hidden = (selectedCategory !== "Todos" && product.category !== selectedCategory)
      || (showFavorites && !favorites.has(product.id))
      || (sizeFilter?.value && !product.sizes.includes(sizeFilter.value))
      || !searchable.includes(query);
    if (!card.hidden) visibleCount += 1;
  }
  byId("empty").hidden = visibleCount > 0;
  byId("catalog-status").textContent = visibleCount === 1 ? "1 peça" : visibleCount + " peças";
  filterButtons.forEach((button) => button.setAttribute("aria-pressed", button.dataset.filter === selectedCategory));
  favoriteFilter.setAttribute("aria-pressed", showFavorites);
  favoriteFilter.textContent = 'Favoritos (' + favorites.size + ')';
  const heading = byId('catalog-title');
  if (heading) heading.textContent = showFavorites ? 'Meus favoritos' : selectedCategory === 'Todos' ? 'Lançamentos' : selectedCategory;
  const empty = byId('empty');
  empty.firstChild.textContent = showFavorites ? 'Nenhum favorito nesta seleção. Salve suas peças pelo coração. ' : 'Nenhuma peça nesta seleção. ';
  window.updateFavoriteCount?.();
}

function applySort() {
  const ordered = [...cards];
  if (sort?.value === "price-asc") ordered.sort((a, b) => a.product.price - b.product.price);
  if (sort?.value === "price-desc") ordered.sort((a, b) => b.product.price - a.product.price);
  for (const { card } of ordered) productList.append(card);
}

const cards = catalog.map((product) => {
  const card = template.content.firstElementChild.cloneNode(true);
  const image = card.querySelector("img");
  const favorite = card.querySelector(".favorite");
  const sizes = card.querySelector(".sizes");
  const purchaseLink = card.querySelector(".product-details");
  const purchaseUrl = new URL("produto.html", location.href);
  purchaseUrl.searchParams.set("id", product.id);
  purchaseUrl.searchParams.set("tamanho", product.initialSize);
  purchaseLink.href = purchaseUrl.href;
  purchaseLink.setAttribute("aria-label", "Comprar " + product.name);

  image.src = "assets/" + product.id + ".jpg";
  image.alt = product.name;
  card.querySelector("h2, h3").textContent = product.name;
  const imageLink = document.createElement('a');
  imageLink.className = 'product-image-link';
  imageLink.href = purchaseUrl.href;
  image.before(imageLink);
  imageLink.append(image);
  const titleLink = document.createElement('a');
  titleLink.className = 'product-title-link';
  titleLink.href = purchaseUrl.href;
  titleLink.textContent = product.name;
  card.querySelector('h2, h3').replaceChildren(titleLink);
  card.querySelector(".product-category").textContent = product.category;
  card.querySelector(".price").textContent = money.format(product.price);
  favorite.setAttribute("aria-label", "Favoritar " + product.name);

  for (const value of product.sizes) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.className = "sr-only";
    input.name = product.id + "-size";
    input.value = value;
    input.checked = value === product.initialSize;
    input.addEventListener("change", () => {
      purchaseUrl.searchParams.set("tamanho", value);
      purchaseLink.href = purchaseUrl.href;
      imageLink.href = purchaseUrl.href;
      titleLink.href = purchaseUrl.href;
    });
    label.append(input, value);
    sizes.append(label);
  }

  const updateFavorite = () => {
    const saved = favorites.has(product.id);
    favorite.textContent = saved ? "♥" : "♡";
    favorite.setAttribute("aria-pressed", saved);
  };
  updateFavorite();
  favorite.addEventListener("click", () => {
    if (favorites.has(product.id)) favorites.delete(product.id);
    else favorites.add(product.id);
    try {
      localStorage.setItem("znt-favorites", JSON.stringify([...favorites]));
    } catch {
      // Keep the selection in memory for this visit.
    }
    updateFavorite();
    updateCatalog();
    if (card.hidden) favoriteFilter.focus();
  });
  productList.append(card);
  return { product, card, searchable: normalize(product.name + " " + product.category) };
});

filterButtons.forEach((button) => button.addEventListener("click", () => {
  selectedCategory = button.dataset.filter;
  updateCatalog();
}));
search.addEventListener("input", updateCatalog);
sizeFilter?.addEventListener("change", updateCatalog);
sort?.addEventListener("change", applySort);
favoriteFilter.addEventListener("click", () => {
  showFavorites = !showFavorites;
  if (showFavorites) {
    selectedCategory = 'Todos';
    search.value = '';
    if (sizeFilter) sizeFilter.value = '';
  }
  updateCatalog();
});
byId("clear").addEventListener("click", () => {
  selectedCategory = "Todos";
  showFavorites = false;
  search.value = "";
  if (sizeFilter) sizeFilter.value = "";
  updateCatalog();
  search.focus();
});
const requestedCategory = new URLSearchParams(location.search).get("categoria");
if (filterButtons.some((button) => button.dataset.filter === requestedCategory)) {
  selectedCategory = requestedCategory;
}

search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") (byId("catalog-title") ?? byId("novidades")).scrollIntoView();
});

applySort();
updateCatalog();

window.addEventListener('pageshow', () => {
  try {
    const saved = JSON.parse(localStorage.getItem('znt-favorites') || '[]');
    if (Array.isArray(saved)) {
      favorites.clear();
      catalog.filter(item => saved.includes(item.id)).forEach(item => favorites.add(item.id));
      cards.forEach(({product,card}) => {
        const control = card.querySelector('.favorite');
        control.setAttribute('aria-pressed', favorites.has(product.id));
        control.textContent = favorites.has(product.id) ? '♥' : '♡';
      });
      updateCatalog();
    }
  } catch { /* Continue with the selection held in memory. */ }
});

