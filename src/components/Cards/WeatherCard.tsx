import { Box, Grid, LinearProgress, Typography, useTheme } from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunny from "@mui/icons-material/WbSunny";
import { grey } from "@mui/material/colors";

import { DateTime } from "luxon";

const WeatherCard = (props: any) => {
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
                {props.weatherData ? <WeatherDetails {...props} /> : <LoadingWeatherData />}
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
                        <Typography
                            style={{
                                fontSize: 28,
                                fontWeight: 500
                            }}
                        >
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

const LoadingWeatherData = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const OtherDetails = (props: any) => {
    const theme = useTheme();

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Box display={"flex"} alignItems={"center"}>
                    <WbSunny
                        style={{
                            fontSize: 18,
                            fill: theme.palette.primary.main
                        }}
                    />
                    <Box pl={1}>
                        <Typography style={{ fontSize: 16, fontWeight: 400 }}>
                            {props.uvIndex}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item>
                <Box display={"flex"} alignItems={"center"}>
                    <OpacityIcon
                        style={{
                            fontSize: 18,
                            fill: theme.palette.primary.main
                        }}
                    />
                    <Box pl={1}>
                        <Typography style={{ fontSize: 16, fontWeight: 400 }}>
                            {props.weatherData.main.humidity + "%"}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item>
                <Box display={"flex"} alignItems={"center"}>
                    <i
                        className={`wi wi-wind from-${props.weatherData.wind.deg}-deg`}
                        style={{
                            fontSize: 22,
                            color: theme.palette.primary.main
                        }}
                    />
                    <Box pl={1}>
                        <Typography style={{ fontSize: 16, fontWeight: 400 }}>
                            {Math.floor(props.weatherData.wind.speed) + " mph"}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default WeatherCard;
