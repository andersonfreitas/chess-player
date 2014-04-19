function Board() {
  BaseObject.call(this);

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.getVertices())), gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 2;
  this.vertexBuffer.numItems = this.getVertices().length;

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(_.flatten(this.getIndices())), gl.STATIC_DRAW);

  var flagColors = [];
  for (i = 0; i < this.getVertices().length; i++) flagColors.push(vec3.fromValues(0, 0, 0));

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(flagColors)), gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 3;
  this.colorBuffer.numItems = flagColors.length;
}

Board.prototype = new BaseObject();
Board.prototype.constructor = Board;

Board.prototype.render = function() {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.vertexAttribPointer(currentProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  if (ChessPlayer.properties.scene.wireframe)
    gl.drawArrays(gl.LINE_LOOP, 0, this.vertexBuffer.numItems);
  else
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexBuffer.numItems);
};

Board.prototype.getVertices = function() {
  return [
    vec2.fromValues(-1, 1), // a
    vec2.fromValues(-1, -1), // b
    vec2.fromValues(1, 1), // c
    vec2.fromValues(1, -1)  // d
  ];
};

Board.prototype.getIndices = function() {
  return [
    0, 1, 2,
    1, 3, 2
  ];
};
