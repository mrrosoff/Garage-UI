import { Fragment } from "react";

import { Box, Divider, LinearProgress, Typography, useTheme } from "@mui/material";

import { DateTime } from "luxon";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import { grey } from "@mui/material/colors";


type WeatherForecast = {
    avewind: {mph: string, kph: string, dir: string},
    conditions: string,
    date: string,
    forecasted_snow_cm: number,
    forecasted_snow_day_cm: string,
    forecasted_snow_day_in: string,
    forecasted_snow_in: number,
    icon: string,
    skies: string,
    temp_high_c: string,
    temp_high_f: string,
    temp_low_c: string,
    temp_low_f: string,
}

const ForecastCard = () => {
    const theme = useTheme();
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );

    const forecastData = resortData?.Forecast;
    const days = ["Two"];
   
    return (
        <Box
            p={2}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
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
                        weatherForecast={days.map((day) => forecastData[`${day}Day`] as WeatherForecast)}
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

const ForecastWeather = (props: { weatherForecast: WeatherForecast[] }) => {
    const { weatherForecast } = props;
    return (
        <>
            {weatherForecast.map((day, index) => {
                const shouldHaveDivider = index !== weatherForecast.length - 1;
                const currentDaysConditions = day.conditions.replace("_", "-");
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
                                className={`wi wi-forecast-io-${currentDaysConditions}`}
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
