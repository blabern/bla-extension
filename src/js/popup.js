(function () {
  var ns = "lingvotv";
  var codeEl = document.querySelector(".code");

  (function () {
    var message = {
      ns: ns,
      action: "getCode",
    };

    function renderCode(code) {
      codeEl.textContent = code;
    }

    chrome.runtime.sendMessage(message, function (res) {
      console.log(res);
      renderCode(res.code);
    });
  })();

  (function () {
    var emailEl = document.querySelector(".email");
    var timeoutId;

    function highlightActive(email) {
      if (email) {
        emailEl.parentNode.classList.add("active");
        codeEl.classList.remove("active");
      } else {
        emailEl.parentNode.classList.remove("active");
        codeEl.classList.add("active");
      }
    }

    function setEmail() {
      var email = emailEl.value.trim();
      var message = {
        ns: ns,
        action: "setEmail",
        payload: email,
      };
      highlightActive(email);
      chrome.runtime.sendMessage(message, function (res) {
        console.log(res);
      });
    }

    // keypress won't fire when you remove the value with backspace
    emailEl.onkeyup = function () {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(setEmail, 200);
    };

    chrome.runtime.sendMessage(
      {
        ns: ns,
        action: "getEmail",
      },
      function (res) {
        if (res.email) {
          emailEl.value = res.email;
        }
        highlightActive(res.email);
      }
    );
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
