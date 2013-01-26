/*global $ define */

define(['controls'], function(controls) {

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el) {
    this.el = el;
    this.pos = { x: 0, y: 0 };
    this.speed = 200;
  };

  Player.prototype.onFrame = function(delta) {
    if (controls.spacePressed) {
      this.pos.x += delta * this.speed;
    }

    if (this.pos.x > 200 || this.pos.x < 0) {
      this.speed *= -1;
    }

    // Update UI.
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
  };

  return Player;
});