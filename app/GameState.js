(function() {
  var GameState;
  GameState = (function() {
    var COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var board = [];
    var moves = [];
    var idx = 0;

    function GameState() {
      this.initGame()
    }

    GameState.prototype.initGame = function() {
      for (var rank = 1; rank <= 8; rank++) {
        for (var column = 0; column < 8; column++) {
          if (rank > 2 && rank < 7)
            board.push({ pos: rank + COLUMNS[column], used: false });
          else
            board.push({ pos: rank + columns[column], used: true });
        }
      }
    }

    GameState.prototype.loadFromFile = function(file) {
      parser = new PgnParser(file);
      parser.parse();
      this.moves = parser.moves
    };

    GameState.prototype.previousMove = function() {
      return this.moves[idx - 1 <= 0 ? 0 : --idx];
    };

    GameState.prototype.nextMove = function() {
      return this.moves[idx++];
    };

    return GameState;
  })();
  window.GameState = GameState;
}).call(this);

// obj.animateMoveTo(sampled.pos, ChessPlayer.properties.game.duration);
