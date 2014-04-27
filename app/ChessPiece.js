function ChessPiece(file) {
  BaseObject.call(this);

  this.loaded = false;

  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);

  this.positions = {}

  var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (var rank = 1; rank <= 8; rank++) {
    for (var column = 0; column < 8; column++) {
      this.positions[rank + columns[column]] = vec3.fromValues(rank-0.5-4, 0, column + 0.5-4);
    }
  }
}

ChessPiece.prototype = new BaseObject();

ChessPiece.prototype.constructor = ChessPiece;

ChessPiece.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents);
  this.initBuffers();
  this.loaded = true;
};

ChessPiece.prototype.moveTo = function(pos) {
  this.position = this.positions[pos];
  this.positionName = pos;
}

function lerp(a, b, t) {
  return [ a[0]+(b[0]-a[0])*t || 0, a[1]+(b[1]-a[1])*t || 0,  a[2]+(b[2]-a[2])*t || 0 ];
}

ChessPiece.prototype.animateMoveTo = function(pos, duration) {
  this.positionName = pos;
  this.animationTime = 0;
  this.destination = this.positions[pos];
  this.lastDestination = this.position;
  this.duration = duration;
  this.animating = true;
}

/**
 * Animando com uma curva bezier quadrática
 */
ChessPiece.prototype.updateAnimation = function(elapsed) {
  this.animationTime += elapsed;

  if (this.animating) {
    var delta = this.animationTime / this.duration;

    delta = Math.min(delta, 1.0);
    if (delta >= 1.0) {
      this.animating = false;
    }

    var middle = lerp(this.lastDestination, this.destination, 0.5);
    middle[1] = 3.0;

    var a = lerp(this.lastDestination, middle, delta);
    var b = lerp(middle, this.destination, delta);

    this.position = lerp(a, b, delta);
  }
}
