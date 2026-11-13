document.querySelectorAll("a[data-category]").forEach((link) => link.addEventListener("click", () => {
  selectedCategory = link.dataset.category;
  showFavorites = false;
  search.value = "";
  updateCatalog();
}));

const slides = [
  { image: "hero-vestidos", label: "Silhuetas fluidas", title: "Vestidos & <em>fluidez</em> elegante.", copy: "Modelagens atemporais que vão do almoço ao fim de semana, com caimento leve e fendas sutis.", action: "Ver vestidos", category: "Vestidos" },
  { image: "hero-conjuntos", label: "Alfaiataria e linho", title: "Conjuntos & <em>estrutura</em> moderna.", copy: "Peças coordenadas e silhuetas de alfaiataria para combinar do seu jeito.", action: "Ver conjuntos", category: "Conjuntos" },
  { image: "hero-urbano", label: "Coleção ZNT", title: "O novo <em>essencial</em> urbano.", copy: "Linho, alfaiataria e cortes que valorizam o movimento para compor seu próximo look.", action: "Explorar novidades", category: "Todos" }
];
const heroImage = document.querySelector(".hero-image");
const heroAction = byId("hero-action");
const heroDots = [...document.querySelectorAll(".hero-dots button")];
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
  heroImage.src = "assets/" + slide.image + ".jpg";
  byId("hero-label").textContent = slide.label;
  byId("hero-title").innerHTML = slide.title;
  byId("hero-copy").textContent = slide.copy;
  heroAction.firstChild.textContent = slide.action + " ";
  heroAction.dataset.category = slide.category;
  heroDots.forEach((dot, i) => dot.setAttribute("aria-current", i === currentSlide));
  byId("hero-status").textContent = slide.label + ", destaque " + (currentSlide + 1) + " de " + slides.length + ".";
}
heroDots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
document.querySelector(".hero-arrow.prev").addEventListener("click", () => showSlide(currentSlide - 1));
document.querySelector(".hero-arrow.next").addEventListener("click", () => showSlide(currentSlide + 1));

