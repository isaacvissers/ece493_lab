export const editorAccessibility = {
  focusFirstItem(container, selector) {
    const item = container.querySelector(selector);
    if (item) {
      item.focus();
      return true;
    }
    return false;
  },
};
