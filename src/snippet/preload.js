const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
    sendAreaSelected: (data) => ipcRenderer.send('area-selected', data)
});