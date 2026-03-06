const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

// Bypass Chromium's GPU blocklist so WebGL2 works on systems with
// older or unrecognised GPU drivers (fixes "WebGL2 blocklisted" errors).
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-webgl");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the Vite-built frontend (run "npm run build" in frontend/ first)
  const indexPath = path.join(__dirname, "..", "frontend", "dist", "index.html");

  if (!fs.existsSync(indexPath)) {
    dialog.showErrorBox(
      "Frontend not built",
      "Could not find frontend/dist/index.html.\n\n" +
        'Run "npm run build" inside the frontend/ directory first.'
    );
    app.quit();
    return;
  }

  win.loadFile(indexPath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
