/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LATITUDE: number;
    readonly VITE_LONGITUDE: number;
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
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    readonly garageAPI: {
        garageSwitch(): boolean;
    };
}
