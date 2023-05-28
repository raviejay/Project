const { app, BrowserWindow, ipcMain } = require('electron');
const { Client } = require('pg');
const path = require('path');

const isDev = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

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

ipcMain.on('executeQuery', async (event) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Sample',
    password: 'puspus',
    port: 5432,
  });

  try {
    await client.connect();
    const query = 'SELECT * FROM Student';
    const res = await client.query(query);
    event.reply('queryResult', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
});
