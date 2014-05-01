var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

var slots = [];
for (var rank = 1; rank <= 8; rank++) {
  for (var column = 0; column < 8; column++) {
    if (rank > 2 && rank < 7)
      slots.push({ pos: rank + columns[column], used: false });
    else
      slots.push({ pos: rank + columns[column], used: true });
  }
}

$(document).ready(function() {
  ChessPlayer.init();
});

function randomMove() {
  obj = _.sample(_.rest(ChessPlayer.scene(), 1));

  freePositions = _.where(slots, { used: false });
  sampled = _.sample(freePositions);
  sampled.used = true;
  _.findWhere(slots, { pos: obj.positionName }).used = false;

  obj.animateMoveTo(sampled.pos, ChessPlayer.properties.game.duration);

  if (ChessPlayer.properties.game.autoplay && !ChessPlayer.properties.game.paused)
    window.setTimeout(randomMove, ChessPlayer.properties.game.delay);
}
