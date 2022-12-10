import { Fragment } from "react";

import { Box, Divider, LinearProgress, Typography, useTheme } from "@mui/material";

import { DateTime } from "luxon";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import { grey } from "@mui/material/colors";

const ForecastCard = () => {
    const theme = useTheme();
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );

    const forecastData = resortData?.Forecast;
    const days = ["Two", "Three", "Four", "Five"];

    return (
        <Box
            p={2}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: grey[300],
                borderRadius: 5,
                height: "100%"
            }}
        >
            <Typography style={{ fontSize: 32, fontWeight: 500 }}>Forecast</Typography>
            <Box
                pt={3}
                height={"100%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
            >
                {forecastData ? (
                    <ForecastWeather
                        weatherForecast={days.map((day) => forecastData[`${day}Day`])}
                    />
                ) : (
                    <LoadingScreen />
                )}
            </Box>
        </Box>
    );
};

const LoadingScreen = () => {
    return (
        <Box
            sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", pb: 25 }}
        >
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const ForecastWeather = (props: any) => {
    const { weatherForecast } = props;
    return (
        <>
            {weatherForecast.map((day, index) => {
                const shouldHaveDivider = index !== weatherForecast.length - 1;
                return (
                    <Fragment key={index}>
                        <Box
                            mb={1}
                            pl={1}
                            pr={1}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"end"}
                        >
                            <Box
                                className={`wi wi-forecast-io-${day.conditions}`}
                                style={{ fontSize: 35 }}
                            />
                            <Box>
                                <Typography>
                                    {DateTime.fromISO(day.date).toFormat("EEE MMM dd")}
                                </Typography>
                                <Typography>
                                    {day.temp_high_f} °F / {day.temp_low_f} °F
                                </Typography>
                            </Box>
                            <Typography>{day.forecasted_snow_in} in</Typography>
                            <Typography>
                                {day.avewind ? day.avewind.dir : "N/A"}{" "}
                                {day.avewind ? day.avewind.mph : "0mph"}
                            </Typography>
                        </Box>
                        {shouldHaveDivider && <Divider />}
                    </Fragment>
                );
            })}
        </>
    );
};
export default ForecastCard;
