/// <reference types="vite/client" />
export type RelayWiring = "forward" | "backward" | undefined;

// Vite exposes every env var as a string. Parse them through src/config.ts instead of reading these directly.
interface ImportMetaEnv {
    readonly VITE_LATITUDE?: string;
    readonly VITE_LONGITUDE?: string;
    readonly VITE_ZIP_CODE?: string;
    readonly VITE_NOAA_STATION?: string;
    readonly VITE_TIME_INTERVAL?: string;
    readonly VITE_OPEN_WEATHER_MAP_ID?: string;
    readonly VITE_SURF_SPOT_ONE_ID?: string;
    readonly VITE_SURF_SPOT_ONE_NAME?: string;
    readonly VITE_SURF_SPOT_TWO_ID?: string;
    readonly VITE_SURF_SPOT_TWO_NAME?: string;
    readonly VITE_SURF_SPOT_THREE_ID?: string;
    readonly VITE_SURF_SPOT_THREE_NAME?: string;
    readonly VITE_SURF_SPOT_FOUR_ID?: string;
    readonly VITE_SURF_SPOT_FOUR_NAME?: string;
    readonly VITE_RELAY_DIRECTION?: string;
    readonly VITE_RELAY_PIN?: string;
    readonly VITE_SHOW_GARAGE_BUTTON?: string;
    readonly VITE_FLIP_DISPLAY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
declare global {
    interface Window {
        readonly garageAPI: {
            garageSwitch(relayWiring: RelayWiring, relayPin: number | undefined): Promise<boolean>;
        };
    }
}
