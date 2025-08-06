/**
 * Advanced Word Ladder Algorithm Implementation
 * Contains multiple sophisticated algorithms for pathfinding and AI strategy
 */

class WordLadderAlgorithm {
    constructor() {
        this.wordSet = new Set();
        this.wordGraph = new Map();
        this.wordsByLength = new Map();
        this.precomputedPaths = new Map();
        this.heuristicCache = new Map();
    }

    /**
     * Initialize the algorithm with word list
     */
    async initialize(words) {
        console.log('Initializing word ladder algorithm...');
        
        // Process words - handle both formats: "word" or "word (definition)"
        const processedWords = words
            .map(line => {
                const parts = line.trim().split(' ');
            const word = parts[parts.length - 1];
            return word.toLowerCase();
        })
        .filter(word => /^[a-z]+$/.test(word));

    this.wordSet = new Set(processedWords);

    for (const word of processedWords) {
        if (!this.wordsByLength.has(word.length)) {
            this.wordsByLength.set(word.length, new Set());
        }
        this.wordsByLength.get(word.length).add(word);
    }
    console.log(`Loaded ${this.wordSet.size} words`);

    await this.buildWordGraph();
}
    /**
     * Build adjacency graph using advanced techniques
     */
    async buildWordGraph() {
        console.log('Building word graph...');
        
        for (const [length, words] of this.wordsByLength) {
            const wordArray = Array.from(words);
            
            // Use bucket sort approach for efficient neighbor finding
            const buckets = new Map();
            
            for (const word of wordArray) {
                // Create wildcard patterns for each position
                for (let i = 0; i < word.length; i++) {
                    const pattern = word.substring(0, i) + '*' + word.substring(i + 1);
                    
                    if (!buckets.has(pattern)) {
                        buckets.set(pattern, []);
                    }
                    buckets.get(pattern).push(word);
                }
            }
            
            // Build adjacency list from buckets
            for (const [pattern, patternWords] of buckets) {
                for (let i = 0; i < patternWords.length; i++) {
                    for (let j = i + 1; j < patternWords.length; j++) {
                        const word1 = patternWords[i];
                        const word2 = patternWords[j];
                        
                        if (!this.wordGraph.has(word1)) {
                            this.wordGraph.set(word1, new Set());
                        }
                        if (!this.wordGraph.has(word2)) {
                            this.wordGraph.set(word2, new Set());
                        }
                        
                        this.wordGraph.get(word1).add(word2);
                        this.wordGraph.get(word2).add(word1);
                    }
                }
            }
        }
        
        console.log('Word graph built successfully');
    }

