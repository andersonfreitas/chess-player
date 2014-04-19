function BaseObject() {
  this.position = [0.0, 0.0, 0.0];

  this.vertexBuffer = 0;
  this.indexBuffer = 0;
  this.colorBuffer = 0;
  this.normalBuffer = 0;

  this.vertices = [];
  this.vertexColors = [];
  this.normals = [];
  this.indices = [];
  this.indicesNormal = [];
}

BaseObject.prototype.initBuffers = function() {
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.vertices)), gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = this.vertices.length;

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.vertexColors)), gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 4;
  this.colorBuffer.numItems = this.vertexColors.length;

  // this.normalBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(this.normals)), gl.STATIC_DRAW);
  // this.colorBuffer.itemSize = 3;
  // this.colorBuffer.numItems = this.normals.length;
}

BaseObject.prototype.loadModelFromObj = function(dados) {
  var linhas = dados.split('\n');

  for (var indice in linhas) {
    var linha = linhas[indice];
    var parte = linha.substring(0, 2);

    if (parte == 'v ') {
      var vertice = linha.match(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/);

      var vx = parseFloat(vertice[1]);
      var vy = parseFloat(vertice[2]);
      var vz = parseFloat(vertice[3]);

      this.vertices.push(vec3.fromValues(vx, vy, vz));
      this.vertexColors.push(vec4.fromValues(1.0, 0.0, 0.0, 1.0));
    } else if (parte == 'vn') {
      var normal = linha.match(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/);

      var vnx = parseFloat(normal[1]);
      var vny = parseFloat(normal[2]);
      var vnz = parseFloat(normal[3]);

      this.normals.push(vec3.fromValues(vnx, vny, vnz));
    } else if (parte == 'f ') {
      var indices0 = (linha.substring(2)).split(' ');

      // console.log(indices0);

      var i1 = parseInt((indices0[0].substring(0)).split('//')[0]);
      var i2 = parseInt((indices0[1].substring(0)).split('//')[0]);
      var i3 = parseInt((indices0[2].substring(0)).split('//')[0]);

      // console.log(i1, i2, i3);

      this.indices.push(i1 - 1, i2 - 1, i3 - 1);
    } else if (parte == 'f ') {
      var indices0 = (linha.substring(2)).split(' ');
      var in1 = parseInt((indices0[0].substring(0)).split('//')[1]);
      var in2 = parseInt((indices0[1].substring(0)).split('//')[1]);
      var in3 = parseInt((indices0[2].substring(0)).split('//')[1]);
      this.indicesNormal.push(in1 - 1, in2 - 1, in3 - 1);
    }
  }
}

BaseObject.prototype.render = function() {
  if (this.vertexBuffer === 0)
    return;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.vertexAttribPointer(currentProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  if (ChessPlayer.properties.scene.wireframe) {
    gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
};

BaseObject.prototype.moveOriginTo = function(x, y, z) {
};

// animateTo(pos, timing, easingFunction)
// tick() -- update animation position
