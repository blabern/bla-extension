(function () {
  var ns = "lingvotv";

  (function () {
    var emailFormEl = document.querySelector(".email-form");
    var emailEl = emailFormEl.querySelector('[type="email"]');

    function setEmail() {
      var email = emailEl.value.trim();
      var message = {
        ns: ns,
        action: "setEmail",
        payload: email,
      };
      chrome.runtime.sendMessage(message, function (res) {
        console.log(res);
      });
    }

    chrome.runtime.sendMessage(
      {
        ns: ns,
        action: "getEmail",
      },
      function (res) {
        if (res.email) {
          emailEl.value = res.email;
        }
      }
    );

    emailFormEl.addEventListener("submit", (event) => {
      event.preventDefault();
      setEmail();
    });
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
