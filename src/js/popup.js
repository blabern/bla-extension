(function () {
  var ns = "lingvotv";
  var baseUrl = "https://api.lingvo.tv";
  //baseUrl = "http://localhost:3000";

  (function () {
    var emailFormEl = document.querySelector(".email-form");
    var emailEl = emailFormEl.querySelector('[type="email"]');
    var statusEl = emailFormEl.querySelector(".status");

    function sendTestSubtitle(auth, callback) {
      var options = {
        method: "POST",
        body: JSON.stringify({
          subtitle: "Chrome Extension is connected",
          auth,
        }),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      };
      fetch(baseUrl + "/subtitle", options)
        .then(function (res) {
          return res.json();
        })
        .then(callback)
        .catch(function (err) {
          callback({ error: err.message, stack: err.stack });
        });
    }

    function setEmail() {
      var email = emailEl.value.trim();
      var message = {
        ns: ns,
        action: "setEmail",
        payload: email,
      };
      chrome.runtime.sendMessage(message, function (res) {
        console.log(res);

        sendTestSubtitle(email, function (res) {
          statusEl.classList.remove("hidden");
          if (res.error) {
            statusEl.classList.add("error");
            statusEl.textContent = res.error;
            return;
          }

          if (res.connected === 0) {
            statusEl.classList.add("error");
            statusEl.textContent = "No Web App is connected";
            return;
          }

          statusEl.classList.remove("error");
          statusEl.textContent = res.connected + " Web Apps are connected";
        });
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
