import React, { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import axios from "axios";
import { DateTime } from "luxon";
import openuv from "openuv";

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    }
}));

const formatString = "MM-dd";

const specialDays = [
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

const DashBoard = (props) => {
    const classes = useStyles();

    const weatherData = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.openweathermap.org/data/2.5/weather?zip=${process.env.zipCode}&units=imperial&appid=${process.env.openWeatherMapAppId}`
    );
    const uvIndex = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.openuv.io/api/v1/uv?lat=${process.env.lat}&lng=${process.env.lng}`,
        { "x-access-token": process.env.openuvAccessToken }
    );
    const tidePredictionData = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${process.env.noaaStation}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );
    const tideActualData = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${process.env.noaaStation}&product=one_minute_water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );
    const waterTemperature = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${process.env.noaaStation}&product=water_temperature&units=english&time_zone=lst_ldt&format=json`
    );

    const [surfData, setSurfData] = useState([]);
    const [specialDay, setSpecialDay] = useState();

    useEffect(() => {
        const getSurfFromAPI = async () => {
            const blacksResp = await axios.get(
                "https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a770883b&days=1&intervalHours=1&maxHeights=true"
            );

            const fifteenthResp = await axios.get(
                "https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a77088af&days=1&intervalHours=1&maxHeights=true"
            );

            const beaconsResp = await axios.get(
                "https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a77088a0&days=1&intervalHours=1&maxHeights=true"
            );

            setSurfDataWithSplice(blacksResp, "Blacks", 0, setSurfData);
            setSurfDataWithSplice(fifteenthResp, "15th Street", 1, setSurfData);
            setSurfDataWithSplice(beaconsResp, "Beacons", 2, setSurfData);
        };

        getSurfFromAPI();
        const interval = setInterval(getSurfFromAPI, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getSpecialDay = async () => {
            const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
            if (specialDay) {
                setSpecialDay(specialDay);
            }
        };

        const interval = setInterval(getSpecialDay, 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box height={"100%"} p={3}>
            <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                <Box width={"33.33%"} height={"100%"} paddingRight={3}>
                    <Paper
                        elevation={2}
                        style={{ width: "100%", height: "100%" }}
                        className={classes.root}
                    >
                        <SideBar specialDay={specialDay} />
                    </Paper>
                </Box>
                <Box width={"66.66%"} height={"100%"}>
                    <Paper
                        elevation={2}
                        style={{ width: "100%", height: "100%" }}
                        className={classes.root}
                    >
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
                                        waterTemperature={waterTemperature?.data[0].v}
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

const setSurfDataWithSplice = (r, location, id, setSurfData) => {
    setSurfData((surfData) => {
        const isItem = surfData.some((item) => item.name === location);
        surfData.splice(
            isItem ? surfData.findIndex((item) => item.name === location) : 0,
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

const calculateTodaysAverage = (data) =>
    data.map((item) => item.surf.max).reduce((a, b) => a + b) / data.length;

export default DashBoard;
