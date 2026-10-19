import { app, ipcMain, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import { Gpio } from "onoff";
import { RelayWiring } from "../src/vite-env";

let mainWindow: BrowserWindow | undefined;

// Kernels 6.6+ number the Pi's sysfs GPIO lines from the chip's base (e.g. 512) instead of 0
const getGpioBase = (): number => {
    try {
        for (const chip of fs.readdirSync("/sys/class/gpio")) {
            if (!chip.startsWith("gpiochip")) continue;
            const label = fs.readFileSync(`/sys/class/gpio/${chip}/label`, "utf8");
            if (/^pinctrl-(bcm|rp1)/.test(label)) {
                return Number(fs.readFileSync(`/sys/class/gpio/${chip}/base`, "utf8"));
            }
        }
    } catch {
        // Not a Raspberry Pi
    }
    return 0;
};

const gpioBase = getGpioBase();

const garageSwitch = (
    _event: any,
    relayWiring: RelayWiring = "forward",
    relayPin: number = 4
): boolean => {
    const relayOn = 1;
    const relayOff = 0;
    const relayDirection = relayWiring === "forward";

    try {
        // Accept either the BCM pin number (4) or the already-offset sysfs number (516)
        const doorPin = new Gpio(relayPin < gpioBase ? relayPin + gpioBase : relayPin, "out");
        doorPin.writeSync(relayDirection ? relayOff : relayOn);

        const flipSwitch = () => {
            doorPin.writeSync(relayDirection ? relayOn : relayOff);
            setTimeout(() => doorPin.writeSync(relayDirection ? relayOff : relayOn), 500);
        };

        flipSwitch();
        return true;
    } catch (err) {
        console.log("Unsupported Platform Or Unknown Error Occurred", err);
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
    mainWindow.once("ready-to-show", () => mainWindow?.show());
    mainWindow.on("closed", () => (mainWindow = undefined));
}

app.on("ready", () => {
    ipcMain.handle("garageSwitch", garageSwitch);
    createWindow();
});
app.commandLine.appendSwitch("disable-gpu-rasterization");
app.commandLine.appendSwitch("disable-zero-copy");

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (!mainWindow) createWindow();
});
