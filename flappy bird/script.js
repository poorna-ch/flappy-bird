const bird = document.getElementById("bird");
const container = document.getElementById("game-container");
const scoreEl = document.getElementById("score");
const startText = document.getElementById("start-text");
const gameOverDialog = document.getElementById("game-over-dialog");
const finalScore = document.getElementById("final-score");

let birdTop = 200;
let velocity = 0;
let gravity = 0.5;
let pipes = [];
let score = 0;
let gameStarted = false;
let gameOver = false;
let pipeInterval;

function flap() {
  if (!gameStarted && !gameOver) startGame();
  velocity = -8;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
});

document.addEventListener("click", flap);

function startGame() {
  gameStarted = true;
  startText.style.display = "none";
  gameLoop();
  pipeInterval = setInterval(createPipe, 2000);
}

function createPipe() {
  const gap = 150;
  const pipeTopHeight = Math.floor(Math.random() * 300) + 50;
  const pipeBottomHeight = 600 - pipeTopHeight - gap;

  const topPipe = document.createElement("img");
  topPipe.src = "https://i.postimg.cc/YSpZJsSN/pipe.jpg";
  topPipe.classList.add("pipe", "pipe-top");
  topPipe.style.height = pipeTopHeight + "px";
  topPipe.style.left = "400px";

  const bottomPipe = document.createElement("img");
  bottomPipe.src = "https://i.postimg.cc/YSpZJsSN/pipe.jpg";
  bottomPipe.classList.add("pipe", "pipe-bottom");
  bottomPipe.style.height = pipeBottomHeight + "px";
  bottomPipe.style.left = "400px";

  container.appendChild(topPipe);
  container.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe, x: 400 });
}

function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    pipes[i].top.style.left = pipes[i].x + "px";
    pipes[i].bottom.style.left = pipes[i].x + "px";

    if (pipes[i].x === 100) {
      score++;
      scoreEl.textContent = score;
    }

    const birdBottom = birdTop + 30;
    const topPipeHeight = parseInt(pipes[i].top.style.height);
    const bottomPipeHeight = parseInt(pipes[i].bottom.style.height);

    if (
      pipes[i].x < 130 &&
      pipes[i].x + 60 > 100 &&
      (birdTop < topPipeHeight || birdBottom > 600 - bottomPipeHeight)
    ) {
      endGame();
    }
  }

  pipes = pipes.filter((pipe) => pipe.x > -60);
}

function endGame() {
  gameOver = true;
  clearInterval(pipeInterval);
  finalScore.textContent = score;
  gameOverDialog.style.display = "block";
}

function restartGame() {
  birdTop = 200;
  velocity = 0;
  score = 0;
  scoreEl.textContent = "0";
  gameOver = false;
  gameStarted = false;

  bird.style.top = birdTop + "px";

  pipes.forEach((pipe) => {
    pipe.top.remove();
    pipe.bottom.remove();
  });

  pipes = [];

  gameOverDialog.style.display = "none";
  startText.style.display = "block";
}

function gameLoop() {
  if (gameOver) return;

  velocity += gravity;
  birdTop += velocity;

  if (birdTop < 0 || birdTop + 30 > 600) {
    endGame();
    return;
  }

  bird.style.top = birdTop + "px";
  updatePipes();
  requestAnimationFrame(gameLoop);
}