'use strict';

// CONSTRUCTOR

function Mtlazy(options) {
  // debounce
  this._lastScroll = 0;
  this._ticking    = false;

  // options
  options = options || {};

  this._optionsContainer    = document.querySelector(options.container) || window;
  this._optionsFade         = options.fade || false;
  this._optionsFadeDuration = options.duration || 300;
  this._optionsSelector     = options.selector || '.lazyload';
  this._optionsAttr         = options.attr || 'data-src';
  this._optionsMobileAttr   = options.mobileAttr || 'data-mobile-src';
  this._optionsAttrRetina   = options.retinaAttr || 'data-retina-src';
  this._optionsAttrBg       = options.bgAttr || 'data-bg-src';
  this._optionsAttrHidden   = options.hiddenAttr || 'data-hidden-src';
  this._optionsThreshold    = options.threshold || 0;
  this._optionsCallback     = options.callback || null;
  this._mobileBreakpoint    = options.breakpoint || 768;
  this._optionsCleanUp      = options.clean || false;

  // properties
  this._retina  = window.devicePixelRatio > 1;
  this._srcAttr = this._retina ? this._optionsAttrRetina : this._optionsAttr;

  // inject polyfill for ie9
  this.rafPolyfill();

  // nodelist
  this._nodes = document.querySelectorAll(this._optionsSelector);

  // scroll and resize handler
  this._handlerBind = this._requestScroll.bind(this);

  // call to create
  this._create();
}

// DEBOUNCE HELPERS
// adapted from: http://www.html5rocks.com/en/tutorials/speed/animations/

Mtlazy.prototype._requestScroll = function() {
  if(this._optionsContainer === window) {
    this._lastScroll = window.pageYOffset;
  }
  else {
    this._lastScroll = this._optionsContainer.scrollTop + this._getOffset(this._optionsContainer);
  }

  this._requestTick();
};

Mtlazy.prototype._requestTick = function() {
  if(!this._ticking) {
    requestAnimationFrame(this.update.bind(this));
    this._ticking = true;
  }
};

// OFFSET HELPER
// remember, getBoundingClientRect is relative to the viewport

Mtlazy.prototype._getOffset = function(node) {
  return node.getBoundingClientRect().top + window.pageYOffset;
};

// HEIGHT HELPER

Mtlazy.prototype._getContainerHeight = function() {
  return this._optionsContainer.innerHeight
      || this._optionsContainer.offsetHeight;
};

// Mtlazy METHODS

Mtlazy.prototype._create = function() {
  // fire scroll event once
  this._handlerBind();

  this._maybeSetOpacity();

  // bind scroll and resize event
  this._optionsContainer.addEventListener('scroll', this._handlerBind, false);
  this._optionsContainer.addEventListener('resize', this._handlerBind, false);
};

Mtlazy.prototype._maybeSetOpacity = function() {
  // if fade set them to opacity 0
  if( this._optionsFade ){
    var nodes = this._nodes;
    var dur = this._optionsFadeDuration;
    for ( var i = 0; i < nodes.length; i++ ) {
      nodes[i].style.opacity = 0;
      nodes[i].style.WebkitTransition =
        nodes[i].style.MozTransition =
          nodes[i].style.OTransition =
            nodes[i].style.MsTransition =
              nodes[i].style.transition =
                'opacity ' + dur + 'ms ease-in';
    }
  }
};

Mtlazy.prototype._destroy = function() {
  // unbind scroll and resize event
  this._optionsContainer.removeEventListener('scroll', this._handlerBind, false);
  this._optionsContainer.removeEventListener('resize', this._handlerBind, false);
};

Mtlazy.prototype._inViewport = function(node) {
  // get viewport top and bottom offset
  var viewportTop = this._lastScroll;
  var viewportBottom = viewportTop + this._getContainerHeight();

  // get node top and bottom offset
  var nodeTop = this._getOffset(node);
  var nodeBottom = nodeTop + this._getContainerHeight();

  // calculate threshold, convert percentage to pixel value
  var threshold = (this._optionsThreshold / 100) * window.innerHeight;

  // return if node in viewport
  return nodeBottom >= viewportTop - threshold
      && nodeTop <= viewportBottom + threshold
      && !node.hasAttribute(this._optionsAttrHidden);
};

Mtlazy.prototype._reveal = function(node) {
  // get node source
  var source;
  if( node.getAttribute( this._optionsMobileAttr ) && window.innerWidth < this._mobileBreakpoint ){
    source = node.getAttribute(this._optionsMobileAttr);
  } else {
    source = node.getAttribute(this._srcAttr) || node.getAttribute(this._optionsAttr);
  }

  if(this._optionsFade && ! node.hasAttribute(this._optionsAttrBg)){
    this.setUpFadeIn(node, source);
  } else {
    // set node src or bg image
    if(node.hasAttribute(this._optionsAttrBg)) {
      node.style.backgroundImage = 'url(' + source + ')';
    }
    else {
      node.setAttribute('src', source);
    }
  }

  // call the callback
  if(typeof this._optionsCallback === 'function') {
    // "this" will be the node in the callback
    this._optionsCallback.call(node);
  }

  if(this._optionsCleanUp){
    // remove node data attributes
    node.removeAttribute(this._optionsMobileAttr);
    node.removeAttribute(this._optionsAttr);
    node.removeAttribute(this._optionsAttrRetina);
    node.removeAttribute(this._optionsAttrBg);
    node.removeAttribute(this._optionsAttrHidden);
  }

};

Mtlazy.prototype.setUpFadeIn = function( node, source ) {

  this.imgLoaded = false;

  node.onload = this.fadeInHandler( node );
  node.src = source;

  if (node.complete) {
    this.fadeInHandler( node );
  }
};

Mtlazy.prototype.fadeInHandler = function( node ) {
  if (this.imgLoaded) {
    return;
  }
  this.imgLoaded = true;
  node.style.opacity = '1';
};

Mtlazy.prototype.updateSelector = function() {
  // update cached list of nodes matching selector
  this._nodes = document.querySelectorAll(this._optionsSelector);
};

Mtlazy.prototype.rafPolyfill = function () {
  if (!Date.now)
    Date.now = function () {
      return new Date().getTime();
    };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
    || window[vp + 'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
          callback(lastTime = nextTime);
        },
        nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
};

Mtlazy.prototype.update = function() {
  // cache nodelist length
  var nodesLength = this._nodes.length;

  // loop through nodes
  for(var i = 0; i < nodesLength; i++) {
    // cache node
    var node = this._nodes[i];

    // check if node has mandatory attribute
    if(node.hasAttribute(this._optionsAttr)) {
      // check if node in viewport
      if(this._inViewport(node)) {
        // reveal node
        this._reveal(node);
      }
    }
  }

  // allow for more animation frames
  this._ticking = false;
};
