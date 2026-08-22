// A net, some shrimp, and the muddy beaches of Skåne.
//
// The original rules: nudge the net a step at a time, the shrimp scuttle once
// a second, a new one wanders in every five. Catch them all.

const water = document.querySelector("#game");
const ink = water.getContext("2d");
const tally = document.querySelector("#catch b");
const banner = document.querySelector("#won");

const SHRIMP = { width: 28, height: 32 };
const NET = 110;
const STEP = 10;

const netArt = Object.assign(new Image(), { src: "/img/net.png" });
const shrimpArt = Object.assign(new Image(), { src: "/img/shrimp.png" });

const net = { x: 0, y: 0 };
let shrimps = [];
let caught = 0;
let fishing = true;

const random = (from, to) => from + Math.random() * (to - from);
const clamp = (value, low, high) => Math.min(Math.max(value, low), high);

// Everything below works in CSS pixels. The backing store is denser than that
// on a retina screen, which is what keeps the sprites from looking grainy.
function resize() {
  const scale = window.devicePixelRatio || 1;
  const width = Math.round(water.clientWidth * scale);
  const height = Math.round(water.clientHeight * scale);
  if (water.width !== width) water.width = width;
  if (water.height !== height) water.height = height;
  ink.setTransform(scale, 0, 0, scale, 0, 0);
}

// A whole sprite clear of every edge, so no shrimp is born half off the water,
// and clear of the net, so none is caught the instant it appears.
function spawn() {
  let place;
  for (let tries = 0; tries < 20; tries++) {
    place = {
      x: random(SHRIMP.width, water.clientWidth - SHRIMP.width),
      y: random(SHRIMP.height, water.clientHeight - SHRIMP.height),
    };
    if (Math.hypot(place.x - net.x, place.y - net.y) > NET) break;
  }
  return place;
}

function start() {
  shrimps = Array.from({ length: 5 }, spawn);
  caught = 0;
  tally.textContent = 0;
  banner.hidden = true;
  fishing = true;
}

function frame() {
  requestAnimationFrame(frame);
  resize();
  const width = water.clientWidth;
  const height = water.clientHeight;

  const sea = ink.createLinearGradient(0, 0, 0, height);
  sea.addColorStop(0, "deepskyblue");
  sea.addColorStop(0.5, "rgb(10, 146, 170)");
  sea.addColorStop(1, "rgb(1, 28, 101)");
  ink.fillStyle = sea;
  ink.fillRect(0, 0, width, height);

  for (let i = shrimps.length - 1; i >= 0; i--) {
    const item = shrimps[i];
    if (fishing && Math.hypot(item.x - net.x, item.y - net.y) < NET / 4) {
      shrimps.splice(i, 1);
      tally.textContent = ++caught;
      if (!shrimps.length) {
        fishing = false;  // no new shrimp until the offer of another game is taken
        banner.hidden = false;
      }
      continue;
    }
    ink.drawImage(shrimpArt, item.x - SHRIMP.width / 2, item.y - SHRIMP.height / 2, SHRIMP.width, SHRIMP.height);
  }

  ink.drawImage(netArt, net.x - NET / 2, net.y - NET / 2, NET, NET);
}

function move(dx, dy) {
  net.x = clamp(net.x + dx, 0, water.clientWidth);
  net.y = clamp(net.y + dy, 0, water.clientHeight);
}

window.addEventListener("keydown", (event) => {
  const step = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] }[event.key];
  if (!step) return;
  event.preventDefault();
  move(...step);
});

// a click sends the net a long way in whichever direction you clicked
water.addEventListener("click", (event) => {
  const box = water.getBoundingClientRect();
  const dx = event.clientX - box.left - water.clientWidth / 2;
  const dy = event.clientY - box.top - water.clientHeight / 2;
  if (Math.abs(dx) > Math.abs(dy)) move(Math.sign(dx) * STEP * 10, 0);
  else move(0, Math.sign(dy) * STEP * 10);
});

document.querySelector("#again").addEventListener("click", start);

setInterval(() => {
  for (const item of shrimps) {
    item.x = clamp(item.x + random(-10, 10), SHRIMP.width / 2, water.clientWidth - SHRIMP.width / 2);
    item.y = clamp(item.y + random(-10, 10), SHRIMP.height / 2, water.clientHeight - SHRIMP.height / 2);
  }
}, 1000);

setInterval(() => fishing && shrimps.push(spawn()), 5000);

resize();
net.x = water.clientWidth / 2;
net.y = water.clientHeight / 2;
start();
frame();
