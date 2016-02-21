function getSubtitle() {
  var spans = document.querySelectorAll('.player-timedtext span')
  return [].slice.call(spans).map(function(span) {
    return span.textContent
  }).join('\n')
}

function observe() {
  var subtitles = document.querySelectorAll('.player-timedtext')[0]
  var last
  function changed() {
    var text = getSubtitle()
    if (!text || text === last) return
    last = text
    send(text, console.log.bind(console))
  }

  var observer = new MutationObserver(changed)
  observer.observe(subtitles, {childList: true})
}


function send(original, callback) {
  var url = "http://localhost:3000?&q=" + encodeURI(original)
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

observe()
