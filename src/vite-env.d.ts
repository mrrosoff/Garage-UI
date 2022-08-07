/// <reference types="vite/client" />
export type RelayWiring = "forward" | "backward" | undefined;

interface ImportMetaEnv {
    readonly VITE_LATITUDE: number;
    readonly VITE_LONGITUDE: number;
    readonly VITE_STATE: string;
    readonly VITE_CITY: string;
    readonly VITE_ZIP_CODE: number;
    readonly VITE_NOAA_STATION: number;
    readonly VITE_TIME_INTERVAL: number;
    readonly VITE_OPEN_WEATHER_MAP_ID: string;
    readonly VITE_OPEN_UV_API_TOKEN: string;
    readonly VITE_SURF_SPOT_ONE_ID: string;
    readonly VITE_SURF_SPOT_ONE_NAME: string;
    readonly VITE_SURF_SPOT_TWO_ID: string;
    readonly VITE_SURF_SPOT_TWO_NAME: string;
    readonly VITE_SURF_SPOT_THREE_ID: string;
    readonly VITE_SURF_SPOT_THREE_NAME: string;
    readonly VITE_RELAY_DIRECTION: RelayWiring;
    readonly VITE_RELAY_PIN: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
declare global {
    interface Window {
        readonly garageAPI: {
            garageSwitch(relayWiring: RelayWiring, relayPin: number): boolean;
        };
    }
}
