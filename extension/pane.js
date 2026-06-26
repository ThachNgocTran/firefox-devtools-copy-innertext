const display = document.getElementById("text-display");
const copyBtn = document.getElementById("copy-btn");
const feedback = document.getElementById("feedback");
const PLACEHOLDER = "(select a node)";

function isPaneVisible() {
  return document.body.getClientRects().length > 0;
}

function updateDisplay(text) {
  if (text === null || text === undefined) {
    display.textContent = PLACEHOLDER;
    display.className = "placeholder";
  } else {
    display.textContent = text;
    display.className = "";
  }
}

function showFeedback(msg) {
  feedback.textContent = msg;
  setTimeout(() => {
    if (feedback.textContent === msg) feedback.textContent = "";
  }, 1500);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function doExtract() {
  browser.devtools.inspectedWindow.eval("$0 ? $0.innerText : null").then(([result]) => {
    updateDisplay(result ?? null);
  });
}

function refreshFromStorage() {
  browser.storage.local.get("_copyInnerText").then(({ _copyInnerText }) => {
    if (_copyInnerText !== undefined) {
      updateDisplay(_copyInnerText);
    }
  });
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes._copyInnerText) {
    if (isPaneVisible()) {
      updateDisplay(changes._copyInnerText.newValue);
    }
  }
});

copyBtn.addEventListener("click", () => {
  browser.devtools.inspectedWindow.eval("$0 ? $0.innerText : ''").then(([result]) => {
    if (!result) {
      showFeedback("Nothing to copy");
      return;
    }
    copyToClipboard(result);
    showFeedback("Copied!");
  });
});

refreshFromStorage();
doExtract();
