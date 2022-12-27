import { Box, Divider, Typography } from "@mui/material";

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import TodaysWeather from "./SideBar/TodaysWeather";
import Forecast from "./SideBar/Forecast";
import MountainStatus from "./SideBar/MountainStatus";
import Leaderboard from "./SideBar/Leaderboard";

const SideBar = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );

    if (!resortData) {
        return null;
    }

    const todaysWeather = resortData.CurrentConditions.Base;
    const forecast = [
        resortData.Forecast.TwoDay,
        resortData.Forecast.ThreeDay,
        resortData.Forecast.FourDay
    ];

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} pt={2} pl={3} pr={3} pb={2}>
            <Typography sx={{ fontSize: 40, fontWeight: 600 }}>Steamboat Springs</Typography>
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 3 }} />
            {todaysWeather && (
                <TodaysWeather
                    todaysWeather={todaysWeather}
                    todaysSnow={resortData.Forecast.OneDay}
                />
            )}
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 2 }} />
            {forecast && <Forecast forecast={forecast} />}
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 1 }} />
            <MountainStatus />
            <Divider sx={{ borderBottomWidth: "medium", mt: 1, mb: 2 }} />
            <Leaderboard />
        </Box>
    );
};







export default SideBar;
