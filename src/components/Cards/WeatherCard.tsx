import { Box, Grid, LinearProgress, Typography, useTheme } from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunny from "@mui/icons-material/WbSunny";
import { grey } from "@mui/material/colors";

import { DateTime } from "luxon";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const WeatherCard = () => {
    const { VITE_ZIP_CODE, VITE_TIME_INTERVAL, VITE_OPEN_WEATHER_MAP_ID } = import.meta.env;

    const openWeatherMapAPI = "https://api.openweathermap.org/data/2.5/weather";
    const weatherData: any | undefined = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${openWeatherMapAPI}?zip=${VITE_ZIP_CODE}&units=imperial&appid=${VITE_OPEN_WEATHER_MAP_ID}`
    );

    return (
        <Box
            pt={2}
            pl={2}
            pr={2}
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: grey[300],
                borderRadius: 1,
                width: 240,
                height: 200
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Grid item container justifyContent={"space-between"}>
                <Grid item>
                    <Typography style={{ fontSize: 32, fontWeight: 500 }}>Weather</Typography>
                </Grid>
            </Grid>

            <Box pt={1} flexGrow={1}>
                {weatherData ? (
                    <WeatherDetails weatherData={weatherData} />
                ) : (
                    <LoadingWeatherData />
                )}
            </Box>
        </Box>
    );
};

const WeatherDetails = (props: any) => {
    return (
        <Grid container direction={"column"} spacing={2}>
            <Grid item>
                <Box display={"flex"} alignItems={"center"}>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Typography style={{ fontSize: 28, fontWeight: 500 }}>
                            {Math.floor(props.weatherData.main.temp) + " °F"}
                        </Typography>
                        <Typography style={{ fontSize: 18 }}>
                            {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
                        </Typography>
                    </Box>
                    <Box pl={4}>
                        <i
                            className={`wi wi-owm-${props.weatherData.weather[0].id}`}
                            style={{ fontSize: 50 }}
                        />
                    </Box>
                </Box>
            </Grid>
            <Grid item>
                <OtherDetails {...props} />
            </Grid>
        </Grid>
    );
};

const LoadingWeatherData = (): JSX.Element => {
    const theme = useTheme();
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: theme.spacing(1) }} />
            </Box>
        </Box>
    );
};

const OtherDetails = (props: any): JSX.Element => {
    return (
        <Grid container spacing={1}>
            <Grid item>
                <UVIndex />
            </Grid>
            <Grid item>
                <Humidity humidity={props.weatherData.main.humidity} />
            </Grid>
            <Grid item>
                <Wind
                    windDirection={props.weatherData.wind.deg}
                    windSpeed={props.weatherData.wind.speed}
                />
            </Grid>
        </Grid>
    );
};

const UVIndex = (): JSX.Element => {
    const theme = useTheme();
    const { VITE_ZIP_CODE, VITE_TIME_INTERVAL } = import.meta.env;
    const uvAPIURL = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${VITE_ZIP_CODE}/JSON`;
    let uvIndexData: any[] | undefined = callExternalAPIOnInterval(VITE_TIME_INTERVAL, uvAPIURL);
    uvIndexData = Array.isArray(uvIndexData) ? uvIndexData : [];
    const currentHour = DateTime.now().toFormat("hh a");

    const uvIndex =
        uvIndexData.find((data: { DATE_TIME: string }) => data.DATE_TIME.includes(currentHour))
            .UV_VALUE || "-";

    return (
        <Box display={"flex"} alignItems={"center"}>
            <WbSunny style={{ fontSize: 18, fill: theme.palette.primary.main }} />
            <Box pl={1}>
                <Typography style={{ fontSize: 16, fontWeight: 400 }}>{uvIndex}</Typography>
            </Box>
        </Box>
    );
};

const Humidity = (props: { humidity: number }): JSX.Element => {
    const theme = useTheme();
    return (
        <Box display={"flex"} alignItems={"center"}>
            <OpacityIcon style={{ fontSize: 18, fill: theme.palette.primary.main }} />
            <Box pl={1}>
                <Typography style={{ fontSize: 16, fontWeight: 400 }}>
                    {props.humidity + "%"}
                </Typography>
            </Box>
        </Box>
    );
};

const Wind = (props: { windDirection: number; windSpeed: number }): JSX.Element => {
    const theme = useTheme();
    return (
        <Box display={"flex"} alignItems={"center"}>
            <i
                className={`wi wi-wind from-${props.windDirection}-deg`}
                style={{ fontSize: 22, color: theme.palette.primary.main }}
            />
            <Box pl={1}>
                <Typography style={{ fontSize: 16, fontWeight: 400 }}>
                    {Math.floor(props.windSpeed) + " mph"}
                </Typography>
            </Box>
        </Box>
    );
};

export default WeatherCard;
