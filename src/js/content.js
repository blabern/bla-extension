(function() {

var log = console.log.bind(console)

function toArray(obj) {
  return [].slice.call(obj)
}

function noop() {}

/**
 * Compare a string with the previous version.
 */
var hasChanged = (function() {
  var previous

  return function hasChanged(next) {
    if (next !== previous) {
      previous = next
      return true
    }
    return false
  }
}())

function send(subtitle, callback) {
  var message = {
    ns: 'lingvotv',
    action: 'translate',
    payload: subtitle
  }
  log('Captured subtitle', subtitle)
  chrome.runtime.sendMessage(message, callback)
}

var adapters = {}

adapters.netflix = (function() {
  var containerClass = 'player-timedtext-text-container'

  /**
   * Netflix newlines are split into divs with containerClass.
   * We better preserve new lines.
   */
  function getSubtitle(container) {
    return toArray(container.querySelectorAll('.' + containerClass))
      .map(function(node) {
        return toArray(node.querySelectorAll('span'))
          .map(function(node) {
            return node.textContent
          })
          .join('\n')
      })
      .join('\n')
  }

  function handle(node) {
    var text = getSubtitle(node)

    if (text && hasChanged(text)) {
      send(text, console.log.bind(console))
    }
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

adapters.amazon = (function() {
  var containerClass = 'timedTextBackground'

  function handle(node) {
    var text = node.innerHTML.split('<br>').join('\n')
    if (text && hasChanged(text)) {
      send(text, console.log.bind(console))
    }
  }

  return function(e) {
    var node = e.target.parentNode
    if (!node.classList || !node.classList.contains(containerClass)) return

    setTimeout(function() {
      handle(node)
    }, 20)
  }
}())

adapters.youtube = (function() {
  var containerClass = 'captions-text'

  function getSubtitle(node) {
    var container = node.children[0]
    return toArray(container.childNodes)
      .map(function(node) {
        if (node.nodeName === 'BR') return '\n'
        if (node.nodeName === '#text') {
          return node.textContent.trim()
        }
        // Youtube might insert something else than text, ignore it.
        return ''
      })
      .join('')
  }

  function handle(node) {
    var text = getSubtitle(node)
    if (text && hasChanged(text)) {
      send(text, console.log.bind(console))
    }
  }

  return function(e) {
    var node = e.target.parentNode
    if (!node.classList || !node.classList.contains(containerClass)) return

    setTimeout(function() {
      handle(node)
    }, 20)
  }
}())

function getAdapter() {
  for (var name in adapters) {
    if (location.hostname.indexOf(name) !== -1) {
      return adapters[name]
    }
  }
  return noop
}

// DOM Mutation events are deprecated
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
document.addEventListener('DOMNodeInserted', getAdapter(), true)

}())

