import { app, shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import kill from 'tree-kill';
import icon from '../../resources/icon.png?asset';
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

let serverProcess; // Holds the reference to the backend process
let isBackendStarted = false; // Ensures the backend starts only once

function startBackendServer() {
  if (isBackendStarted) {
    console.log('Backend server already started.');
    return;
  }
  isBackendStarted = true;

  const exePath = path.join(__dirname, '../../../backend/app/dist/main/main.exe');
  const cwdPath = path.join(__dirname, '../../../backend/app/');
  const quotedExePath = `"${exePath}"`;

  console.log(`Starting backend server at path: ${exePath}`);

  serverProcess = exec(quotedExePath, { cwd: cwdPath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting FastAPI server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FastAPI stderr: ${stderr}`);
    }
    console.log(`FastAPI stdout: ${stdout}`);
  });

  serverProcess.stdout?.on('data', (data) => console.log(`FastAPI stdout: ${data}`));
  serverProcess.stderr?.on('data', (data) => console.error(`FastAPI stderr: ${data}`));
}

function stopBackendServer() {
  if (!isBackendStarted) {
    console.log('No backend server to stop.');
    return;
  }
  if (serverProcess) {
    console.log(`Attempting to stop backend server with PID: ${serverProcess.pid}`);
    kill(serverProcess.pid, 'SIGKILL', (err) => {
      if (err) {
        console.error(`Failed to kill server process: ${err.message}`);
      } else {
        console.log('Server process forcefully killed.');
        isBackendStarted = false;
        serverProcess = null; // Reset the serverProcess reference
      }
    });
  } else {
    console.log('No server process found.');
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    minWidth: 1920,
    minHeight: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    console.log('Main window closed. Stopping backend server...');
    stopBackendServer(); // Ensure backend process is stopped when the main window is closed
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && `${process.env['ELECTRON_RENDERER_URL']}`) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
}

app.whenReady().then(() => {
  if (!isBackendStarted) {
    startBackendServer();
  }

  // Set app user model id for Windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed. Stopping backend server...');
  if (process.platform !== 'darwin') {
    stopBackendServer(); // Ensure backend process is killed
    app.quit();
  }
});

app.on('will-quit', () => {
  console.log('App is quitting. Stopping backend server...');
  stopBackendServer(); // Cleanup backend on application quit
});
