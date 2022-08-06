const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("garageAPI", {
    garageSwitch: () => ipcRenderer.invoke("garageSwitch")
});
