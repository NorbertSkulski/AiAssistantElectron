const { app, BrowserWindow, globalShortcut,Menu, ipcMain } = require('electron');
const path = require('path');
const { snippedWindow } = require('./snippet');

let win;
// Menu.setApplicationMenu(null);

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('src/scenes/homeScene.html')   
    win.setContentProtection(true);
}



app.on('ready', () => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

snippedWindow();