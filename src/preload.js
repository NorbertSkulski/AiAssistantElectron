const electron = require('electron');
const { contextBridge } = electron;
const clipboard = electron.clipboard;

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  getClipboardImage: () => {
    if (!clipboard) {
      console.error("Moduł clipboard nie jest dostępny w preload!");
      return null;
    }
    const img = clipboard.readImage();
    return img.isEmpty() ? null : img.toDataURL();
  },
  getClipboardText: () => clipboard.readText(),
  clearClipboard: () => clipboard.clear(),
})

contextBridge.exposeInMainWorld('env', {
  TEST: "test 123",
})
