# fold-notifier

> Deal the dom elements who enter the viewport

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
```

## API

* [constructor](#constructorcb-opts)
* [collect](#collect)
* [kill](#kill)

#### constructor(cb, [opts])

| Argument | Action |
| :------ | :------- |
| **cb** | the callback |
| **opts.attribute** | optional targeted attribute, default to `fold` |
| **opts.offset** | optional offset, default to `0` |
| **opts.target** | optional targeted container, default to `document.body` |
| **opts.watch** | if `true`, auto `collect()` with **MutationObserver**, default to `false` |

The callback `cb` receive 2 arguments

| Argument | Action |
| :------ | :------- |
| **el** | the dom element entering the viewport |
| **data** | a **Plain Object** with serialized attribute values |

#### collect()

Collect new elements where `opts.attribute` is found

Use it when interesting new nodes are appended to the dom

Elements already 'done' are ignored

Not needed if `opts.watch` is setted to `true`

Using `collect` is recommended because far more optimized than the option `{watch:true}`

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
