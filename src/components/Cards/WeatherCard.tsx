import { Box, Divider, LinearProgress, Typography, useTheme } from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import LightModeIcon from "@mui/icons-material/LightMode";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { DateTime } from "luxon";
import { Fragment } from "react";
import SnowPatrolInfoCard from "./SnowPatrolInfoCard";

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
        resortData?.Forecast?.TwoDay,
        resortData?.Forecast?.ThreeDay,
        resortData?.Forecast?.FourDay
    ];

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Box width={"75%"} style={{ overflow: "auto", maxHeight: 250 }} position={"absolute"}>
                <SnowPatrolInfoCard />
            </Box>
            {todaysWeather && tomorrowsWeather ? (
                <>
                    <TodaysWeather todaysWeather={todaysWeather} dayOrNight={dayOrNight} />
                    <Box pt={3} display={"flex"}>
                        <TomorrowsWeather tomorrowsWeather={tomorrowsWeather} />
                    </Box>
                    <Box pt={3}>
                        <SnowForecast snowForecast={snowForecast} />
                    </Box>
                </>
            ) : (
                <LoadingScreen />
            )}
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
        <Box flexDirection={"column"} alignItems={"center"}>
            <Typography align={"center"} sx={{ fontSize: 24 }}>
                Steamboat Springs
            </Typography>
            <Typography align={"center"} sx={{ fontSize: 22, pb: 2 }}>
                {getConditionsInHumanReadableFormat(todaysConditions)}
            </Typography>
            <span
                className={`wi wi-${props.dayOrNight}-${todaysConditions}`}
                style={{ fontSize: 60, display: "table", margin: "auto" }}
            />
            <Typography align={"center"} style={{ fontSize: 24 }}>
                {parseInt(props.todaysWeather.TemperatureF)}°
            </Typography>
            <Typography align={"center"} style={{ fontSize: 16 }}>
                H:{parseInt(props.todaysWeather.TemperatureHighF)}° L:
                {parseInt(props.todaysWeather.TemperatureLowF)}°
            </Typography>
            <TodaysWeatherAttributes todaysWeather={props.todaysWeather} />
        </Box>
    );
};

const TodaysWeatherAttributes = (props: any) => {
    return (
        <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Box>
                <Box display={"flex"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>
                        {" "}
                        {props.todaysWeather.WindGustsMph} mph {props.todaysWeather.WindDirection}
                    </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <ScaleIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.PressureIN} inHg</Typography>
                </Box>
            </Box>
            <Box>
                <Box display={"flex"} alignItems={"center"}>
                    <LightModeIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.UvIndex}</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <WavesIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.Humidity}%</Typography>
                </Box>
            </Box>
        </Box>
    );
};

function getConditionsInHumanReadableFormat(condition: string) {
    if (
        (condition.includes("partly") || condition.includes("mostly")) &&
        !condition.includes("-")
    ) {
        return (
            condition.substring(0, 1).toUpperCase() +
            condition.substring(1, condition.indexOf("y") + 1) +
            " " +
            condition.charAt(condition.indexOf("y") + 1).toUpperCase() +
            condition.substring(condition.indexOf("y") + 2, condition.length)
        );
    }
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
            <Box display={"flex"} alignItems={"center"}>
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
                <Box display={"flex"} alignItems={"center"}>
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
                <Typography sx={{ fontSize: 18, paddingLeft: 0.5 }}>Forecasted Snowfall</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-around"} pt={1}>
                {props.snowForecast.map((day: any, index: number) => {
                    return (
                        <Fragment key={index}>
                            <Box display={"flex"}>
                                <Typography>
                                    {" "}
                                    {DateTime.fromISO(day.date).toFormat("EEE")}:
                                </Typography>
                                <Typography style={{ paddingLeft: 4 }}>
                                    {day.forecasted_snow_day_in}"
                                </Typography>
                            </Box>

                            {index !== props.snowForecast.length - 1 && (
                                <Divider orientation="vertical" flexItem />
                            )}
                        </Fragment>
                    );
                })}
            </Box>
        </>
    );
};

export default WeatherCard;
