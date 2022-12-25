import { Fragment } from "react";

import { DateTime } from "luxon";

import { Box, Divider, LinearProgress, Typography, useTheme } from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import LightModeIcon from "@mui/icons-material/LightMode";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { grey } from "@mui/material/colors";

import { Cell, Label, Pie, PieChart } from "recharts";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import ImportantAlertsCard from "./ImportantAlertsCard";

const SideBar = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );

    if (!resortData) {
        return null;
    }

    const todaysWeather = resortData.CurrentConditions.Base;
    const tomorrowsWeather = resortData.Forecast.TwoDay;
    const snowForecast = [
        resortData.Forecast.TwoDay,
        resortData.Forecast.ThreeDay,
        resortData.Forecast.FourDay
    ];

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} pt={2} pl={3} pr={3} pb={2}>
            <Box width={"78%"} style={{ overflow: "auto", maxHeight: 250 }} position={"absolute"}>
                <ImportantAlertsCard />
            </Box>
            <Typography sx={{ fontSize: 40, fontWeight: 600 }}>Steamboat Springs</Typography>
            {todaysWeather && (
                <>
                    <TodaysWeather todaysWeather={todaysWeather} />
                    <TodaysWeatherAttributes todaysWeather={todaysWeather} />
                </>
            )}
            <Divider sx={{ mt: 2, mb: 2 }} />
            {tomorrowsWeather && <TomorrowsWeather tomorrowsWeather={tomorrowsWeather} />}
            <Divider sx={{ mt: 2, mb: 2 }} />
            {snowForecast && <SnowForecast snowForecast={snowForecast} />}
            <Divider sx={{ mt: 2, mb: 2 }} />
            <LiftAndTrailStatus />
        </Box>
    );
};

const TodaysWeather = (props: { todaysWeather: any }) => {
    const theme = useTheme();
    const todaysConditions = props.todaysWeather.Conditions.replace("_", "-");

    return (
        <Box display={"flex"} pt={4}>
            <span
                className={`wi wi-${
                    theme.palette.mode === "dark" ? "night" : "day"
                }-${todaysConditions}`}
                style={{ fontSize: 80 }}
            />
            <Box display={"flex"} flexDirection={"column"} ml={4}>
                <Typography style={{ fontSize: 30 }}>
                    {parseInt(props.todaysWeather.TemperatureF)} °F
                </Typography>
                <Typography sx={{ fontSize: 20, pb: 2 }}>
                    {getConditionsInHumanReadableFormat(todaysConditions)}
                </Typography>
            </Box>
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
                                    {day.date && DateTime.fromISO(day.date).toFormat("EEE")}:
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

const LiftAndTrailStatus = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const snowReport = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    )?.SnowReport;

    return (
        <Box display={"flex"}>
            <MountainPieChart
                chartUnit={"Trails"}
                totalOpen={parseInt(snowReport?.TotalOpenTrails)}
                totalAmount={parseInt(snowReport?.TotalTrails)}
            />
            <MountainPieChart
                chartUnit={"Lifts"}
                totalOpen={parseInt(snowReport?.TotalOpenLifts)}
                totalAmount={parseInt(snowReport?.TotalLifts)}
            />
            <MountainPieChart
                type={"Percent"}
                chartUnit={"Acres"}
                totalOpen={parseInt(snowReport?.OpenTerrainAcres)}
                totalAmount={parseInt(snowReport?.TotalTerrainAcres)}
            />
        </Box>
    );
};

const MountainPieChart = (props: {
    totalOpen: number;
    totalAmount: number;
    chartUnit: string;
    type?: "Fraction" | "Percent";
}) => {
    const percentOpen = (props.totalOpen / props.totalAmount) * 100;
    const data = [
        { name: "open", value: props.totalOpen },
        { name: "not open", value: props.totalAmount - props.totalOpen }
    ];

    const theme = useTheme();
    const COLORS = [theme.palette.primary.light, grey[300]];

    const labelType = props.type || "Fraction";
    return (
        <Box p={1}>
            <PieChart width={105} height={100}>
                <Pie
                    data={data}
                    cx={"50%"}
                    cy={"50%"}
                    startAngle={90}
                    endAngle={450}
                    innerRadius={40}
                    outerRadius={50}
                    dataKey="value"
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                        width={30}
                        position="center"
                        content={
                            labelType === "Fraction" ? (
                                <FractionLabel
                                    totalOpen={props.totalOpen}
                                    totalAmount={props.totalAmount}
                                    chartUnit={props.chartUnit}
                                />
                            ) : (
                                <PercentLabel
                                    percentOpen={percentOpen}
                                    chartUnit={props.chartUnit}
                                />
                            )
                        }
                    ></Label>
                </Pie>
            </PieChart>
        </Box>
    );
};

const FractionLabel = (
    props: { totalOpen: number; totalAmount: number; chartUnit: string } & any
) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";
    return (
        <>
            <text
                x={cx - 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
            >
                {props.totalOpen}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={10}
                fontWeight={500}
            >
                / {props.totalAmount}
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
    );
};

const PercentLabel = (props: { percentOpen: number; chartUnit: string } & any) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";

    return (
        <>
            <text
                x={cx - 5}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={22}
                fontWeight={700}
            >
                {props.percentOpen.toFixed(0)}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={14}
                fontWeight={500}
            >
                %
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
    );
};

export default SideBar;
