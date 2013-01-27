/*global $ define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 300;
  var JUMP_VELOCITY = 1000;
  var GRAVITY = 2500;

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el) {
    this.el = el;
    this.jumping = false;
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

    // Jump
    if (controls.keys.space && !this.jumping) {
      this.jumping = true;
      this.vel.y = -JUMP_VELOCITY;
    }

    // Update state
    this.pos.x += this.vel.x * delta;
    this.pos.y += this.vel.y * delta;

    // Collision with the ground.
    if (this.pos.y > 0) {
      this.vel.y = 0;
      this.pos.y = 0;
      this.jumping = false;
    }

    // Gravity
    if (this.pos.y !== 0) {
      this.vel.y += GRAVITY * delta;
    }

    // Update UI.
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
  };

  return Player;
});