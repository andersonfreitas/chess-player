function Cube() {
  BaseObject.call(this);

  this.loaded = false;
  this.contents = "";

  Utils.loadRemoteFile(this, 'assets/obj/cube.obj', this.onLoad);
};

Cube.prototype = new BaseObject();

Cube.prototype.constructor = Cube;

Cube.prototype.onLoad = function(url, contents) {
  var obj = Wavefront.parseObj(contents);
  this.vertices = obj.vertices;
  this.indices = obj.indices;
  this.normals = obj.normals;

  this.contents = contents;
  this.loaded = true;
}

Cube.prototype.render = function() {
  if (loaded) {

  }
}
