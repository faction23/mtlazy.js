# MTLazy.js

A small, fast, modern, and dependency-free library for lazy loading. This is a fork of Layzr.js bringing in ie9 support and some other features we needed for service projects at MT.

Lazy loading boosts page speed by deferring the loading of images until they're in (or near) the viewport. This library makes it completely painless - maximizing speed by keeping options to a minimum.

* [Demo Page](http://callmecavs.github.io/layzr.js/)

## Usage

Follow these steps:

1. [Install](https://github.com/faction23/mtlazy.js#install)
2. [Image Setup](https://github.com/faction23/mtlazy.js#image-setup)
3. [Instance Creation](https://github.com/faction23/mtlazy.js#instance-creation)

### Install

Load the script.

[Download it](https://github.com/faction23/mtlazy.js/archive/master.zip), install it with [NPM](https://www.npmjs.com/package/layzr.js), or install it with [Bower](http://bower.io/search/?q=mtlazy.js).

```html
<script src="mtlazy.js"></script>
```

### Image Setup

For each `img` and/or `iframe` you want to lazy load, put the `src` in the `data-layzr` attribute.

```html
<img data-src="image/source">
<iframe data-src="media/source"></iframe>
```

This is the only _required_ attribute. Advanced, _optional_ configuration follows:

#### (Optional) Placeholders

Include a placeholder, via the `src` attribute.

Images without a placeholder - _before_ they're loaded - may impact layout (no width/height), or appear broken.

```html
<img src="optional/placeholder" data-src="image/source">
```

#### (Optional) Retina Support

Include a retina (high-resolution) version of the image in the `data-retina-src` attribute. This source will only be loaded if the [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) is greater than 1.

Ensure the proper CSS is in place to display both regular and retina images correctly. This library handles the loading, but not the displaying, of elements.

```html
<img data-src="image/source" data-retina-src="optional/retina/source">
```

#### (Optional) Background Images

Include the `data-bg-src` attribute to load the source as a background image.

The `data-bg-src` attribute should be valueless - the image source is still taken from the `data-src` and `data-retina-src` attributes.

```html
<img data-src="image/source" data-bg-src>
```

#### (Optional) Hidden Images

Include the `data-hidden-src` attribute to prevent an image from loading.

Removing this attribute _will not load the image_ - the user will still need to scroll, and the element will still need to be in the viewport.

```html
<img data-src="image/source" data-hidden-src>
```

### Instance Creation

Create a new instance, and that's it!

```javascript
var MTLazy = new Mtlazy();
```

Documentation for all options follows:

## Options

Defaults shown below:

```javascript
var mtlazy = new Mtlazy({
  container: null,
  selector: '[data-src]',
  attr: 'data-src',
  retinaAttr: 'data-src-retina',
  bgAttr: 'data-bg-src',
  hiddenAttr: 'data-hidden-src',
  threshold: 0,
  callback: null
});
```

Explanation of each follows:

### container

Customize the container that holds the elements to lazy load - using CSS selector syntax. This option may be useful when building single page applications.

Note that `window` is assumed to be the container if this option is set to `null`.

```javascript
var mtlazy = new Mtlazy({
  container: null
});
```

### selector

Customize the selector used to find elements to lazy load - using CSS selector syntax.

```javascript
var mtlazy = new Mtlazy({
  selector: '[data-src]'
});
```

### attr / retinaAttr

Customize the data attributes that image sources are taken from.

```javascript
var mtlazy = new Mtlazy({
  attr: 'data-src',
  retinaAttr: 'data-retina-src'
});
```

### bgAttr

Customize the data attribute that loads images as a background.

```javascript
var mtlazy = new Mtlazy({
  bgAttr: 'data-bg-src'
});
```

### hiddenAttr

Customize the data attribute that prevents images from loading.

```javascript
var mtlazy = new Mtlazy({
  hiddenAttr: 'data-hidden-src'
});
```

### threshold

Adjust when images load, relative to the viewport. Positive values make elements load _sooner_.

Threshold is a percentage of the viewport height - think of it as similar to the CSS `vh` unit.

```javascript
// load images when they're half the viewport height away from the bottom of the viewport

var mtlazy = new Mtlazy({
  threshold: 50
});
```

### callback

Invoke a callback function each time an image is loaded.

The image _may not be fully loaded before the function is called_. Detecting image load is inconsistent at best in modern browsers.

```javascript
// in the callback function, "this" refers to the image node

var mtlazy = new Mtlazy({
  callback: function() {
    this.classList.add('class');
  }
});
```

## Browser Support

Mtlazy natively supports **IE9+**.


## License

MIT. © 2015 Michael Cavalea


