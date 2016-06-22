const exec = require('child_process').exec

var arr = [];

[
  {
    name: 'red',
    bg: 'F44336',
    txtclr: 'FFFFFF'
  },
  {
    name: 'pink',
    bg: 'E91E63',
    txtclr: 'FFFFFF'
  },
  {
    name: 'purple',
    bg: '9C27B0',
    txtclr: 'FFFFFF'
  },
  {
    name: 'blue',
    bg: '2196F3',
    txtclr: 'FFFFFF'
  },
  {
    name: 'orange',
    bg: 'FF9800',
    txtclr: '000000'
  },
  {
    name: 'grey',
    bg: '9E9E9E',
    txtclr: '000000'
  }
].forEach((e) => {
  for (var i = 75; i <= 350; i+= 25) {
    arr.push({
      url: `https://placeholdit.imgix.net/~text?txtsize=31&bg=${e.bg}&txtclr=${e.txtclr}&txt=350%C3%97${i}&w=350&h=${i}`,
      file: `${__dirname}/img/${e.name}-${i}.png`
    })
  }
})

function download() {
  if (!arr.length) return console.log('done')
  var obj = arr.shift()
  exec(`curl '${obj.url}' -o ${obj.file}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    download()
  })
}

download()
