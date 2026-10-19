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
                            className={`wi wi-owm-${props.weatherData.weather[0].id}`}
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
    const uvAPIURL = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${config.zipCode}/JSON`;
    const uvIndexData = useExternalAPIOnInterval(config.timeInterval, uvAPIURL);
    const currentHour = DateTime.now().toFormat("hh a");

    // The API returns an { error } object instead of an array when it has no data for the zip code
    const uvIndex = (Array.isArray(uvIndexData) ? uvIndexData : []).find(
        (data: { DATE_TIME: string }) => data.DATE_TIME.includes(currentHour)
    )?.UV_VALUE;

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <WbSunny style={{ fontSize: 24, fill: theme.palette.primary.main }} />
            <Box sx={{ pl: 1 }}>
                <Typography style={{ fontSize: 20, fontWeight: 400 }}>{uvIndex ?? "-"}</Typography>
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
