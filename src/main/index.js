"use strict";

import { app, Tray, nativeTheme, Menu, nativeImage, shell, dialog } from "electron";
import { autoUpdater } from "electron-updater";

import log from "electron-log";
import { menubar } from "menubar";

const base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAGAAAAABAAAAYAAAAAEAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAAHWfLmAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzI8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CkUuZIEAAAGESURBVDgRjZM9SkNBEMfz8kjMDSyMaIo0QcFC5OkBJIViY+MlgjdJ0HgABTsLFQUhBxA7sQsqguIRFFLo8/fftxNHieDAj/nY2dmv2VIJyfO8LC3BzqAP92AiW7GsyHJzCIbJ6Cp0weQD4yki20Q51bhYsbACcBkzXtEdaEIK5WgrpjGJckORsCOcnqLINdTdNhfwV5xfjzmovGuT1+Qhqu4nz+HfwgvoXmzbKmI7yXRpByDpuJXm8Z/hGPbgHbbduI4j6avAA+iSGi6hjT+CGcXQs7/GG/ifMNSgRM9UcwWm8M/gDU5gKRZKo64Re4Tv93eT0yRJRrBFbAdU+IbcdWLaaWK5QROYdIQN4m1LxB7AofPHR1AjXIH0piWgp0FvfQT72MtwASbanXYy0B389YyLjN2BnnEV7Pw/n1ElGfSNFG4+xluMafUg2JqsZpMUjaQRHLXyuaKImsRaWW2cQBN2wRroFLtiVe0zVQj+9zOFyeSPP1NhFLux7zwkwUT2xO/8BVIyZOBoppyqAAAAAElFTkSuQmCC`;
const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;

if (process.env.NODE_ENV === "production") {
  Object.assign(console, log.functions);
}

console.log("Starting env:", process.env.NODE_ENV);

app.once("ready", () => {
  app.setAsDefaultProtocolClient("balancebar");

  if (process.env.NODE_ENV === "production") {
    console.log("Automatically checking for updates");
    autoUpdater.checkForUpdates();
  }

  const icon = nativeImage.createFromDataURL(base64Icon);
  const tray = new Tray(icon);

  tray.setIgnoreDoubleClickEvents(true);
  tray.setToolTip("Balances");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Home",
      type: "normal",
      click: () => {
        mb.window.webContents.send("goto-home");
        mb.showWindow();
      },
    },
    {
      label: "Refresh",
      type: "normal",
      click: () => {
        mb.window.webContents.send("refresh");
        mb.showWindow();
      },
    },
    {
      label: "Manage Connections",
      type: "normal",
      click: () => {
        mb.window.webContents.send("goto-connections");
        mb.showWindow();
      },
    },
    {
      label: "Full Reset",
      type: "normal",
      click: () => {
        mb.window.webContents.send("reset");
        mb.window.loadURL(winURL);
        mb.showWindow();
      },
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        mb.app.quit();
      },
    },
    {
      type: "separator",
    },
    {
      label: `Version: ${app.getVersion()}`,
      type: "normal",
      click: () => {
        autoUpdater.checkForUpdates();
        console.log("Checking for updates");
      },
    },
  ]);

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });

  nativeTheme.themeSource = "system";

  const mb = menubar({
    tray,
    index: winURL,
    preloadWindow: true,
    browserWindow: {
      width: 400,
      minWidth: 400,
      maxWidth: 400,
      height: 700,
      minHeight: 700,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
      },
    },
  });

  mb.app.on("open-url", function (event, data) {
    event.preventDefault();

    mb.window.webContents.send("handle-oauth", data);
    mb.showWindow();
  });

  mb.on("after-create-window", () => {
    mb.app.dock.hide();
  });
});

autoUpdater.on("update-available", () => {
  console.log("Update available");

  const dialogOpts = {
    type: "info",
    buttons: ["Download", "Maybe Later"],
    title: "Balance Bar Update Available",
    message: "A new version of Balance Bar is available, do you want to download it?",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      shell.openExternal("https://github.com/scottrobertson/balancebar/releases/latest");
    }
  });
});

autoUpdater.on("update-not-available", () => {
  console.log("No update available");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded");
});
