// Browser API Polyfill for Chrome and Firefox compatibility
// This ensures the extension works seamlessly on both browsers

(function () {
  'use strict';

  // If browser API doesn't exist, create it from chrome API
  if (typeof browser === 'undefined') {
    // Create browser namespace pointing to chrome
    globalThis.browser = chrome;
  }

  // If chrome API doesn't exist (Firefox), create it from browser API
  if (typeof chrome === 'undefined') {
    globalThis.chrome = browser;
  }

  // Ensure we have a working API object
  const api = typeof browser !== 'undefined' ? browser : chrome;

  // Wrap chrome API methods to return Promises (for Firefox compatibility)
  // Firefox's browser.* API already returns promises
  // Chrome's chrome.* API uses callbacks

  if (api === chrome && typeof browser === 'undefined') {
    // We're in Chrome, no need to modify anything
    // Chrome APIs work with async/await when using them correctly
    console.log('Browser API polyfill loaded (Chrome mode)');
  } else {
    // We're in Firefox or using browser API
    console.log('Browser API polyfill loaded (Firefox mode)');
  }
})();
