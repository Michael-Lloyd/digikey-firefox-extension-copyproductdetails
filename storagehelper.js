function getSelectedMode() {
  return browser.storage.local.get("selectedMode")
    .then(({ selectedMode }) => selectedMode);
}
