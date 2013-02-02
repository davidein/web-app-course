/*global define, $, asEvented */

define([], function() {

  var KEYS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  var FULL_ANGLE = 30;

  /**
   * Controls singleton class.
   * @constructor
   */
  var Controls = function() {
    this.inputVec = { x: 0, y: 0 };
    this.tilt = 0;

    // Key states
    this.keys = {};

    $(window)
      .on('keydown', this.onKeyDown.bind(this))
      .on('keyup', this.onKeyUp.bind(this))
      .on('deviceorientation', this.onMotion.bind(this))
      .on('tap', this.onTap.bind(this));
  };

  asEvented.call(Controls.prototype);

  Controls.prototype.onKeyDown = function(e) {
    if (e.keyCode in KEYS) {
      var key = KEYS[e.keyCode];
      this.keys[key] = true;

      if (key === 'space') {
        this.trigger('jump');
      }
    }
  };

  Controls.prototype.onKeyUp = function(e) {
    if (e.keyCode in KEYS) {
      this.keys[KEYS[e.keyCode]] = false;
    }
  };

  Controls.prototype.onMotion = function(e) {
    var degree = e.gamma;

    // Landscape
    if (window.orientation) {
      degree = e.beta * window.orientation / 90;
    }

    // Tilt is a value between -1 and 1
    var speed = degree / FULL_ANGLE;
    this.tilt = Math.max(Math.min(speed, 1), -1);
  };

  Controls.prototype.onTap = function() {
    this.trigger('jump');
  };

  Controls.prototype.onFrame = function() {
    // Arrow keys
    if (this.keys.right) {
      this.inputVec.x = 1;
    } else if (this.keys.left) {
      this.inputVec.x = -1;
    } else {
      this.inputVec.x = 0;
    }

    // Accelerometer
    if (this.inputVec.x === 0) {
      this.inputVec.x = this.tilt;
    }
  };

  // Export singleton.
  return new Controls();
});