# Copy innerText — Firefox DevTools Extension

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

The display updates automatically as you select different nodes. See the [Open Issues](#open-issues) section for known limitations.

## Files

```
extension/
├── manifest.json         # Extension manifest (MV2)
├── devtools-page.html    # DevTools page entry point
├── devtools.js           # Creates sidebar pane, extracts $0.innerText
├── pane.html             # Sidebar pane UI
├── pane.js               # Display update, clipboard copy, visibility detection
└── icons/
    └── icon.svg          # Extension icon
```

## Open Issues

### Extraction runs on every node click regardless of active sidebar tab

`devtools.js` listens to `onSelectionChanged` and evaluates `$0.innerText` on **every** node click in the DOM tree, regardless of whether the "innerText" sidebar tab is currently active. The evaluation is a layout-triggering read (`innerText` forces style recalc on the inspected page).

**Attempted fix**: We tried to skip extraction when the tab is hidden by:
1. Using `ExtensionSidebarPane.onShown`/`onHidden` events — these are **not supported** on `ExtensionSidebarPane` in Firefox (only on `ExtensionPanel`).
2. Having `pane.js` poll visibility and set a `_paneVisible` flag in `storage.local` for `devtools.js` to check — this added fragile inter-page state synchronization.

**Current behavior**: Extraction always runs on every selection change. `pane.js` gates only the UI update with `getClientRects()` — the DOM is updated silently even when hidden, but has no visual impact.

**To truly fix**: The Firefox WebExtensions API lacks a way to query whether a specific sidebar tab is active. A reliable solution would require Firefox to expose an `isSelected` property or `onSelected`/`onDeselected` events on `ExtensionSidebarPane`.

## How it works

- `devtools.js` listens for node selection changes (`onSelectionChanged`), evaluates `$0.innerText` in the inspected page, and stores the result in `storage.local`.
- `pane.js` reads from `storage.local` and updates the display. It only updates the UI when the pane tab is actually visible (detected via `getClientRects()`).
- The **Copy** button does a fresh `eval()` to get the absolute latest text (handles DOM mutations since selection).

## License

MPL-2.0
