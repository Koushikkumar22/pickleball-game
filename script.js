// Advanced Pickleball Game - Enhanced Version
// Features: Multiple game modes, power-ups, achievements, mobile optimization

class AdvancedPickleballGame {
    constructor() {
        this.initializeElements();
        this.initializeGameState();
        this.initializeSettings();
        this.initializeAudio();
        this.initializeAchievements();
        this.loadStats();
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Achievement popup timeout
        this._achievementTimeout = null;
        this._powerUpTimeout = null;
    }

    initializeElements() {
        // Screens
        this.screens = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            settings: document.getElementById('settings-menu'),
            achievements: document.getElementById('achievements-menu'),
            game: document.getElementById('game-screen'),
            pause: document.getElementById('pause-menu'),
            gameOver: document.getElementById('game-over-screen')
        };

        // Game elements
        this.gameArea = document.getElementById('game-area');
        this.paddleLeft = document.getElementById('paddle-left');
        this.paddleRight = document.getElementById('paddle-right');
        this.ball = document.getElementById('ball');
        this.net = document.getElementById('net');
        
        // UI elements
        this.player1Score = document.getElementById('player1-score');
        this.player2Score = document.getElementById('player2-score');
        this.levelDisplay = document.getElementById('level-display');
        this.timerDisplay = document.getElementById('timer-display');
        this.gameModeDisplay = document.getElementById('game-mode-display');
        
        // Containers
        this.particlesContainer = document.getElementById('particles-container');
        this.powerUpsContainer = document.getElementById('power-ups-container');
        this.comboDisplay = document.getElementById('combo-display');
        
