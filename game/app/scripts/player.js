/*global $ define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 300;
  var ROTATE_FACTOR = 0.05;
  var JUMP_VELOCITY = 1000;
  var GRAVITY = 2500;
  var EDGE_OF_LIFE = 860; // DUM DUM DUM!
  var BOUNDING_BOX_BONUS = 10;

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el, game) {
    this.el = el;
    this.segwayEl = el.find('.segway');
    this.game = game;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };

    controls.bind('jump', this.onJump.bind(this));
  };

  Player.prototype.onJump = function() {
    if (this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
      this.game.sound.play('blast');
    }
  };

  Player.prototype.onFrame = function(delta) {
    // Player input
    this.vel.x = controls.inputVec.x * PLAYER_SPEED;

    // Gravity
    this.vel.y += GRAVITY * delta;

    // Update state
    var oldY = this.pos.y;
    this.pos.x += this.vel.x * delta;
    this.pos.y += this.vel.y * delta;

    // Check collisions
    this.checkPlatforms(oldY);
    this.checkGameover();

    // Update UI.
    var rotate = this.vel.x * ROTATE_FACTOR;
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
    this.segwayEl.css(transform, 'rotate(' + rotate + 'deg)');
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var platforms = this.game.platforms;
    for (var i = 0, p; p = platforms[i]; i++) {
      // Are we crossing Y.
      if (p.rect.y >= oldY && p.rect.y < this.pos.y) {

        // Is our X within platform width
        if (this.pos.x + BOUNDING_BOX_BONUS > p.rect.x && this.pos.x - BOUNDING_BOX_BONUS < p.rect.right) {

          // Collision. Let's stop gravity.
          this.pos.y = p.rect.y;
          this.vel.y = 0;
        }
      }
    }
  };

  Player.prototype.checkGameover = function() {
    if (this.pos.y > EDGE_OF_LIFE) {
      this.game.gameover();
    }
  };

  return Player;
});