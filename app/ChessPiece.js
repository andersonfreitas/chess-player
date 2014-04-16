function ChessPiece(file) {
  this.wavefrontFile = file;

  BaseObject.call(this);
};

ChessPiece.prototype = new BaseObject();
ChessPiece.prototype.constructor = ChessPiece;

ChessPiece.prototype.render = function() {
}
