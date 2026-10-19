import { RelayWiring } from "./vite-env";

const env = import.meta.env;

const parseBoolean = (value?: string) => ["true", "1", "yes"].includes(value?.toLowerCase() ?? "");

const parseNumber = (value?: string) => {
    const number = Number(value);
    return value && !Number.isNaN(number) ? number : undefined;
};

export interface SurfSpot {
    id: string;
    name: string;
}

const surfSpots: SurfSpot[] = [
    { id: env.VITE_SURF_SPOT_ONE_ID, name: env.VITE_SURF_SPOT_ONE_NAME },
    { id: env.VITE_SURF_SPOT_TWO_ID, name: env.VITE_SURF_SPOT_TWO_NAME },
    { id: env.VITE_SURF_SPOT_THREE_ID, name: env.VITE_SURF_SPOT_THREE_NAME },
    { id: env.VITE_SURF_SPOT_FOUR_ID, name: env.VITE_SURF_SPOT_FOUR_NAME }
].filter((spot): spot is SurfSpot => !!spot.id && !!spot.name);

// Hours of the day (0-23) to refresh surf conditions, e.g. "6,14"
const parseHours = (value?: string) => {
    const hours = (value ?? "")
        .split(",")
        .map((hour) => parseNumber(hour.trim()))
        .filter((hour): hour is number => hour !== undefined && hour >= 0 && hour <= 23);
    return hours.length > 0 ? hours : [6];
};

const timeInterval = parseNumber(env.VITE_TIME_INTERVAL);
if (!timeInterval) {
    throw new Error("Missing .env File. Please Refer to README.md");
}

const config = {
    latitude: env.VITE_LATITUDE,
    longitude: env.VITE_LONGITUDE,
    zipCode: env.VITE_ZIP_CODE,
    noaaStation: env.VITE_NOAA_STATION,
    timeInterval,
    openWeatherMapId: env.VITE_OPEN_WEATHER_MAP_ID,
    surfSpots,
    parseApiKey: env.VITE_PARSE_API_KEY,
    surfRefreshHours: parseHours(env.VITE_SURF_REFRESH_HOURS),
    relayWiring: env.VITE_RELAY_DIRECTION as RelayWiring,
    relayPin: parseNumber(env.VITE_RELAY_PIN),
    showGarageButton: parseBoolean(env.VITE_SHOW_GARAGE_BUTTON),
    flipDisplay: parseBoolean(env.VITE_FLIP_DISPLAY)
};

export default config;
