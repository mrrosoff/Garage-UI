import { Box, Grid, LinearProgress, Typography, useTheme } from "@mui/material";

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
                {todaysWeather ? (
                    <TodaysWeather todaysWeather={todaysWeather} dayOrNight={dayOrNight} />
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
    const todaysConditions = props.todaysWeather.conditions.replace('_', '-');
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

export default TodayInfoCard;