    /**
     * Advanced A* pathfinding with multiple heuristics
     */
    findPath(start, end, useHeuristic = true) {
        if (start.length !== end.length) {
            return null;
        }
        
        if (start === end) {
            return [start];
        }
        
        // Check cache first
        const cacheKey = `${start}-${end}`;
        if (this.precomputedPaths.has(cacheKey)) {
            return this.precomputedPaths.get(cacheKey);
        }
        
        const openSet = new Map();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        // Initialize starting node
        openSet.set(start, 0);
        gScore.set(start, 0);
        fScore.set(start, useHeuristic ? this.heuristic(start, end) : 0);
        
        while (openSet.size > 0) {
            // Find node with lowest fScore
            let current = null;
            let lowestF = Infinity;
            
            for (const [node, f] of openSet) {
                if (f < lowestF) {
                    lowestF = f;
                    current = node;
                }
            }
            
            if (current === end) {
                // Reconstruct path
                const path = [];
                let temp = current;
                while (temp) {
                    path.unshift(temp);
                    temp = cameFrom.get(temp);
                }
                
                // Cache result
                this.precomputedPaths.set(cacheKey, path);
                return path;
            }
            
            openSet.delete(current);
            closedSet.add(current);
            
            // Explore neighbors
            const neighbors = this.wordGraph.get(current) || new Set();
            
            for (const neighbor of neighbors) {
                if (closedSet.has(neighbor)) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(current) + 1;
                
                if (!openSet.has(neighbor)) {
                    openSet.set(neighbor, Infinity);
                }
                
                if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + (useHeuristic ? this.heuristic(neighbor, end) : 0));
                    openSet.set(neighbor, fScore.get(neighbor));
                }
            }
        }
        
        return null; // No path found
    }

    /**
     * Composite heuristic function using multiple strategies
     */
    heuristic(word1, word2) {
        const cacheKey = `${word1}-${word2}`;
        if (this.heuristicCache.has(cacheKey)) {
            return this.heuristicCache.get(cacheKey);
        }
        
        // Hamming distance (number of differing characters)
        let hammingDistance = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) {
                hammingDistance++;
            }
        }
        
        // Levenshtein distance for more accurate estimation
        const levenshteinDistance = this.calculateLevenshtein(word1, word2);
        
        // Character frequency analysis
        const charFreqDiff = this.calculateCharFrequencyDifference(word1, word2);
        
        // Composite heuristic with weighted components
        const heuristicValue = hammingDistance * 0.6 + levenshteinDistance * 0.3 + charFreqDiff * 0.1;
        
        this.heuristicCache.set(cacheKey, heuristicValue);
        return heuristicValue;
    }

    /**
     * Calculate Levenshtein distance between two words
     */
    calculateLevenshtein(word1, word2) {
        const matrix = [];
        
        for (let i = 0; i <= word2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= word1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= word2.length; i++) {
            for (let j = 1; j <= word1.length; j++) {
                if (word2.charAt(i - 1) === word1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[word2.length][word1.length];
    }

    /**
     * Calculate character frequency difference
     */
    calculateCharFrequencyDifference(word1, word2) {
        const freq1 = {};
        const freq2 = {};
        
        for (const char of word1) {
            freq1[char] = (freq1[char] || 0) + 1;
        }
        
        for (const char of word2) {
            freq2[char] = (freq2[char] || 0) + 1;
        }
        
        const allChars = new Set([...word1, ...word2]);
        let diff = 0;
        
        for (const char of allChars) {
            diff += Math.abs((freq1[char] || 0) - (freq2[char] || 0));
        }
        
        return diff;
    }

    /**
     * Bidirectional BFS for faster pathfinding
     */
    findPathBidirectional(start, end) {
        if (start.length !== end.length) {
            return null;
        }
        
        if (start === end) {
            return [start];
        }
        
        const forwardQueue = [start];
        const backwardQueue = [end];
        const forwardVisited = new Map();
        const backwardVisited = new Map();
        const forwardParent = new Map();
        const backwardParent = new Map();
        
        forwardVisited.set(start, 0);
        backwardVisited.set(end, 0);
        
        let level = 0;
        
        while (forwardQueue.length > 0 && backwardQueue.length > 0) {
            level++;
            
            // Expand forward frontier
            const forwardSize = forwardQueue.length;
            for (let i = 0; i < forwardSize; i++) {
                const current = forwardQueue.shift();
                const neighbors = this.wordGraph.get(current) || new Set();
                
                for (const neighbor of neighbors) {
                    if (backwardVisited.has(neighbor)) {
                        // Path found! Reconstruct from both sides
                        return this.reconstructBidirectionalPath(
                            neighbor, forwardParent, backwardParent, start, end
                        );
                    }
                    
                    if (!forwardVisited.has(neighbor)) {
                        forwardVisited.set(neighbor, level);
                        forwardParent.set(neighbor, current);
                        forwardQueue.push(neighbor);
                    }
                }
            }
            
            // Expand backward frontier
            const backwardSize = backwardQueue.length;
            for (let i = 0; i < backwardSize; i++) {
                const current = backwardQueue.shift();
                const neighbors = this.wordGraph.get(current) || new Set();
                
                for (const neighbor of neighbors) {
                    if (forwardVisited.has(neighbor)) {
                        // Path found! Reconstruct from both sides
                        return this.reconstructBidirectionalPath(
                            neighbor, forwardParent, backwardParent, start, end
                        );
                    }
                    
                    if (!backwardVisited.has(neighbor)) {
                        backwardVisited.set(neighbor, level);
                        backwardParent.set(neighbor, current);
                        backwardQueue.push(neighbor);
                    }
                }
            }
        }
        
        return null; // No path found
    }

    /**
     * Reconstruct path from bidirectional search
     */
    reconstructBidirectionalPath(meetingPoint, forwardParent, backwardParent, start, end) {
        const forwardPath = [];
        const backwardPath = [];
        
        // Build forward path
        let current = meetingPoint;
        while (current !== start) {
            forwardPath.unshift(current);
            current = forwardParent.get(current);
        }
        forwardPath.unshift(start);
        
        // Build backward path
        current = backwardParent.get(meetingPoint);
        while (current && current !== end) {
            backwardPath.push(current);
            current = backwardParent.get(current);
        }
        if (current === end) {
            backwardPath.push(end);
        }
        
        return [...forwardPath, ...backwardPath];
    }

    /**
     * Advanced AI move selection with multiple strategies
     */
    selectAIMove(currentWord, targetWord, difficulty, playerLadder = []) {
        const strategies = {
            'easy': this.selectEasyMove.bind(this),
            'medium': this.selectMediumMove.bind(this),
            'hard': this.selectHardMove.bind(this),
            'expert': this.selectExpertMove.bind(this)
        };
        
        return strategies[difficulty](currentWord, targetWord, playerLadder);
    }

    /**
     * Easy AI: Random valid moves with occasional mistakes
     */
    selectEasyMove(currentWord, targetWord) {
        const neighbors = Array.from(this.wordGraph.get(currentWord) || []);
        
        if (neighbors.length === 0) {
            return null;
        }
        
        // 30% chance to make a suboptimal move
        if (Math.random() < 0.3) {
            return neighbors[Math.floor(Math.random() * neighbors.length)];
        }
        
        // Otherwise, try to move towards target
        const validMoves = neighbors.filter(word => 
            this.heuristic(word, targetWord) <= this.heuristic(currentWord, targetWord)
        );
        
        if (validMoves.length > 0) {
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    /**
     * Medium AI: Greedy approach with some lookahead
     */
    selectMediumMove(currentWord, targetWord) {
        const neighbors = Array.from(this.wordGraph.get(currentWord) || []);
        
        if (neighbors.length === 0) {
            return null;
        }
        
        // Score each neighbor based on heuristic and 2-step lookahead
        const scoredMoves = neighbors.map(neighbor => {
            const baseScore = this.heuristic(neighbor, targetWord);
            
            // Look ahead 2 steps
            const neighborNeighbors = Array.from(this.wordGraph.get(neighbor) || []);
            const bestLookahead = neighborNeighbors.reduce((best, nn) => {
                const score = this.heuristic(nn, targetWord);
                return score < best ? score : best;
            }, Infinity);
            
            return {
                word: neighbor,
                score: baseScore + (bestLookahead * 0.3)
            };
        });
        
        // Sort by score and add some randomness
        scoredMoves.sort((a, b) => a.score - b.score);
        
        // 70% chance to pick the best move, 30% chance for top 3
        if (Math.random() < 0.7) {
            return scoredMoves[0].word;
        } else {
            const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
            return topMoves[Math.floor(Math.random() * topMoves.length)].word;
        }
    }

    /**
     * Hard AI: Uses A* with strategic blocking
     */
    selectHardMove(currentWord, targetWord, playerLadder = []) {
        const optimalPath = this.findPath(currentWord, targetWord);
        
        if (!optimalPath || optimalPath.length < 2) {
            return this.selectMediumMove(currentWord, targetWord);
        }
        
        // Consider blocking player's progress
        const playerCurrentWord = playerLadder.length > 0 ? playerLadder[playerLadder.length - 1] : null;
        
        if (playerCurrentWord && Math.random() < 0.3) {
            const blockingMove = this.findBlockingMove(currentWord, playerCurrentWord, targetWord);
            if (blockingMove) {
                return blockingMove;
            }
        }
        
        // Use optimal path with slight variations
        const nextMove = optimalPath[1];
        
        // 20% chance to deviate for unpredictability
        if (Math.random() < 0.2) {
            const alternatives = Array.from(this.wordGraph.get(currentWord) || [])
                .filter(word => word !== nextMove)
                .filter(word => this.heuristic(word, targetWord) <= this.heuristic(currentWord, targetWord) + 1);
            
            if (alternatives.length > 0) {
                return alternatives[Math.floor(Math.random() * alternatives.length)];
            }
        }
        
        return nextMove;
    }

    /**
     * Expert AI: Advanced minimax with alpha-beta pruning
     */
    selectExpertMove(currentWord, targetWord, playerLadder = []) {
        const depth = 4;
        const result = this.minimax(currentWord, targetWord, depth, -Infinity, Infinity, true, playerLadder);
        return result.move;
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     */
    minimax(currentWord, targetWord, depth, alpha, beta, isMaximizing, playerLadder = []) {
        if (depth === 0 || currentWord === targetWord) {
            return {
                score: this.evaluatePosition(currentWord, targetWord, playerLadder),
                move: null
            };
        }
        
        const neighbors = Array.from(this.wordGraph.get(currentWord) || []);
        
        if (neighbors.length === 0) {
            return {
                score: isMaximizing ? -Infinity : Infinity,
                move: null
            };
        }
        
        let bestMove = null;
        
        if (isMaximizing) {
            let maxScore = -Infinity;
            
            for (const neighbor of neighbors) {
                const result = this.minimax(neighbor, targetWord, depth - 1, alpha, beta, false, playerLadder);
                
                if (result.score > maxScore) {
                    maxScore = result.score;
                    bestMove = neighbor;
                }
                
                alpha = Math.max(alpha, result.score);
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
            
            return { score: maxScore, move: bestMove };
        } else {
            let minScore = Infinity;
            
            for (const neighbor of neighbors) {
                const result = this.minimax(neighbor, targetWord, depth - 1, alpha, beta, true, playerLadder);
                
                if (result.score < minScore) {
                    minScore = result.score;
                    bestMove = neighbor;
                }
                
                beta = Math.min(beta, result.score);
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
            
            return { score: minScore, move: bestMove };
        }
    }

    /**
     * Evaluate current position for minimax
     */
    evaluatePosition(currentWord, targetWord, playerLadder = []) {
        const distanceToTarget = this.heuristic(currentWord, targetWord);
        const pathLength = this.findPath(currentWord, targetWord)?.length || Infinity;
        
        let score = 100 - distanceToTarget - (pathLength * 2);
        
        // Bonus for being ahead of player
        if (playerLadder.length > 0) {
            const playerCurrent = playerLadder[playerLadder.length - 1];
            const playerDistance = this.heuristic(playerCurrent, targetWord);
            score += (playerDistance - distanceToTarget) * 10;
        }
        
        return score;
    }

    /**
     * Find a move that blocks the player's progress
     */
    findBlockingMove(aiWord, playerWord, targetWord) {
        const aiNeighbors = Array.from(this.wordGraph.get(aiWord) || []);
        const playerPath = this.findPath(playerWord, targetWord);
        
        if (!playerPath || playerPath.length < 3) {
            return null;
        }
        
        // Look for AI moves that intersect with player's optimal path
        const playerPathSet = new Set(playerPath.slice(1, -1)); // Exclude start and end
        const blockingMoves = aiNeighbors.filter(move => playerPathSet.has(move));
        
        if (blockingMoves.length > 0) {
            return blockingMoves[0];
        }
        
        return null;
    }

    /**
     * Get valid neighbors for a word
     */
    getNeighbors(word) {
        return Array.from(this.wordGraph.get(word) || []);
    }

    /**
     * Check if a word exists in the dictionary
     */
    isValidWord(word) {
        return this.wordSet.has(word.toLowerCase());
    }

    /**
     * Check if two words are neighbors (differ by one character)
     */
    areNeighbors(word1, word2) {
        if (word1.length !== word2.length) {
            return false;
        }
        
        let differences = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) {
                differences++;
                if (differences > 1) {
                    return false;
                }
            }
        }
        
        return differences === 1;
    }

    /**
     * Get hint for player (next possible word)
     */
    getHint(currentWord, targetWord, usedWords = []) {
        const neighbors = this.getNeighbors(currentWord);
        const unusedNeighbors = neighbors.filter(word => !usedWords.includes(word));
        
        if (unusedNeighbors.length === 0) {
            return null;
        }
        
        // Find the neighbor that gets closest to target
        let bestHint = null;
        let bestScore = Infinity;
        
        for (const neighbor of unusedNeighbors) {
            const score = this.heuristic(neighbor, targetWord);
            if (score < bestScore) {
                bestScore = score;
                bestHint = neighbor;
            }
        }
        
        return bestHint;
    }

    /**
     * Generate random word pairs with guaranteed solution
     */
    generateRandomPair(wordLength = 4) {
        const wordsOfLength = Array.from(this.wordsByLength.get(wordLength) || []);
        
        if (wordsOfLength.length < 2) {
            return null;
        }
        
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const startWord = wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
            const endWord = wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
            
            if (startWord !== endWord) {
                const path = this.findPath(startWord, endWord);
                if (path && path.length > 2 && path.length < 8) {
                    return { start: startWord, end: endWord, optimalLength: path.length };
                }
            }
            
            attempts++;
        }
        
        return null;
    }

    /**
     * Calculate path difficulty score
     */
    calculateDifficulty(startWord, endWord) {
        const path = this.findPath(startWord, endWord);
        if (!path) {
            return Infinity;
        }
        
        const pathLength = path.length;
        const hammingDistance = this.heuristic(startWord, endWord);
        const avgNeighbors = path.reduce((sum, word) => sum + this.getNeighbors(word).length, 0) / path.length;
        
        // Difficulty score based on path length, distance, and connectivity
        return pathLength * 10 + hammingDistance * 5 + (10 - avgNeighbors);
    }
}