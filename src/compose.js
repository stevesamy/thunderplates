browser.runtime.onMessage.addListener((message) => {
  if (message.command === 'insertTemplate') {
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) {
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const frag = range.createContextualFragment(message.html);
    range.insertNode(frag);
    // Move cursor to the end of the inserted content
    sel.collapseToEnd();
  }
});
