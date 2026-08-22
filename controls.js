// Applies both switches before the page paints, and flips them on click.
const root = document.documentElement;

root.dataset.theme = localStorage.theme
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
root.dataset.shapes = localStorage.shapes || "on";

document.addEventListener("click", (event) => {
  const { id } = event.target;
  if (id === "theme") root.dataset.theme = localStorage.theme = root.dataset.theme === "dark" ? "light" : "dark";
  if (id === "shapes") root.dataset.shapes = localStorage.shapes = root.dataset.shapes === "on" ? "off" : "on";
});
