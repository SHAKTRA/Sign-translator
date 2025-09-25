// Content script for Manos extension
let manosWidget = null;
let selectedText = '';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translateText") {
    selectedText = request.text;
    showManosWidget(request.text);
    sendResponse({ success: true });
  }
  
  if (request.action === "getSelection") {
    const selection = window.getSelection().toString().trim();
    sendResponse({ text: selection });
  }
});

// Create and show the Manos widget
function showManosWidget(text) {
  // Remove existing widget if any
  removeManosWidget();
  
  // Create widget container
  manosWidget = document.createElement('div');
  manosWidget.id = 'manos-translate-widget';
  manosWidget.innerHTML = `
    <div class="manos-widget-header">
      <div class="manos-logo">
        <span class="manos-text">Manos</span>
        <span class="manos-subtitle">Sign Language Translator</span>
      </div>
      <button class="manos-close" onclick="this.closest('#manos-translate-widget').remove()">×</button>
    </div>
    <div class="manos-widget-content">
      <div class="selected-text">
        <strong>Selected Text:</strong>
        <p>"${text.length > 100 ? text.substring(0, 100) + '...' : text}"</p>
      </div>
      <div class="manos-actions">
        <button class="manos-btn manos-btn-primary" id="translateNow">
          🤟 Translate to Sign Language
        </button>
        <button class="manos-btn manos-btn-secondary" id="openApp">
          🚀 Open Manos App
        </button>
      </div>
    </div>
  `;
  
  // Add styles
  const styles = `
    #manos-translate-widget {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .manos-widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .manos-logo .manos-text {
      font-size: 20px;
      font-weight: bold;
      background: linear-gradient(45deg, #00ff88, #0088ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
    
    .manos-subtitle {
      display: block;
      font-size: 12px;
      opacity: 0.8;
      margin-top: 2px;
    }
    
    .manos-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    .manos-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .manos-widget-content {
      padding: 20px;
    }
    
    .selected-text {
      margin-bottom: 20px;
    }
    
    .selected-text strong {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .selected-text p {
      background: rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 8px;
      margin: 8px 0 0 0;
      font-size: 14px;
      line-height: 1.4;
      border-left: 3px solid #00ff88;
    }
    
    .manos-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .manos-btn {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .manos-btn-primary {
      background: linear-gradient(45deg, #00ff88, #0088ff);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
    }
    
    .manos-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 255, 136, 0.4);
    }
    
    .manos-btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .manos-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
  `;
  
  // Add styles to page
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Add widget to page
  document.body.appendChild(manosWidget);
  
  // Add event listeners
  document.getElementById('translateNow').addEventListener('click', () => {
    translateWithManos(text);
  });
  
  document.getElementById('openApp').addEventListener('click', () => {
    openManosApp(text);
  });
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (manosWidget && manosWidget.parentNode) {
      manosWidget.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => removeManosWidget(), 300);
    }
  }, 10000);
}

// Remove the widget
function removeManosWidget() {
  if (manosWidget && manosWidget.parentNode) {
    manosWidget.parentNode.removeChild(manosWidget);
    manosWidget = null;
  }
}

// Translate text with Manos
function translateWithManos(text) {
  // Open Manos app with the text pre-filled
  const manosUrl = `http://localhost:4200/app?text=${encodeURIComponent(text)}&autoTranslate=true`;
  window.open(manosUrl, '_blank');
  removeManosWidget();
}

// Open Manos app
function openManosApp(text = '') {
  chrome.runtime.sendMessage({
    action: "openManosApp",
    text: text
  });
  removeManosWidget();
}

// Add CSS animation for slide out
const slideOutCSS = `
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = slideOutCSS;
document.head.appendChild(slideOutStyle);
