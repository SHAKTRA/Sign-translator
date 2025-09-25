// Background script for Manos extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: "translateWithManos",
    title: "Translate with Manos 🤟",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateWithManos" && info.selectionText) {
    // Send selected text to content script
    chrome.tabs.sendMessage(tab.id, {
      action: "translateText",
      text: info.selectionText,
      pageUrl: tab.url
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openManosApp") {
    // Open Manos app in new tab with the text to translate
    const manosUrl = `http://localhost:4200/app?text=${encodeURIComponent(request.text)}`;
    chrome.tabs.create({ url: manosUrl });
    sendResponse({ success: true });
  }
  
  if (request.action === "getSelectedText") {
    // Get selected text from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSelection" }, (response) => {
        sendResponse(response);
      });
    });
    return true; // Will respond asynchronously
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open Manos app
  chrome.tabs.create({ url: "http://localhost:4200" });
});
