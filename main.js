const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

ipcMain.on("garageSwitch", (event) => {
	try {
		const gpio = require("onoff").Gpio;
		const doorPin = new gpio(4, "out");
		doorPin.writeSync(1);

		const flipSwitch = () => {
			doorPin.writeSync(0);
			setTimeout(() => doorPin.writeSync(1), 500);
		};

		flipSwitch();
	} catch (err) {
		console.error(err);
		event.sender.send("notSupportedPlatform", err);
	}
});

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1300,
		height: 750,
		icon: path.join(__dirname, "./src/template/icon.png"),
		show: false,
		darkTheme: true,
		fullscreen: true,
		autoHideMenuBar: true,
		webPreferences: { enableRemoteModule: true, nodeIntegration: true, contextIsolation: false }
	});

	let indexPath = "http://localhost:3000";
	if (process.env.NODE_ENV === "production") {
		indexPath = "file://" + path.join(__dirname, "dist", "index.html");
	}

	mainWindow.loadURL(indexPath);
	mainWindow.once("ready-to-show", () => mainWindow.show());
	mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", async () => createWindow());
// For sunrise and sunset times API. No SSL Certificate error.
app.commandLine.appendSwitch("ignore-certificate-errors");
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
