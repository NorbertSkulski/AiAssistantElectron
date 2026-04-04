const {app, desktopCapturer, clipboard, screen, ipcMain, globalShortcut, BrowserWindow } = require('electron');

const path = require('path');

console.log("Ładowanie modułu snippedWindow...", __dirname);


const snippedWindow = () => {
// Funkcja przechwytująca ekran i wycinająca fragment
async function takeScreenshotToFile(area) {
    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().bounds // Pobieramy pełny wymiar
    });

    const primarySource = sources[0]; // Zazwyczaj pierwszy ekran
    const image = primarySource.thumbnail;

    // Wycinamy zaznaczony obszar (crop)
    // area = { x, y, width, height }
    const cropped = image.crop(area);

    // Ścieżka zapisu (np. na Pulpicie)
    const filePath = path.join(app.getPath('desktop'), `screenshot_${Date.now()}.png`);

    fs.writeFile(filePath, cropped.toPNG(), (err) => {
        if (err) console.error('Błąd zapisu:', err);
        else console.log(`Zapisano pomyślnie: ${filePath}`);
    });
}

// Funkcja przechwytująca ekran i wycinająca fragment
async function copyScreenshotToClipboard(area) {
    try {
        // 1. Pobieramy źródła obrazu
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: screen.getPrimaryDisplay().bounds
        });

        const primarySource = sources[0];
        const image = primarySource.thumbnail;

        // 2. Uwzględnienie skali ekranu (High DPI / Retina)
        // Jeśli masz skalowanie systemowe (np. 125% lub 150%), 
        // musimy przeliczyć współrzędne, aby wycięcie było precyzyjne.
        const scaleFactor = screen.getPrimaryDisplay().scaleFactor;

        const cropped = image.crop({
            x: Math.round(area.x * scaleFactor),
            y: Math.round(area.y * scaleFactor),
            width: Math.round(area.width * scaleFactor),
            height: Math.round(area.height * scaleFactor)
        });

        // 3. Kopiowanie do schowka
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
    snippetWindow.hide(); // Ukrywamy okno wyboru przed zrobieniem zdjęcia

    // Małe opóźnienie, aby okno zdążyło zniknąć z kadru
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