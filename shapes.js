// Shapes drift and spin across the background; when two meet they annihilate
// into a scatter of fragments that drift outwards and fade. Click one and it
// complains.

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const shapes = [];
const fragments = [];

const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const furious = document.body.hasAttribute("data-angry");  // the 404 page

const clock = document.querySelector("#hud time");
const tally = document.querySelector("#hud b");
// the count follows you from page to page, and starts over on a reload
if (performance.getEntriesByType("navigation")[0].type === "reload") sessionStorage.collisions = 0;
let collisions = Number(sessionStorage.collisions || 0);
let greeted = false;

const show = () => tally.textContent = String(collisions).padStart(3, "0");
const tick = () => clock.textContent = new Date().toTimeString().slice(0, 8);

const COLOURS = ["#1a60c8", "#28a745", "#c07820", "#a3b1c6", "#e8c33c"];

const TAUNTS = [
  "Don't touch me!",
  "Stop it!",
  "Go read the blog instead!",
  "I'm drifting here!",
  "Ouch!!",
  "Do that again and I detonate.",
  "I'm on my break.",
  "NOOOOOOOOOO!",
  "That tickles. Stop.",
  "Touch me again. I dare you.",
];

const random = (from, to) => from + Math.random() * (to - from);
const pick = (list) => list[Math.floor(random(0, list.length))];

// sides: 0 draws a circle, 3 a triangle, 4 a square. Heading is radial so
// that fragments of an annihilation leave in every direction at equal pace.
const shape = (x, y, radius, speed) => {
  const heading = random(0, 2 * Math.PI);
  return {
    x, y, radius,
    vx: Math.cos(heading) * speed,
    vy: Math.sin(heading) * speed,
    angle: random(0, 2 * Math.PI),
    spin: random(-0.01, 0.01),
    sides: pick([0, 3, 4]),
    colour: pick(COLOURS),
    life: 1,
    says: pick(TAUNTS),
    talk: furious ? Infinity : 0,
  };
};

function complain(item) {
  const reach = item.radius;
  context.beginPath();
  // two angled brows over a frown
  context.moveTo(item.x - reach * 0.55, item.y - reach * 0.45);
  context.lineTo(item.x - reach * 0.15, item.y - reach * 0.15);
  context.moveTo(item.x + reach * 0.55, item.y - reach * 0.45);
  context.lineTo(item.x + reach * 0.15, item.y - reach * 0.15);
  context.moveTo(item.x - reach * 0.4, item.y + reach * 0.5);
  context.quadraticCurveTo(item.x, item.y + reach * 0.05, item.x + reach * 0.4, item.y + reach * 0.5);
  context.stroke();

  context.font = "12px ui-monospace, monospace";
  const width = context.measureText(item.says).width + 10;
  const left = Math.min(item.x + reach + 6, canvas.width - width - 4);
  const top = item.y - reach - 24;
  context.strokeRect(left, top, width, 20);
  context.fillStyle = item.colour;
  context.fillText(item.says, left + 5, top + 14);
}

function draw(item) {
  context.globalAlpha = item.life;
  context.strokeStyle = item.colour;
  context.beginPath();
  if (item.sides === 0) {
    context.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
  } else {
    for (let corner = 0; corner <= item.sides; corner++) {
      // the half-step turn stands squares on an edge rather than on a corner
      const angle = (2 * Math.PI * corner + Math.PI) / item.sides - Math.PI / 2 + item.angle;
      context.lineTo(item.x + Math.cos(angle) * item.radius, item.y + Math.sin(angle) * item.radius);
    }
  }
  context.stroke();
  if (item.talk) complain(item);
}

function frame() {
  if (animate) requestAnimationFrame(frame);
  if (!window.innerWidth) return;  // a window with no size yet has nothing to draw

  // sizing here rather than on a resize event also covers a window that had no
  // size when the page loaded, as a background tab can have
  if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
  if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (document.documentElement.dataset.shapes === "off") return;
  context.lineWidth = 2;

  while (shapes.length < 7) {
    shapes.push(shape(random(0, canvas.width), random(0, canvas.height), random(14, 30), 0.3));
  }

  if (!greeted) {
    greeted = true;
    // below the panel, where there is room for the bubble to be read, and it
    // stays up for as long as this shape survives
    Object.assign(shapes[0], { x: 90, y: canvas.height - 70, says: "Don't like us? Disable shapes at [\u25c6]", talk: 1800 });
  }

  for (const item of shapes.concat(fragments)) {
    item.x = (item.x + item.vx + canvas.width) % canvas.width;
    item.y = (item.y + item.vy + canvas.height) % canvas.height;
    item.angle += item.spin;
    if (item.talk) item.talk--;
    draw(item);
  }

  collision: for (let a = 0; a < shapes.length; a++) {
    for (let b = a + 1; b < shapes.length; b++) {
      if (Math.hypot(shapes[a].x - shapes[b].x, shapes[a].y - shapes[b].y) > shapes[a].radius + shapes[b].radius) continue;
      for (let piece = 0; piece < 12; piece++) {
        fragments.push(shape(shapes[a].x, shapes[a].y, random(2, 5), 2));
      }
      shapes.splice(b, 1);
      shapes.splice(a, 1);
      sessionStorage.collisions = ++collisions;
      show();
      break collision;  // the loops above walk an array this just mutated
    }
  }

  for (let i = fragments.length - 1; i >= 0; i--) {
    if ((fragments[i].life -= 0.012) <= 0) fragments.splice(i, 1);
  }
}

window.addEventListener("click", (event) => {
  for (const item of shapes) {
    if (Math.hypot(item.x - event.clientX, item.y - event.clientY) > item.radius) continue;
    item.talk = 180;  // frames, about three seconds
    break;
  }
});

show();
tick();
setInterval(tick, 1000);
frame();
