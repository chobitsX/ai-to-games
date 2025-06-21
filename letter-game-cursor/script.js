// 游戏状态和配置
class LetterMoleGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.isPaused = false;
        this.activeMoles = new Set();
        this.gameInterval = null;
        this.timeInterval = null;
        this.moleSpawnRate = 2000; // 初始生成速度（毫秒）
        this.moleDuration = 3000; // 地鼠停留时间（毫秒）
        
        // 字母池
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.currentLetters = new Map(); // 存储当前显示的字母和其位置
        
        // DOM元素
        this.initDOMElements();
        this.bindEvents();
        this.createParticles();
        
        // 音频上下文（用于生成音效）
        this.initAudio();
    }
    
    initDOMElements() {
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timeElement = document.getElementById('time');
        this.livesElement = document.getElementById('lives');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.modal = document.getElementById('game-over-modal');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalLevelElement = document.getElementById('final-level');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.holes = document.querySelectorAll('.hole');
        this.moles = document.querySelectorAll('.mole');
        this.letterElements = document.querySelectorAll('.letter');
    }
    
    bindEvents() {
        // 按钮事件
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 点击事件（用于触摸设备）
        this.holes.forEach((hole, index) => {
            hole.addEventListener('click', () => this.handleHoleClick(index));
        });
        
        // 模态框点击外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    initAudio() {
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('音频上下文不支持');
        }
    }
    
    // 播放音效
    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // 创建背景粒子
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
        
        // 持续创建粒子
        setInterval(() => {
            this.createParticle();
        }, 200);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.getElementById('particles').appendChild(particle);
        
        // 移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }
    
    // 开始游戏
    startGame() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        this.isPaused = false;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.playSound(440, 0.2); // 开始音效
        
        // 开始生成地鼠
        this.gameInterval = setInterval(() => {
            if (!this.isPaused) {
                this.spawnMole();
            }
        }, this.moleSpawnRate);
        
        // 开始计时
        this.timeInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateTimer();
            }
        }, 1000);
        
        this.updateDisplay();
    }
    
    // 暂停/恢复游戏
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '恢复' : '暂停';
        
        if (this.isPaused) {
            this.playSound(330, 0.2);
        } else {
            this.playSound(440, 0.2);
        }
    }
    
    // 重置游戏
    resetGame() {
        this.stopGame();
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.timeLeft = 60;
        this.moleSpawnRate = 2000;
        this.moleDuration = 3000;
        this.currentLetters.clear();
        this.activeMoles.clear();
        
        // 隐藏所有地鼠
        this.moles.forEach(mole => {
            mole.classList.remove('active', 'hit');
        });
        
        this.updateDisplay();
        this.playSound(220, 0.3);
    }
    
    // 停止游戏
    stopGame() {
        this.isPlaying = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    }
    
    // 生成地鼠
    spawnMole() {
        const availableHoles = [];
        
        // 找到没有活跃地鼠的洞
        this.holes.forEach((hole, index) => {
            if (!this.activeMoles.has(index)) {
                availableHoles.push(index);
            }
        });
        
        if (availableHoles.length === 0) return;
        
        const randomHoleIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const randomLetter = this.letters[Math.floor(Math.random() * this.letters.length)];
        
        this.showMole(randomHoleIndex, randomLetter);
    }
    
    // 显示地鼠
    showMole(holeIndex, letter) {
        const mole = this.moles[holeIndex];
        const letterElement = this.letterElements[holeIndex];
        
        mole.classList.add('active');
        letterElement.textContent = letter;
        this.activeMoles.add(holeIndex);
        this.currentLetters.set(letter, holeIndex);
        
        // 地鼠自动消失
        setTimeout(() => {
            if (this.activeMoles.has(holeIndex)) {
                this.hideMole(holeIndex);
                this.loseLive(); // 没打中扣生命
            }
        }, this.moleDuration);
    }
    
    // 隐藏地鼠
    hideMole(holeIndex) {
        const mole = this.moles[holeIndex];
        const letterElement = this.letterElements[holeIndex];
        const letter = letterElement.textContent;
        
        mole.classList.remove('active', 'hit');
        letterElement.textContent = '';
        this.activeMoles.delete(holeIndex);
        this.currentLetters.delete(letter);
    }
    
    // 处理按键
    handleKeyPress(event) {
        if (!this.isPlaying || this.isPaused) return;
        
        const pressedKey = event.key.toUpperCase();
        
        // 检查是否有对应的字母
        if (this.currentLetters.has(pressedKey)) {
            const holeIndex = this.currentLetters.get(pressedKey);
            this.hitMole(holeIndex);
            event.preventDefault();
        }
    }
    
    // 处理洞口点击（触摸设备）
    handleHoleClick(holeIndex) {
        if (!this.isPlaying || this.isPaused) return;
        
        if (this.activeMoles.has(holeIndex)) {
            this.hitMole(holeIndex);
        }
    }
    
    // 击中地鼠
    hitMole(holeIndex) {
        const mole = this.moles[holeIndex];
        const hole = this.holes[holeIndex];
        
        // 添加击中效果
        mole.classList.add('hit');
        this.playSound(660, 0.2); // 击中音效
        
        // 创建爆炸效果
        this.createSuccessBurst(hole);
        
        // 更新分数
        this.score += this.level * 10;
        this.updateDisplay();
        
        // 隐藏地鼠
        setTimeout(() => {
            this.hideMole(holeIndex);
        }, 300);
        
        // 检查升级
        this.checkLevelUp();
    }
    
    // 创建成功击中的爆炸效果
    createSuccessBurst(hole) {
        const rect = hole.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'success-particle';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--x', x + 'px');
            particle.style.setProperty('--y', y + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 600);
        }
    }
    
    // 失去生命
    loseLive() {
        this.lives--;
        this.playSound(200, 0.4, 'sawtooth'); // 失败音效
        this.updateDisplay();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    // 检查升级
    checkLevelUp() {
        const newLevel = Math.floor(this.score / 200) + 1;
        
        if (newLevel > this.level) {
            this.level = newLevel;
            this.playSound(800, 0.5); // 升级音效
            
            // 增加难度
            this.moleSpawnRate = Math.max(800, this.moleSpawnRate - 200);
            this.moleDuration = Math.max(1500, this.moleDuration - 200);
            
            // 重新设置生成间隔
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(() => {
                    if (!this.isPaused) {
                        this.spawnMole();
                    }
                }, this.moleSpawnRate);
            }
            
            // 升级动画
            this.levelElement.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.levelElement.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }
    
    // 更新计时器
    updateTimer() {
        this.timeLeft--;
        this.updateDisplay();
        
        if (this.timeLeft <= 0) {
            this.gameOver();
        } else if (this.timeLeft <= 10) {
            // 时间紧急时的效果
            this.timeElement.classList.add('animate__animated', 'animate__flash');
            setTimeout(() => {
                this.timeElement.classList.remove('animate__animated', 'animate__flash');
            }, 1000);
        }
    }
    
    // 更新显示
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.timeElement.textContent = this.timeLeft;
        
        // 更新生命显示
        const hearts = this.livesElement.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            heart.style.opacity = index < this.lives ? '1' : '0.3';
        });
    }
    
    // 游戏结束
    gameOver() {
        this.stopGame();
        this.playSound(300, 1, 'triangle'); // 游戏结束音效
        
        // 隐藏所有地鼠
        this.moles.forEach(mole => {
            mole.classList.remove('active', 'hit');
        });
        
        this.showModal();
    }
    
    // 显示结束模态框
    showModal() {
        this.finalScoreElement.textContent = this.score;
        this.finalLevelElement.textContent = this.level;
        this.modal.style.display = 'block';
        
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.classList.add('animate__bounceIn');
    }
    
    // 隐藏模态框
    hideModal() {
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.classList.remove('animate__bounceIn');
        modalContent.classList.add('animate__bounceOut');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            modalContent.classList.remove('animate__bounceOut');
        }, 500);
    }
    
    // 重新开始游戏
    restartGame() {
        this.hideModal();
        this.resetGame();
        setTimeout(() => {
            this.startGame();
        }, 500);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new LetterMoleGame();
    
    // 添加一些全局效果
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
    
    // 防止页面意外刷新时的提醒
    window.addEventListener('beforeunload', (e) => {
        if (game.isPlaying) {
            e.preventDefault();
            e.returnValue = '游戏正在进行中，确定要离开吗？';
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ': // 空格键开始/暂停
                e.preventDefault();
                if (!game.isPlaying) {
                    game.startGame();
                } else {
                    game.togglePause();
                }
                break;
            case 'Escape': // ESC键重置
                e.preventDefault();
                game.resetGame();
                break;
        }
    });
}); 