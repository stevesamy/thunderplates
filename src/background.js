// background.js

browser.runtime.onInstalled.addListener(() => {
  // Initialize storage with empty templates array if not present
  browser.storage.local.get({ templates: [] }).then(() => {});
});
