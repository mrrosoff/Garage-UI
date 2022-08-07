import { contextBridge, ipcRenderer } from "electron";
import { RelayWiring } from "../src/vite-env";

contextBridge.exposeInMainWorld("garageAPI", {
    garageSwitch: (relayWiring: RelayWiring, relayPin: number) =>
        ipcRenderer.invoke("garageSwitch", relayWiring, relayPin)
});
