const ACTIONS = {
  popupOpened: () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.executeScript(tab.id, { file: './entry.js' });
    });
  },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.action || !ACTIONS[request.action]) {
    return;
  }

  ACTIONS[request.action](request, sender, sendResponse);
  return true;
});
