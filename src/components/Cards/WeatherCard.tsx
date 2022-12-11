import { Box, Divider, Grid, LinearProgress, Typography, useTheme } from "@mui/material";

import { grey } from "@mui/material/colors";
import { DateTime } from "luxon";
import { Fragment } from "react";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const WeatherCard = () => {
    const theme = useTheme();
    let dayOrNight = theme.palette.mode === "dark" ? "night" : "day";

    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );
    const todaysWeather = resortData?.Forecast?.OneDay;

    const tomorrowsWeather = resortData?.Forecast?.TwoDay;

    const snowForecast = [
        resortData?.Forecast?.TwoDay.forecasted_snow_day_in,
        resortData?.Forecast?.ThreeDay.forecasted_snow_day_in,
        resortData?.Forecast?.FourDay.forecasted_snow_day_in
    ];

    return (
        <Box
            p={2}
            sx={{
                height: "100%"
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Typography style={{ fontSize: 32, fontWeight: 500 }}>Weather</Typography>

            <Box pt={1} flexGrow={1} display={"flex"}>
                {todaysWeather && tomorrowsWeather ? (
                    <Box width={"100%"} flexDirection={"column"}>
                        <Box display={"flex"} alignItems={"center"}>
                            <TodaysWeather todaysWeather={todaysWeather} dayOrNight={dayOrNight} />
                        </Box>
                        <Box pt={4} display={"flex"}>
                            <TomorrowsWeather tomorrowsWeather={tomorrowsWeather} />
                        </Box>
                        <Box pt={4}>
                            <SnowForecast snowForecast={snowForecast} />
                        </Box>
                    </Box>
                ) : (
                    <LoadingScreen />
                )}
            </Box>
        </Box>
    );
};

const LoadingScreen = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const TodaysWeather = (props: any) => {
    const todaysConditions = props.todaysWeather.conditions.replace("_", "-");
    return (
        <>
            <Box flexDirection={"column"}>
                <Typography style={{ fontSize: 22 }}> Today </Typography>
                <span
                    className={`wi wi-${props.dayOrNight}-${todaysConditions}`}
                    style={{ fontSize: 80 }}
                />
            </Box>

            <Box pt={4} pl={10} flexGrow={1}>
                <Box>
                    <Typography style={{ fontSize: 28 }}>
                        {DateTime.fromISO(props.todaysWeather.date).toFormat("EEE MMM dd")}
                    </Typography>
                </Box>
                <Box pt={2}>
                    <Typography style={{ fontSize: 22 }}>
                        {props.todaysWeather.temp_high_f} °F / {props.todaysWeather.temp_low_f} °F
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

const TomorrowsWeather = (props: any) => {
    const tomorrowsInfo = props.tomorrowsWeather;
    return (
        <Box flexDirection={"column"} width={"100%"}>
            <Box>
                <Typography style={{ fontSize: 22 }}> Tomorrow </Typography>
            </Box>
            <Fragment>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"100%"}
                >
                    <Box
                        className={`wi wi-forecast-io-${tomorrowsInfo.conditions}`}
                        style={{ fontSize: 35 }}
                    />
                    <Box>
                        <Typography>
                            {DateTime.fromISO(tomorrowsInfo.date).toFormat("EEE MMM dd")}
                        </Typography>
                        <Typography>
                            {tomorrowsInfo.temp_high_f} °F / {tomorrowsInfo.temp_low_f} °F
                        </Typography>
                    </Box>
                    <Typography>{tomorrowsInfo.forecasted_snow_in} in</Typography>
                    <Typography>
                        {tomorrowsInfo.avewind ? tomorrowsInfo.avewind.dir : "N/A"}{" "}
                        {tomorrowsInfo.avewind ? tomorrowsInfo.avewind.mph : "0mph"}
                    </Typography>
                </Box>
            </Fragment>
        </Box>
    );
};

const SnowForecast = (props: any) => {
    return (
        <>
            <Typography sx={{ fontSize: 22 }}> Forecasted Snowfall </Typography>
            <Box
                display={"flex"}
                justifyContent={"space-around"}
                marginRight={"auto"}
                flexDirection={"row"}
                pt={0.5}
            >
                <Typography> {props.snowForecast[0]} in </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography> {props.snowForecast[1]} in </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography> {props.snowForecast[2]} in </Typography>
            </Box>
        </>
    );
};

export default WeatherCard;
