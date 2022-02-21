/**
 * encode Base64
 *
 * @param {*} str the string to encode
 * @return {*}  the base 64 string
 */
 export function _btoa(str)
 {
     return window.btoa(unescape(encodeURIComponent(str))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
 }
 
 /**
  * decode Base64
  *
  * @param {*} str the base 64 string to decode 
  * @return {*}  the decoded string
  */
 export function _atob(str)
 {
     str = str.replace(/-/g, "+").replace(/_/g, "/");
     return decodeURIComponent(escape(window.atob(str)));
 }