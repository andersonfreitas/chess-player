(function() {

  var Utils = { };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Utils;
    }
    exports.Utils = Utils;
  } else {
    this.Utils = Utils;
  }

  Utils.loadLocalFile = function(callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {


    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  /**
  Utils.loadRemoteFile("README.md", function(url, contents) { console.log("URL", url, "Contents", contents) })
   */
  Utils.loadRemoteFile = function(url, callback) {
    var req = new XMLHttpRequest();

    if (req) {
      req.overrideMimeType("text/plain")
      req.onreadystatechange = function() {

        if (this.readyState == 4) {
          if (this.status == 200 || this.status == 0) {
            callback.call(null, url, this.responseText);
          } else {
            console.error("Error loading file: " + url + " status " + this.status);
          }
        }
      };
      req.open("GET", url, true);
      req.send("");
    }
  };

}).call(this);
