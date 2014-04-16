var ChessPlayer = (function() {

  var gui = new dat.GUI({ autoPlace: true });

  var properties = {
    game: {
      pgn: "sample.pgn",
      reload: function() { console.log("Reloading PGN from file... " + properties.game.pgn); },
      autoplay: true,
      next: function() { console.log("Playing NEXT move from PGN..."); },
      previous: function() { console.log("Playing PREVIOUS move from PGN..."); }
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
      previous: folders.game.add(properties.game, 'previous')
    },
    scene: {
      projection: folders.scene.add(properties.scene, 'projection', [ 'perspective', 'isometric'] ),
      wireframe: folders.scene.add(properties.scene, 'wireframe'),
      lightning: folders.scene.add(properties.scene, 'lightning'),
      shadows: folders.scene.add(properties.scene, 'shadows'),
      resolution: folders.scene.add(properties.scene, 'resolution', { low: 1, medium: 2, high: 3 })
    }
  };

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

    console.log("handleFileSelect")
  }

  function initLocalFileLoad() {
    $(".property-name:contains(pgn) ~ .c").html('<input type="file" id="filename" />');
    $("#filename").on('change', handleFileSelect);
  }

  function init() {
    console.log("initWebGL()");
    console.log("loadStage()");
    console.log("loadPieces()");

    initLocalFileLoad();

    folders.game.open();
    folders.scene.open();
  }

  // public methods
  return {
    init: init
  }
})();
