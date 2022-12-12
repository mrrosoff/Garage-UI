import { Box, Divider, LinearProgress, Typography, useTheme } from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import LightModeIcon from "@mui/icons-material/LightMode";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import AcUnitIcon from "@mui/icons-material/AcUnit";
const WeatherCard = () => {
    const theme = useTheme();
    let dayOrNight = theme.palette.mode === "dark" ? "night" : "day";

    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );
    
    const todaysWeather = resortData?.CurrentConditions?.Base;
    const tomorrowsWeather = resortData?.Forecast?.TwoDay;
    
    const snowForecast = [
        resortData?.Forecast?.TwoDay.forecasted_snow_day_in,
        resortData?.Forecast?.ThreeDay.forecasted_snow_day_in,
        resortData?.Forecast?.FourDay.forecasted_snow_day_in
    ];

    return (
        <Box
            pl={2}
            sx={{
                height: "100%"
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Box flexGrow={1} display={"flex"}>
                {todaysWeather && tomorrowsWeather ? (
                    <Box width={"100%"} flexDirection={"column"}>
                        <Box display={"flex"} alignItems={"center"}>
                            <TodaysWeather todaysWeather={todaysWeather} dayOrNight={dayOrNight} />
                        </Box>
                        <Box pt={4} display={"flex"}>
                            <TomorrowsWeather tomorrowsWeather={tomorrowsWeather} />
                        </Box>
                        <Box pt={4} pb={1}>
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
    const todaysConditions = props.todaysWeather.Conditions.replace("_", "-");
    return (
        <>
            <Box
                flexDirection={"column"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography align={"center"} style={{ fontSize: 22, paddingBottom: 2 }}>
                    {" "}
                    Steamboat Springs{" "}
                </Typography>
                <Box flexDirection={"row"} width={"100%"} height={"100%"}>
                    <span
                        className={`wi wi-${props.dayOrNight}-${todaysConditions}`}
                        style={{ fontSize: 60, display: "table", margin: "auto" }}
                    />
                    <Box flexDirection={"column"} width={"100%"}>
                        <Typography align={"center"} style={{ fontSize: 24 }}>
                            {parseInt(props.todaysWeather.TemperatureF)}°
                        </Typography>

                        <Typography align={"center"} style={{ fontSize: 16 }}>
                            H:{parseInt(props.todaysWeather.TemperatureHighF)}° L:
                            {parseInt(props.todaysWeather.TemperatureLowF)}°
                        </Typography>
                    </Box>
                </Box>
                <TodaysWeatherAttributes todaysWeather={props.todaysWeather} />
            </Box>
        </>
    );
};

const TodaysWeatherAttributes = (props: any) => {
    return (
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
            <Box>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>
                        {" "}
                        {props.todaysWeather.WindGustsMph} mph {props.todaysWeather.WindDirection}
                    </Typography>
                </Box>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <ScaleIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.PressureIN}in</Typography>
                </Box>
            </Box>
            <Box>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <LightModeIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.UvIndex}</Typography>
                </Box>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <WavesIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.Humidity}%</Typography>
                </Box>
            </Box>
        </Box>
    );
};

function getConditionsInHumanReadableFormat(condition: string) {
    let conditions = condition.split("-");
    for (let i = 0; i < conditions.length; i++) {
        conditions[i] = conditions[i].charAt(0).toUpperCase() + conditions[i].slice(1);
    }
    return conditions.join(" ");
}

const TomorrowsWeather = (props: any) => {
    const tomorrowsInfo = props.tomorrowsWeather;
    tomorrowsInfo.conditions = tomorrowsInfo.conditions.replace("_", "-");

    return (
        <Box flexDirection={"column"} width={"100%"}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <WbTwilightIcon style={{ fontSize: 18, verticalAlign: "middle" }} />
                <Typography style={{ fontSize: 18, paddingLeft: 2 }}> Tomorrow </Typography>
            </Box>
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
                    <Typography align={"center"}>
                        {getConditionsInHumanReadableFormat(tomorrowsInfo.conditions)}
                    </Typography>
                    <Typography align={"center"}>
                        H:{parseInt(tomorrowsInfo.temp_high_f)}° L:
                        {parseInt(tomorrowsInfo.temp_low_f)}°
                    </Typography>
                </Box>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 0.5 }}>
                        {tomorrowsInfo.avewind ? tomorrowsInfo.avewind.mph : "0mph"}{" "}
                        {tomorrowsInfo.avewind ? tomorrowsInfo.avewind.dir : "N/A"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const SnowForecast = (props: any) => {
    return (
        <>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <AcUnitIcon style={{ fontSize: 18, verticalAlign: "middle" }} />
                <Typography sx={{ fontSize: 18, paddingLeft: 0.5 }}>
                    {" "}
                    Forecasted Snowfall{" "}
                </Typography>
            </Box>
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
