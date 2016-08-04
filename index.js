const getAttributes = require('dom-funcs/get-attributes')
const setBoolean = require('set-funcs/set-boolean')
const setNumber = require('set-funcs/set-number')
const setString = require('set-funcs/set-string')
const defined = require('object-funcs/defined')
const flatten = require('array-funcs/flatten')
const isString = require('is-funcs/is-string')
const toNumber = require('to-funcs/to-number')
const Viewport = require('viewport-update')
const isNode = require('is-funcs/is-node')
const only = require('object-funcs/only')

module.exports = FoldNotifier

function FoldNotifier(cb, opts) {
  if (!(this instanceof FoldNotifier)) return new FoldNotifier(cb, opts)

  if (typeof cb !== 'function') throw new Error('FoldNotifier require a callback')
  this.cb = cb
  this.opts = only(opts, 'attribute offset target watch')
  this.opts.attribute = setString(this.opts.attribute, 'fold')
  this.opts.offset    = setNumber(this.opts.offset)
  if (isNode(this.opts.target, true) === false) this.opts.target = document.body

  this.arr = []
  this.check = this.check.bind(this)
  this.viewport = new Viewport()
  this.viewport.update.add(this.check)
}

FoldNotifier.prototype.add = function() {
  if (this.arr == null) return
  var args = flatten(arguments)
  var data
  for (var i = 0, n = args.length; i < n; i++) {
    if (isNode(args[i], true)) {
      data = getAttributes(args[i], this.opts.attribute)
      if (typeof data.offset != 'number') data.offset = this.opts.offset
      this.arr.push({
        el:   args[i],
        data: data
      })
    }
  }
  this.viewport.immediate()
}

FoldNotifier.prototype.collect = function() {
  if (this.arr == null) return
  var list = this.opts.target.querySelectorAll('[' + this.opts.attribute + ']:not([' + this.opts.attribute + '-done])')
  this.arr = []
  var el, data
  for (var i = 0, n = list.length; i < n; i++) {
    el = list.item(i)
    if (isNode(el, true)) {
      data = getAttributes(el, this.opts.attribute)
      if (typeof data.offset != 'number') data.offset = this.opts.offset
      this.arr.push({
        el:   el,
        data: data
      })
    }
  }
  this.viewport.immediate()
  return this.arr.length
}

FoldNotifier.prototype.check = function(data) {
  if (this.arr == null) return
  var obj, rec
  var n = this.arr.length
  for (var i = 0; i < n; i++) {
    obj = this.arr[i]
    if (obj == null) continue
    rec = obj.el.getBoundingClientRect()
    if (rec.top <= window.innerHeight + obj.data.offset) {
      this.arr[i] = null
      obj.el.setAttribute(this.opts.attribute + '-done', '')
      this.cb(obj.el, obj.data)
    }
  }
}

FoldNotifier.prototype.kill = function() {
  if (this.viewport) this.viewport.update.remove(this.check)
  if (this.arr) this.arr.length = 0

  delete this.viewport
  delete this.check
  delete this.opts
  delete this.arr
  delete this.cb
}
