import { app, ipcMain, BrowserWindow } from "electron";
import path from "path";
import { Gpio } from "onoff";
import { RelayWiring } from "../src/vite-env";

let mainWindow;

const garageSwitch = (
    _event: any,
    relayWiring: RelayWiring = "forward",
    relayPin: number = 4
): boolean => {
    const relayOn = 1;
    const relayOff = 0;
    const relayDirection = relayWiring === "forward";

    try {
        const doorPin = new Gpio(relayPin, "out");
        doorPin.writeSync(relayDirection ? relayOff : relayOn);

        const flipSwitch = () => {
            doorPin.writeSync(relayDirection ? relayOn : relayOff);
            setTimeout(() => doorPin.writeSync(relayDirection ? relayOff : relayOn), 500);
        };

        flipSwitch();
        return true;
    } catch (err) {
        console.log("Unsupported Platform Or Unknown Error Occured");
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
            preload: path.join(__dirname, "preload.js")
        }
    });

    let indexPath = "http://localhost:3000";
    if (process.env.NODE_ENV === "production") {
        indexPath = "file://" + path.join(__dirname, "..", "index.html");
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