        // Stats displays
        this.highScoreDisplay = document.getElementById('high-score-display');
        this.gamesPlayedDisplay = document.getElementById('games-played-display');
        this.achievementsCountDisplay = document.getElementById('achievements-count');
    }

    initializeGameState() {
        // Game dimensions - will be updated based on container
        this.gameWidth = 900;
        this.gameHeight = 400;
        this.gameScale = 1;
        
        // Ball properties
        this.ball.x = this.gameWidth / 2;
        this.ball.y = this.gameHeight / 2;
        this.ball.speedX = 4;
        this.ball.speedY = 4;
        this.ball.baseSpeed = 4;
        
        // Paddle properties
        this.paddleWidth = 15;
        this.paddleHeight = 80;
        this.paddleSpeed = 8;
        this.paddleLeft.y = (this.gameHeight - this.paddleHeight) / 2;
        this.paddleRight.y = (this.gameHeight - this.paddleHeight) / 2;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameMode = 'single-player';
        this.difficulty = 'medium';
        this.currentLevel = 1;
        this.gameStartTime = 0;
        this.gameTime = 0;
        
        // Scores
        this.player1Points = 0;
        this.player2Points = 0;
        this.targetScore = 11;
        
        // Power-ups
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpSpawnRate = 0.003;
        
        // Particles
        this.particles = [];
        
        // Combo system
        this.combo = 0;
        this.lastHitTime = 0;
        this.comboThreshold = 1000; // 1 second
        
        // AI state
        this.aiDifficulty = 0.8;
        this.aiReactionTime = 100;
        this.aiLastReaction = 0;
        
        // Mobile controls
        this.touchControls = {
            leftUp: false,
            leftDown: false,
            rightUp: false,
            rightDown: false
        };
        
        // Input handling
        this.keys = {};
        this.setupInputHandling();
    }

    initializeSettings() {
        this.settings = {
            soundEffects: true,
            backgroundMusic: true,
            particles: true,
            ballSpeed: 3,
            paddleSize: 80,
            difficulty: 'medium'
        };
        
        this.loadSettings();
        this.updateSettingsUI();
    }

    initializeAudio() {
        this.sounds = {
            hit: document.getElementById('hit-sound'),
            score: document.getElementById('score-sound'),
            powerUp: document.getElementById('power-up-sound'),
            bgm: document.getElementById('bgm')
        };
        
        // Set volumes
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = 0.5;
        });
        
        if (this.sounds.bgm) {
            this.sounds.bgm.volume = 0.3;
        }
    }

    initializeAchievements() {
        this.achievements = [
            { id: 'first_win', name: 'First Victory', desc: 'Win your first game', unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', desc: 'Reach ball speed level 5', unlocked: false },
            { id: 'combo_master', name: 'Combo Master', desc: 'Achieve a 10-hit combo', unlocked: false },
            { id: 'power_collector', name: 'Power Collector', desc: 'Collect 25 power-ups', unlocked: false },
            { id: 'perfectionist', name: 'Perfectionist', desc: 'Win without opponent scoring', unlocked: false },
            { id: 'marathon_player', name: 'Marathon Player', desc: 'Play for 30 minutes total', unlocked: false },
            { id: 'tournament_winner', name: 'Tournament Winner', desc: 'Win a tournament', unlocked: false },
            { id: 'survival_expert', name: 'Survival Expert', desc: 'Survive 5 minutes in survival mode', unlocked: false },
            { id: 'time_attack_pro', name: 'Time Attack Pro', desc: 'Score 50 points in time attack', unlocked: false },
            { id: 'difficulty_master', name: 'Difficulty Master', desc: 'Beat insane difficulty', unlocked: false },
            { id: 'power_up_master', name: 'Power-up Master', desc: 'Use all types of power-ups', unlocked: false },
            { id: 'paddle_master', name: 'Paddle Master', desc: 'Win with different paddle sizes', unlocked: false },
            { id: 'score_crusher', name: 'Score Crusher', desc: 'Score 100 total points', unlocked: false },
            { id: 'quick_win', name: 'Quick Win', desc: 'Win a game in under 60 seconds', unlocked: false },
            { id: 'comeback_king', name: 'Comeback King', desc: 'Win after being 5 points behind', unlocked: false },
            { id: 'particle_lover', name: 'Particle Lover', desc: 'Create 1000 particles', unlocked: false },
            { id: 'settings_explorer', name: 'Settings Explorer', desc: 'Change all settings at least once', unlocked: false },
            { id: 'mobile_master', name: 'Mobile Master', desc: 'Win a game on mobile', unlocked: false },
            { id: 'achievement_hunter', name: 'Achievement Hunter', desc: 'Unlock 10 achievements', unlocked: false },
            { id: 'game_master', name: 'Game Master', desc: 'Unlock all achievements', unlocked: false }
        ];
        
        this.loadAchievements();
        this.updateAchievementsDisplay();
    }

    showLoadingScreen() {
        this.screens.loading.style.display = 'flex';
        const progressBar = document.querySelector('.loading-progress');
        
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.screens.loading.style.opacity = '0';
                    setTimeout(() => {
                        this.screens.loading.style.display = 'none';
                        this.showMainMenu();
                    }, 500);
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    showMainMenu() {
        this.hideAllScreens();
        this.screens.mainMenu.classList.remove('hidden');
        this.updateStatsDisplay();
        
        if (this.settings.backgroundMusic && this.sounds.bgm) {
            this.sounds.bgm.play().catch(() => {}); // Handle autoplay restrictions
        }
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Force hide any open popups during screen transitions
        this.hideAchievementPopup();
        this.hidePowerUpNotification();
    }
    
    hidePowerUpNotification() {
        const popup = document.getElementById('power-up-notification');
        
        if (this._powerUpTimeout) {
            clearTimeout(this._powerUpTimeout);
            this._powerUpTimeout = null;
        }
        
        popup.classList.remove('visible');
        popup.classList.add('hidden');
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('single-player').addEventListener('click', () => this.startGame('single-player'));
        document.getElementById('two-player').addEventListener('click', () => this.startGame('two-player'));
        document.getElementById('tournament').addEventListener('click', () => this.startGame('tournament'));
        document.getElementById('time-attack').addEventListener('click', () => this.startGame('time-attack'));
        document.getElementById('survival').addEventListener('click', () => this.startGame('survival'));
        document.getElementById('settings').addEventListener('click', () => this.showSettings());
        document.getElementById('achievements').addEventListener('click', () => this.showAchievements());
        
        // Settings buttons
        document.getElementById('back-to-menu').addEventListener('click', () => this.showMainMenu());
        document.getElementById('reset-stats').addEventListener('click', () => this.resetStats());
        document.getElementById('back-to-menu-from-achievements').addEventListener('click', () => this.showMainMenu());
        
        // Game control buttons
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('power-btn').addEventListener('click', () => this.activateRandomPowerUp());
        
        // Pause menu buttons
        document.getElementById('resume-game').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('quit-to-menu').addEventListener('click', () => this.quitToMenu());
        
        // Game over buttons
        document.getElementById('play-again').addEventListener('click', () => this.restartGame());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.showMainMenu());
        
        // Settings controls
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('sfx-toggle').addEventListener('click', () => this.toggleSetting('soundEffects'));
        document.getElementById('music-toggle').addEventListener('click', () => this.toggleSetting('backgroundMusic'));
        document.getElementById('particles-toggle').addEventListener('click', () => this.toggleSetting('particles'));
        
        document.getElementById('ball-speed-slider').addEventListener('input', (e) => {
            this.settings.ballSpeed = parseInt(e.target.value);
            this.saveSettings();
        });
        
        document.getElementById('paddle-size-slider').addEventListener('input', (e) => {
            this.settings.paddleSize = parseInt(e.target.value);
            this.updatePaddleSize();
            this.saveSettings();
        });
        
        // Mobile controls
        this.setupMobileControls();
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Touch events for mobile (prevent scrolling during game)
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('#game-area') || e.target.closest('#mobile-controls')) {
                e.preventDefault();
            }
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('#game-area') || e.target.closest('#mobile-controls')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Window events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
        window.addEventListener('blur', () => this.autoPause());
        
        // Click outside popup to close
        document.addEventListener('click', (e) => {
            if (e.target.id === 'achievement-popup' || e.target.id === 'power-up-notification') {
                this.hidePopup(e.target);
            }
        });
    }

    setupMobileControls() {
        const mobileControls = {
            'left-up': () => this.touchControls.leftUp = true,
            'left-down': () => this.touchControls.leftDown = true,
            'right-up': () => this.touchControls.rightUp = true,
            'right-down': () => this.touchControls.rightDown = true
        };
        
        Object.entries(mobileControls).forEach(([id, action]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    action();
                    element.style.transform = 'scale(0.95)';
                });
                
                element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.touchControls[id.replace('-', '').replace('up', 'Up').replace('down', 'Down')] = false;
                    element.style.transform = 'scale(1)';
                });
                
                element.addEventListener('touchcancel', (e) => {
                    e.preventDefault();
                    this.touchControls[id.replace('-', '').replace('up', 'Up').replace('down', 'Down')] = false;
                    element.style.transform = 'scale(1)';
                });
            }
        });
    }

    setupInputHandling() {
        this.inputActions = {
            'w': () => this.keys.w,
            's': () => this.keys.s,
            'ArrowUp': () => this.keys.ArrowUp,
            'ArrowDown': () => this.keys.ArrowDown,
            ' ': () => this.activateRandomPowerUp(),
            'Escape': () => this.togglePause(),
            'p': () => this.togglePause()
        };
    }

    handleKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        this.keys[e.key] = true;
        
        if (e.key === ' ' && this.gameRunning && !this.gamePaused) {
            this.activateRandomPowerUp();
        }
        
        if (e.key === 'Escape' || e.key === 'p') {
            this.togglePause();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    startGame(mode) {
        this.gameMode = mode;
        this.difficulty = this.settings.difficulty;
        this.setupGameMode();
        this.hideAllScreens();
        this.screens.game.classList.remove('hidden');
        
        // Update game area size for responsive design
        setTimeout(() => {
            this.updateGameAreaSize();
            this.resetGame();
            this.gameRunning = true;
            this.gameStartTime = Date.now();
            this.gameModeDisplay.textContent = this.formatGameMode(mode);
            
            // Update stats
            this.stats.gamesPlayed++;
            this.saveStats();
            
            this.gameLoop();
        }, 50); // Small delay to ensure DOM is updated
    }

    setupGameMode() {
        switch (this.gameMode) {
            case 'tournament':
                this.targetScore = 21;
                this.currentLevel = 1;
                break;
            case 'time-attack':
                this.targetScore = Infinity;
                this.gameTime = 120; // 2 minutes
                this.startTimer();
                break;
            case 'survival':
                this.targetScore = Infinity;
                this.currentLevel = 1;
                this.ball.baseSpeed = 2;
                break;
            default:
                this.targetScore = 11;
        }
        
        this.updateAIDifficulty();
    }

    formatGameMode(mode) {
        const modes = {
            'single-player': 'Single Player',
            'two-player': 'Two Player',
            'tournament': 'Tournament',
            'time-attack': 'Time Attack',
            'survival': 'Survival'
        };
        return modes[mode] || mode;
    }

    updateAIDifficulty() {
        const difficulties = {
            'easy': { speed: 0.6, reaction: 200, accuracy: 0.7 },
            'medium': { speed: 0.8, reaction: 150, accuracy: 0.8 },
            'hard': { speed: 1.0, reaction: 100, accuracy: 0.9 },
            'insane': { speed: 1.2, reaction: 50, accuracy: 0.95 }
        };
        
        const diff = difficulties[this.difficulty] || difficulties.medium;
        this.aiDifficulty = diff.speed;
        this.aiReactionTime = diff.reaction;
        this.aiAccuracy = diff.accuracy;
    }

    resetGame() {
        this.ball.x = this.gameWidth / 2;
        this.ball.y = this.gameHeight / 2;
        this.ball.speedX = this.ball.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.speedY = this.ball.baseSpeed * (Math.random() - 0.5);
        
        this.paddleLeft.y = (this.gameHeight - this.paddleHeight) / 2;
        this.paddleRight.y = (this.gameHeight - this.paddleHeight) / 2;
        
        this.player1Points = 0;
        this.player2Points = 0;
        this.combo = 0;
        
        this.powerUps = [];
        this.activePowerUps = [];
        this.particles = [];
        
        this.updateScore();
        this.updatePaddleSize();
        this.clearPowerUps();
        this.clearParticles();
    }

    gameLoop() {
        if (!this.gameRunning || this.gamePaused) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }
        
        this.updatePaddles();
        this.updateBall();
        this.updatePowerUps();
        this.updateParticles();
        this.updateAI();
        this.updateTimer();
        this.checkGameEnd();
        this.spawnPowerUps();
        
        this.renderGame();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updatePaddles() {
        const speed = this.paddleSpeed;
        
        // Left paddle (Player 1)
        if (this.keys.w || this.touchControls.leftUp) {
            this.paddleLeft.y = Math.max(0, this.paddleLeft.y - speed);
        }
        if (this.keys.s || this.touchControls.leftDown) {
            this.paddleLeft.y = Math.min(this.gameHeight - this.paddleHeight, this.paddleLeft.y + speed);
        }
        
        // Right paddle (Player 2 or AI)
        if (this.gameMode === 'two-player') {
            if (this.keys.ArrowUp || this.touchControls.rightUp) {
                this.paddleRight.y = Math.max(0, this.paddleRight.y - speed);
            }
            if (this.keys.ArrowDown || this.touchControls.rightDown) {
                this.paddleRight.y = Math.min(this.gameHeight - this.paddleHeight, this.paddleRight.y + speed);
            }
        }
    }

    updateAI() {
        if (this.gameMode === 'two-player') return;
        
        const now = Date.now();
        if (now - this.aiLastReaction < this.aiReactionTime) return;
        
        const paddleCenter = this.paddleRight.y + this.paddleHeight / 2;
        const ballCenter = this.ball.y;
        const diff = ballCenter - paddleCenter;
        
        // Add some randomness based on accuracy
        const shouldReact = Math.random() < this.aiAccuracy;
        if (!shouldReact) return;
        
        const moveSpeed = this.paddleSpeed * this.aiDifficulty;
        
        if (Math.abs(diff) > 5) {
            if (diff > 0) {
                this.paddleRight.y = Math.min(this.gameHeight - this.paddleHeight, this.paddleRight.y + moveSpeed);
            } else {
                this.paddleRight.y = Math.max(0, this.paddleRight.y - moveSpeed);
            }
        }
        
        this.aiLastReaction = now;
    }

    updateBall() {
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.gameHeight - 20) {
            this.ball.speedY = -this.ball.speedY;
            this.playSound('hit');
            this.createParticles(this.ball.x, this.ball.y, '#ffeb3b');
        }
        
        // Ball collision with paddles
        if (this.checkPaddleCollision()) {
            this.handlePaddleHit();
        }
        
        // Ball out of bounds
        if (this.ball.x < 0) {
            this.player2Points++;
            this.resetBall();
            this.playSound('score');
            this.updateScore();
            this.resetCombo();
        } else if (this.ball.x > this.gameWidth) {
            this.player1Points++;
            this.resetBall();
            this.playSound('score');
            this.updateScore();
            this.resetCombo();
        }
    }

    checkPaddleCollision() {
        const ballLeft = this.ball.x;
        const ballRight = this.ball.x + 20;
        const ballTop = this.ball.y;
        const ballBottom = this.ball.y + 20;
        
        // Left paddle collision
        if (ballLeft <= 30 && ballRight >= 15 && 
            ballBottom >= this.paddleLeft.y && ballTop <= this.paddleLeft.y + this.paddleHeight) {
            return 'left';
        }
        
        // Right paddle collision
        if (ballRight >= this.gameWidth - 30 && ballLeft <= this.gameWidth - 15 &&
            ballBottom >= this.paddleRight.y && ballTop <= this.paddleRight.y + this.paddleHeight) {
            return 'right';
        }
        
        return false;
    }

    handlePaddleHit() {
        this.ball.speedX = -this.ball.speedX;
        
        // Add some angle based on where the ball hits the paddle
        const paddle = this.ball.speedX > 0 ? this.paddleLeft : this.paddleRight;
        const paddleCenter = paddle.y + this.paddleHeight / 2;
        const hitPos = (this.ball.y + 10 - paddleCenter) / (this.paddleHeight / 2);
        this.ball.speedY += hitPos * 2;
        
        // Increase speed slightly
        this.ball.speedX *= 1.05;
        this.ball.speedY *= 1.05;
        
        // Cap maximum speed
        const maxSpeed = this.ball.baseSpeed * 3;
        if (Math.abs(this.ball.speedX) > maxSpeed) {
            this.ball.speedX = Math.sign(this.ball.speedX) * maxSpeed;
        }
        if (Math.abs(this.ball.speedY) > maxSpeed) {
            this.ball.speedY = Math.sign(this.ball.speedY) * maxSpeed;
        }
        
        this.playSound('hit');
        this.createParticles(this.ball.x, this.ball.y, '#ff6600');
        this.updateCombo();
    }

    updateCombo() {
        const now = Date.now();
        if (now - this.lastHitTime < this.comboThreshold) {
            this.combo++;
            if (this.combo >= 5) {
                this.showComboDisplay();
            }
            this.checkComboAchievements();
        } else {
            this.combo = 1;
        }
        this.lastHitTime = now;
    }

    resetCombo() {
        this.combo = 0;
        this.hideComboDisplay();
    }

    showComboDisplay() {
        this.comboDisplay.textContent = `${this.combo}x COMBO!`;
        this.comboDisplay.classList.remove('hidden');
        
        setTimeout(() => {
            this.comboDisplay.classList.add('hidden');
        }, 2000);
    }

    hideComboDisplay() {
        this.comboDisplay.classList.add('hidden');
    }

    resetBall() {
        this.ball.x = this.gameWidth / 2;
        this.ball.y = this.gameHeight / 2;
        this.ball.speedX = this.ball.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.speedY = this.ball.baseSpeed * (Math.random() - 0.5);
        
        // In survival mode, increase speed over time
        if (this.gameMode === 'survival') {
            this.ball.baseSpeed += 0.1;
            this.levelDisplay.textContent = `Level ${Math.floor(this.ball.baseSpeed)}`;
        }
    }

    spawnPowerUps() {
        if (Math.random() < this.powerUpSpawnRate && this.powerUps.length < 3) {
            const types = ['speed', 'size', 'multi', 'slow'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const powerUp = {
                type: type,
                x: Math.random() * (this.gameWidth - 60) + 30,
                y: Math.random() * (this.gameHeight - 60) + 30,
                id: Date.now()
            };
            
            this.powerUps.push(powerUp);
            this.createPowerUpElement(powerUp);
        }
    }

    createPowerUpElement(powerUp) {
        const element = document.createElement('div');
        element.className = `power-up ${powerUp.type}`;
        element.style.left = powerUp.x + 'px';
        element.style.top = powerUp.y + 'px';
        element.dataset.id = powerUp.id;
        
        const icons = {
            speed: '⚡',
            size: '📏',
            multi: '🎾',
            slow: '🐌'
        };
        
        element.textContent = icons[powerUp.type];
        element.addEventListener('click', () => this.collectPowerUp(powerUp.id));
        
        this.powerUpsContainer.appendChild(element);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            this.removePowerUp(powerUp.id);
        }, 10000);
    }

    collectPowerUp(id) {
        const powerUp = this.powerUps.find(p => p.id === id);
        if (!powerUp) return;
        
        this.activatePowerUp(powerUp.type);
        this.removePowerUp(id);
        this.playSound('powerUp');
        this.showPowerUpNotification(powerUp.type);
        
        // Update stats
        this.stats.powerUpsCollected = (this.stats.powerUpsCollected || 0) + 1;
        this.checkPowerUpAchievements();
    }

    activatePowerUp(type) {
        const effects = {
            speed: () => {
                this.ball.speedX *= 1.5;
                this.ball.speedY *= 1.5;
                this.ball.element?.classList.add('powered');
            },
            size: () => {
                this.paddleLeft.style.height = '120px';
                this.paddleRight.style.height = '120px';
                this.paddleLeft.classList.add('powered');
                this.paddleRight.classList.add('powered');
            },
            multi: () => {
                // Create multiple balls effect (simplified)
                this.createParticles(this.ball.x, this.ball.y, '#00BCD4', 20);
            },
            slow: () => {
                this.ball.speedX *= 0.5;
                this.ball.speedY *= 0.5;
            }
        };
        
        effects[type]?.();
        
        // Add to active power-ups
        this.activePowerUps.push({
            type: type,
            endTime: Date.now() + 5000 // 5 seconds
        });
    }

    activateRandomPowerUp() {
        if (this.powerUps.length > 0) {
            const randomPowerUp = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
            this.collectPowerUp(randomPowerUp.id);
        }
    }

    removePowerUp(id) {
        this.powerUps = this.powerUps.filter(p => p.id !== id);
        const element = this.powerUpsContainer.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.remove();
        }
    }

    updatePowerUps() {
        const now = Date.now();
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            if (now > powerUp.endTime) {
                this.deactivatePowerUp(powerUp.type);
                return false;
            }
            return true;
        });
    }

    deactivatePowerUp(type) {
        switch (type) {
            case 'size':
                this.updatePaddleSize();
                this.paddleLeft.classList.remove('powered');
                this.paddleRight.classList.remove('powered');
                break;
            case 'speed':
                this.ball.element?.classList.remove('powered');
                break;
        }
    }

    clearPowerUps() {
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpsContainer.innerHTML = '';
    }

    createParticles(x, y, color, count = 8) {
        if (!this.settings.particles) return;
        
        for (let i = 0; i < count; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: color,
                id: Date.now() + i
            };
            
            this.particles.push(particle);
            this.createParticleElement(particle);
        }
        
        // Update stats
        this.stats.particlesCreated = (this.stats.particlesCreated || 0) + count;
        this.checkParticleAchievements();
    }

    createParticleElement(particle) {
        const element = document.createElement('div');
        element.className = 'particle';
        element.style.left = particle.x + 'px';
        element.style.top = particle.y + 'px';
        element.style.background = particle.color;
        element.dataset.id = particle.id;
        
        this.particlesContainer.appendChild(element);
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vy += 0.2; // Gravity
            
            const element = this.particlesContainer.querySelector(`[data-id="${particle.id}"]`);
            if (element) {
                element.style.left = particle.x + 'px';
                element.style.top = particle.y + 'px';
                element.style.opacity = particle.life;
            }
            
            if (particle.life <= 0) {
                element?.remove();
                return false;
            }
            
            return true;
        });
    }

    clearParticles() {
        this.particles = [];
        this.particlesContainer.innerHTML = '';
    }

    updateScore() {
        this.player1Score.textContent = this.player1Points;
        this.player2Score.textContent = this.player2Points;
    }

    updateTimer() {
        if (this.gameMode === 'time-attack') {
            this.gameTime--;
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.gameTime <= 0) {
                this.endGame();
            }
        } else {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameRunning && !this.gamePaused) {
                this.updateTimer();
            }
        }, 1000);
    }

    checkGameEnd() {
        let gameEnded = false;
        let winner = '';
        
        if (this.gameMode === 'time-attack') {
            if (this.gameTime <= 0) {
                gameEnded = true;
                winner = this.player1Points > this.player2Points ? 'Player 1' : 
                        this.player2Points > this.player1Points ? 'Player 2' : 'Tie';
            }
        } else {
            if (this.player1Points >= this.targetScore) {
                gameEnded = true;
                winner = 'Player 1';
            } else if (this.player2Points >= this.targetScore) {
                gameEnded = true;
                winner = 'Player 2';
            }
        }
        
        if (gameEnded) {
            this.endGame(winner);
        }
    }

    endGame(winner = '') {
        this.gameRunning = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.updateGameStats(winner);
        this.checkWinAchievements(winner);
        this.showGameOverScreen(winner);
    }

    updateGameStats(winner) {
        const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        // Update stats
        this.stats.totalPlayTime = (this.stats.totalPlayTime || 0) + gameTime;
        this.stats.totalScore = (this.stats.totalScore || 0) + this.player1Points + this.player2Points;
        
        if (winner === 'Player 1') {
            this.stats.wins = (this.stats.wins || 0) + 1;
            if (this.player1Points > (this.stats.highScore || 0)) {
                this.stats.highScore = this.player1Points;
            }
        }
        
        this.saveStats();
        this.checkTimeAchievements();
        this.checkScoreAchievements();
    }

    showGameOverScreen(winner) {
        const title = document.getElementById('game-over-title');
        const stats = document.getElementById('game-over-stats');
        
        let titleText = 'Game Over!';
        if (winner === 'Player 1') titleText = '🎉 Victory!';
        else if (winner === 'Player 2') titleText = '💀 Defeat!';
        else if (winner === 'Tie') titleText = '🤝 Tie Game!';
        
        title.textContent = titleText;
        
        const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        
        stats.innerHTML = `
            <div class="game-stat">Final Score: ${this.player1Points} - ${this.player2Points}</div>
            <div class="game-stat">Game Time: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
            <div class="game-stat">Best Combo: ${this.combo}</div>
            <div class="game-stat">Power-ups Used: ${this.stats.powerUpsCollected || 0}</div>
        `;
        
        this.hideAllScreens();
        this.screens.gameOver.classList.remove('hidden');
    }

    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.hideAllScreens();
            this.screens.pause.classList.remove('hidden');
        } else {
            this.hideAllScreens();
            this.screens.game.classList.remove('hidden');
        }
    }

    autoPause() {
        if (this.gameRunning && !this.gamePaused) {
            this.togglePause();
        }
    }

    restartGame() {
        this.resetGame();
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameStartTime = Date.now();
        this.hideAllScreens();
        this.screens.game.classList.remove('hidden');
    }

    quitToMenu() {
        this.gameRunning = false;
        this.gamePaused = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        this.showMainMenu();
    }

    renderGame() {
        // Update ball position
        this.ball.style.left = this.ball.x + 'px';
        this.ball.style.top = this.ball.y + 'px';
        
        // Update paddle positions
        this.paddleLeft.style.top = this.paddleLeft.y + 'px';
        this.paddleRight.style.top = this.paddleRight.y + 'px';
        
        // Update game area size if needed
        this.updateGameAreaSize();
    }

    updateGameAreaSize() {
        const rect = this.gameArea.getBoundingClientRect();
        this.gameWidth = rect.width - 6; // Account for borders
        this.gameHeight = rect.height - 6;
        this.gameScale = Math.min(this.gameWidth / 900, this.gameHeight / 400);
        
        // Update paddle height based on screen size
        this.paddleHeight = Math.max(50, this.settings.paddleSize * this.gameScale);
        
        // Reposition game elements if game is running
        if (this.gameRunning) {
            this.repositionGameElements();
        }
    }
    
    repositionGameElements() {
        // Keep ball in bounds
        this.ball.x = Math.min(this.ball.x, this.gameWidth - 20);
        this.ball.y = Math.min(this.ball.y, this.gameHeight - 20);
        
        // Keep paddles in bounds
        this.paddleLeft.y = Math.min(this.paddleLeft.y, this.gameHeight - this.paddleHeight);
        this.paddleRight.y = Math.min(this.paddleRight.y, this.gameHeight - this.paddleHeight);
        
        this.updatePaddleSize();
        this.renderGame();
    }

    updatePaddleSize() {
        const height = this.settings.paddleSize + 'px';
        this.paddleLeft.style.height = height;
        this.paddleRight.style.height = height;
        this.paddleHeight = this.settings.paddleSize;
    }

    // Settings Management
    showSettings() {
        this.hideAllScreens();
        this.screens.settings.classList.remove('hidden');
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        document.getElementById('difficulty-select').value = this.settings.difficulty;
        document.getElementById('sfx-toggle').className = `toggle-btn ${this.settings.soundEffects ? 'on' : 'off'}`;
        document.getElementById('sfx-toggle').textContent = this.settings.soundEffects ? 'ON' : 'OFF';
        document.getElementById('music-toggle').className = `toggle-btn ${this.settings.backgroundMusic ? 'on' : 'off'}`;
        document.getElementById('music-toggle').textContent = this.settings.backgroundMusic ? 'ON' : 'OFF';
        document.getElementById('particles-toggle').className = `toggle-btn ${this.settings.particles ? 'on' : 'off'}`;
        document.getElementById('particles-toggle').textContent = this.settings.particles ? 'ON' : 'OFF';
        document.getElementById('ball-speed-slider').value = this.settings.ballSpeed;
        document.getElementById('paddle-size-slider').value = this.settings.paddleSize;
    }

    toggleSetting(setting) {
        this.settings[setting] = !this.settings[setting];
        this.saveSettings();
        this.updateSettingsUI();
        
        if (setting === 'backgroundMusic') {
            if (this.settings.backgroundMusic) {
                this.sounds.bgm?.play();
            } else {
                this.sounds.bgm?.pause();
            }
        }
        
        this.checkSettingsAchievements();
    }

    saveSettings() {
        localStorage.setItem('pickleballSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('pickleballSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    // Stats Management
    updateStatsDisplay() {
        this.highScoreDisplay.textContent = this.stats.highScore || 0;
        this.gamesPlayedDisplay.textContent = this.stats.gamesPlayed || 0;
        const unlockedCount = this.achievements.filter(a => a.unlocked).length;
        this.achievementsCountDisplay.textContent = `${unlockedCount}/${this.achievements.length}`;
    }

    saveStats() {
        localStorage.setItem('pickleballStats', JSON.stringify(this.stats));
        this.updateStatsDisplay();
    }

    loadStats() {
        const saved = localStorage.getItem('pickleballStats');
        this.stats = saved ? JSON.parse(saved) : {
            gamesPlayed: 0,
            wins: 0,
            highScore: 0,
            totalPlayTime: 0,
            totalScore: 0,
            powerUpsCollected: 0,
            particlesCreated: 0
        };
    }

    resetStats() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            this.stats = {
                gamesPlayed: 0,
                wins: 0,
                highScore: 0,
                totalPlayTime: 0,
                totalScore: 0,
                powerUpsCollected: 0,
                particlesCreated: 0
            };
            
            this.achievements.forEach(achievement => {
                achievement.unlocked = false;
            });
            
            this.saveStats();
            this.saveAchievements();
            this.updateStatsDisplay();
            this.updateAchievementsDisplay();
        }
    }

    // Achievements System
    showAchievements() {
        this.hideAllScreens();
        this.screens.achievements.classList.remove('hidden');
        this.updateAchievementsDisplay();
    }

    updateAchievementsDisplay() {
        const container = document.getElementById('achievements-list');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const element = document.createElement('div');
            element.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            const icon = achievement.unlocked ? '🏅' : '🔒';
            element.innerHTML = `
                <div class="achievement-icon">${icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            
            container.appendChild(element);
        });
    }

    unlockAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveAchievements();
            this.showAchievementPopup(achievement);
            this.updateStatsDisplay();
            
            // Check for meta achievements
            const unlockedCount = this.achievements.filter(a => a.unlocked).length;
            if (unlockedCount >= 10 && !this.achievements.find(a => a.id === 'achievement_hunter').unlocked) {
                this.unlockAchievement('achievement_hunter');
            }
            if (unlockedCount >= this.achievements.length - 1 && !this.achievements.find(a => a.id === 'game_master').unlocked) {
                this.unlockAchievement('game_master');
            }
        }
    }

    showAchievementPopup(achievement) {
        const popup = document.getElementById('achievement-popup');
        const name = document.getElementById('achievement-name');
        const desc = document.getElementById('achievement-desc');
        
        // Clear any existing timeout
        if (this._achievementTimeout) {
            clearTimeout(this._achievementTimeout);
            this._achievementTimeout = null;
        }
        
        name.textContent = achievement.name;
        desc.textContent = achievement.desc;
        
        popup.classList.remove('hidden');
        popup.classList.add('visible');
        
        // Set new timeout
        this._achievementTimeout = setTimeout(() => {
            this.hideAchievementPopup();
        }, 3000);
        
        // Auto-hide on visibility change (tab switch, etc.)
        const hideOnVisibilityChange = () => {
            if (document.hidden) {
                this.hideAchievementPopup();
                document.removeEventListener('visibilitychange', hideOnVisibilityChange);
            }
        };
        document.addEventListener('visibilitychange', hideOnVisibilityChange);
    }
    
    hideAchievementPopup() {
        const popup = document.getElementById('achievement-popup');
        
        if (this._achievementTimeout) {
            clearTimeout(this._achievementTimeout);
            this._achievementTimeout = null;
        }
        
        popup.classList.remove('visible');
        popup.classList.add('hidden');
    }

    showPowerUpNotification(type) {
        const popup = document.getElementById('power-up-notification');
        const name = document.getElementById('power-up-name');
        const effect = document.getElementById('power-up-effect');
        
        const powerUpInfo = {
            speed: { name: '⚡ Speed Boost', effect: 'Ball speed increased!' },
            size: { name: '📏 Paddle Size', effect: 'Paddle size increased!' },
            multi: { name: '🎾 Multi Ball', effect: 'Multiple ball effect!' },
            slow: { name: '🐌 Slow Motion', effect: 'Ball slowed down!' }
        };
        
        const info = powerUpInfo[type];
        name.textContent = info.name;
        effect.textContent = info.effect;
        
        popup.classList.remove('hidden');
        
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 2000);
    }

    hidePopup(popup) {
        // Delegate to specific popup hide methods that handle timeouts
        if (popup.id === 'achievement-popup') {
            this.hideAchievementPopup();
        } else if (popup.id === 'power-up-notification') {
            this.hidePowerUpNotification();
        } else {
            // Fallback for other popups
            popup.classList.remove('visible');
            popup.classList.add('hidden');
        }
    }

    saveAchievements() {
        localStorage.setItem('pickleballAchievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('pickleballAchievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            savedAchievements.forEach(saved => {
                const achievement = this.achievements.find(a => a.id === saved.id);
                if (achievement) {
                    achievement.unlocked = saved.unlocked;
                }
            });
        }
    }

    // Achievement Checkers
    checkWinAchievements(winner) {
        if (winner === 'Player 1') {
            this.unlockAchievement('first_win');
            
            if (this.player2Points === 0) {
                this.unlockAchievement('perfectionist');
            }
            
            const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
            if (gameTime < 60) {
                this.unlockAchievement('quick_win');
            }
            
            if (this.difficulty === 'insane') {
                this.unlockAchievement('difficulty_master');
            }
            
            if (this.gameMode === 'tournament') {
                this.unlockAchievement('tournament_winner');
            }
            
            // Check for mobile
            if (window.innerWidth <= 768) {
                this.unlockAchievement('mobile_master');
            }
        }
    }

    checkComboAchievements() {
        if (this.combo >= 10) {
            this.unlockAchievement('combo_master');
        }
    }

    checkPowerUpAchievements() {
        if ((this.stats.powerUpsCollected || 0) >= 25) {
            this.unlockAchievement('power_collector');
        }
    }

    checkTimeAchievements() {
        const totalMinutes = Math.floor((this.stats.totalPlayTime || 0) / 60);
        if (totalMinutes >= 30) {
            this.unlockAchievement('marathon_player');
        }
        
        if (this.gameMode === 'survival') {
            const survivalTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
            if (survivalTime >= 300) { // 5 minutes
                this.unlockAchievement('survival_expert');
            }
        }
        
        if (this.gameMode === 'time-attack' && this.player1Points >= 50) {
            this.unlockAchievement('time_attack_pro');
        }
    }

    checkScoreAchievements() {
        if ((this.stats.totalScore || 0) >= 100) {
            this.unlockAchievement('score_crusher');
        }
    }

    checkParticleAchievements() {
        if ((this.stats.particlesCreated || 0) >= 1000) {
            this.unlockAchievement('particle_lover');
        }
    }

    checkSettingsAchievements() {
        // Simple check - if user has changed multiple settings
        const changedSettings = Object.values(this.settings).filter(v => v !== true && v !== 3 && v !== 80 && v !== 'medium').length;
        if (changedSettings >= 3) {
            this.unlockAchievement('settings_explorer');
        }
    }

    // Audio Management
    playSound(soundName) {
        if (!this.settings.soundEffects || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        sound.currentTime = 0;
        sound.play().catch(() => {}); // Handle autoplay restrictions
    }

    // Utility Methods
    handleResize() {
        this.updateGameAreaSize();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pickleballGame = new AdvancedPickleballGame();
});

// Prevent context menu on mobile
document.addEventListener('contextmenu', e => e.preventDefault());

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.pickleballGame) {
        window.pickleballGame.autoPause();
    }
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPickleballGame;
}