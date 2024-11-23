chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Check if the tab URL matches a cart URL pattern (you can adjust the URL pattern based on your requirements)
    if (tab.url && tab.url.includes('cart')) {
        // Open the popup when a cart page is opened
        chrome.action.openPopup();
    }
});

// Optionally, you could listen for when a new tab is created
chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.url && tab.url.includes('cart')) {
        chrome.action.openPopup();
    }
});