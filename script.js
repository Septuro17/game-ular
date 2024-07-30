const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const box = 20;
canvas.width = Math.min(window.innerWidth, 400);
canvas.height = Math.min(window.innerHeight - 200, 400);
let score = 0;
let level = 1;
let maxLevel = 10;

let snake = [{ x: 9 * box, y: 9 * box }];
let food = generateFood();
let obstacles = generateObstacles(5);
let d = "";

document.addEventListener("keydown", direction);
document.getElementById("upBtn").addEventListener("click", () => {
  if (d !== "DOWN") d = "UP";
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (d !== "UP") d = "DOWN";
});
document.getElementById("leftBtn").addEventListener("click", () => {
  if (d !== "RIGHT") d = "LEFT";
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (d !== "LEFT") d = "RIGHT";
});

function direction(event) {
  if (event.keyCode === 37 && d !== "RIGHT") {
    d = "LEFT";
  } else if (event.keyCode === 38 && d !== "DOWN") {
    d = "UP";
  } else if (event.keyCode === 39 && d !== "LEFT") {
    d = "RIGHT";
  } else if (event.keyCode === 40 && d !== "UP") {
    d = "DOWN";
  }
}

function draw() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  for (let obstacle of obstacles) {
    ctx.fillStyle = "brown";
    ctx.fillRect(obstacle.x, obstacle.y, box, box);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = generateFood();

    if (score % 5 === 0) {
      level++;
      if (level > maxLevel) {
        clearInterval(game);
        alert("Selamat! Anda telah menyelesaikan semua level.");
        return;
      } else {
        alert("Level " + level + " Selesai! Lanjut ke Level " + level);
        increaseDifficulty();
      }
    }
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake) ||
    collision(newHead, obstacles)
  ) {
    clearInterval(game);
    alert("Game Over! Skor Anda: " + score);
  }

  snake.unshift(newHead);
  document.getElementById("score").innerText =
    "Skor: " + score + " | Level: " + level;
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

function generateObstacles(num) {
  let obstacles = [];
  for (let i = 0; i < num; i++) {
    let obstacle = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    obstacles.push(obstacle);
  }
  return obstacles;
}

function increaseDifficulty() {
  clearInterval(game);
  game = setInterval(draw, 150 - level * 5);
  obstacles = generateObstacles(3 + level);
}

let game;
document.getElementById("startBtn").addEventListener("click", () => {
  score = 0;
  level = 1;
  snake = [{ x: 9 * box, y: 9 * box }];
  food = generateFood();
  obstacles = generateObstacles(5);
  d = "";
  clearInterval(game);
  game = setInterval(draw, 100);
});
