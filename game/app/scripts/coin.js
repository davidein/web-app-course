/*global $ define */

define(function() {

  var Coin = function(pos) {
    this.pos = pos;

    this.el = $('<div class="coin">');
    this.el.css({
      left: pos.x,
      top: pos.y
    });
  };

  Coin.prototype.onFrame = function(delta) {
  };

  return Coin;
});