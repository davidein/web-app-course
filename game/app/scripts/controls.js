/*global define, $ */

define([], function() {

  var KEYS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  /**
   * Controls singleton class.
   * @constructor
   */
  var Controls = function() {
    this.inputVec = { x: 0, y: 0 };

    this.spacePressed = false;
    this.keys = {};

    $(window)
      .on('keydown', this.onKeyDown.bind(this))
      .on('keyup', this.onKeyUp.bind(this));
  };

  Controls.prototype.onKeyDown = function(e) {
    if (e.keyCode in KEYS) {
      this.keys[KEYS[e.keyCode]] = true;
    }
  };

  Controls.prototype.onKeyUp = function(e) {
    if (e.keyCode in KEYS) {
      this.keys[KEYS[e.keyCode]] = false;
    }
  };

  Controls.prototype.onFrame = function() {
    if (this.keys.right) {
      this.inputVec.x = 1;
    } else if (this.keys.left) {
      this.inputVec.x = -1;
    } else {
      this.inputVec.x = 0;
    }
  };

  // Export singleton.
  return new Controls();
});