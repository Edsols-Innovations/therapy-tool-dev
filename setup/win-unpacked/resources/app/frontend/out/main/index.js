"use strict";
const electron = require("electron");
const path$1 = require("path");
const utils = require("@electron-toolkit/utils");
const kill = require("tree-kill");
const icon = path$1.join(__dirname, "../../resources/icon.png");
const path = require("path");
const { exec } = require("child_process");
const url = require("url");
let serverProcess;
let isBackendStarted = false;
function startBackendServer() {
  if (isBackendStarted) {
    console.log("Backend server already started.");
    return;
  }
  isBackendStarted = true;
  const exePath = path.join(__dirname, "../../../backend/app/dist/main/main.exe");
  const cwdPath = path.join(__dirname, "../../../backend/app/");
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
  serverProcess.stdout?.on("data", (data) => console.log(`FastAPI stdout: ${data}`));
  serverProcess.stderr?.on("data", (data) => console.error(`FastAPI stderr: ${data}`));
}
function stopBackendServer() {
  if (!isBackendStarted) {
    console.log("No backend server to stop.");
    return;
  }
  if (serverProcess) {
    console.log(`Attempting to stop backend server with PID: ${serverProcess.pid}`);
    kill(serverProcess.pid, "SIGKILL", (err) => {
      if (err) {
        console.error(`Failed to kill server process: ${err.message}`);
      } else {
        console.log("Server process forcefully killed.");
        isBackendStarted = false;
        serverProcess = null;
      }
    });
  } else {
    console.log("No server process found.");
  }
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    minWidth: 1920,
    minHeight: 1080,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path$1.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true
    }
  });
  mainWindow.maximize();
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.on("closed", () => {
    console.log("Main window closed. Stopping backend server...");
    stopBackendServer();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && `${process.env["ELECTRON_RENDERER_URL"]}`) {
    mainWindow.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../renderer/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
}
electron.app.whenReady().then(() => {
  if (!isBackendStarted) {
    startBackendServer();
  }
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  console.log("All windows closed. Stopping backend server...");
  if (process.platform !== "darwin") {
    stopBackendServer();
    electron.app.quit();
  }
});
electron.app.on("will-quit", () => {
  console.log("App is quitting. Stopping backend server...");
  stopBackendServer();
});
