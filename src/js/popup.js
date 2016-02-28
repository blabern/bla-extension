(function() {
var message = {
  ns: 'lingvotv',
  action: 'getAuth'
}

function renderAuth(auth) {
  document.querySelectorAll('.auth')[0].textContent = auth
}

chrome.runtime.sendMessage(message, function(res) {
  renderAuth(res.auth)
})

}())

