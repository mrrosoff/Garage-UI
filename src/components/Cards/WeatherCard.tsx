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
    return (
        <Box
            p={2}
            sx={{
                height: "100%"
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Grid item container justifyContent={"space-between"}>
                <Grid item>
                    <Typography style={{ fontSize: 32, fontWeight: 500 }}>Weather</Typography>
                </Grid>
            </Grid>
            <Box pt={5} flexGrow={1} display={"flex"}>
                {todaysWeather && tomorrowsWeather ? (
                    <>
                        <TodaysWeather todaysWeather={todaysWeather} dayOrNight={dayOrNight} />
                        <TomorrowsWeather tomorrowsWeather={tomorrowsWeather} />
                    </>
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
            <span
                className={`wi wi-${props.dayOrNight}-${todaysConditions}`}
                style={{ fontSize: 80 }}
            />
            <Box pt={2} pl={10} flexGrow={1}>
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
        <Fragment>
            <Box
                mb={1}
                pl={1}
                pr={1}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"end"}
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
    );
};

export default WeatherCard;
