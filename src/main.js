const { app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');
const path = require('path');
const { snippedWindow } = require('./snippet');

let win;
let tray;
// Menu.setApplicationMenu(null);
const isDev = process.env.NODE_ENV === 'development';
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, "..", 'dist/index.html'));
    }

    // win.setContentProtection(true);

    win.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault(); 
            win.hide();      
        }
    });
}


app.on('ready', () => {
    createWindow();

    const iconPath = path.join(__dirname, 'icon.png');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Pokaż aplikację', click: () => win.show() },
        { type: 'separator' },
        {
            label: 'Zamknij całkowicie',
            click: () => {
                app.isQuitting = true; 
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Moja aplikacja w tle');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show();
    });
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