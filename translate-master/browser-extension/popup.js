// Popup script for Manos extension
document.addEventListener('DOMContentLoaded', function() {
  const openAppBtn = document.getElementById('openApp');
  const translateSelectedBtn = document.getElementById('translateSelected');
  
  // Open Manos app
  openAppBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'http://localhost:4200' });
    window.close();
  });
  
  // Translate selected text
  translateSelectedBtn.addEventListener('click', function() {
    // Get selected text from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelection' }, function(response) {
        if (response && response.text && response.text.trim()) {
          // Open Manos app with selected text
          const manosUrl = `http://localhost:4200/app?text=${encodeURIComponent(response.text)}&autoTranslate=true`;
          chrome.tabs.create({ url: manosUrl });
          window.close();
        } else {
          // Show message if no text is selected
          showMessage('Please select some text on the page first!');
        }
      });
    });
  });
  
  function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: rgba(255, 107, 107, 0.9);
      color: white;
      padding: 10px;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      z-index: 1000;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }
});
