function BaseObject() {
  this.position = [0.0, 0.0, 0.0];

  this.vertexBuffer;
  this.indexBuffer;
  this.colorBuffer;
  this.normalBuffer;
}

BaseObject.prototype.render = function() {
};
