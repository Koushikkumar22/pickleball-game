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
const bgm = document.getElementById('bgm');

// New interactive elements
const powerUpElement = document.getElementById('power-up');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverText = document.getElementById('game-over-text');
const playAgainButton = document.getElementById('play-again-button');

let ballX, ballY;
let ballSpeedX, ballSpeedY;
let initialBallSpeed = 4;
let paddleSpeed = 8;
const powerUpDuration = 5000; // 5 seconds
let powerUpTimeout;
let powerUpType = '';

const winningScore = 11;
let player1Points, player2Points;
let gameRunning = false;
let isSinglePlayer = false;

let paddleLeftVelocity = 0;
let paddleRightVelocity = 0;

// --- MOBILE COMPATIBILITY ---
// Handle touch controls
gameArea.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleTouchMove(event);
}, { passive: false });

gameArea.addEventListener('touchmove', (event) => {
    event.preventDefault();
    handleTouchMove(event);
}, { passive: false });

function handleTouchMove(event) {
    if (!gameRunning) return;

    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    const gameAreaRect = gameArea.getBoundingClientRect();

    const normalizedY = touchY - gameAreaRect.top;
    const newPaddleY = Math.min(Math.max(0, normalizedY - 40), 320); // 40 = half of paddle height

    // Control paddle based on touch position
    if (touchX < gameAreaRect.left + gameAreaRect.width / 2) {
        paddleLeft.style.top = `${newPaddleY}px`;
    } else {
        if (!isSinglePlayer) {
            paddleRight.style.top = `${newPaddleY}px`;
        }
    }
}

// --- DESKTOP CONTROLS ---
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    if (event.key === 'w') paddleLeftVelocity = -paddleSpeed;
    if (event.key === 's') paddleLeftVelocity = paddleSpeed;
    if (!isSinglePlayer) {
        if (event.key === 'ArrowUp') paddleRightVelocity = -paddleSpeed;
        if (event.key === 'ArrowDown') paddleRightVelocity = paddleSpeed;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 's') paddleLeftVelocity = 0;
    if (!isSinglePlayer && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) paddleRightVelocity = 0;
});

function updatePaddles() {
    const paddleLeftTop = parseInt(window.getComputedStyle(paddleLeft).top);
    const paddleRightTop = parseInt(window.getComputedStyle(paddleRight).top);
    
    const newLeftTop = paddleLeftTop + paddleLeftVelocity;
    if (newLeftTop >= 0 && newLeftTop <= 320) paddleLeft.style.top = `${newLeftTop}px`;

    const newRightTop = paddleRightTop + paddleRightVelocity;
    if (newRightTop >= 0 && newRightTop <= 320) paddleRight.style.top = `${newRightTop}px`;
}

// --- AI FOR SINGLE-PLAYER ---
function moveComputerPaddle() {
    if (!isSinglePlayer || !gameRunning) return;
    const paddleRightTop = parseInt(window.getComputedStyle(paddleRight).top);
    const ballCenter = ballY + 10;
    const aiSpeed = paddleSpeed * 0.9;
    
    if (paddleRightTop + 40 < ballCenter) {
        paddleRight.style.top = `${Math.min(320, paddleRightTop + aiSpeed)}px`;
    }
    if (paddleRightTop + 40 > ballCenter) {
        paddleRight.style.top = `${Math.max(0, paddleRightTop - aiSpeed)}px`;
    }
}

// --- BALL AND GAME LOGIC ---
function moveBall() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

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
        ballSpeedX *= 1.05; // Dynamic difficulty increase
        ballSpeedY *= 1.05;
        hitSound.play();
    }

    // Ball collision with power-up
    const powerUpRect = powerUpElement.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    if (!powerUpElement.classList.contains('hidden') && 
        ballRect.left < powerUpRect.right &&
        ballRect.right > powerUpRect.left &&
        ballRect.top < powerUpRect.bottom &&
        ballRect.bottom > powerUpRect.top) {
        
        activatePowerUp(powerUpType);
        powerUpElement.classList.add('hidden');
    }

    // Ball out of bounds (score)
    if (ballX <= 0) {
        player2Points++;
        player2Score.textContent = player2Points;
        scoreSound.play();
        checkWinCondition();
        resetBall();
    }
    if (ballX >= 780) {
        player1Points++;
        player1Score.textContent = player1Points;
        scoreSound.play();
        checkWinCondition();
        resetBall();
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function checkWinCondition() {
    if (player1Points >= winningScore || player2Points >= winningScore) {
        gameRunning = false;
        bgm.pause();
        bgm.currentTime = 0;
        gameOverScreen.classList.remove('hidden');
        if (player1Points > player2Points) {
            gameOverText.textContent = "Player 1 Wins!";
        } else {
            gameOverText.textContent = "Player 2 Wins!";
        }
    }
}

function resetBall() {
    ballX = 390;
    ballY = 190;
    ballSpeedX = initialBallSpeed;
    ballSpeedY = initialBallSpeed;
    if (Math.random() < 0.5) ballSpeedX *= -1;
    if (Math.random() < 0.5) ballSpeedY *= -1;
}

// --- POWER-UP LOGIC ---
function spawnPowerUp() {
    if (gameRunning) {
        powerUpElement.classList.remove('hidden');
        powerUpElement.style.left = `${Math.random() * 600 + 100}px`;
        powerUpElement.style.top = `${Math.random() * 300 + 50}px`;
        powerUpType = Math.random() < 0.5 ? 'speed' : 'slowmo';
        powerUpElement.style.backgroundImage = powerUpType === 'speed' ? "url('assets/powerup.png')" : "url('assets/slowmo.png')";
    }
}

function activatePowerUp(type) {
    if (type === 'speed') {
        initialBallSpeed *= 1.5;
        paddleSpeed *= 1.5;
    } else if (type === 'slowmo') {
        initialBallSpeed *= 0.5;
        paddleSpeed *= 0.5;
    }
    
    clearTimeout(powerUpTimeout);
    powerUpTimeout = setTimeout(() => {
        initialBallSpeed = 4;
        paddleSpeed = 8;
    }, powerUpDuration);
}

// --- BUTTON LISTENERS ---
startButton.addEventListener('click', () => {
    gameRunning = true;
    startButton.disabled = true;
    gameOverScreen.classList.add('hidden');
    player1Points = 0;
    player2Points = 0;
    player1Score.textContent = '0';
    player2Score.textContent = '0';
    bgm.play();
    resetBall();
    setInterval(spawnPowerUp, 10000);
});

singlePlayerButton.addEventListener('click', () => {
    isSinglePlayer = true;
    startButton.disabled = false;
});

twoPlayerButton.addEventListener('click', () => {
    isSinglePlayer = false;
    startButton.disabled = false;
});

playAgainButton.addEventListener('click', () => {
    startButton.click();
});

// Initial state
startButton.disabled = true;

// Game loop
setInterval(() => {
    if (gameRunning) {
        moveBall();
        moveComputerPaddle();
        updatePaddles();
    }
}, 20);