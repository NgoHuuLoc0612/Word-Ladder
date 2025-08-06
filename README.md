# Word Ladder Game

A sophisticated web-based word ladder puzzle game where players transform one word into another by changing exactly one letter at a time. Each intermediate step must be a valid English word.

## 🎮 Game Overview

Transform words step by step in this engaging puzzle game! Start with one word and reach the target word by making valid single-letter changes. Challenge yourself against AI opponents or play with friends.

**Example:** CAT → COT → DOT → DOG

## ✨ Features

### Game Modes
- **Player vs Player (PvP)**: Compete against another human player
- **AI vs Player**: Challenge yourself against intelligent AI opponents
- **AI vs AI**: Watch AI algorithms compete against each other

### AI Difficulty Levels
- **Easy**: Makes occasional suboptimal moves with basic strategy
- **Medium**: Uses greedy approach with 2-step lookahead
- **Hard**: Employs A* pathfinding with strategic blocking
- **Expert**: Advanced minimax algorithm with alpha-beta pruning

### Advanced Features
- **Multiple Pathfinding Algorithms**: A*, Bidirectional BFS, Dijkstra
- **Smart Heuristics**: Hamming distance, Levenshtein distance, character frequency analysis
- **AI Strategy**: Blocking moves, optimal path calculation, position evaluation
- **Game Statistics**: Timer, move counter, score calculation
- **Hint System**: Get helpful suggestions when stuck
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or static hosting service

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/word-ladder.git
cd word-ladder
```

2. **Set up word list:**
   - Create a `wordlist.txt` file in the root directory
   - Add one word per line (see Word List Format section)
   - Or download a pre-made word list from various online sources

3. **Run the game:**
   - **Option A**: Use a local web server
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```
   
   - **Option B**: Deploy to a static hosting service (GitHub Pages, Netlify, Vercel)

4. **Open your browser:**
   - Navigate to `http://localhost:8000` (or your hosting URL)

## 📁 Project Structure

```
word-ladder/
├── index.html          # Main HTML file
├── style.css          # Styling and animations
├── game.js           # Core game logic and UI management
├── algorithm.js      # Advanced pathfinding algorithms
├── wordlist.txt      # Word dictionary (not included)
├── LICENSE          # MIT License
└── README.md        # This file
```

## 🎯 How to Play

1. **Select Game Mode**: Choose between Player vs Player, AI vs Player, or AI vs AI
2. **Set Words**: Enter start and end words (must be same length) or use "Random Words"
3. **Choose Difficulty**: Select AI difficulty level if playing against computer
4. **Start Playing**: Take turns entering valid words that differ by exactly one letter
5. **Win Condition**: First player to reach the target word wins!

### Game Rules
- Words must be the same length as the start word
- Each move must change exactly one letter
- All intermediate words must be valid English words
- No word can be repeated in the same game
- Players alternate turns (except in AI vs AI mode)

## 🔧 Word List Format

Create a `wordlist.txt` file with one word per line:

```
cat
cot
dot
dog
bat
bag
big
...
```

**Supported Formats:**
- Simple word lists: `word`
- Dictionary format: `word (definition)` - definitions are automatically stripped

**Recommendations:**
- Include 3-8 letter words for best gameplay
- Ensure good connectivity between words
- Common word lists: SOWPODS, TWL, or custom curated lists

## 🤖 AI Algorithm Details

### Pathfinding Algorithms
- **A* Search**: Optimal pathfinding with multiple heuristics
- **Bidirectional BFS**: Faster search by exploring from both ends
- **Dijkstra's Algorithm**: Guaranteed shortest path finding

### Heuristics
- **Hamming Distance**: Number of differing character positions
- **Levenshtein Distance**: Minimum edit distance between words
- **Character Frequency**: Difference in letter distributions

### AI Strategies
- **Easy**: Random moves with 30% suboptimal choice rate
- **Medium**: Greedy selection with 2-step lookahead
- **Hard**: Strategic blocking with path optimization
- **Expert**: Minimax with alpha-beta pruning (4-ply depth)

## 🎨 Customization

### Styling
Modify `style.css` to customize:
- Color schemes and themes
- Animations and transitions
- Layout and typography
- Responsive breakpoints

### Game Logic
Extend `game.js` to add:
- New game modes
- Additional statistics
- Custom scoring systems
- Tournament functionality

### Algorithms
Enhance `algorithm.js` with:
- New pathfinding methods
- Alternative heuristics
- Machine learning integration
- Performance optimizations

## 📊 Technical Details

### Performance Features
- **Efficient Graph Building**: Bucket sort approach for O(n) neighbor finding
- **Caching System**: Precomputed paths and heuristic values
- **Memory Optimization**: Smart data structures for large word sets
- **Responsive UI**: Smooth animations and real-time updates

### Browser Compatibility
- Chrome/Edge 70+
- Firefox 65+
- Safari 12+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Architecture
- **Modular Design**: Separate concerns for algorithms, game logic, and UI
- **Event-Driven**: Reactive UI updates and game state management
- **Scalable**: Easy to add new features and game modes

## 🛠️ Development

### Adding New Features

1. **New Game Mode:**
```javascript
// In game.js
case 'newmode':
    this.players.player1.isAI = false;
    this.players.player2.isAI = true;
    // Configure mode-specific settings
    break;
```

2. **Custom AI Strategy:**
```javascript
// In algorithm.js
selectCustomMove(currentWord, targetWord, difficulty) {
    // Implement your strategy
    return bestMove;
}
```

3. **New Heuristic:**
```javascript
// In algorithm.js
customHeuristic(word1, word2) {
    // Calculate custom distance metric
    return distance;
}
```

### Testing
- Test with various word lengths (3-8 letters recommended)
- Verify pathfinding accuracy with known solutions
- Check AI behavior across difficulty levels
- Validate UI responsiveness on different devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and structure
- Add comments for complex algorithms
- Test new features thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Credits

- **Algorithm Design**: Advanced pathfinding and AI strategies
- **UI/UX**: Modern responsive design with smooth animations
- **Game Logic**: Comprehensive rule validation and state management

## 📞 Support

If you encounter any issues or have questions:
- Check the [Issues](../../issues) page for known problems
- Create a new issue with detailed description
- Include browser version and error messages

## 🔮 Future Enhancements

### Planned Features
- [ ] Multiplayer online gameplay
- [ ] Tournament mode with brackets
- [ ] Daily challenges and puzzles
- [ ] Word definition display
- [ ] Sound effects and music
- [ ] Player profiles and statistics
- [ ] Leaderboards and achievements
- [ ] Mobile app version
- [ ] Accessibility improvements
- [ ] Multiple language support

### Technical Roadmap
- [ ] WebSocket integration for real-time multiplayer
- [ ] Service Worker for offline functionality
- [ ] Progressive Web App (PWA) features
- [ ] Machine learning for dynamic difficulty
- [ ] Graph database for optimal word relationships
- [ ] Performance monitoring and analytics

---

**Enjoy playing Word Ladder!** 🎮✨
