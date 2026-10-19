import axios from "axios";
import { DateTime } from "luxon";

import config, { SurfSpot } from "./config";

// Surfline blocks direct API calls, so conditions come through parse.bot, which charges a
// credit per request. Results are cached in localStorage and only refreshed at the scheduled
// hours, so restarts and the regular refresh interval don't spend credits.

const parseAPI =
    "https://api.parse.bot/scraper/ee8dc746-3f62-4465-8b17-cc5d8c44a178/get_current_conditions";
const CACHE_KEY = "surfConditions";
const RETRY_AFTER_MS = 60 * 60 * 1000;

export interface SurfConditions {
    name: string;
    minHeight: number;
    maxHeight: number;
    fetchedAt: number;
}

interface SurfCache {
    spots: Record<string, SurfConditions>;
    lastAttemptAt: number;
}

const readCache = (): SurfCache => {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
        if (cache?.spots) return cache;
    } catch {
        // Fall through to an empty cache
    }
    return { spots: {}, lastAttemptAt: 0 };
};

const writeCache = (cache: SurfCache) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Failed to save surf conditions:", error);
    }
};

// The most recent scheduled refresh time at or before now
const lastScheduledRefresh = (now = DateTime.now()) => {
    const times = config.surfRefreshHours.flatMap((hour) => {
        const today = now.startOf("day").set({ hour });
        return [today, today.minus({ days: 1 })];
    });
    return Math.max(...times.filter((time) => time <= now).map((time) => time.toMillis()));
};

const fetchSpot = async (spot: SurfSpot): Promise<SurfConditions> => {
    const { data } = await axios.get(`${parseAPI}?spot_id=${spot.id}`, {
        headers: { "X-API-Key": config.parseApiKey },
        timeout: 60000
    });
    const waveHeight = data?.data?.waveHeight;
    if (typeof waveHeight?.min !== "number" || typeof waveHeight?.max !== "number") {
        throw new Error(`Unexpected response for ${spot.name}`);
    }
    return {
        name: spot.name,
        minHeight: waveHeight.min,
        maxHeight: waveHeight.max,
        fetchedAt: Date.now()
    };
};

let refreshInFlight = false;
let warnedMissingKey = false;

/** Returns cached conditions, fetching stale spots first if a scheduled refresh is due. */
export const getSurfConditions = async (): Promise<(SurfConditions | undefined)[]> => {
    const cache = readCache();
    const refreshDue = lastScheduledRefresh();
    const staleSpots = config.surfSpots.filter(
        (spot) => (cache.spots[spot.id]?.fetchedAt ?? 0) < refreshDue
    );
    const canRetry = Date.now() - cache.lastAttemptAt > RETRY_AFTER_MS;

    if (staleSpots.length > 0 && canRetry && !refreshInFlight && config.parseApiKey) {
        refreshInFlight = true;
        try {
            cache.lastAttemptAt = Date.now();
            writeCache(cache);

            const results = await Promise.allSettled(staleSpots.map(fetchSpot));
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    cache.spots[staleSpots[index].id] = result.value;
                } else {
                    console.error(
                        `Failed to fetch surf for ${staleSpots[index].name}:`,
                        result.reason
                    );
                }
            });
            // Only back off when something failed
            if (results.every((result) => result.status === "fulfilled")) {
                cache.lastAttemptAt = 0;
            }
            writeCache(cache);
        } finally {
            refreshInFlight = false;
        }
    } else if (!config.parseApiKey && !warnedMissingKey) {
        warnedMissingKey = true;
        console.error("Missing VITE_PARSE_API_KEY, so surf conditions can't be fetched");
    }

    return config.surfSpots.map((spot) => cache.spots[spot.id]);
};
