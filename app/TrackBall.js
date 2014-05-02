(function() {
  var TrackBall;
  TrackBall = (function() {
    var lastX = -1, lastY = -1;

    var dragging = false;

    var currentAngle = [0.0, 0.0];

    var canvas = 0;

    function TrackBall(canvas) {
      this.canvas = canvas;

      that = this;

      this.currentAngle = [0.0, 0.0];

      this.canvas.addEventListener("mousedown", function(ev) { that.onMouseDown(ev); }, false);
      this.canvas.addEventListener("mouseup", function(ev) { that.onMouseUp(ev); }, false);
      this.canvas.addEventListener("mousemove", function(ev) { that.onMouseMove(ev); }, false);
      // this.canvas.addEventListener("mousewheel", this.onMouseWheel, false);
    }

    TrackBall.prototype.onMouseDown = function(ev) {
      this.dragging = true;

      var x = ev.clientX, y = ev.clientY;

      this.lastX = x;
      this.lastY = y;
    }

    TrackBall.prototype.onMouseUp = function(ev) {
      this.dragging = false;
    }

    TrackBall.prototype.onMouseMove = function(ev) {
      var x = ev.clientX, y = ev.clientY;

      if (this.dragging) {
        var factor = 100 / this.canvas.height;

        var dx = factor * (x - this.lastX);
        var dy = factor * (y - this.lastY);

        this.currentAngle[0] = this.currentAngle[0] + dy; //Math.max(Math.min(this.currentAngle[0] + dy, 90.0), -90.0);
        this.currentAngle[1] = this.currentAngle[1] + dx;
      }
      this.lastX = x;
      this.lastY = y;
    }

    TrackBall.prototype.onMouseWheel = function() {
      // console.log("onMouseWheel");
    }

    TrackBall.prototype.getRotation = function() {
      return this.currentAngle;
    }

    return TrackBall;
  })();
  window.TrackBall = TrackBall;
}).call(this);
