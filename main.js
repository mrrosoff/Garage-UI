const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

exports.garageSwitch = () => {
	let gpio = require("onoff").Gpio;
	let doorPin = new gpio(4, "out");
	doorPin.writeSync(1);

	const flipSwitch = () => {
		doorPin.writeSync(0);
		setTimeout(() => doorPin.writeSync(1), 500);
	};

	flipSwitch();
};

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

	let indexPath;

	if (process.env.NODE_ENV === "production") {
		indexPath ="file://" + path.join(__dirname, "dist", "index.html");
	} else {
		indexPath = "http://localhost:3000";
	}

	mainWindow.loadURL(indexPath);
	mainWindow.once("ready-to-show", () => mainWindow.show());
	mainWindow.on("closed", () => mainWindow = null);
}

app.on("ready", async () => createWindow());

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
