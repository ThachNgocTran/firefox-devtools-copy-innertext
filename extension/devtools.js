let paneActive = false;

browser.devtools.panels.elements.createSidebarPane("innerText").then(pane => {
  pane.setPage("pane.html");

  pane.onShown.addListener(() => {
    paneActive = true;
    browser.devtools.inspectedWindow.eval("$0 ? $0.innerText : null").then(([result]) => {
      browser.storage.local.set({ _copyInnerText: result ?? null });
    });
  });

  pane.onHidden.addListener(() => {
    paneActive = false;
  });
});

browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
  if (!paneActive) return;
  console.log(new Date().toISOString().slice(0, 19).replace("T", " "), "[Copy innerText] selection changed, extracting innerText");
  setTimeout(() => {
    browser.devtools.inspectedWindow.eval("$0 ? $0.innerText : null").then(([result]) => {
      browser.storage.local.set({ _copyInnerText: result ?? null });
    });
  }, 0);
});
