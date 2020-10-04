(function () {
  var ns = "lingvotv";

  var auth = (function () {
    function generateAuth() {
      return Math.random().toString().substr(2, 6);
    }

    var auth = localStorage.getItem(ns + "Auth");
    if (auth) return auth;

    auth = generateAuth();
    try {
      localStorage.setItem(ns + "Auth", auth);
    } catch (err) {}

    return auth;
  })();

  var baseUrl = "http://api.lingvo.tv/subtitle";
  //var baseUrl = 'http://localhost:3000/subtitle'
  var url = baseUrl + "?auth=" + auth;

  function verifyEmail(email, callback) {
    // TODO actually verify
    localStorage.setItem(ns + "Email", email);
    callback({ verified: true });
  }

  function getEmail(callback) {
    var email = localStorage.getItem(ns + "Email");
    callback({ email: email });
  }

  function translate(subtitle, callback) {
    var options = {
      method: "POST",
      body: JSON.stringify({ subtitle: subtitle }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    };
    fetch(url, options)
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

  chrome.runtime.onMessage.addListener(function (req, sender, callback) {
    if (req.ns !== ns) return;

    switch (req.action) {
      case "getAuth":
        return callback({ auth: auth });
      case "getEmail":
        return getEmail(callback);
      case "verifyEmail":
        return verifyEmail(req.payload, callback);
      case "translate":
        return translate(req.payload, callback);
      case "getSuppressSubtitles":
        return suppressSubtitles.get(callback);
      case "toggleSubtitles":
        return suppressSubtitles.set(req.payload, callback);
    }
  });
})();
