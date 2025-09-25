# Quick Installation Guide

## Install Manos Browser Extension

### Step 1: Enable Developer Mode
1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Toggle "Developer mode" ON (top right corner)

### Step 2: Load the Extension
1. Click "Load unpacked" button
2. Navigate to your project folder: `Sign-translator\translate-master\browser-extension`
3. Select the `browser-extension` folder
4. Click "Select Folder"

### Step 3: Verify Installation
✅ You should see "Manos - Sign Language Translator" in your extensions list
✅ Extension should show "Service worker (Inactive)" - this is normal
✅ No errors should appear in the extension details

### Step 4: Test the Extension
1. **Open the test page**: Open `test-extension.html` in your browser
2. **Select some text** by highlighting it
3. **Right-click** on the selected text
4. **Look for "Translate with Manos 🤟"** in the context menu
5. **Click it** to see the translation widget!

## Troubleshooting

### ❌ "Could not load CSS" Error:
- Make sure `content.css` file exists in the browser-extension folder
- Refresh the extension by clicking the reload button
- Check that all files are in the correct location

### ❌ "Could not load manifest" Error:
- Ensure `manifest.json` is valid JSON (no trailing commas)
- Check that all referenced files exist
- Make sure you're selecting the correct folder

### ❌ Context menu not appearing:
- Ensure text is selected before right-clicking
- Try refreshing the page after installing extension
- Check browser console for any errors

## Usage Examples

### Example 1: Translate a News Article
1. Go to any news website
2. Select a headline or paragraph
3. Right-click → "Translate with Manos 🤟"
4. Click "🤟 Translate to Sign Language"

### Example 2: Quick Access
1. Click the Manos extension icon in toolbar
2. Select text on any page
3. Click "🤟 Translate Selected Text" in popup

## Troubleshooting

**❌ Context menu not showing?**
- Make sure text is selected first
- Try refreshing the page
- Check if extension is enabled

**❌ Widget not appearing?**
- Ensure Manos app is running on localhost:4200
- Check browser console for errors
- Try reloading the extension

**❌ Extension icon missing?**
- Look in the extensions puzzle piece icon
- Pin the Manos extension to toolbar

## Next Steps

Once installed, you can:
- 🌐 **Use on any website** - Wikipedia, social media, news sites
- 📚 **Translate educational content** - Online courses, articles
- 💬 **Convert social media posts** - Twitter, Facebook, Reddit
- 📧 **Translate emails** - Gmail, Outlook web
- 🛒 **Shopping sites** - Product descriptions, reviews

**Happy translating with Manos! 🤟**
