browser.devtools.panels.elements.createSidebarPane("innerText").then(pane => {
  pane.setPage("pane.html");
});

browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
  setTimeout(() => {
    browser.devtools.inspectedWindow.eval("$0 ? $0.innerText : null").then(([result]) => {
      browser.storage.local.set({ _copyInnerText: result ?? null });
    });
  }, 0);
});
