(function() {

var ns = 'lingvotv'

;(function() {
  var message = {
    ns: ns,
    action: 'getAuth'
  }

  function renderAuth(auth) {
    document.querySelectorAll('.auth')[0].textContent = auth
  }

  chrome.runtime.sendMessage(message, function(res) {
    renderAuth(res.auth)
  })
}())

;(function(){
  var input = document.querySelectorAll('.suppress')[0]

  function notify() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var message = {
        ns: ns,
        action: 'toggleSubtitles',
        payload: input.checked
      }
      chrome.tabs.sendMessage(tabs[0].id, message)
      chrome.runtime.sendMessage(message)
    })
  }

  input.onclick = notify

  var queryMessage = {
    ns: ns,
    action: 'getSuppressSubtitles'
  }

  chrome.runtime.sendMessage(queryMessage, function(isSuppressed) {
    input.checked = isSuppressed
  })
}())

}())

