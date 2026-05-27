const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");

let velocity = 0;
let gravity = 0.7;
let jumping = false;

let gameRunning = false;
let gameOver = false;

let score = 0;
let rotation = 0;
let difficulty = 1;

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gameOver = false;
  score = 0;
  scoreEl.innerText = score;

  update();
  createObstacle();
  createCoin();
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  alert("Jogo encerrado! Pontuação: " + score);
  location.reload();
}

function increaseDifficulty() {
  difficulty += 1;
  alert("Dificuldade: " + difficulty.toFixed(1));
}

function reduceDifficulty() {
  difficulty -= 0.5;

  if (difficulty < 0.5) {
    difficulty = 0.5;
  }

  alert("Dificuldade: " + difficulty.toFixed(1));
}

function jump() {
  if (!jumping && gameRunning) {
    velocity = 13;
    jumping = true;
  }
}

document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

function update() {
  if (!gameRunning || gameOver) return;

  let bottom = parseFloat(window.getComputedStyle(player).bottom);

  velocity -= gravity;
  bottom += velocity;

  if (bottom <= 60) {
    bottom = 60;
    jumping = false;
    rotation = 0;
  } else {
    rotation += 5;
  }

  player.style.bottom = bottom + "px";
  player.style.transform = `rotate(${rotation}deg)`;

  requestAnimationFrame(update);
}

function createObstacle() {
  if (!gameRunning || gameOver) return;

  const obs = document.createElement("div");
  obs.classList.add("obstacle");

  let posX = game.offsetWidth;
  obs.style.left = posX + "px";

  game.appendChild(obs);

  let speed = 7 * difficulty;

  function move() {
    if (!gameRunning || gameOver) return;

    posX -= speed;
    obs.style.left = posX + "px";

    const playerRect = player.getBoundingClientRect();
    const obsRect = obs.getBoundingClientRect();

    if (
      playerRect.left < obsRect.right &&
      playerRect.right > obsRect.left &&
      playerRect.bottom > obsRect.top
    ) {
      endGame();
    }

    if (posX < -50) {
      obs.remove();
      score++;
      scoreEl.innerText = score;
    } else {
      requestAnimationFrame(move);
    }
  }

  move();

  setTimeout(createObstacle, (Math.random() * 1500 + 900) / difficulty);
}

function createCoin() {
  if (!gameRunning || gameOver) return;

  const coin = document.createElement("div");
  coin.classList.add("coin");

  let posX = game.offsetWidth;
  let height = Math.random() * 100 + 80;

  coin.style.left = posX + "px";
  coin.style.bottom = height + "px";

  game.appendChild(coin);

  let speed = 7 * difficulty;

  function move() {
    if (!gameRunning || gameOver) return;

    posX -= speed;
    coin.style.left = posX + "px";

    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
      playerRect.left < coinRect.right &&
      playerRect.right > coinRect.left &&
      playerRect.top < coinRect.bottom &&
      playerRect.bottom > coinRect.top
    ) {
      coin.remove();
      score += 5;
      scoreEl.innerText = score;
      return;
    }

    if (posX < -30) {
      coin.remove();
    } else {
      requestAnimationFrame(move);
    }
  }

  move();

  setTimeout(createCoin, (Math.random() * 3000 + 2000) / difficulty);
}