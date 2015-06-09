(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, BubbleArc, Circle, CircleCollection, Helpers, Supports;

$ = require('jquery');

Helpers = require('./helpers.coffee');

Supports = require('./support.coffee');

Circle = require('./circle.coffee');

CircleCollection = require('./circle-collection.coffee');

BubbleArc = (function() {
  BubbleArc.helpers = Helpers;

  BubbleArc.supports = Supports;

  BubbleArc.prototype.defaults = function(obj1, obj2) {
    var prop, val;
    for (prop in obj2) {
      val = obj2[prop];
      if (obj1[prop] == null) {
        obj1[prop] = val;
      }
    }
    return obj1;
  };

  BubbleArc.prototype.animations = function(state) {
    var prom;
    if (state != null) {
      prom = $.Deferred();
      this.animation = state;
      setTimeout(function() {
        return prom.resolve();
      });
      return prom;
    } else {
      return this.animation && Supports.transition;
    }
  };

  BubbleArc.prototype.getOption = function(key) {
    return this.options[key];
  };

  BubbleArc.prototype.setOption = function(key, value) {
    this.options[key] = value;
    return this;
  };

  BubbleArc.prototype.setOptions = function(obj) {
    var key, value;
    for (key in obj) {
      value = obj[key];
      this.setOption(key, value);
    }
    return this;
  };

  function BubbleArc(options) {
    if (options == null) {
      options = {};
    }
    this.options = this.defaults(options, {
      classes: '',
      radius: [6, 'em'],
      degrees: 360,
      fillLast: false,
      align: 'center',
      offset: 90
    });
    this.el = $('<div>').addClass(this.options.classes);
    this.circles = new CircleCollection;
    this.animations(true);
  }

  BubbleArc.prototype.setCollection = function(coll, hide) {
    var promise, promise2, promises;
    if (hide == null) {
      hide = true;
    }
    promise = $.Deferred();
    this.circles = coll;
    this.el.children('.circle').remove();
    this.el.append(this.circles.get());
    promise2 = $.Deferred();
    if (hide) {
      promises = [];
      this.circles.each(function(circle) {
        var prom2;
        circle.addClass('notrans');
        circle.addClass('collapsed');
        prom2 = $.Deferred();
        promises.push(prom2);
        return setTimeout(function() {
          circle.removeClass('notrans');
          return prom2.resolve();
        });
      });
      $.when.apply($, promises).then((function(_this) {
        return function() {
          return _this.arrangeAll().then(function() {
            return promise2.resolve();
          });
        };
      })(this));
    } else {
      this.arrangeAll().then(function() {
        return promise2.resolve();
      });
    }
    promise2.then(function() {
      return promise.resolve();
    });
    return promise;
  };

  BubbleArc.prototype.dom = function() {
    return this.el;
  };

  BubbleArc.prototype.pause = function(ms) {
    var promise;
    promise = $.Deferred();
    setTimeout(function() {
      return promise.resolve();
    }, ms);
    return promise;
  };

  BubbleArc.prototype.splitArc = function(amount) {
    var additionalOffsets, angleDeg, calcAmount, degs, distanceDeg, i, j, ref;
    if (amount == null) {
      amount = this.size();
    }
    calcAmount = this.options.fillLast ? amount - 1 : amount;
    degs = [];
    angleDeg = this.options.degrees;
    if (calcAmount !== 0) {
      distanceDeg = angleDeg / calcAmount;
    } else {
      distanceDeg = 0;
    }
    additionalOffsets = {
      first: 0,
      center: calcAmount / 2,
      last: calcAmount
    };
    for (i = j = 1, ref = amount; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      degs.push((i - 1) * distanceDeg + this.options.offset - additionalOffsets[this.options.align] * distanceDeg);
    }
    return degs;
  };

  BubbleArc.prototype.arrange = function(circle, angle, radius, unit) {
    var pre, promise, ref, x, y;
    if (unit == null) {
      unit = 'px';
    }
    promise = $.Deferred();
    if (!Supports.transform) {
      promise.resolve();
      return promise;
    }
    ref = Helpers.deg2coords(angle), x = ref[0], y = ref[1];
    if (this.animations() === false) {
      circle.addClass('notrans');
    }
    circle.outerLabelEl.removeClass('top bottom left right');
    if (circle.direction === "auto") {
      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          circle.outerLabelEl.addClass("right");
        } else {
          circle.outerLabelEl.addClass("left");
        }
      } else {
        if (y > 0) {
          circle.outerLabelEl.addClass("bottom");
        } else {
          circle.outerLabelEl.addClass("top");
        }
      }
    } else {
      if (circle.direction === "vertical") {
        if (y > 0) {
          circle.outerLabelEl.addClass("bottom");
        } else {
          circle.outerLabelEl.addClass("top");
        }
      } else {
        if (x > 0) {
          circle.outerLabelEl.addClass("right");
        } else {
          circle.outerLabelEl.addClass("left");
        }
      }
    }
    pre = circle[0].style[Helpers.transform];
    circle.css(Helpers.transform, "translateX(" + (x * radius) + unit + ") translateY(" + (y * radius) + unit + ")");
    circle.find('.edge').css(Helpers.transform, "rotate(" + (angle + 180) + "deg)");
    setTimeout((function(_this) {
      return function() {
        if (_this.animations()) {
          if ((pre === circle[0].style[Helpers.transform]) || (pre == null) || (pre.length === 0)) {
            circle.removeClass('notrans');
            return promise.resolve();
          } else {
            return circle.on(Helpers.transitionEvent, function() {
              circle.removeClass('notrans');
              return promise.resolve();
            });
          }
        } else {
          circle.removeClass('notrans');
          return promise.resolve();
        }
      };
    })(this));
    return promise;
  };

  BubbleArc.prototype.arrangeAll = function(radius, unit) {
    var angles, promiseAll, promises;
    if (radius == null) {
      radius = this.options.radius[0];
    }
    if (unit == null) {
      unit = this.options.radius[1];
    }
    angles = this.splitArc();
    promiseAll = $.Deferred();
    promises = [];
    this.circles.each((function(_this) {
      return function(circle, i) {
        return promises.push(_this.arrange(circle, angles[i], radius, unit));
      };
    })(this));
    $.when.apply($, promises).then(function() {
      return promiseAll.resolve();
    });
    return promiseAll;
  };

  BubbleArc.prototype.collapse = function() {
    var allPromises, instant, promise;
    instant = !this.animations();
    promise = $.Deferred();
    allPromises = [];
    this.circles.each(function(circle, i) {
      var pre, promiseLoop;
      promiseLoop = $.Deferred();
      allPromises.push(promiseLoop);
      pre = circle[0].style[Helpers.transform];
      if (instant) {
        circle.addClass('notrans');
      }
      return setTimeout(function() {
        circle.removeClass('expanding');
        if (Supports.transition) {
          if (pre === circle.css(Helpers.transform) || instant) {
            circle.addClass('collapsed');
            promiseLoop.resolve();
          } else {
            circle.addClass('collapsed');
            circle.on(Helpers.transitionEvent, function() {
              return promiseLoop.resolve();
            });
          }
        } else {
          circle.addClass('collapsed');
          promiseLoop.resolve();
        }
        return setTimeout(function() {
          return circle.removeClass('notrans');
        });
      });
    });
    $.when.apply($, allPromises).then(function() {
      return promise.resolve();
    });
    return promise;
  };

  BubbleArc.prototype.expand = function() {
    var allPromises, instant, promise;
    instant = !this.animations();
    promise = $.Deferred();
    allPromises = [];
    this.circles.each(function(circle, i) {
      var pre, promiseLoop;
      promiseLoop = $.Deferred();
      allPromises.push(promiseLoop);
      pre = circle[0].style[Helpers.transform];
      if (instant) {
        circle.addClass('notrans');
      }
      return setTimeout(function() {
        if (Supports.transition) {
          if (pre === circle[0].style[Helpers.transform] || instant) {
            circle.removeClass('collapsed').addClass('expanding');
            promiseLoop.resolve();
          } else {
            circle.addClass('expanding').removeClass('collapsed').on(Helpers.transitionEvent, function() {
              return promiseLoop.resolve();
            });
          }
        } else {
          circle.removeClass('collapsed');
          promiseLoop.resolve();
        }
        return setTimeout(function() {
          return circle.removeClass('notrans');
        });
      });
    });
    $.when.apply($, allPromises).then(function() {
      return promise.resolve();
    });
    return promise;
  };

  BubbleArc.prototype.size = function() {
    return this.circles.size();
  };

  BubbleArc.prototype.add = function(circles, position) {
    var pos;
    pos = this.circles.add(circles, position);
    if (!(pos instanceof Array)) {
      pos = [pos];
    }
    pos.forEach((function(_this) {
      return function(el, k) {
        _this.circles.get()[k].addClass("in");
        return _this.el.append(_this.circles.get()[k]);
      };
    })(this));
    return this.arrangeAll();
  };

  BubbleArc.prototype.remove = function(what) {
    this.circles.remove(what);
    return this.arrangeAll();
  };

  BubbleArc.prototype.removeFirst = function() {
    this.circles.removeFirst();
    return this.arrangeAll();
  };

  BubbleArc.prototype.removeLast = function() {
    this.circles.removeLast();
    return this.arrangeAll();
  };

  BubbleArc.prototype.reverse = function() {
    this.circles.reverse();
    return this.arrangeAll();
  };

  return BubbleArc;

})();

