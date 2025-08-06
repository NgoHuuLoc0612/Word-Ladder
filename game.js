/**
 * Word Ladder Game Implementation
 * Main game logic and UI management
 */

class WordLadderGame {
    constructor() {
        this.algorithm = new WordLadderAlgorithm();
        this.gameState = {
            mode: null,
            startWord: '',
            endWord: '',
            currentTurn: 'player1',
            gameStarted: false,
            gameEnded: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            difficulty: 'medium'
        };
        
        this.players = {
            player1: {
                name: 'Player 1',
                currentWord: '',
                ladder: [],
                isAI: false,
                hintsUsed: 0,
                score: 0
            },
            player2: {
                name: 'Player 2',
                currentWord: '',
                ladder: [],
                isAI: false,
                hintsUsed: 0,
                score: 0
            }
        };
        
        this.timerInterval = null;
        this.aiThinkingTimeout = null;
        this.isInitialized = false;
        
        this.initializeUI();
        this.loadWordList();
    }

    /**
     * Initialize UI event listeners
     */
    initializeUI() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMode(e.target.dataset.mode);
            });
        });

        // Word input
        document.getElementById('startWord').addEventListener('input', (e) => {
            this.validateWordInput(e.target);
        });
        
        document.getElementById('endWord').addEventListener('input', (e) => {
            this.validateWordInput(e.target);
        });

        // Game controls
        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('randomWords').addEventListener('click', () => {
            this.generateRandomWords();
        });

        // Player inputs
        document.getElementById('player1Input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitMove('player1');
            }
        });
        
        document.getElementById('player2Input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitMove('player2');
            }
        });

        document.getElementById('player1Submit').addEventListener('click', () => {
            this.submitMove('player1');
        });
        
        document.getElementById('player2Submit').addEventListener('click', () => {
            this.submitMove('player2');
        });

        // Hints
        document.getElementById('player1Hint').addEventListener('click', () => {
            this.showHint('player1');
        });

        // Game controls
        document.getElementById('pauseGame').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('backToMenu').addEventListener('click', () => {
            this.backToMenu();
        });
        
        document.getElementById('playAgain').addEventListener('click', () => {
            this.playAgain();
        });
    }

    /**
     * Load word list from file
     */
    async loadWordList() {
        try {
            document.getElementById('loading').style.display = 'flex';
            
            const response = await fetch('wordlist.txt');
            const text = await response.text();
            const words = text.split('\n').filter(line => line.trim());
            
            await this.algorithm.initialize(words);
            this.isInitialized = true;
            
            document.getElementById('loading').style.display = 'none';
            console.log('Word list loaded successfully');
        } catch (error) {
            console.error('Error loading word list:', error);
            this.showError('Failed to load word list. Please refresh the page.');
            document.getElementById('loading').style.display = 'none';
        }
    }

    /**
     * Select game mode
     */
    selectMode(mode) {
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('selected');
        
        // Update game state
        this.gameState.mode = mode;
        
        // Configure players based on mode
        switch (mode) {
            case 'pvp':
                this.players.player1.isAI = false;
                this.players.player2.isAI = false;
                this.players.player1.name = 'Player 1';
                this.players.player2.name = 'Player 2';
                document.getElementById('player2InputArea').style.display = 'flex';
                break;
            case 'aip':
                this.players.player1.isAI = false;
                this.players.player2.isAI = true;
                this.players.player1.name = 'Player';
                this.players.player2.name = 'AI';
                document.getElementById('player2InputArea').style.display = 'none';
                break;
            case 'aia':
                this.players.player1.isAI = true;
                this.players.player2.isAI = true;
                this.players.player1.name = 'AI 1';
                this.players.player2.name = 'AI 2';
                document.getElementById('player2InputArea').style.display = 'none';
                break;
        }
        
        // Update player section titles
        document.querySelector('#player1Section h3').textContent = this.players.player1.name;
        document.querySelector('#player2Section h3').textContent = this.players.player2.name;
        
        this.validateGameSetup();
    }

    /**
     * Validate word input
     */
    validateWordInput(input) {
        const word = input.value.toLowerCase().trim();
        
        if (!this.isInitialized) {
            return;
        }
        
        if (word.length < 3) {
            input.classList.remove('invalid');
            return;
        }
        
        if (this.algorithm.isValidWord(word)) {
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
        }
        
        this.validateGameSetup();
    }

    /**
     * Validate game setup
     */
    validateGameSetup() {
        const startWord = document.getElementById('startWord').value.toLowerCase().trim();
        const endWord = document.getElementById('endWord').value.toLowerCase().trim();
        const startBtn = document.getElementById('startGame');
        
        const isValid = this.gameState.mode && 
                       startWord.length >= 3 && 
                       endWord.length >= 3 && 
                       startWord.length === endWord.length &&
                       this.algorithm.isValidWord(startWord) && 
                       this.algorithm.isValidWord(endWord) &&
                       startWord !== endWord &&
                       this.isInitialized;
        
        startBtn.disabled = !isValid;
        
        if (isValid) {
            // Check if path exists
            const path = this.algorithm.findPath(startWord, endWord);
            if (!path) {
                startBtn.disabled = true;
                this.showError('No path exists between these words. Try different words.');
            } else {
                this.clearError();
            }
        }
    }

    /**
     * Generate random words
     */
    generateRandomWords() {
        if (!this.isInitialized) {
            return;
        }
        
        const lengths = [4, 5, 6];
        const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
        const wordPair = this.algorithm.generateRandomPair(randomLength);
        
        if (wordPair) {
            document.getElementById('startWord').value = wordPair.start.toUpperCase();
            document.getElementById('endWord').value = wordPair.end.toUpperCase();
            
            this.validateGameSetup();
        } else {
            this.showError('Could not generate random words. Please try again.');
        }
    }

    /**
     * Start the game
     */
    startGame() {
        if (!this.isInitialized) {
            this.showError('Game is still loading. Please wait.');
            return;
        }
        
        // Get and validate input
        const startWord = document.getElementById('startWord').value.toLowerCase().trim();
        const endWord = document.getElementById('endWord').value.toLowerCase().trim();
        const difficulty = document.getElementById('aiDifficulty').value;
        
        // Validate path exists
        const path = this.algorithm.findPath(startWord, endWord);
        if (!path) {
            this.showError('No path exists between these words.');
            return;
        }
        
        // Initialize game state
        this.gameState.startWord = startWord;
        this.gameState.endWord = endWord;
        this.gameState.difficulty = difficulty;
        this.gameState.gameStarted = true;
        this.gameState.gameEnded = false;
        this.gameState.isPaused = false;
        this.gameState.startTime = Date.now();
        this.gameState.elapsedTime = 0;
        this.gameState.currentTurn = 'player1';
        
        // Initialize players
        this.players.player1.currentWord = startWord;
        this.players.player1.ladder = [startWord];
        this.players.player1.hintsUsed = 0;
        this.players.player1.score = 0;
        
        this.players.player2.currentWord = startWord;
        this.players.player2.ladder = [startWord];
        this.players.player2.hintsUsed = 0;
        this.players.player2.score = 0;
        
        // Update UI
        this.showGameBoard();
        this.updateUI();
        this.startTimer();
        
        // Start AI if needed
        if (this.players.player1.isAI && this.gameState.currentTurn === 'player1') {
            this.makeAIMove('player1');
        }
    }

    /**
     * Show game board
     */
    showGameBoard() {
        document.getElementById('gameSetup').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'block';
        
        // Update display
        document.getElementById('displayStartWord').textContent = this.gameState.startWord.toUpperCase();
        document.getElementById('displayEndWord').textContent = this.gameState.endWord.toUpperCase();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update current words
        document.getElementById('player1CurrentWord').textContent = this.players.player1.currentWord.toUpperCase();
        document.getElementById('player2CurrentWord').textContent = this.players.player2.currentWord.toUpperCase();
        
        // Update ladders
        this.updateLadder('player1');
        this.updateLadder('player2');
        
        // Update active player
        document.getElementById('player1Section').classList.toggle('active', this.gameState.currentTurn === 'player1');
        document.getElementById('player2Section').classList.toggle('active', this.gameState.currentTurn === 'player2');
        
        // Update input states
        document.getElementById('player1Input').disabled = this.gameState.currentTurn !== 'player1' || this.players.player1.isAI;
        document.getElementById('player1Submit').disabled = this.gameState.currentTurn !== 'player1' || this.players.player1.isAI;
        document.getElementById('player2Input').disabled = this.gameState.currentTurn !== 'player2' || this.players.player2.isAI;
        document.getElementById('player2Submit').disabled = this.gameState.currentTurn !== 'player2' || this.players.player2.isAI;
        
        // Clear inputs
        document.getElementById('player1Input').value = '';
        document.getElementById('player2Input').value = '';
        
        // Update moves counter
        const totalMoves = this.players.player1.ladder.length + this.players.player2.ladder.length - 2;
        document.getElementById('moves').textContent = `Moves: ${totalMoves}`;
    }

    /**
     * Update ladder display
     */
    updateLadder(player) {
        const ladderElement = document.getElementById(`${player}Ladder`);
        const ladder = this.players[player].ladder;
        
        ladderElement.innerHTML = '';
        
        ladder.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'ladder-word';
            wordElement.textContent = word.toUpperCase();
            
            if (index === ladder.length - 1) {
                wordElement.classList.add('current');
            }
            
            ladderElement.appendChild(wordElement);
        });
    }

    /**
     * Submit player move
     */
    submitMove(player) {
        if (this.gameState.gameEnded || this.gameState.isPaused) {
            return;
        }
        
        if (this.gameState.currentTurn !== player) {
            return;
        }
        
        const input = document.getElementById(`${player}Input`);
        const word = input.value.toLowerCase().trim();
        
        if (!word) {
            this.showError('Please enter a word.');
            return;
        }
        
        if (!this.algorithm.isValidWord(word)) {
            this.showError('Invalid word. Please try again.');
            return;
        }
        
        if (this.players[player].ladder.includes(word)) {
            this.showError('Word already used. Try a different word.');
            return;
        }
        
        const currentWord = this.players[player].currentWord;
        if (!this.algorithm.areNeighbors(currentWord, word)) {
            this.showError('Words must differ by exactly one letter.');
            return;
        }
        
        // Valid move
        this.makeMove(player, word);
    }

    /**
     * Make a move for a player
     */
    makeMove(player, word) {
        this.players[player].currentWord = word;
        this.players[player].ladder.push(word);
        
        // Check for win
        if (word === this.gameState.endWord) {
            this.endGame(player);
            return;
        }
        
        // Switch turns
        this.gameState.currentTurn = player === 'player1' ? 'player2' : 'player1';
        
        // Update UI
        this.updateUI();
        
        // Check if next player is AI
        const nextPlayer = this.gameState.currentTurn;
        if (this.players[nextPlayer].isAI) {
            this.makeAIMove(nextPlayer);
        }
    }

    /**
     * Make AI move
     */
    makeAIMove(player) {
        if (this.gameState.gameEnded || this.gameState.isPaused) {
            return;
        }
        
        // Show AI thinking animation
        const thinkingElement = document.getElementById('aiThinking');
        thinkingElement.style.display = 'flex';
        
        // Simulate thinking time
        const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
        
        this.aiThinkingTimeout = setTimeout(() => {
            thinkingElement.style.display = 'none';
            
            const currentWord = this.players[player].currentWord;
            const targetWord = this.gameState.endWord;
            const difficulty = this.gameState.difficulty;
            
            // Get opponent's ladder for strategic play
            const opponentPlayer = player === 'player1' ? 'player2' : 'player1';
            const opponentLadder = this.players[opponentPlayer].ladder;
            
            const aiMove = this.algorithm.selectAIMove(currentWord, targetWord, difficulty, opponentLadder);
            
            if (aiMove) {
                this.makeMove(player, aiMove);
            } else {
                // AI is stuck, player wins
                const winner = player === 'player1' ? 'player2' : 'player1';
                this.endGame(winner);
            }
        }, thinkingTime);
    }

    /**
     * Show hint for player
     */
    showHint(player) {
        const currentWord = this.players[player].currentWord;
        const targetWord = this.gameState.endWord;
        const usedWords = this.players[player].ladder;
        
        const hint = this.algorithm.getHint(currentWord, targetWord, usedWords);
        
        if (hint) {
            const hintElement = document.getElementById(`${player}HintText`);
            hintElement.textContent = `Try: ${hint.toUpperCase()}`;
            hintElement.style.display = 'block';
            
            this.players[player].hintsUsed++;
            
            // Hide hint after 5 seconds
            setTimeout(() => {
                hintElement.style.display = 'none';
            }, 5000);
        } else {
            this.showError('No hints available.');
        }
    }

    /**
     * Start game timer
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.gameState.elapsedTime = Date.now() - this.gameState.startTime;
                this.updateTimer();
            }
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimer() {
        const minutes = Math.floor(this.gameState.elapsedTime / 60000);
        const seconds = Math.floor((this.gameState.elapsedTime % 60000) / 1000);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const pauseBtn = document.getElementById('pauseGame');
        
        if (this.gameState.isPaused) {
            pauseBtn.textContent = 'Resume';
            this.gameState.pauseTime = Date.now();
        } else {
            pauseBtn.textContent = 'Pause';
            // Adjust start time to account for pause
            const pauseDuration = Date.now() - this.gameState.pauseTime;
            this.gameState.startTime += pauseDuration;
        }
    }

    /**
     * End the game
     */
    endGame(winner) {
        this.gameState.gameEnded = true;
        
        // Clear timers
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.aiThinkingTimeout) {
            clearTimeout(this.aiThinkingTimeout);
        }
        
        // Calculate final scores
        this.calculateScores();
        
        // Show game over screen
        this.showGameOver(winner);
    }

    /**
     * Calculate final scores
     */
    calculateScores() {
        const baseScore = 1000;
        
        for (const player in this.players) {
            const playerData = this.players[player];
            let score = baseScore;
            
            // Deduct for moves (fewer moves = better score)
            score -= (playerData.ladder.length - 1) * 50;
            
            // Deduct for hints used
            score -= playerData.hintsUsed * 100;
            
            // Bonus for winning
            if (playerData.currentWord === this.gameState.endWord) {
                score += 500;
            }
            
            // Time bonus (faster = better)
            const timeBonus = Math.max(0, 300 - Math.floor(this.gameState.elapsedTime / 1000));
            score += timeBonus;
            
            playerData.score = Math.max(0, score);
        }
    }

    /**
     * Show game over screen
     */
    showGameOver(winner) {
        const gameOverElement = document.getElementById('gameOver');
        const titleElement = document.getElementById('gameOverTitle');
        const winnerElement = document.getElementById('winner');
        const finalTimeElement = document.getElementById('finalTime');
        const finalMovesElement = document.getElementById('finalMoves');
        const finalLadderElement = document.getElementById('finalLadder');
        
        // Update game over info
        titleElement.textContent = 'Game Over!';
        winnerElement.textContent = this.players[winner].name;
        
        // Update final time
        const minutes = Math.floor(this.gameState.elapsedTime / 60000);
        const seconds = Math.floor((this.gameState.elapsedTime % 60000) / 1000);
        finalTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update final moves
        finalMovesElement.textContent = this.players[winner].ladder.length - 1;
        
        // Show winning ladder
        finalLadderElement.innerHTML = '';
        this.players[winner].ladder.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'final-ladder-word';
            wordElement.textContent = word.toUpperCase();
            
            if (index === 0) {
                wordElement.classList.add('start');
            } else if (index === this.players[winner].ladder.length - 1) {
                wordElement.classList.add('end');
            }
            
            finalLadderElement.appendChild(wordElement);
        });
        
        // Hide game board and show game over
        document.getElementById('gameBoard').style.display = 'none';
        gameOverElement.style.display = 'flex';
    }

    /**
     * Restart the current game
     */
    restartGame() {
        // Reset game state
        this.gameState.gameStarted = false;
        this.gameState.gameEnded = false;
        this.gameState.isPaused = false;
        this.gameState.currentTurn = 'player1';
        this.gameState.elapsedTime = 0;
        
        // Reset players
        for (const player in this.players) {
            this.players[player].currentWord = '';
            this.players[player].ladder = [];
            this.players[player].hintsUsed = 0;
            this.players[player].score = 0;
        }
        
        // Clear timers
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.aiThinkingTimeout) {
            clearTimeout(this.aiThinkingTimeout);
        }
        
        // Restart with same words
        this.startGame();
    }

    /**
     * Go back to main menu
     */
    backToMenu() {
        // Clear timers
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.aiThinkingTimeout) {
            clearTimeout(this.aiThinkingTimeout);
        }
        
        // Reset game state
        this.gameState.gameStarted = false;
        this.gameState.gameEnded = false;
        this.gameState.isPaused = false;
        this.gameState.mode = null;
        
        // Reset players
        for (const player in this.players) {
            this.players[player].currentWord = '';
            this.players[player].ladder = [];
            this.players[player].hintsUsed = 0;
            this.players[player].score = 0;
        }
        
        // Clear UI selections
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('startWord').value = '';
        document.getElementById('endWord').value = '';
        
        // Show setup screen
        document.getElementById('gameBoard').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameSetup').style.display = 'block';
    }

    /**
     * Play again with new words
     */
    playAgain() {
        this.backToMenu();
        this.generateRandomWords();
    }

    /**
     * Show error message
     */
    showError(message) {
        // Create error element if it doesn't exist
        let errorElement = document.getElementById('errorMessage');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'errorMessage';
            errorElement.className = 'error-message';
            document.querySelector('.container').appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Clear error message
     */
    clearError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordLadderGame();
});