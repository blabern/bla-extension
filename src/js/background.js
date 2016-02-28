(function() {

function generateAuth() {
  return Math
    .random()
    .toString()
    .substr(2, 4)
}

var auth = generateAuth()

var ns = 'lingvotv'
var baseUrl = 'http://api.lingvo.tv/subtitle'
//var baseUrl = 'http://localhost:3000/subtitle'
var url = baseUrl + '?auth=' + auth

function send(subtitle, callback) {
  var options = {
    method: 'POST',
    body: JSON.stringify({subtitle: subtitle}),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }
  fetch(url, options)
    .then(function(res) {
      return res.text()
    })
    .then(function(text) {
      callback(JSON.parse(text))
    })
    .catch(function(err) {
      callback({message: err.message, stack: err.stack})
    })
}

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  if (req.ns !== ns) return

  switch (req.action) {
    case 'translate':
      return send(req.payload, callback)
    case 'getAuth':
      return callback({auth: auth})
  }
})

}())
