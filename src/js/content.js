(function() {

var containerClass = 'player-timedtext-text-container'

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

function send(subtitle, callback) {
  var message = {
    ns: 'lingvotv',
    action: 'translate',
    payload: subtitle
  }
  chrome.runtime.sendMessage(message, callback)
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

