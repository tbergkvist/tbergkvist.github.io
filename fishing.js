// A net, some shrimp, and the muddy beaches of Skåne.
//
// The rules are the original ones: nudge the net a step at a time, the shrimp
// scuttle once a second, a new one wanders in every five. Catch them all.

const water = document.querySelector("#game");
const ink = water.getContext("2d");
const tally = document.querySelector("#catch b");
const trophy = document.querySelector("#won");
const shrimps = [];
const net = { x: 0, y: 0, size: 110 };
const SHRIMP = { width: 28, height: 32 };
const STEP = 10;
let caught = 0;

const netArt = Object.assign(new Image(), { src: "/img/net.png" });
const shrimpArt = Object.assign(new Image(), { src: "/img/shrimp.png" });

const random = (from, to) => from + Math.random() * (to - from);
const within = (value, limit) => Math.min(Math.max(value, 0), limit);

function resize() {
  if (water.width !== water.clientWidth) water.width = water.clientWidth;
  if (water.height !== water.clientHeight) water.height = water.clientHeight;
}

const shrimp = () => ({ x: random(0, water.width), y: random(0, water.height) });

function frame() {
  requestAnimationFrame(frame);
  resize();

  const sea = ink.createLinearGradient(0, 0, 0, water.height);
  sea.addColorStop(0, "deepskyblue");
  sea.addColorStop(0.5, "rgb(10, 146, 170)");
  sea.addColorStop(1, "rgb(1, 28, 101)");
  ink.fillStyle = sea;
  ink.fillRect(0, 0, water.width, water.height);

  for (let i = shrimps.length - 1; i >= 0; i--) {
    const item = shrimps[i];
    if (Math.hypot(item.x - net.x, item.y - net.y) < net.size / 4) {
      shrimps.splice(i, 1);
      tally.textContent = ++caught;
      if (!shrimps.length) trophy.hidden = false;
    } else {
      ink.drawImage(shrimpArt, item.x - SHRIMP.width / 2, item.y - SHRIMP.height / 2, SHRIMP.width, SHRIMP.height);
    }
  }

  ink.drawImage(netArt, net.x - net.size / 2, net.y - net.size / 2, net.size, net.size);
}

function move(dx, dy) {
  net.x = within(net.x + dx, water.width);
  net.y = within(net.y + dy, water.height);
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
  const dx = event.clientX - box.left - water.width / 2;
  const dy = event.clientY - box.top - water.height / 2;
  if (Math.abs(dx) > Math.abs(dy)) move(Math.sign(dx) * STEP * 10, 0);
  else move(0, Math.sign(dy) * STEP * 10);
});

setInterval(() => {
  for (const item of shrimps) {
    item.x = within(item.x + random(-10, 10), water.width);
    item.y = within(item.y + random(-10, 10), water.height);
  }
}, 1000);

setInterval(() => shrimps.push(shrimp()), 5000);

resize();
net.x = water.width / 2;
net.y = water.height / 2;
for (let i = 0; i < 5; i++) shrimps.push(shrimp());
frame();
