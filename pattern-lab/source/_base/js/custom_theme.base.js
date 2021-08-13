function tcgBaseInit() {

  // Shim for IE
  if (typeof NodeList.prototype.forEach !== "function") {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // console.log('Hello from the Drupal Starter Kit\'s Base JS');
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
  const name = cname + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  tcgBaseInit();
} else {
  document.addEventListener("DOMContentLoaded", tcgBaseInit);
}
