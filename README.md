# Copy DOM innerText — Firefox DevTools Extension

Adds an **"innerText"** tab to the Inspector sidebar showing the rendered text of the currently selected DOM node. Click **Copy innerText** to copy it to clipboard.

## Installation (temporary)

1. Open Firefox and go to `about:debugging`
2. Click **This Firefox** → **Load Temporary Add-on...**
3. Select `extension/manifest.json`

## Usage

1. Open DevTools (F12) → **Inspector** tab
2. Click a node in the DOM tree
3. Switch to the **"innerText"** tab in the right sidebar
4. See the rendered text of the selected node
5. Click **Copy innerText** to copy it to clipboard

The display updates automatically as you select different nodes.

## Files

```
extension/
├── manifest.json         # Extension manifest (MV2)
├── devtools-page.html    # DevTools page entry point
├── devtools.js           # Creates sidebar pane, extracts $0.innerText (skipped when tab hidden)
├── pane.html             # Sidebar pane UI
├── pane.js               # Display update, clipboard copy, visibility detection
└── icons/
    └── icon.svg          # Extension icon
```

## Performance

Extraction uses `ExtensionSidebarPane.onShown`/`onHidden` events (supported since Firefox 57) to gate on the active tab. When the "innerText" tab is hidden, `$0.innerText` is never evaluated — avoiding the layout-triggering style recalc on the inspected page. A timestamped `console.log` is emitted in the Browser Console whenever extraction does run.

## How it works

- `devtools.js` listens for node selection changes (`onSelectionChanged`). When the "innerText" tab is active (`paneActive === true`), it evaluates `$0.innerText` in the inspected page and stores the result in `storage.local`. When hidden, extraction is skipped entirely.
- `pane.js` reads from `storage.local` and updates the display. It only updates the UI when the pane tab is actually visible (detected via `getClientRects()`).
- The **Copy** button does a fresh `eval()` to get the absolute latest text (handles DOM mutations since selection).
- Open the **Browser Console** (`Ctrl+Shift+J`) to see debug output: `YYYY-MM-DD HH:mm:ss [Copy innerText] selection changed, extracting innerText`

## License

MIT

## Tested on

- Windows 10 x64
- Firefox 152 x64
