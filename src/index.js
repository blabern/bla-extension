(function() {

var containerClass = 'player-timedtext-text-container'
var baseUrl = 'http://api.lingvo.tv/subtitle'

function toArray(obj) {
  return [].slice.call(obj)
}

/**
 * Netflix newlines are split into divs with containerClass.
 * We better preserve new lines.
 */
function getSubtitle(container) {
  return toArray(container.querySelectorAll('.' + containerClass))
    .map(function(node) {
      return node.textContent
    })
    .join('\n')
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

  function handle(node) {
    var text = getSubtitle(node)

    if (!text || text === last) return
    last = text
    send(text, console.log.bind(console))
  }

  return function(e) {
    var node = e.target
    if (!node.classList || !node.classList.contains(containerClass)) return
    var parent = node.parentNode
    setTimeout(function() {
      handle(parent)
    }, 20)
  }
}())

// DOM Mutation events are deprecated
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
document.addEventListener('DOMNodeInserted', onChange, true)
}())

