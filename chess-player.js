var ChessPlayer = (function() {

  var gui = new dat.GUI({ autoPlace: true });

  var stats = new Stats();

  var lastTime = 0;
  var mvMatrix = mat4.create();
  var mvMatrixStack = [];
  var pMatrix = mat4.create();

  function setMatrixUniforms() {
    gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);
  }

  var properties = {
    game: {
      pgn: "sample.pgn",
      reload: function() { console.log("Reloading PGN from file... " + properties.game.pgn); },
      autoplay: true,
      next: function() { console.log("Playing NEXT move from PGN..."); },
      previous: function() { console.log("Playing PREVIOUS move from PGN..."); },
      paused: false
    },
    scene: {
      projection: 'perspective',
      shadows: false,
      wireframe: false,
      lightning: true,
      resolution: 2
    }
  };

  var folders = {
    game: gui.addFolder('Game'),
    scene: gui.addFolder('Scene')
  };

  var controllers = {
    game: {
      pgn: folders.game.add(properties.game, 'pgn'),
      reload: folders.game.add(properties.game, 'reload'),
      autoplay: folders.game.add(properties.game, 'autoplay'),
      next: folders.game.add(properties.game, 'next'),
      previous: folders.game.add(properties.game, 'previous'),
      paused: folders.game.add(properties.game, 'paused')
    },
    scene: {
      projection: folders.scene.add(properties.scene, 'projection', [ 'perspective', 'isometric'] ),
      wireframe: folders.scene.add(properties.scene, 'wireframe'),
      lightning: folders.scene.add(properties.scene, 'lightning'),
      shadows: folders.scene.add(properties.scene, 'shadows'),
      resolution: folders.scene.add(properties.scene, 'resolution', { low: 1, medium: 2, high: 3 })
    }
  };

  var scene = [];
  var game = {};

  function initScene() {
    function addToScene(object) { scene.push(object); return object; }

    this.game = {
      board: addToScene(new Board()),

      // one king, one queen, two rooks, two knights, two bishops, and eight pawns
      pieces: {
        king: addToScene(new ChessPiece("rei")),
        queen: addToScene(new ChessPiece("rainha")),
        rooks: [
          addToScene(new ChessPiece("torre")),
          addToScene(new ChessPiece("torre"))
        ],
        knights: [
          addToScene(new ChessPiece("cavalo")),
          addToScene(new ChessPiece("cavalo"))
        ],
        bishops: [
          addToScene(new ChessPiece("bispo")),
          addToScene(new ChessPiece("bispo"))
        ],
        pawns: [
          addToScene(new ChessPiece("peao")), addToScene(new ChessPiece("peao")),
          addToScene(new ChessPiece("peao")), addToScene(new ChessPiece("peao")),
          addToScene(new ChessPiece("peao")), addToScene(new ChessPiece("peao")),
          addToScene(new ChessPiece("peao")), addToScene(new ChessPiece("peao"))
        ]
      }
    };

    return scene;
  }

  function handleFileSelect(evt) {
    var files = evt.target.files;

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      // console.log(escape(f.name), f.stype || 'n/a', ' - ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');

      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          console.log(e.target.result);
        };
      })(f);

      reader.readAsText(f);
    }

    console.log("handleFileSelect");
  }

  function initShaderVars() {
    currentProgram.vertexPositionAttribute = gl.getAttribLocation(currentProgram, "aVertexPosition");
    gl.enableVertexAttribArray(currentProgram.vertexPositionAttribute);

    currentProgram.vertexColorAttribute = gl.getAttribLocation(currentProgram, "aVertexColor");
    gl.enableVertexAttribArray(currentProgram.vertexColorAttribute);

    currentProgram.pMatrixUniform = gl.getUniformLocation(currentProgram, "uPMatrix");
    currentProgram.mvMatrixUniform = gl.getUniformLocation(currentProgram, "uMVMatrix");
  }

  function initLocalFileLoad() {
    $(".property-name:contains(pgn) ~ .c").html('<input type="file" id="filename" />');
    $("#filename").on('change', handleFileSelect);
  }

  function initStats() {
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
  }

  function render() {
    if (!currentProgram)
      return;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, 45, (gl.viewportWidth / gl.viewportHeight), 1, 100.0);
    mat4.identity(mvMatrix);

    gl.useProgram(currentProgram);

    // gl.uniform1f(gl.getUniformLocation(currentProgram, 'time'), parameters.time / 1000);
    // gl.uniform2f(gl.getUniformLocation(currentProgram, 'resolution'), parameters.screenWidth, parameters.screenHeight);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0, 0, -3));

    setMatrixUniforms();

    _.invoke(scene, 'render');
  }

  function updateAnimationTime() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;
    }
    lastTime = timeNow;
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    render();
    updateAnimationTime();
    stats.end();
  }

  function init() {
    WebGL.init();
    initStats();
    initScene();
    initShaderVars();
    initLocalFileLoad();

    folders.game.open();
    folders.scene.open();

    animate();
  }

  // public methods
  return {
    init: init,
    initScene: initScene,
    properties: properties
  };
})();
