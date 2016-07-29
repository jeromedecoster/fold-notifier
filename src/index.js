const Stats = require('@jordandelcros/stats-js')
const Fold = require('..')

function time() {
  var d = new Date()
  var ms = d.getMilliseconds().toString()
  while (ms.length < 3) ms = '0' + ms
  return d.toString().substr(15, 9) + '.' + ms
}

function cb(el, data) {
  // console.log('cb el:', el, data)
  if (el.nodeName == 'IMG') {
    el.src = data.src
    console.log(' added:', time(), data.src)
  } else if (data.delay != null) {
    el.style.transitionDelay = data.delay + 's'
  }
}

var colors = 'grey orange pink purple red'.split(' ')
var fold

function onclick(evt) {
  var action = evt.target.getAttribute('action')
  var offset = +document.querySelector('input[offset]').value
  var checked = document.querySelector('input[add]').checked
  var col2 = document.querySelector('.col-2')
  if (action === 'add-squares') {
    var div = document.createElement('div')
    div.classList.add('square')
    div.setAttribute('fold', `offset(${offset})`)
    // div.setAttribute('fold-offset', offset)
    var col1 = document.querySelector('.col-1')
    var add = []
    for (var i = 0, n = 20; i < n; i++) {
      var clo = div.cloneNode()
      if (Math.random() < .2) {
        var delay = Math.random() * 5
        if (Math.random() < .5) delay = Math.ceil(delay)
        clo.setAttribute('fold', `offset(${offset}) delay(${delay}) some-slug-case(data)`)
      }
      col1.appendChild(clo)
      add.push(clo)
      var clo2 = div.cloneNode()
      col2.appendChild(clo2)
      add.push(clo2)
    }
    if (fold && checked) {
      fold.add(add)
    }
  } else if (action === 'add-images') {
    if (colors.length == 0) return
    var col3 = document.querySelector('.col-3')
    var img
    var color = colors.shift()
    var add = []
    for (var i = 75, n = 350; i <= n; i += 25) {
      img = document.createElement('img')
      // gif file + data:image/gif from https://github.com/vvo/lazyload
      // img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
      img.src = 'b.gif'
      img.onload = function() { console.log('loaded:', time(), this.src.substr(this.src.lastIndexOf('/')+1))}
      img.width  = 350
      img.height = i
      if (Math.random() < .5) {
        var off = -Math.floor(Math.random() * offset)
        img.setAttribute('fold', `offset(${off}) src(img/${color}-${i}.png)`)
      } else {
        img.setAttribute('fold', `src(img/${color}-${i}.png)`)
      }
      col3.appendChild(img)
      add.push(img)
    }
    if (fold && checked) {
      fold.add(add)
    }
  } else if (action === 'default-options') {
    fold = new Fold(cb)
  } else if (action === 'offset') {
    console.log('offset')
    fold = new Fold(cb, {offset: offset})
  } else if (action === 'target') {
    console.log('target')
    fold = new Fold(cb, {target: col2})
  } else if (action === 'collect') {
    console.log('collect')
    if (fold) fold.collect()
  } else if (action === 'kill') {
    if (fold) fold.kill()
  }
}

var list = document.querySelectorAll('button')
for (var i = 0, n = list.length; i < n; i++) {
  list.item(i).addEventListener('click', onclick)
}

function range() {
  var value = +document.querySelector('input[range]').value
  document.querySelector('label[range]').textContent = value
  for (var el of document.querySelectorAll('.fake')) {
    el.style.height = value + 'px'
  }
}

range()
document.querySelector('input[range]').addEventListener('input', range)

//

/*
var stats = new Stats()

document.body.appendChild(stats.domElement)

function update() {
  window.requestAnimationFrame(update)
  stats.begin()

  // monitored code goes here

  stats.end()
}

window.requestAnimationFrame(update)
*/

