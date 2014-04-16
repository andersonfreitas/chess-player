var gl;
var currentProgram;

var WebGL = (function() {
  var canvas;
  var vertexShader, fragmentShader;

  function initWebGL() {
    vertexShader = document.getElementById('vs').textContent;
    fragmentShader = document.getElementById('fs').textContent;

    canvas = document.querySelector('canvas');

    try {
      gl = canvas.getContext( 'experimental-webgl' );
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch(error) {
      console.error(error);
    }
    if (!gl) {
      console.error("cannot create webgl context");
    }

    currentProgram = createProgram(vertexShader, fragmentShader);

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    gl.clearColor(0.98, 0.98, 0.98, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  function createProgram(vertex, fragment) {
    var program = gl.createProgram();

    var vs = createShader(vertex, gl.VERTEX_SHADER);
    var fs = createShader('#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER);

    if (vs == null || fs == null) return null;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("VALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + "\n" +
                    "ERROR: " + gl.getError() + "\n\n" +
                    "- Vertex Shader -\n" + vertex + "\n\n" +
                    "- Fragment Shader -\n" + fragment);
      return null;
    }
    return program;
  }

  function createShader(src, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error((type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT")  + " SHADER:\n" + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function onWindowResize(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }

  function init() {
    glMatrix.setMatrixArrayType(Array);
    initWebGL();
  }

  return {
    init: init
  }
})();
