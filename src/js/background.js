(function () {
  var ns = "lingvotv";

  var baseUrl = "https://api.lingvo.tv/subtitle";
  //baseUrl = "http://localhost:3000/subtitle";

  function send(subtitle, callback) {
    var options = {
      method: "POST",
      body: JSON.stringify({ subtitle: subtitle, auth: email.get() }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    };
    fetch(baseUrl, options)
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {
        callback(JSON.parse(text));
      })
      .catch(function (err) {
        callback({ message: err.message, stack: err.stack });
      });
  }

  var suppressSubtitles = (function () {
    var key = ns + "supressSubtitlesUntil";
    // Same logic is in content script.
    var lifetime = 2 * 60 * 60 * 1000;

    function get(callback) {
      callback(Number(localStorage.getItem(key)) >= Date.now());
    }

    function set(suppress, callback) {
      try {
        localStorage.setItem(key, suppress ? Date.now() + lifetime : 0);
      } catch (err) {
        return;
      }
      callback();
    }

    return {
      get: get,
      set: set,
    };
  })();

  var email = (function () {
    var key = ns + "Email";

    function get(callback) {
      return localStorage.getItem(key);
    }

    function set(payload, callback) {
      try {
        if (payload) localStorage.setItem(key, payload);
        else localStorage.removeItem(key);
      } catch (err) {
        return;
      }
      callback({ email: payload });
    }

    return {
      get: get,
      set: set,
    };
  })();

  chrome.runtime.onMessage.addListener(function (req, sender, callback) {
    if (req.ns !== ns) return;

    switch (req.action) {
      case "translate":
        return send(req.payload, callback);
      case "getSuppressSubtitles":
        return suppressSubtitles.get(callback);
      case "toggleSubtitles":
        return suppressSubtitles.set(req.payload, callback);
      case "setEmail":
        return email.set(req.payload, callback);
      case "getEmail":
        return callback({ email: email.get() });
    }
  });
})();
