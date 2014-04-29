var ChessPlayer = (function() {

  var gui = new dat.GUI({ autoPlace: true });

  var stats = new Stats();

  var lastTime = 0;
  var mvMatrix = mat4.create();
  var mvMatrixStack = [];
  var pMatrix = mat4.create();

  function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  }

  function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
  }

  function setMatrixUniforms() {
    gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);
  }

  var properties = {
    game: {
      pgn: 'sample.pgn',
      reload: function() { console.log('Reloading PGN from file... ' + properties.game.pgn); },
      autoplay: true,
      next: function() { console.log('Playing NEXT move from PGN...'); },
      previous: function() { console.log('Playing PREVIOUS move from PGN...'); },
      paused: false,
      duration: 500,
      delay: 1000
    },
    scene: {
      projection: 'perspective',
      shadows: false,
      wireframe: false,
      lightning: true,
      resolution: 2,
      diffuse: '#ccc'
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
      paused: folders.game.add(properties.game, 'paused'),
      duration: folders.game.add(properties.game, 'duration'),
      delay: folders.game.add(properties.game, 'delay')
    },
    scene: {
      projection: folders.scene.add(properties.scene, 'projection', ['perspective', 'isometric']),
      wireframe: folders.scene.add(properties.scene, 'wireframe'),
      lightning: folders.scene.add(properties.scene, 'lightning'),
      // shadows: folders.scene.add(properties.scene, 'shadows'),
      // resolution: folders.scene.add(properties.scene, 'resolution', { low: 1, medium: 2, high: 3 }),
      diffuse: folders.scene.addColor(properties.scene, 'diffuse')
    }
  };
  controllers.game.autoplay.onChange(function(value) {
    if (value)
      randomMove();
  });

  controllers.scene.lightning.onChange(function(value) {
    updateLightning(value);
  });

  controllers.scene.diffuse.onChange(function(value) {
    var color = Utils.hexToRgb(value);
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);
  });

  controllers.scene.projection.onChange(function(value) {
    updateProjection(value);
  });

  var scene = [];
  var game = {};

  function initScene() {
    var x = 0;
    function addToScene(object) { scene.push(object); return object; }

    var blackColor = vec4.fromValues(0.3, 0.3, 0.3, 1.0);
    var whiteColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

    game = {
      board: addToScene(new Board()),

    //   // one king, one queen, two rooks, two knights, two bishops, and eight pawns
      black: {
        king: addToScene(new ChessPiece('rei', blackColor)),
        queen: addToScene(new ChessPiece('rainha', blackColor)),
        rooks: [
          addToScene(new ChessPiece('torre', blackColor)),
          addToScene(new ChessPiece('torre', blackColor))
        ],
        knights: [
          addToScene(new ChessPiece('cavalo', blackColor)),
          addToScene(new ChessPiece('cavalo', blackColor))
        ],
        bishops: [
          addToScene(new ChessPiece('bispo', blackColor)),
          addToScene(new ChessPiece('bispo', blackColor))
        ],
        pawns: [
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor)),
          addToScene(new ChessPiece('peao', blackColor))
        ]
      },

      white: {
        king: addToScene(new ChessPiece('rei', whiteColor)),
        queen: addToScene(new ChessPiece('rainha', whiteColor)),
        rooks: [
          addToScene(new ChessPiece('torre', whiteColor)),
          addToScene(new ChessPiece('torre', whiteColor))
        ],
        knights: [
          addToScene(new ChessPiece('cavalo', whiteColor)),
          addToScene(new ChessPiece('cavalo', whiteColor))
        ],
        bishops: [
          addToScene(new ChessPiece('bispo', whiteColor)),
          addToScene(new ChessPiece('bispo', whiteColor))
        ],
        pawns: [
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor)),
          addToScene(new ChessPiece('peao', whiteColor))
        ]
      }
    };

    positionPieces();

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

    console.log('handleFileSelect');
  }

  function initShaderVars() {
    currentProgram.vertexPositionAttribute = gl.getAttribLocation(currentProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(currentProgram.vertexPositionAttribute);

    currentProgram.vertexColorAttribute = gl.getAttribLocation(currentProgram, 'aVertexColor');
    gl.enableVertexAttribArray(currentProgram.vertexColorAttribute);

    currentProgram.vertexNormalAttribute = gl.getAttribLocation(currentProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(currentProgram.vertexNormalAttribute);

    currentProgram.pMatrixUniform = gl.getUniformLocation(currentProgram, 'uPMatrix');
    currentProgram.mvMatrixUniform = gl.getUniformLocation(currentProgram, 'uMVMatrix');

    gl.useProgram(currentProgram);
    currentProgram.u_DiffuseLight = gl.getUniformLocation(currentProgram, 'u_DiffuseLight');
    currentProgram.u_LightDirection = gl.getUniformLocation(currentProgram, 'u_LightDirection');
    currentProgram.u_AmbientLight = gl.getUniformLocation(currentProgram, 'u_AmbientLight');

    var color = Utils.hexToRgb('#ccc');
    gl.uniform3f(currentProgram.u_DiffuseLight, color.r, color.g, color.b);

    var lightDirection = vec3.fromValues(1, 1, 0);
    vec3.normalize(lightDirection, lightDirection);
    gl.uniform3fv(currentProgram.u_LightDirection, _.flatten(lightDirection));

    gl.uniform3f(currentProgram.u_AmbientLight, 0.2, 0.2, 0.2);
  }

  function initLocalFileLoad() {
    $('.property-name:contains(pgn) ~ .c').html('<input type="file" id="filename" />');
    $('#filename').on('change', handleFileSelect);
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

    gl.useProgram(currentProgram);

    // gl.uniform1f(gl.getUniformLocation(currentProgram, 'time'), parameters.time / 1000);
    // gl.uniform2f(gl.getUniformLocation(currentProgram, 'resolution'), parameters.screenWidth, parameters.screenHeight);

    for (var i = scene.length - 1; i >= 0; i--) {
      obj = scene[i];

      mvPushMatrix();
      mat4.translate(mvMatrix, mvMatrix, obj.position);
      mat4.rotateY(mvMatrix, mvMatrix, obj.rotation[1]*π/180);
      setMatrixUniforms();

      obj.render();

      mvPopMatrix();
    }
  }

  function setupCameraPosition() {
    eye = vec3.fromValues(6, 6, 0);
    at = vec3.fromValues(0, 0, 0);
    up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(mvMatrix, eye, at, up);
  }

  function lookAt(eye, at) {
    mat4.identity(mvMatrix);

    eye = vec3.fromValues(eye[0], eye[1], eye[2]);
    at = vec3.fromValues(at[0], at[1], at[2]);
    up = vec3.fromValues(0, 1, 0);

    mat4.lookAt(mvMatrix, eye, at, up);
  }

  function updateAnimationTime() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
      var elapsed = timeNow - lastTime;

      for (var i = scene.length - 1; i >= 0; i--) {
        obj = scene[i];

        if (!properties.game.paused)
          obj.updateAnimation(elapsed);
      }
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

  function updateLightning(enable) {
    gl.uniform1i(gl.getUniformLocation(currentProgram, 'enableLight'), enable);
  }

  function updateProjection(projection) {
    mat4.identity(pMatrix);
    if (projection === 'perspective') {
      mat4.perspective(pMatrix, 45, (gl.viewportWidth / gl.viewportHeight), 1, 100);
      setMatrixUniforms();
    } else {
      var w = gl.viewportWidth;
      var h = gl.viewportHeight;
      var ratio = w / h;

      mat4.ortho(pMatrix, -5*ratio, 5*ratio, -5, 5, -100, 100);

      lookAt([1,1,1],[0,0,0])
      setMatrixUniforms();
    }
  }

  // Initial position,
  // first row: rook, knight, bishop, queen, king, bishop, knight, and rook;
  // second row: pawns
  function positionPieces() {
    game.black.rooks[0].moveTo('1a');
    game.black.knights[0].moveTo('1b');
    game.black.bishops[0].moveTo('1c');
    game.black.queen.moveTo('1d');
    game.black.king.moveTo('1e');
    game.black.bishops[1].moveTo('1f');
    game.black.knights[1].moveTo('1g');
    game.black.rooks[1].moveTo('1h');

    var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < game.black.pawns.length; i++) {
      pawn = game.black.pawns[i];
      pawn.moveTo('2' + columns[i]);
    };

    // rotacionado todas as peças pretas para ficarem de frente para a camera
    _.invoke(_.flatten(ChessPlayer.game().black), 'rotate', [0, 180, 0]);
    game.black.king.rotate([0, 90, 0]);

    game.white.rooks[0].moveTo('8a');
    game.white.knights[0].moveTo('8b');
    game.white.bishops[0].moveTo('8c');
    game.white.queen.moveTo('8d');
    game.white.king.moveTo('8e').rotate([0, 90, 0]);
    game.white.bishops[1].moveTo('8f');
    game.white.knights[1].moveTo('8g');
    game.white.rooks[1].moveTo('8h');

    var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < game.white.pawns.length; i++) {
      pawn = game.white.pawns[i];
      pawn.moveTo('7' + columns[i]);
    };
  }

  function init() {
    WebGL.init();
    initStats();
    initScene();
    initShaderVars();
    initLocalFileLoad();

    setupCameraPosition();
    updateProjection('perspective');
    updateLightning(true);

    // folders.game.open();
    folders.scene.open();
    onWindowResize();
    window.addEventListener('resize', _.debounce(onWindowResize, 300, false), false);

    animate();
  }

  function onWindowResize(event) {
    var canvas = WebGL.getCanvas();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    updateProjection(properties.scene.projection);
  }

  // public methods
  return {
    init: init,
    initScene: initScene,
    scene: function() { return scene; },
    game: function() { return game; },
    properties: properties,
    lookAt: lookAt
  };
})();
