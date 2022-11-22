/// <reference types="vite/client" />
export type RelayWiring = "forward" | "backward" | undefined;

interface ImportMetaEnv {
    readonly VITE_LATITUDE: number;
    readonly VITE_LONGITUDE: number;
    readonly VITE_NOAA_STATION: number;
    readonly VITE_TIME_INTERVAL: number;
    readonly VITE_SKI_RESORT_ID: number;
    readonly VITE_RELAY_DIRECTION: RelayWiring;
    readonly VITE_RELAY_PIN: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
