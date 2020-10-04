(function () {
  var ns = "lingvotv";

  (function () {
    var message = {
      ns: ns,
      action: "getAuth",
    };

    function renderCode(auth) {
      document.querySelector(".code").textContent = auth;
    }

    chrome.runtime.sendMessage(message, function (res) {
      renderCode(res.auth);
    });
  })();

  (function () {
    var emailEl = document.querySelector('input[type="email"]');

    function markAsVerified() {
      document.body.classList.add("email-verified");
    }

    function verify() {
      var message = {
        ns: ns,
        action: "verifyEmail",
        payload: emailEl.value,
      };
      chrome.runtime.sendMessage(message, function (res) {
        if (res.verified) {
          return markAsVerified();
        }
      });
    }

    function getEmail() {
      var message = {
        ns: ns,
        action: "getEmail",
      };
      chrome.runtime.sendMessage(message, function (res) {
        if (res.email) markAsVerified();
      });
    }

    document
      .querySelector(".login-section form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        verify();
      });

    getEmail();
  })();

  (function () {
    var input = document.querySelectorAll(".suppress")[0];

    function notify() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var message = {
          ns: ns,
          action: "toggleSubtitles",
          payload: input.checked,
        };
        chrome.tabs.sendMessage(tabs[0].id, message);
        chrome.runtime.sendMessage(message);
      });
    }

    input.onclick = notify;

    var queryMessage = {
      ns: ns,
      action: "getSuppressSubtitles",
    };

    chrome.runtime.sendMessage(queryMessage, function (isSuppressed) {
      input.checked = isSuppressed;
    });
  })();
})();
