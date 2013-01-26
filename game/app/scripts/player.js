/*global $ define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 300;

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el) {
    this.el = el;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
  };

  Player.prototype.onFrame = function(delta) {

    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }

    // Update state
    this.pos.x += this.vel.x * delta;

    // Update UI.
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
  };

  return Player;
});