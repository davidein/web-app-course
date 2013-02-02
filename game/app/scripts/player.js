/*global $ define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 300;
  var ROTATE_FACTOR = 0.05;
  var JUMP_VELOCITY = 1000;
  var GRAVITY = 2500;
  var EDGE_OF_LIFE = 860; // DUM DUM DUM!
  var BOUNDING_BOX_BONUS = 10;
  var COIN_HIT_Y = -50;
  var COIN_HIT_DIST_SQ = Math.pow(75, 2);

  var transform = $.fx.cssPrefix + 'transform';

  var Player = function(el, game) {
    this.el = el;
    this.segwayEl = el.find('.segway');
    this.game = game;
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
    if (controls.keys.space && this.vel.y === 0) {
      this.vel.y = -JUMP_VELOCITY;
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    // Update state
    var oldY = this.pos.y;
    this.pos.x += this.vel.x * delta;
    this.pos.y += this.vel.y * delta;

    // Check collisions
    this.checkPlatforms(oldY);
    this.checkCoins();
    this.checkGameover();

    // Update UI.
    var rotate = this.vel.x * ROTATE_FACTOR;
    this.el.css(transform, 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)');
    this.segwayEl.css(transform, 'rotate(' + rotate + 'deg)');
  };

  Player.prototype.checkPlatforms = function(oldY) {
    var self = this;
    var curY = this.pos.y;
    var curX = this.pos.x;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      if (p.rect.y >= oldY && p.rect.y < curY) {

        // Is our X within platform width
        if (curX + BOUNDING_BOX_BONUS > p.rect.x && curX - BOUNDING_BOX_BONUS < p.rect.right) {

          // Collision. Let's stop gravity.
          self.pos.y = p.rect.y;
          self.vel.y = 0;
        }
      }
    });
  };

  Player.prototype.checkCoins = function() {
    var game = this.game;
    var centerX = this.pos.x;
    var centerY = this.pos.y + COIN_HIT_Y;

    this.game.forEachCoin(function(coin) {
      var dist = Math.pow(centerX - coin.pos.x, 2) + Math.pow(centerY - coin.pos.y, 2);
      if (dist < COIN_HIT_DIST_SQ) {
        game.hitCoin(coin);
      }
    });
  };

  Player.prototype.checkGameover = function() {
    if (this.pos.y > EDGE_OF_LIFE) {
      this.game.gameover();
    }
  };

  return Player;
});