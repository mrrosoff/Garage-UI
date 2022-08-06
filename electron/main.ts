import { app, ipcMain, BrowserWindow } from "electron";
import path from "path";
import { Gpio } from "onoff";

let mainWindow;

const garageSwitch = (): boolean => {
    console.log("here");

    try {
        const doorPin = new Gpio(4, "out");
        doorPin.writeSync(1);

        const flipSwitch = () => {
            doorPin.writeSync(0);
            setTimeout(() => doorPin.writeSync(1), 500);
        };

        flipSwitch();
        return true;
    } catch (err) {
        return false;
    }
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 750,
        show: false,
        darkTheme: true,
        fullscreen: process.env.NODE_ENV === "production",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    let indexPath = "http://localhost:3000";
    if (process.env.NODE_ENV === "production") {
        indexPath = "file://" + path.join(__dirname, "dist", "index.html");
    }

    mainWindow.loadURL(indexPath);
    mainWindow.once("ready-to-show", () => mainWindow.show());
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
    ipcMain.handle("garageSwitch", garageSwitch);
    createWindow();
});
// For sunrise and sunset times API. No SSL Certificate error.
app.commandLine.appendSwitch("ignore-certificate-errors");
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (mainWindow === null) createWindow();
});
