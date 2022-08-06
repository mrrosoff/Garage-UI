import { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import axios from "axios";
import { DateTime } from "luxon";

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

interface SpecialDay {
    emoji: string;
    text: string;
    date: DateTime;
}

const formatString = "MM-dd";

const specialDays: SpecialDay[] = [
    { date: DateTime.fromFormat("01-01", formatString), text: "Happy New Year", emoji: "🎉" },
    { date: DateTime.fromFormat("02-14", formatString), text: "Happy Valentines Day", emoji: "💖" },
    { date: DateTime.fromFormat("05-16", formatString), text: "Happy Birthday Max", emoji: "🎉" },
    { date: DateTime.fromFormat("05-24", formatString), text: "Happy Birthday Jaden", emoji: "🎉" },
    { date: DateTime.fromFormat("07-04", formatString), text: "Happy Forth Of July", emoji: "🇺🇸" },
    {
        date: DateTime.fromFormat("07-19", formatString),
        text: "Happy Birthday Mother",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("10-31", formatString), text: "Happy Halloween", emoji: "🎃" },
    { date: DateTime.fromFormat("12-17", formatString), text: "Happy Birthday Jack", emoji: "🎉" }
];

const DashBoard = () => {
    const {
        VITE_TIME_INTERVAL,
        VITE_LATITUDE,
        VITE_LONGITUDE,
        VITE_ZIP_CODE,
        VITE_NOAA_STATION,
        VITE_OPEN_WEATHER_MAP_ID,
        VITE_OPEN_UV_API_TOKEN,
        VITE_SURF_SPOT_ONE_ID,
        VITE_SURF_SPOT_ONE_NAME,
        VITE_SURF_SPOT_TWO_ID,
        VITE_SURF_SPOT_TWO_NAME,
        VITE_SURF_SPOT_THREE_ID,
        VITE_SURF_SPOT_THREE_NAME
    } = import.meta.env;

    const openWeatherMapAPI = "https://api.openweathermap.org/data/2.5/weather";
    const openUVAPI = "https://api.openuv.io/api/v1/uv";
    const noaaAPI = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const surfAPI = "https://services.surfline.com/kbyg/spots/forecasts";

    const weatherData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${openWeatherMapAPI}?zip=${VITE_ZIP_CODE}&units=imperial&appid=${VITE_OPEN_WEATHER_MAP_ID}`
    );

    const uvIndex = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${openUVAPI}?lat=${VITE_LATITUDE}&lng=${VITE_LONGITUDE}`,
        { "x-access-token": VITE_OPEN_UV_API_TOKEN }
    );
    const tidePredictionData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${noaaAPI}?date=today&station=${VITE_NOAA_STATION}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );
    const tideActualData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${noaaAPI}?date=today&station=${VITE_NOAA_STATION}&product=one_minute_water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );
    const waterTemperature = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${noaaAPI}?date=latest&station=${VITE_NOAA_STATION}&product=water_temperature&units=english&time_zone=lst_ldt&format=json`
    );

    const [surfData, setSurfData] = useState<any>([]);
    const [specialDay, setSpecialDay] = useState<SpecialDay>();

    useEffect(() => {
        const getSurfFromAPI = async () => {
            const blacksResp = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_ONE_ID}&days=1&intervalHours=1&maxHeights=true`
            );
            const fifteenthResp = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_TWO_ID}&days=1&intervalHours=1&maxHeights=true`
            );
            const beaconsResp = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_THREE_ID}&days=1&intervalHours=1&maxHeights=true`
            );

            setSurfDataWithSplice(blacksResp, VITE_SURF_SPOT_ONE_NAME, 0, setSurfData);
            setSurfDataWithSplice(fifteenthResp, VITE_SURF_SPOT_TWO_NAME, 1, setSurfData);
            setSurfDataWithSplice(beaconsResp, VITE_SURF_SPOT_THREE_NAME, 2, setSurfData);
        };

        getSurfFromAPI();
        const interval = setInterval(getSurfFromAPI, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getSpecialDay = async () => {
            const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
            if (specialDay) {
                setSpecialDay(specialDay);
            }
        };

        const interval = setInterval(getSpecialDay, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box height={"100%"} p={3}>
            <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                <Box width={"33.33%"} height={"100%"} paddingRight={3}>
                    <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 3 }}>
                        <SideBar specialDay={specialDay} />
                    </Paper>
                </Box>
                <Box width={"66.66%"} height={"100%"}>
                    <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 3 }}>
                        <Box
                            width={"100%"}
                            height={"100%"}
                            display={"flex"}
                            flexDirection={"column"}
                        >
                            <Box display={"flex"}>
                                <Box>
                                    <WeatherCard
                                        weatherData={weatherData}
                                        uvIndex={parseInt(uvIndex?.uv) || "-"}
                                    />
                                </Box>
                                <Box pl={3} flexGrow={1}>
                                    <SurfCard
                                        surfData={surfData}
                                        waterTemperature={parseInt(waterTemperature?.data[0].v)}
                                    />
                                </Box>
                            </Box>
                            <Box pt={3} flexGrow={1}>
                                <TideCard
                                    tidePredictionData={tidePredictionData}
                                    tideActualData={tideActualData}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

const setSurfDataWithSplice = (r: any, location: string, id: number, setSurfData: Function) => {
    setSurfData((surfData: any) => {
        const isItem = surfData.some((item: any) => item.name === location);
        surfData.splice(
            isItem ? surfData.findIndex((item: any) => item.name === location) : 0,
            isItem ? 1 : 0,
            {
                id: id,
                name: location,
                waveHeight: calculateTodaysAverage(r.data.data.wave)
            }
        );
        return surfData;
    });
};

const calculateTodaysAverage = (data: any) =>
    data.map((item: any) => item.surf.max).reduce((a: any, b: any) => a + b) / data.length;

export default DashBoard;
