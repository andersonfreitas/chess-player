function ChessPiece(file) {
  BaseObject.call(this);

  this.loaded = false;

  Utils.loadRemoteFile(this, 'assets/obj/' + file + '.obj', this.onLoad);
}

ChessPiece.prototype = new BaseObject();

ChessPiece.prototype.constructor = ChessPiece;

ChessPiece.prototype.onLoad = function(_, contents) {
  this.loadModelFromObj(contents);
  this.initBuffers();
  this.loaded = true;
};
