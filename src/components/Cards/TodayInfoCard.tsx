import React from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";

import {
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList
} from "recharts";

import { grey } from "@mui/material/colors";
import { DateTime } from "luxon";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const TodayInfoCard = () => {
    const theme = useTheme();
    let dayOrNight = theme.palette.mode === "dark" ? "night" : "day";

    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );
    const todaysWeather = resortData?.Forecast?.OneDay;

    // TODO: Replace with loading screen
    if (!todaysWeather) {
        return null;
    }

    return (
        <Box
            p={2}
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: grey[300],
                borderRadius: 5,
                height: "100%"
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Grid item container justifyContent={"space-between"}>
                <Grid item>
                    <Typography style={{ fontSize: 32, fontWeight: 500 }}>Today</Typography>
                </Grid>
            </Grid>
            <Box pt={5} flexGrow={1} display={"flex"}>
                <span
                    className={`wi wi-${dayOrNight}-${todaysWeather.conditions}`}
                    style={{ fontSize: 80 }}
                />
                <Box pt={2} pl={10} flexGrow={1}>
                    <Box>
                        <Typography style={{ fontSize: 28 }}>
                            {DateTime.fromISO(todaysWeather.date).toFormat("EEE MMM dd")}
                        </Typography>
                    </Box>
                    <Box pt={2}>
                        <Typography style={{ fontSize: 22 }}>
                            {todaysWeather.temp_high_f} °F / {todaysWeather.temp_low_f} °F
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TodayInfoCard;
