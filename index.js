const setBoolean = require('is-funcs/set-boolean')
const setNumber = require('is-funcs/set-number')
const setString = require('is-funcs/set-string')
const defined = require('object-funcs/defined')
const isString = require('is-funcs/is-string')
const toNumber = require('is-funcs/to-number')
const throttle = require('raf-funcs/throttle')
const isNode = require('is-funcs/is-node')
const only = require('object-funcs/only')
const SR = require('scroll-resize')

module.exports = FoldNotifier

function FoldNotifier(cb, opts) {
  if (!(this instanceof FoldNotifier)) return new FoldNotifier(cb, opts)

  if (typeof cb !== 'function') throw new Error('FoldNotifier require a callback')
  this.cb = cb
  this.opts = only(opts, 'attribute offset target watch')
  this.opts.attribute = setString(this.opts.attribute, 'fold')
  this.opts.offset    = setNumber(this.opts.offset, 0)
  this.opts.watch     = setBoolean(this.opts.watch, false)
  if (isNode(this.opts.target) === false) this.opts.target = document.body

  if (this.opts.watch === true && typeof window.MutationObserver === 'function') {
    this.throttled = throttle(this.collect, 250, this)
    this.observer = new MutationObserver(this.throttled)
    this.observer.observe(this.opts.target, {childList: true, subtree: true})
  }

  this.check = bind(this, this.check)
  this.sr = new SR(this.check)
  this.sr.start(true)
  this.collect()
}

FoldNotifier.prototype.parse = function(node) {
  var attr = node.getAttribute(this.opts.attribute)
  var obj = {offset: this.opts.offset}
  if (isString(attr) === false) return obj

  attr = attr.toLowerCase().trim()
  var c
  var key = ''
  var value = ''
  var inkey = true
  for (var i = 0, n = attr.length; i < n; i++) {
    c = attr.charAt(i)
    if (c === '(') {
      inkey = false
    } else if (c === ')') {
      inkey = true
      value = value.trim()
      if (value.length > 0) {
        // quick clean + camelCase -- from https://github.com/ianstormtaylor/to-camel-case
        key = key.replace(/[-]+/g, ' ').trim().replace(/\s(\w)/g, function(matches, letter) {
          return letter.toUpperCase()
        })
        obj[key] = defined(toNumber(value), value)
      }
      key = value = ''
    } else {
      if (inkey) key += c
      else value += c
    }
  }

  return obj
}

FoldNotifier.prototype.collect = function() {
  if (this.sr == null) return
  var list = this.opts.target.querySelectorAll('[' + this.opts.attribute + ']:not([' + this.opts.attribute + '-done])')
  this.arr = []
  var el
  for (var i = 0, n = list.length; i < n; i++) {
    el = list.item(i)
    this.arr.push({
        el: el,
      data: this.parse(el)
    })
  }

  this.sr.immediate()
}

FoldNotifier.prototype.check = function(data) {
  var i = this.arr.length
  if (i == 0) return

  var obj, rec
  while (--i >= 0) {
    obj = this.arr[i]
    rec = obj.el.getBoundingClientRect()
    if (rec.top <= window.innerHeight + obj.data.offset) {
      obj.el.setAttribute(this.opts.attribute + '-done', '')
      this.cb(obj.el, obj.data)
      this.arr.splice(i, 1)
    }
  }
}

FoldNotifier.prototype.kill = function() {
  if (this.observer) {
    this.throttled.cancel()
    this.observer.disconnect()
  }
  if (this.arr) this.arr.length = 0
  if (this.sr)  this.sr.stop()

  delete this.throttled
  delete this.observer
  delete this.check
  delete this.opts
  delete this.arr
  delete this.cb
  delete this.sr
}

// fast bind -- from https://github.com/component/bind
function bind(ctx, fn) {
  return function() {
    return fn.apply(ctx, [].slice.call(arguments))
  }
}
