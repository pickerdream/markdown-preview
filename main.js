const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { marked } = require('marked');
const TurndownService = require('turndown');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('markdown-to-html', (event, markdown) => {
  return marked(markdown);
});

ipcMain.handle('html-to-markdown', (event, html) => {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
});
