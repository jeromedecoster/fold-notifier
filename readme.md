# fold-notifier

> Deal with the dom elements who enter the viewport

## Install

```bash
npm i fold-notifier
```

Package [on npm](https://www.npmjs.com/package/fold-notifier)

## Example 1

Two div will be animated when they enter the viewport

```css
.rect {
  transform: translateY(80px) translateZ(0px);
  transition: all 3s cubic-bezier(.19, 1, .22, 1);
}

/* animation starts when the attribute `fold-done` is setted */
.rect[fold-done] {
  transform: translateY(0px);
}
```

```html
<div class='rect one' fold></div>
<div class='rect two' fold='delay(1.3)'></div>
```

```js
const Fold = require('fold-notifier')

// when update is invoked, the attribute `fold-done` was just setted to `el`
function update(el, data) {
  // `el` with class `.two` receive serialized data {offset:-25, delay:-1.3}
  if (data.delay != null) {
    el.style.transitionDelay = data.delay + 's'
  }
}

var fold = new Fold(update, {offset: -25})
fold.collect()
```

## Example 2

Images are lazyloaded when they are about to enter the viewport

```html
<!-- b.gif is the famous 1x1 transparent pixel image -->
<img class='one' src='b.gif' lazy='src(image1.jpg)'/>
<img class='two' src='b.gif' lazy='src(image2.jpg)'/>
```

```js
const Fold = require('fold-notifier')

// when update is invoked, the attribute `lazy-done` was just setted to `el`
function update(el, data) {
  // `el` with class `.one` receive serialized data {offset:250, src:'image1.jpg'}
  // `el` with class `.two` receive {offset:250, src:'image2.jpg'}
  if (data.src != null) {
    el.src = data.src
  }
}

var fold = new Fold(update, {offset: 250, attribute:'lazy'})
fold.collect()
```

## API

* [constructor](#constructorcb-opts)
* [add](#addarg-arg-)
* [collect](#collect)
* [kill](#kill)

#### constructor(cb, [opts])

| Argument | Action |
| :------ | :------- |
| **cb** | the callback |
| **opts.attribute** | optional targeted attribute, default to `fold` |
| **opts.offset** | optional offset, default to `0` |
| **opts.target** | optional targeted container, default to `document.body` |

The callback `cb` receive 2 arguments

| Argument | Action |
| :------ | :------- |
| **el** | the dom element entering the viewport |
| **data** | a **Plain Object** with serialized attribute values |

You must call `add` or `collect` to start

#### add(arg, [arg], [...])

Add new elements manually

`arg` can be:

* a **Html Element**
* a **NodeList**
* a flat **Array** or an **Array** of nested `arg`

Make sure that the array contains valid node elements with the correct `opts.attribute`

The elements are directly added in the previous internal data storage, faster than the [collect](#collect) method

```js
const Fold = require('fold-notifier')

var fold = new Fold(/* ... */)

var ela = document.querySelector('p.a')
var elb = document.querySelector('p.b')
var elc = document.querySelector('p.c')
var lst = document.querySelectorAll('div')

fold.add(ela, [elb, elc], lst)
```

#### collect()

Collect new elements where `opts.attribute` is found

Use it when interesting new nodes are appended to the dom

Elements already *"done"* are ignored

It reset the internal data storage. Every element not *"done"* are tested / imported again

Safer than the [add](#addarg-arg-) method with the `opts.attribute` test, but slower

Return the count of watched elements

Return the count of watched elements

```html
<!-- .one and .two are ignored -->
<div class='rect one' fold fold-done></div>
<div class='rect two' fold='delay(1.3)' fold-done></div>

<!-- .three is collected -->
<div class='rect three' fold='delay(1.3)'></div>
```

#### kill()

Stop and delete all internal stuffs. Nothing can be done after that

## License

MIT
