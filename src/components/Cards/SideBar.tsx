import { Fragment } from "react";

import { DateTime } from "luxon";

import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import LightModeIcon from "@mui/icons-material/LightMode";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
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
    const snowForecast = [
        resortData.Forecast.TwoDay,
        resortData.Forecast.ThreeDay,
        resortData.Forecast.FourDay
    ];

    console.log(resortData);

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} pt={2} pl={3} pr={3} pb={2}>
            <ImportantAlertsCard />
            <Typography sx={{ fontSize: 40, fontWeight: 600 }}>Steamboat Springs</Typography>
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 3 }} />
            {todaysWeather && (
                <TodaysWeather
                    todaysWeather={todaysWeather}
                    todaysSnow={resortData.Forecast.OneDay}
                />
            )}
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 2 }} />
            {snowForecast && <SnowForecast snowForecast={snowForecast} />}
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 2 }} />
            <LiftAndTrailStatus />
            <Divider sx={{ borderBottomWidth: "medium", mt: 2, mb: 2 }} />
            <VerticalFeetLeaderboard />
        </Box>
    );
};

const TodaysWeather = (props: { todaysWeather: any; todaysSnow: any }) => {
    const theme = useTheme();
    const todaysConditions = props.todaysWeather.Conditions.replace("_", "-");

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <span
                    className={`wi wi-${
                        theme.palette.mode === "dark" ? "night" : "day"
                    }-${todaysConditions}`}
                    style={{ fontSize: 80 }}
                />
                <Box ml={4} display={"flex"} flexDirection={"column"}>
                    <Typography style={{ fontSize: 25 }}>
                        {parseInt(props.todaysWeather.TemperatureF)} °F
                    </Typography>
                    <Typography sx={{ fontSize: 14, mt: -0.5 }}>
                        {getConditionsInHumanReadableFormat(todaysConditions)}
                    </Typography>
                    <Typography>{props.todaysSnow.forecasted_snow_day_in}"</Typography>
                </Box>
            </Box>
            <Box mt={3} pl={2} pr={2} display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>
                        {props.todaysWeather.WindGustsMph} mph {props.todaysWeather.WindDirection}
                    </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <LightModeIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>{props.todaysWeather.UvIndex}</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <WavesIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>{props.todaysWeather.Humidity}%</Typography>
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

const SnowForecast = (props: any) => {
    return (
        <Box mt={1} display={"flex"} justifyContent={"space-around"}>
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
            <PieChart width={100} height={100}>
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

const VerticalFeetLeaderboard = () => {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <LeaderboardIcon sx={{ fontSize: 30, alignSelf: "end" }} />
            <Box mt={-3} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Matthew Ernst" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
                            Matthew Ernst
                        </Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 300 }}>10,200 ft</Typography>
                    </Box>
                </Box>
                <Divider sx={{ m: 1 }} />
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Max Rosoff" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Max Rosoff</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 300 }}>8,400 ft</Typography>
                    </Box>
                </Box>
                <Divider sx={{ m: 1 }} />
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Dante Delee" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Dante Delee</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 300 }}>6,920 ft</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SideBar;
