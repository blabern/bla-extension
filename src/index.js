(function() {

var containerClass = 'player-timedtext-text-container'
var baseUrl = 'https://bla-server.herokuapp.com/subtitle'

function toArray(obj) {
  return [].slice.call(obj)
}

function getSubtitle(container) {
  var spans = container.querySelectorAll('span')
  return toArray(spans).map(function(span) {
    return span.textContent
  }).join('\n')
}

function send(text, callback) {
  var url = baseUrl + '/' + encodeURI(text)
  fetch(url)
    .then(function(res) {
      return res.text()
    })
    .then(function(text) {
      callback(JSON.parse(text))
    })
    .catch(function(err) {
      console.log(err)
    })
}

var onChange = (function() {
  var last

  return function(e) {
    var node = e.target
    if (!node.classList || !node.classList.contains(containerClass)) return
    var text = getSubtitle(node)
    if (!text || text === last) return
    last = text
    send(text, console.log.bind(console))
  }
}())

document.addEventListener('DOMNodeInserted', onChange, false)
}())

