import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunny from "@mui/icons-material/WbSunny";

import { DateTime } from "luxon";

import config from "../../config";
import useExternalAPIOnInterval from "../../hooks/useExternalAPIOnInterval";
import Card, { LoadingBar } from "./Card";

const WeatherCard = () => {
    const openWeatherMapAPI = "https://api.openweathermap.org/data/2.5/weather";
    const weatherData = useExternalAPIOnInterval(
        config.timeInterval,
        `${openWeatherMapAPI}?zip=${config.zipCode}&units=imperial&appid=${config.openWeatherMapId}`
    );

    return (
        <Card title={"Weather"} width={280} height={240}>
            {weatherData ? <WeatherDetails weatherData={weatherData} /> : <LoadingBar />}
        </Card>
    );
};

const WeatherDetails = (props: any) => {
    const weather = props.weatherData.weather[0];
    // OpenWeatherMap icon codes end in "n" at night, e.g. "01n" for a clear night
    const timeOfDay = weather.icon?.endsWith("n") ? "night" : "day";
    return (
        <Stack spacing={3}>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography style={{ fontSize: 36, fontWeight: 500 }}>
                            {Math.floor(props.weatherData.main.temp) + " °F"}
                        </Typography>
                        <Typography style={{ fontSize: 22 }}>
                            {DateTime.now().toFormat("h:mm a")}
                        </Typography>
                    </Box>
                    <Box sx={{ pl: 4 }}>
                        <i
                            className={`wi wi-owm-${timeOfDay}-${weather.id}`}
                            style={{ fontSize: 64 }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box>
                <OtherDetails {...props} />
            </Box>
        </Stack>
    );
};

const OtherDetails = (props: any) => {
    return (
        <Grid container spacing={1}>
            <Grid>
                <UVIndex />
            </Grid>
            <Grid>
                <Humidity humidity={props.weatherData.main.humidity} />
            </Grid>
            <Grid>
                <Wind
                    windDirection={props.weatherData.wind.deg}
                    windSpeed={props.weatherData.wind.speed}
                />
            </Grid>
        </Grid>
    );
};

const UVIndex = () => {
    const theme = useTheme();
    const uvAPIURL = `https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}&longitude=${config.longitude}&current=uv_index`;
    const uvIndexData = useExternalAPIOnInterval(config.timeInterval, uvAPIURL);
    const uvIndex = uvIndexData?.current?.uv_index;

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <WbSunny style={{ fontSize: 24, fill: theme.palette.primary.main }} />
            <Box sx={{ pl: 1 }}>
                <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                    {typeof uvIndex === "number" ? Math.round(uvIndex) : "-"}
                </Typography>
            </Box>
        </Box>
    );
};

const Humidity = (props: { humidity: number }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <OpacityIcon style={{ fontSize: 24, fill: theme.palette.primary.main }} />
            <Box sx={{ pl: 1 }}>
                <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                    {props.humidity + "%"}
                </Typography>
            </Box>
        </Box>
    );
};

const HOUSE_FACING_DEG = 285;

const Wind = (props: { windDirection: number; windSpeed: number }) => {
    const theme = useTheme();
    const adjustedDirection = (props.windDirection - HOUSE_FACING_DEG + 360) % 360;
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <i
                className={`wi wi-wind from-${Math.round(adjustedDirection)}-deg`}
                style={{ fontSize: 24, color: theme.palette.primary.main }}
            />
            <Box sx={{ pl: 1 }}>
                <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                    {Math.floor(props.windSpeed) + " mph"}
                </Typography>
            </Box>
        </Box>
    );
};

export default WeatherCard;
