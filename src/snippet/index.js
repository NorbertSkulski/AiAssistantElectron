const { app, desktopCapturer, clipboard, screen, ipcMain, globalShortcut, BrowserWindow } = require('electron');

const path = require('path');

console.log("Ładowanie modułu snippedWindow...", __dirname);


const snippedWindow = () => {
    async function takeScreenshotToFile(area) {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: screen.getPrimaryDisplay().bounds
        });

        const primarySource = sources[0];
        const image = primarySource.thumbnail;


        const cropped = image.crop(area);

        const filePath = path.join(app.getPath('desktop'), `screenshot_${Date.now()}.png`);

        fs.writeFile(filePath, cropped.toPNG(), (err) => {
            if (err) console.error('Błąd zapisu:', err);
            else console.log(`Zapisano pomyślnie: ${filePath}`);
        });
    }

    async function copyScreenshotToClipboard(area) {
        try {
            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: screen.getPrimaryDisplay().bounds
            });

            const primarySource = sources[0];
            const image = primarySource.thumbnail;


            const scaleFactor = screen.getPrimaryDisplay().scaleFactor;

            const cropped = image.crop({
                x: Math.round(area.x * scaleFactor),
                y: Math.round(area.y * scaleFactor),
                width: Math.round(area.width * scaleFactor),
                height: Math.round(area.height * scaleFactor)
            });

            clipboard.writeImage(cropped);

            console.log("Obraz został skopiowany do schowka!");
        } catch (err) {
            console.error("Błąd podczas kopiowania:", err);
        }
    }

    let snippetWindow;

    function createSnippetWindow() {
        const { width, height } = screen.getPrimaryDisplay().bounds;
        snippetWindow = new BrowserWindow({
            width,
            height,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            fullscreen: true,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            fullscreenable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        snippetWindow.loadFile('src/snippet/index.html');
    }

    app.whenReady().then(() => {
        globalShortcut.register('Alt+P', () => {
            if (!snippetWindow) createSnippetWindow();
        });
    });

    ipcMain.on('area-selected', (event, area) => {
        snippetWindow.hide(); 

        setTimeout(async () => {
            await copyScreenshotToClipboard(area);
            snippetWindow.close();
            snippetWindow = null;
        }, 100);
    });

}

module.exports = {
    snippedWindow
}