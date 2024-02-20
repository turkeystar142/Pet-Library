const express = require('express');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  const server = express();
  server.use(express.static(path.join(__dirname, 'docs')));
  server.listen(4200);

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      protocol: 'http:',
      hostname: 'localhost',
      port: 4200,
      pathname: 'index.html',
      slashes: true,
    })
  );
}

app.whenReady().then(createWindow);