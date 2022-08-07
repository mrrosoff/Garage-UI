import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("garageAPI", {
    garageSwitch: () => ipcRenderer.invoke("garageSwitch")
});
