var gl;

var WebGL = (function() {
  var canvas;
  var vertexShader, fragmentShader;

  function init() {
    vertexShader = document.getElementById('vs').textContent;
    fragmentShader = document.getElementById('fs').textContent;

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
  function init() {
    glMatrix.setMatrixArrayType(Array);
  }

  return {
    init: init,
    gl: gl
  }
})();
