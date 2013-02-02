/*global define, alert */

define(['player', 'platform', 'coin'], function(Player, Platform, Coin) {

  var VIEWPORT_HEIGHT = 720;
  var VIEWPORT_WIDTH = 1280;

  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */
  var Game = function(el) {
    this.el = el;
    this.coinsEl = el.find('.coins');
    this.platformsEl = el.find('.platforms');
    this.scoreEl = el.find('.scoreboard .score .value');
    this.worldEl = el.find('.world');

    this.player = new Player(this.el.find('.player'), this);
    this.entities = [];
    
    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };

  /**
   * Reset all game state for a new game.
   */
  Game.prototype.reset = function() {
    // Reset entities.
    for (var i = 0, e; e = this.entities[i]; i++) {
      e.el.remove();
    }
    this.entities = [];

    this.createWorld();

    this.coinsCollected = 0;
    this.player.pos = {x: 700, y: 418};

    // Start game
    this.unfreezeGame();
  };

  Game.prototype.createWorld = function() {
    // ground
    this.addPlatform(new Platform({
      x: 100,
      y: 418,
      width: 800,
      height: 20
    }));

    // Floating platforms
    this.addPlatform(new Platform({
      x: 300,
      y: 258,
      width: 100,
      height: 20
    }));
    this.addPlatform(new Platform({
      x: 500,
      y: 288,
      width: 100,
      height: 20
    }));
    this.addPlatform(new Platform({
      x: 400,
      y: 158,
      width: 100,
      height: 20
    }));
    this.addPlatform(new Platform({
      x: 750,
      y: 188,
      width: 100,
      height: 20
    }));

    this.addCoin(new Coin({
      x: 770,
      y: 80
    }));

    this.addCoin(new Coin({
      x: 820,
      y: 80
    }));
  };

  Game.prototype.addCoin = function(coin) {
    this.entities.push(coin);
    this.coinsEl.append(coin.el);
  };

  Game.prototype.addPlatform = function(platform) {
    this.entities.push(platform);
    this.platformsEl.append(platform.el);
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    if (!this.isPlaying) {
      return;
    }

    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    this.player.onFrame(delta);

    this.updateViewport();

    // Update entities
    for (var i = 0, e; e = this.entities[i]; i++) {
      e.onFrame(delta);

      if (e.dead) {
        this.entities.splice(i--, 1);
      }
    }

    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.updateViewport = function() {
    var x = this.player.pos.x - VIEWPORT_WIDTH / 2;
    var y = this.player.pos.y - VIEWPORT_HEIGHT / 2;
    this.worldEl.css('-webkit-transform', 'translate3d(' + (-x) + 'px, ' + (-y) + 'px,0)');
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    this.reset();
  };

  /**
   * Stop the game and notify user that he has lost.
   */
  Game.prototype.gameover = function() {
    alert('You are game over!');
    this.freezeGame();

    var game = this;
    setTimeout(function() {
      game.reset();
    }, 0);
  };

  /**
   * Freezes the game. Stops the onFrame loop and stops any CSS3 animations.
   * Can be used both for game over and pause.
   */
  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
    this.el.addClass('frozen');
  };

  /**
   * Unfreezes the game. Starts the game loop again.
   */
  Game.prototype.unfreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.el.removeClass('frozen');

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };

  Game.prototype.forEachPlatform = function(fun) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Platform) {
        fun(e);
      }
    }
  };

  Game.prototype.forEachCoin = function(fun) {
    for (var i = 0, e; e = this.entities[i]; i++) {
      if (e instanceof Coin) {
        fun(e);
      }
    }
  };

  Game.prototype.hitCoin = function(coin) {
    coin.hit();

    this.coinsCollected++;
    this.scoreEl.text(this.coinsCollected);
  };

  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  return Game;
});