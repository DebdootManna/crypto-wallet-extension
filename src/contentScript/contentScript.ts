// This script runs in the context of web pages
// It acts as a bridge between webpage and the extension

// Listen for messages from the page
window.addEventListener('message', (event) => {
    // Only accept messages from the same frame
    if (event.source !== window) return;
  
    // Check if the message is from our extension
    if (event.data.type && event.data.type === 'WEBSITE_REQUEST') {
      // Forward the request to our extension
      chrome.runtime.sendMessage(event.data, (response) => {
        // Send the response back to the page
        window.postMessage({
          type: 'WALLET_RESPONSE',
          payload: response
        }, '*');
      });
    }
  });
// Inject a script to access window.ethereum
function injectScript() {
    const script = document.createElement('script');
    script.textContent = `
      window.ethereum = {
        isSimpleWallet: true,
        request: function(args) {
          return new Promise((resolve, reject) => {
            window.postMessage({
              type: 'WEBSITE_REQUEST',
              method: args.method,
              params: args.params
            }, '*');
            
            window.addEventListener('message', function handler(event) {
              if (event.data.type === 'WALLET_RESPONSE') {
                window.removeEventListener('message', handler);
                if (event.data.payload.error) {
                  reject(event.data.payload.error);
                } else {
                  resolve(event.data.payload.result);
                }
              }
            });
          });
        }
      };
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }
  
  injectScript();
  