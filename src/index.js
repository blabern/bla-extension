
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

var baseUrl = 'https://bla-server.herokuapp.com/subtitle'

function send(text, callback) {
  var url = baseUrl + '?q=' + encodeURI(text)
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
