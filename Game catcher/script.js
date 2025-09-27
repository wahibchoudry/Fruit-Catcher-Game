let currentScreen = "menu";

// Switch Screens
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screen).classList.add("active");

  if (screen === "game") {
    startGame();
  }
}

// --------------------
// 🎨 Falling Fruit Background
// --------------------
const menuCanvas = document.getElementById("menuBackground");
const menuCtx = menuCanvas.getContext("2d");
let fruitEmojis = ["🍎", "🍌", "🍇", "🍒", "🍊"];
let fruitsFalling = [];

function resizeCanvas() {
  menuCanvas.width = window.innerWidth;
  menuCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function spawnFruit() {
  let emoji = fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
  fruitsFalling.push({
    x: Math.random() * menuCanvas.width,
    y: -30,
    emoji: emoji,
    speed: 2 + Math.random() * 3
  });
}

function drawMenuBackground() {
  menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
  fruitsFalling.forEach((fruit, i) => {
    menuCtx.font = "2rem Arial";
    menuCtx.fillText(fruit.emoji, fruit.x, fruit.y);
    fruit.y += fruit.speed;
    if (fruit.y > menuCanvas.height) {
      fruitsFalling.splice(i, 1);
    }
  });
}

setInterval(spawnFruit, 500);
setInterval(drawMenuBackground, 30);

// --------------------
// 🎮 Game Logic
// --------------------
let canvas, ctx;
let basket, fruits;
let score = 0, missed = 0;
let gameInterval;

function startGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  basket = { x: canvas.width / 2 - 40, y: canvas.height - 30, w: 80, h: 20 };
  fruits = [];
  score = 0;
  missed = 0;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("missed").innerText = "Missed: 0";

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 30);

  document.addEventListener("keydown", moveBasket);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.fillStyle = "yellow";
  ctx.fillRect(basket.x, basket.y, basket.w, basket.h);

  // Add new fruit
  if (Math.random() < 0.02) {
    fruits.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20 });
  }

  // Move and draw fruits
  for (let i = 0; i < fruits.length; i++) {
    let f = fruits[i];
    f.y += 3;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Collision with basket
    if (f.y + f.size > basket.y && f.x > basket.x && f.x < basket.x + basket.w) {
      score++;
      document.getElementById("score").innerText = "Score: " + score;
      fruits.splice(i, 1);
      i--;
    }
    // Missed fruit
    else if (f.y > canvas.height) {
      missed++;
      document.getElementById("missed").innerText = "Missed: " + missed;
      fruits.splice(i, 1);
      i--;
      if (missed >= 5) endGame();
    }
  }
}

function moveBasket(e) {
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 40;
  if (e.key === "ArrowRight" && basket.x < canvas.width - basket.w) basket.x += 40;
}

function endGame() {
  clearInterval(gameInterval);
  document.removeEventListener("keydown", moveBasket);
  showScreen("exit");
}
