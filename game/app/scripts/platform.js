/*global $ define */

define(function(controls) {

  var Platform = function(rect) {
    this.rect = rect;

    this.el = $('<div class="platform">');
    this.el.css({
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height
    });
  };

  Platform.prototype.onFrame = function(delta) {
    // Movement?
  };

  // Collision?

  return Platform;
});