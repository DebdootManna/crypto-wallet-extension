// This script runs in the background
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  // Listen for messages from content scripts or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_WALLET') {
      chrome.storage.local.get(['wallet', 'encryptedPrivateKey'], (result) => {
        sendResponse({ wallet: result.wallet, encryptedPrivateKey: result.encryptedPrivateKey });
      });
      return true; // Needed for async response
    }
    
    if (message.type === 'CONNECT_TO_SITE') {
      // Handle connection request from websites
      sendResponse({ success: true });
      return true;
    }
  });