module.exports = BubbleArc;


},{"./circle-collection.coffee":2,"./circle.coffee":3,"./helpers.coffee":4,"./support.coffee":5,"jquery":undefined}],2:[function(require,module,exports){
var $, Circle, CircleCollection;

$ = require('jquery');

Circle = require('./circle.coffee');

CircleCollection = (function() {
  function CircleCollection(elements) {
    var circle, i, j, num, ref;
    if (elements == null) {
      elements = [];
    }
    if (typeof elements === "number") {
      num = elements;
      elements = [];
      for (i = j = 1, ref = num; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        circle = Circle.create().innerLabel(i);
        elements.push(circle);
      }
    }
    this.elements = elements;
  }

  CircleCollection.prototype.each = function(fn) {
    return this.elements.forEach(fn);
  };

  CircleCollection.prototype.size = function() {
    return this.elements.length;
  };

  CircleCollection.prototype.append = function(circle) {
    return this.add(circle, this.size());
  };

  CircleCollection.prototype.add = function(circle, position) {
    var c, i, pos;
    if (circle instanceof Array) {
      pos = [];
      for (i in circle) {
        c = circle[i];
        this.add(c, position + i);
        pos.push(position + i);
      }
      return pos;
    } else {
      this.elements.splice(position, 0, circle);
      return position;
    }
  };

  CircleCollection.prototype.remove = function(what) {
    var body, clone, el, pos;
    if (typeof what === 'number') {
      pos = what;
      el = this.elements.splice(pos, 1);
    } else {
      pos = this.elements.indexOf(what);
      el = this.elements.splice(pos, 1);
    }
    body = $('body');
    el = el[0];
    clone = el.clone();
    clone.removeClass('notrans').css({
      position: 'absolute',
      top: el.offset().top + body.scrollTop(),
      left: el.offset().left + body.scrollLeft(),
      zIndex: 99
    }).css(Helpers.transform, 'none');
    setTimeout(function() {
      clone.addClass('out');
      return clone.on(Helpers.animationEvent, function() {
        return clone.remove();
      });
    });
    body.prepend(clone);
    el.remove();
    return pos;
  };

  CircleCollection.prototype.removeLast = function() {
    return this.remove(this.elements.length - 1);
  };

  CircleCollection.prototype.removeFirst = function() {
    return this.remove(0);
  };

  CircleCollection.prototype.get = function() {
    return this.elements;
  };

  CircleCollection.prototype.reverse = function() {
    return this.elements = this.elements.reverse();
  };

  return CircleCollection;

})();

module.exports = CircleCollection;


},{"./circle.coffee":3,"jquery":undefined}],3:[function(require,module,exports){
var $, Circle;

$ = require('jquery');

Circle = (function() {
  Circle.create = function(triangle) {
    var c;
    if (triangle == null) {
      triangle = true;
    }
    c = new Circle(triangle);
    c.el.innerLabel = function(label) {
      return c.innerLabel(label);
    };
    c.el.outerLabel = function(label, direction) {
      return c.outerLabel(label, direction);
    };
    c.el.color = function(color) {
      return c.color(color);
    };
    c.el.link = function(url) {
      return c.el.attr('href', url);
    };
    c.el.unlink = function() {
      return c.el.removeAttr('href');
    };
    c.el.outerLabelEl = c.outerLabelEl;
    c.el.innerLabelEl = c.innerLabelEl;
    c.el.clickable = function(fn) {
      var clickEnd, clickEvent, clickStart;
      clickEvent = Supports.touch ? 'tap' : 'click';
      clickStart = Supports.touch ? 'touchstart' : 'mousedown';
      clickEnd = Supports.touch ? 'touchend' : 'mouseup';
      c.el.off(clickEvent);
      if (fn === false) {
        return c.el.removeClass('clickable');
      } else {
        if ((clickEvent === "tap") || true) {
          c.el.on(clickStart, function() {
            var preTransform, preTransition;
            preTransform = c.el[0].style[Helpers.transform];
            preTransition = c.el[0].style[Helpers.transition];
            c.el[0].style[Helpers.transform] += ' scale(0.9)';
            c.el[0].style[Helpers.transition] += 'none';
            return $(window).one(clickEnd, function() {
              c.el[0].style[Helpers.transform] = preTransform;
              return c.el[0].style[Helpers.transition] = preTransition;
            });
          });
        }
        c.innerLabelEl.on('click', function(e) {
          return fn.apply(c.el, [e]);
        });
        return c.el.addClass('clickable');
      }
    };
    return c.el;
  };

  function Circle(triangle1) {
    var cir, edge, triangle;
    this.triangle = triangle1 != null ? triangle1 : true;
    cir = $('<a>').addClass('circle');
    if (this.triangle) {
      edge = $('<div>').addClass('edge');
      triangle = $('<div>').addClass('triangle').appendTo(edge);
      cir.append(edge);
    }
    this.outerLabelEl = $("<div>").addClass("outer-label");
    this.innerLabelEl = $("<div>").addClass("inner-label");
    cir.append([this.outerLabelEl, this.innerLabelEl]);
    this.el = cir;
  }

  Circle.prototype.innerLabel = function(label) {
    this.innerLabelEl.empty().append(label);
    return this.el;
  };

  Circle.prototype.outerLabel = function(label, direction) {
    var text;
    if (direction == null) {
      direction = 'auto';
    }
    this.direction = direction;
    this.el.direction = direction;
    text = $("<div>").addClass("text").append(label);
    this.outerLabelEl.empty().append(text);
    return this.el;
  };

  Circle.prototype.color = function(color) {
    this.el.css('background-color', color);
    this.el.find('.triangle').css('border-left-color', color);
    return this.el;
  };

  return Circle;

})();

module.exports = Circle;


},{"jquery":undefined}],4:[function(require,module,exports){
module.exports = {
  transform: (function() {
    var el, t, transforms;
    el = document.createElement('fakeelement');
    transforms = {
      'transform': 'transform',
      'OTransform': '-o-transform',
      'MozTransform': '-moz-transform',
      'WebkitTransform': '-webkit-transform',
      'msTransform': '-ms-transform'
    };
    for (t in transforms) {
      if (el.style[t] != null) {
        return transforms[t];
      }
    }
    return false;
  })(),
  transition: (function() {
    var el, t, transitions;
    el = document.createElement('fakeelement');
    transitions = {
      'transition': 'transition',
      'OTransition': '-o-transition',
      'MozTransition': '-moz-transition',
      'WebkitTransition': '-webkit-transition'
    };
    for (t in transitions) {
      if (el.style[t] != null) {
        return transitions[t];
      }
    }
    return false;
  })(),
  transitionEvent: (function() {
    var el, t, transitions;
    el = document.createElement('fakeelement');
    transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] != null) {
        return transitions[t];
      }
    }
    return false;
  })(),
  animationEvent: (function() {
    var animations, el, t;
    el = document.createElement('fakeelement');
    animations = {
      'animation': 'animationend',
      'OAnimation': 'oAnimationEnd',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd'
    };
    for (t in animations) {
      if (el.style[t] != null) {
        return animations[t];
      }
    }
    return false;
  })(),
  arcFn: function(deg, fn) {
    var accHelper, accuracy, arc, res;
    accuracy = 10;
    arc = deg * Math.PI / 180;
    accHelper = Math.pow(10, accuracy);
    res = Math[fn](arc);
    res = Math.round(res * accHelper) / accHelper;
    return res;
  },
  sin: function(deg) {
    return Helpers.arcFn(deg, 'sin');
  },
  cos: function(deg) {
    return Helpers.arcFn(deg, 'cos');
  },
  deg2coords: function(deg) {
    var x, y;
    y = Helpers.sin(deg);
    x = Helpers.cos(deg);
    return [x, y];
  }
};


},{}],5:[function(require,module,exports){
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = {
  transition: Helpers.transition !== false,
  transform: Helpers.transform !== false,
  touch: indexOf.call(document.documentElement, 'ontouchstart') >= 0
};


},{}]},{},[1]);
