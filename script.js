// Game variables
const gameArea = document.getElementById('game-area');
const paddleLeft = document.getElementById('paddle-left');
const paddleRight = document.getElementById('paddle-right');
const ball = document.getElementById('ball');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const startButton = document.getElementById('start-button');
const singlePlayerButton = document.getElementById('single-player');
const twoPlayerButton = document.getElementById('two-player');
const hitSound = document.getElementById('hit-sound');
const scoreSound = document.getElementById('score-sound');
const bgm = document.getElementById('bgm'); // BGM element

let ballX = 390, ballY = 190;
let ballSpeedX = 4, ballSpeedY = 4;
const paddleSpeed = 8;
let player1Points = 0, player2Points = 0;
let gameRunning = false;
let isSinglePlayer = false;

// Smooth paddle movement
let paddleLeftVelocity = 0;
let paddleRightVelocity = 0;

// Prevent default arrow key behavior
document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }
});

// Move paddles
document.addEventListener('keydown', (event) => {
  if (!gameRunning) return;

  // Left paddle controls (W and S keys)
  if (event.key === 'w') {
    paddleLeftVelocity = -paddleSpeed;
  }
  if (event.key === 's') {
    paddleLeftVelocity = paddleSpeed;
  }

  // Right paddle controls (Arrow Up and Arrow Down keys) - Only in two-player mode
  if (!isSinglePlayer) {
    if (event.key === 'ArrowUp') {
      paddleRightVelocity = -paddleSpeed;
    }
    if (event.key === 'ArrowDown') {
      paddleRightVelocity = paddleSpeed;
    }
  }

  // Allow Arrow Up and Arrow Down for left paddle in single-player mode
  if (isSinglePlayer) {
    if (event.key === 'ArrowUp') {
      paddleLeftVelocity = -paddleSpeed;
    }
    if (event.key === 'ArrowDown') {
      paddleLeftVelocity = paddleSpeed;
    }
  }
});

// Stop paddles when keys are released
document.addEventListener('keyup', (event) => {
  if (event.key === 'w' || event.key === 's' || (isSinglePlayer && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))) {
    paddleLeftVelocity = 0;
  }
  if (!isSinglePlayer && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    paddleRightVelocity = 0;
  }
});

function updatePaddles() {
  const paddleLeftTop = parseInt(window.getComputedStyle(paddleLeft).top);
  const paddleRightTop = parseInt(window.getComputedStyle(paddleRight).top);

  // Move left paddle
  const newLeftTop = paddleLeftTop + paddleLeftVelocity;
  if (newLeftTop >= 0 && newLeftTop <= 320) {
    paddleLeft.style.top = `${newLeftTop}px`;
  }

  // Move right paddle
  const newRightTop = paddleRightTop + paddleRightVelocity;
  if (newRightTop >= 0 && newRightTop <= 320) {
    paddleRight.style.top = `${newRightTop}px`;
  }
}

// AI for single-player mode
function moveComputerPaddle() {
  if (!isSinglePlayer || !gameRunning) return;

  const paddleRightTop = parseInt(window.getComputedStyle(paddleRight).top);
  const ballCenter = ballY + 10; // Ball center

  if (paddleRightTop + 40 < ballCenter) {
    paddleRight.style.top = `${paddleRightTop + paddleSpeed}px`;
  }
  if (paddleRightTop + 40 > ballCenter) {
    paddleRight.style.top = `${paddleRightTop - paddleSpeed}px`;
  }
}

// Ball movement
function moveBall() {
  if (!gameRunning) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= 380) {
    ballSpeedY = -ballSpeedY;
    hitSound.play();
  }

  // Ball collision with paddles
  if (
    (ballX <= 20 && ballY >= parseInt(paddleLeft.style.top) && ballY <= parseInt(paddleLeft.style.top) + 80) ||
    (ballX >= 760 && ballY >= parseInt(paddleRight.style.top) && ballY <= parseInt(paddleRight.style.top) + 80)
  ) {
    ballSpeedX = -ballSpeedX;
    hitSound.play();
  }

  // Ball out of bounds (left or right)
  if (ballX <= 0) {
    player2Points++;
    player2Score.textContent = player2Points;
    resetBall();
    scoreSound.play();
  }
  if (ballX >= 780) {
    player1Points++;
    player1Score.textContent = player1Points;
    resetBall();
    scoreSound.play();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}

// Reset ball position
function resetBall() {
  ballX = 390;
  ballY = 190;
  ballSpeedX = -ballSpeedX;
}

// Start game
startButton.addEventListener('click', () => {
  gameRunning = true;
  startButton.disabled = true;
  player1Points = 0;
  player2Points = 0;
  player1Score.textContent = '0';
  player2Score.textContent = '0';
  bgm.play(); // Play BGM when the game starts
});

// Mode selection
singlePlayerButton.addEventListener('click', () => {
  isSinglePlayer = true;
  startButton.disabled = false;
});

twoPlayerButton.addEventListener('click', () => {
  isSinglePlayer = false;
  startButton.disabled = false;
});

// Game loop
setInterval(() => {
  moveBall();
  moveComputerPaddle();
  updatePaddles(); // Update paddle positions
}, 20);