# Manos Browser Extension

A powerful browser extension that allows you to translate any selected text to sign language using the Manos app.

## Features

🤟 **Right-Click Translation**: Select any text on any webpage and right-click to translate with Manos
⚡ **Instant Access**: Beautiful popup widget appears with translation options
🌐 **Universal Compatibility**: Works on all websites and web applications
🚀 **Direct Integration**: Seamlessly opens Manos app with pre-filled text
✨ **Modern UI**: Beautiful gradient design matching Manos branding

## How to Install

### For Development:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `browser-extension` folder
4. The Manos extension will appear in your extensions list

### For Production:
1. Package the extension as a .crx file
2. Upload to Chrome Web Store for distribution

## How to Use

### Method 1: Right-Click Context Menu
1. **Select Text**: Highlight any text on any webpage
2. **Right-Click**: Choose "Translate with Manos 🤟" from the context menu
3. **Translate**: A beautiful widget appears with translation options
4. **Action**: Click "Translate to Sign Language" to open Manos app

### Method 2: Extension Popup
1. **Click Extension Icon**: Click the Manos icon in your browser toolbar
2. **Select Option**: Choose "Translate Selected Text" or "Open Manos App"
3. **Translate**: If text is selected, it will open Manos with that text

## Widget Features

The translation widget includes:
- **Beautiful Design**: Gradient background matching Manos branding
- **Selected Text Preview**: Shows the text you selected
- **Two Action Buttons**:
  - 🤟 **Translate to Sign Language**: Opens Manos app with text pre-filled
  - 🚀 **Open Manos App**: Opens the main Manos application
- **Auto-Hide**: Widget automatically disappears after 10 seconds
- **Close Button**: Manual close option available

## Technical Details

### Files Structure:
```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for context menus
├── content.js            # Content script for text selection
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
└── README.md             # This file
```

### Permissions Required:
- `contextMenus`: For right-click "Translate with Manos" option
- `activeTab`: To access selected text on current tab
- `storage`: For extension settings (future use)
- `<all_urls>`: To work on all websites

### Integration with Manos App:
- Opens Manos at `http://localhost:4200/app`
- Passes selected text via URL parameter: `?text=selectedText`
- Supports auto-translation with: `?autoTranslate=true`

## Customization

### Changing Manos App URL:
Edit the URL in `background.js` and `content.js`:
```javascript
const manosUrl = 'http://localhost:4200/app'; // Change this URL
```

### Styling the Widget:
Modify the CSS in `content.js` within the `showManosWidget` function to customize the appearance.

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ⚠️ Firefox (requires Manifest V2 conversion)
- ⚠️ Safari (requires different approach)

## Security Features

- **Content Security Policy**: Follows Chrome extension security guidelines
- **Limited Permissions**: Only requests necessary permissions
- **Secure Communication**: Uses Chrome extension messaging API
- **No External Requests**: All communication stays within browser/local app

## Future Enhancements

- 🎯 **Keyboard Shortcuts**: Add hotkeys for quick translation
- 🎨 **Theme Options**: Multiple widget themes
- 📱 **Mobile Support**: Browser extension for mobile browsers
- 🔧 **Settings Panel**: Customizable options and preferences
- 🌍 **Multi-Language**: Extension UI in multiple languages

## Troubleshooting

### Extension Not Working:
1. Ensure Manos app is running on `http://localhost:4200`
2. Check if extension has necessary permissions
3. Reload the extension in `chrome://extensions/`

### Widget Not Appearing:
1. Make sure text is properly selected
2. Check browser console for errors
3. Verify content script is injected

### Context Menu Missing:
1. Right-click on selected text (not empty space)
2. Ensure extension is enabled
3. Check background script permissions

## Support

For issues or feature requests, please visit the main Manos repository or create an issue in the project's GitHub page.
