(function() {
  var GameState;
  GameState = (function() {
    var board = {};
    var moves = [];
    var idx = 0;

    function GameState(board) {
      this.board = board;
    }

    GameState.prototype.restart = function(board) {
      this.board = board;
      this.idx = 0;
    }

    GameState.prototype.loadFromFile = function(file) {
      parser = new PgnParser(file);
      parser.parse();
      this.moves = parser.moves;
    };

    GameState.prototype.previousMove = function() {
      var move = this.moves[idx - 1 <= 0 ? 0 : --idx];
      var obj = board[move.to];

      this.board[move.to] = undefined;
      this.board[move.from] = obj;

      obj.animateMoveTo(move.from, ChessPlayer.properties.game.duration);
    };

    GameState.prototype.nextMove = function() {
      var move = this.moves[idx++];
      var obj = this.board[move.from];

      if (this.board[move.to] !== undefined) {
        // remove a peça
        this.board[move.to].capture(ChessPlayer.properties.game.duration);
      }

      this.board[move.from] = undefined;
      this.board[move.to] = obj;

      obj.animateMoveTo(move.to, ChessPlayer.properties.game.duration);
    };

    return GameState;
  })();
  window.GameState = GameState;
}).call(this);
