/**
 * Provides requestAnimationFrame in a cross browser way.
 * paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimationFrame = window.requestAnimationFrame || ( function() {
  return  window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(  callback, element ) {
            window.setTimeout( callback, 1000 / 60 );
          };
})();

var canvas;
var gl;
var buffer;
var vertex_shader;
var fragment_shader;
var currentProgram;
var vertex_position;
var stats;
var parameters = {  start_time  : new Date().getTime(),
                    time        : 0,
                    screenWidth : 0,
                    screenHeight: 0 };

glMatrix.setMatrixArrayType(Array);
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var lastTime = 0;
var rTri = 0;
var u_DiffuseLight;
var u_LightDirection;
var u_AmbientLight;

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function init() {
  vertex_shader = document.getElementById('vs').textContent;
  fragment_shader = document.getElementById('fs').textContent;

  canvas = document.querySelector( 'canvas' );

  // Initialise WebGL
  try {
    gl = canvas.getContext( 'experimental-webgl' );
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch( error ) { }
  if ( !gl ) {
    throw "cannot create webgl context";
  }

  // Create Program
  currentProgram = createProgram( vertex_shader, fragment_shader );

  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );

  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild( stats.domElement );

  initShaderVars();
  initBuffers();
  gl.clearColor(0.98, 0.98, 0.98, 1.0);
  gl.enable(gl.DEPTH_TEST);
}

function initShaderVars() {
  currentProgram.vertexPositionAttribute = gl.getAttribLocation(currentProgram, "aVertexPosition");
  gl.enableVertexAttribArray(currentProgram.vertexPositionAttribute);

  currentProgram.vertexColorAttribute = gl.getAttribLocation(currentProgram, "aVertexColor");
  gl.enableVertexAttribArray(currentProgram.vertexColorAttribute);

  // currentProgram.vertexNormalAttribute = gl.getAttribLocation(currentProgram, "aVertexNormal");
  // gl.enableVertexAttribArray(currentProgram.vertexNormalAttribute);

  currentProgram.pMatrixUniform = gl.getUniformLocation(currentProgram, "uPMatrix");
  currentProgram.mvMatrixUniform = gl.getUniformLocation(currentProgram, "uMVMatrix");

  currentProgram.u_DiffuseLight = gl.getUniformLocation(currentProgram, 'u_DiffuseLight');
  currentProgram.u_LightDirection = gl.getUniformLocation(currentProgram, 'u_LightDirection');
  currentProgram.u_AmbientLight = gl.getUniformLocation(currentProgram, 'u_AmbientLight');

  gl.uniform3f(u_DiffuseLight, 0.1, 0.0, 0.1);
  var lightDirection = vec3.fromValues(-0.250, -0.250, 1.0);
  vec3.normalize(lightDirection, lightDirection)

  gl.uniform3fv(u_LightDirection, _.flatten(lightDirection));

  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function mix( u, v, s ) {
  if ( typeof s !== "number" ) {
    throw "mix: the last parameter " + s + " must be a number";
  }
  if ( u.length != v.length ) {
    throw "vector dimension mismatch";
  }
  var result = [];
  for ( var i = 0; i < u.length; ++i ) {
    result.push( s * u[i] + (1.0 - s) * v[i] );
  }
  return result;
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);
}

function createProgram( vertex, fragment ) {
  var program = gl.createProgram();

  var vs = createShader( vertex, gl.VERTEX_SHADER );
  var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );

  if ( vs == null || fs == null ) return null;

  gl.attachShader( program, vs );
  gl.attachShader( program, fs );


  gl.deleteShader( vs );
  gl.deleteShader( fs );

  gl.linkProgram( program );

  if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
    alert( "ERROR:\n" +
    "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
    "ERROR: " + gl.getError() + "\n\n" +
    "- Vertex Shader -\n" + vertex + "\n\n" +
    "- Fragment Shader -\n" + fragment );

    return null;
  }
  return program;
}

function createShader( src, type ) {
  var shader = gl.createShader( type );

  gl.shaderSource( shader, src );
  gl.compileShader( shader );

  if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
    alert( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
    return null;
  }
  return shader;
}

function onWindowResize( event ) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  parameters.screenWidth = canvas.width;
  parameters.screenHeight = canvas.height;

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
}
