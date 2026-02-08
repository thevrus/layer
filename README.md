# Layer

> Customize any website with CSS and JavaScript. Arc Boosts for Chrome.

Layer brings the power of Arc's Boosts to Chrome and other Chromium browsers. A minimal, clean extension for injecting custom styles and scripts into any website.

## Features

- 🎨 **Custom CSS** - Style any website with your own CSS
- ⚡ **Custom JavaScript** - Add functionality with custom scripts
- 🔒 **Per-site settings** - Each rule is scoped to specific domains
- 💾 **Auto-save** - Changes persist across browser sessions
- 🎯 **Minimal UI** - Clean, distraction-free interface
- 🔐 **Privacy-first** - No tracking, no data collection, no remote code

## Installation

### From Chrome Web Store

[Install Layer](https://chrome.google.com/webstore) ← *Coming soon*

### From Source

1. Clone this repository
   ```bash
   git clone https://github.com/thevrus/layer.git
   cd layer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the extension
   ```bash
   npm run build
   ```

4. Load in Chrome
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

## Usage

1. **Click the Layer icon** in your browser toolbar
2. **Toggle CSS or JS** for the current site
3. **Click "Edit Code"** to open the editor
4. **Write your customizations** and they'll auto-save
5. **Refresh the page** to see changes

### Example: Dark Mode for Any Site

```css
body {
  background: #1a1a1a !important;
  color: #e0e0e0 !important;
}

a {
  color: #60a5fa !important;
}
```

### Example: Remove Annoying Elements

```css
.newsletter-popup,
.cookie-banner,
.sticky-header {
  display: none !important;
}
```

### Example: Custom Functionality

```javascript
// Add a button to copy page title
const btn = document.createElement('button');
btn.textContent = 'Copy Title';
btn.onclick = () => navigator.clipboard.writeText(document.title);
document.body.appendChild(btn);
```

## Tech Stack

- [WXT](https://wxt.dev/) - Next-gen web extension framework
- TypeScript - Type-safe development
- Manifest V3 - Latest Chrome extension standard

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Build for specific browser
npm run build:chrome
npm run build:firefox
```

## Privacy

Layer is **privacy-first**:

- ✅ Zero tracking or analytics
- ✅ All data stored locally in your browser
- ✅ No external network requests
- ✅ Open source - verify the code yourself

We only request the minimum permissions needed:

- `storage` - Save your boosts locally
- `activeTab` - Inject code into current tab
- `scripting` - Execute your custom CSS/JS

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Roadmap

- [ ] Visual element picker (click to hide elements)
- [ ] Import/export

## FAQ

**Q: How is this different from Stylus or Tampermonkey?**  
A: Layer is simpler and more focused. No complex user scripts, no community styles - just you and your code.

**Q: Does this work on Firefox?**  
A: Yes, it works on Firefox.

## License

MIT © Vadym Rusin

---

[Report Bug](https://github.com/thevrus/layer/issues) · [Request Feature](https://github.com/thevrus/layer/issues) · [Chrome Web Store](#)
