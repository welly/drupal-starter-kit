function baseInit() {
  // Shim for IE
  if (typeof NodeList.prototype.forEach !== "function") {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
}

/**
 * Get a cookie form the cookie string.
 *
 * @param {string} cname
 *   The cookie name
 * @returns {string}
 *   The returned cookie value
 */
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
}

if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
  baseInit();
} else {
  document.addEventListener("DOMContentLoaded", baseInit);
}
