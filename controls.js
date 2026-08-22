// Applies both switches before the page paints, and flips them on click.
const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');

// the stored choice is written only on a click, so an untouched browser keeps
// following the system setting
function apply(theme) {
  root.dataset.theme = theme;
  themeMeta.content = getComputedStyle(root).getPropertyValue("--background").trim();
}

apply(localStorage.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
root.dataset.shapes = localStorage.shapes || (window.matchMedia("(max-width: 46rem)").matches ? "off" : "on");

document.addEventListener("click", (event) => {
  const { id } = event.target;
  if (id === "theme") apply(localStorage.theme = root.dataset.theme === "dark" ? "light" : "dark");
  if (id === "shapes") root.dataset.shapes = localStorage.shapes = root.dataset.shapes === "on" ? "off" : "on";
});
