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

  /**
  Utils.loadRemoteFile(this, "README.md", function(url, contents) { console.log("URL", url, "Contents", contents) })
   */
  Utils.loadRemoteFile = function(context, url, callback) {
    var req = new XMLHttpRequest();

    if (req) {
      req.overrideMimeType("text/plain");
      req.onreadystatechange = function() {

        if (this.readyState == 4) {
          if (this.status == 200 || this.status === 0) {
            callback.call(context, url, this.responseText);
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
