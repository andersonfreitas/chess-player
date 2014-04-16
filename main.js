var wireframe = true;
var A = 0.15;
var v = 1.0;
var lambda = 1.0;
var subdivision = 5;

var flagVertexBuffer, flagColorBuffer, flagIndexBuffer, flagNormalBuffer;
var BASE_MESH = [
  vec2.fromValues(-1,  1), // a
  vec2.fromValues(-1, -0.5), // b
  vec2.fromValues( 1,  1), // c
  vec2.fromValues( 1, -0.5)  // d
]

var flagVertexes = BASE_MESH;

var BASE_INDICES = [
  0, 1, 2,
  1, 3, 2
];

var flagIndices = BASE_INDICES;

function subdivide(level) {
  flagVertexes = [];
  flagIndices = [];
  for (var i = 0; i < BASE_INDICES.length; i += 3) {
    var a = BASE_MESH[BASE_INDICES[i+0]];
    var b = BASE_MESH[BASE_INDICES[i+1]];
    var c = BASE_MESH[BASE_INDICES[i+2]];

    divideTriangle(a, b, c, level);
  }
}

function triangle(a, b, c) {
  flagVertexes.push(a, b);
  flagVertexes.push(b, c);
  flagVertexes.push(a, c);
  // flagVertexes.push(a, b, c);
  // flagIndices.push(a);
  // flagIndices.push(b);
  // flagIndices.push(c);
}

function divideTriangle(a, b, c, count) {
  if ( count === 0 ) {
    triangle( a, b, c );
  } else {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    --count;

    divideTriangle( a, ac, ab, count);
    divideTriangle( c, bc, ac, count);
    divideTriangle( b, ab, bc, count);
    divideTriangle(ab, ac, bc, count);
  }
}

subdivide(subdivision);

function initBuffers() {
  // Bandeira
  if (flagVertexBuffer == undefined ) flagVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, flagVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(flagVertexes)), gl.STATIC_DRAW);
  flagVertexBuffer.itemSize = 2;
  flagVertexBuffer.numItems = flagVertexes.length;

  flagIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, flagIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(_.flatten(flagIndices)), gl.STATIC_DRAW);

  // var flagNormals = [];
  // for (i = 0; i< flagVertexes.length; i++) flagNormals.push(vec3.fromValues(0.0, 0.0, 1.0));
  // flagNormalBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, flagNormalBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(flagNormals)), gl.STATIC_DRAW);
  // flagNormalBuffer.itemSize = 3;
  // flagNormalBuffer.numItems = flagNormals.length;

  var flagColors = [];
  for (i = 0; i< flagVertexes.length; i++) flagColors.push(vec3.fromValues(0, 0.7647058823529411, 0));

  if (flagColorBuffer == undefined ) flagColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, flagColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_.flatten(flagColors)), gl.STATIC_DRAW);
  flagColorBuffer.itemSize = 3;
  flagColorBuffer.numItems = flagColors.length;

  gl.useProgram(currentProgram);
  gl.uniform1f(gl.getUniformLocation(currentProgram, 'A'), A);
  gl.uniform1f(gl.getUniformLocation(currentProgram, 'v'), v);
  gl.uniform1f(gl.getUniformLocation(currentProgram, 'lambda'), lambda);
}

function render() {
  if ( !currentProgram ) return;
  parameters.time = new Date().getTime() - parameters.start_time;

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  mat4.perspective(pMatrix, 45, (gl.viewportWidth / gl.viewportHeight), 1, 100.0);
  mat4.identity(mvMatrix);

  gl.useProgram(currentProgram);

  gl.uniform1f(gl.getUniformLocation(currentProgram, 'time'), parameters.time / 1000);
  gl.uniform2f(gl.getUniformLocation(currentProgram, 'resolution'), parameters.screenWidth, parameters.screenHeight);

  mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0, 0, -3));

  setMatrixUniforms();

  gl.bindBuffer(gl.ARRAY_BUFFER, flagVertexBuffer);
  gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, flagVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, flagNormalBuffer);
  // gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, flagNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, flagColorBuffer);
  gl.vertexAttribPointer(currentProgram.vertexColorAttribute, flagColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  if (wireframe)
    // gl.drawElements(gl.LINE_LOOP, flagIndices.length, gl.UNSIGNED_BYTE, 0);
    gl.drawArrays(gl.LINES, 0, flagVertexBuffer.numItems);
  else
    // gl.drawElements(gl.TRIANGLES, flagIndices.length, gl.UNSIGNED_BYTE, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, flagVertexBuffer.numItems);
}

function updateAnimation() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
      var elapsed = timeNow - lastTime;
        rTri += (90 * elapsed) / 1000.0;
  }
  lastTime = timeNow;
}

function animate() {
  requestAnimationFrame(animate);
  stats.begin();
  render();
  updateAnimation();
  stats.end();
}

init();
animate();
