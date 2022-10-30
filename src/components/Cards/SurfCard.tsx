import { useEffect, useState } from "react";

import { Box, Grid, LinearProgress, Typography, useTheme } from "@mui/material";
import {
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList
} from "recharts";
import DeviceThermostat from "@mui/icons-material/DeviceThermostat";
import { grey } from "@mui/material/colors";

import axios from "axios";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const SurfCard = () => {
    const {
        VITE_TIME_INTERVAL,
        VITE_SURF_SPOT_ONE_ID,
        VITE_SURF_SPOT_ONE_NAME,
        VITE_SURF_SPOT_TWO_ID,
        VITE_SURF_SPOT_TWO_NAME,
        VITE_SURF_SPOT_THREE_ID,
        VITE_SURF_SPOT_THREE_NAME
    } = import.meta.env;

    const [surfData, setSurfData] = useState<any>([]);
    const surfAPI = "https://services.surfline.com/kbyg/spots/forecasts";
    
    useEffect(() => {
        const getSurfFromAPI = async () => {
            const beachOne = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_ONE_ID}&days=1&intervalHours=1&maxHeights=true`
            );
            const beachTwo = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_TWO_ID}&days=1&intervalHours=1&maxHeights=true`
            );
            const beachThree = await axios.get(
                `${surfAPI}/wave?spotId=${VITE_SURF_SPOT_THREE_ID}&days=1&intervalHours=1&maxHeights=true`
            );

            setSurfDataWithSplice(beachOne, VITE_SURF_SPOT_ONE_NAME, 0, setSurfData);
            setSurfDataWithSplice(beachTwo, VITE_SURF_SPOT_TWO_NAME, 1, setSurfData);
            setSurfDataWithSplice(beachThree, VITE_SURF_SPOT_THREE_NAME, 2, setSurfData);
        };

        getSurfFromAPI();
        const interval = setInterval(getSurfFromAPI, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

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
                height: 200
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Grid item container justifyContent={"space-between"}>
                <Grid item>
                    <Typography style={{ fontSize: 32, fontWeight: 500 }}>Surf</Typography>
                </Grid>
                <Grid item>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item>
                            <WaterTemperature />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box pt={1} flexGrow={1}>
                {surfData.length > 0 ? <SurfGraph surfData={surfData} /> : <LoadingSurfData />}
            </Box>
        </Box>
    );
};

const LoadingSurfData = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const SurfGraph = (props: any) => {
    const theme = useTheme();
    return (
        <ResponsiveContainer width={"99%"} height={"100%"}>
            <BarChart
                data={props.surfData.sort((a: any, b: any) =>
                    a.id > b.id ? 1 : a.id < b.id ? -1 : 0
                )}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                    dataKey="waveHeight"
                    domain={[
                        0,
                        Math.floor(
                            Math.max(...props.surfData.map((item: any) => item.waveHeight))
                        ) + 3
                    ]}
                    hide
                />
                <XAxis dataKey="name" />
                <Bar dataKey="waveHeight" fill={theme.palette.primary.main} minPointSize={5}>
                    <LabelList dataKey="waveHeight" content={renderCustomizedLabel} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const renderCustomizedLabel = (props: any) => {
    const theme = useTheme();
    const { x, y, width, value } = props;
    const radius = 10;
    const waveHeight = Math.round(value * 2) / 2;
    const isDecimal = waveHeight % 1 !== 0;
    return (
        <text
            style={{ fontWeight: 600 }}
            x={x + width / 2}
            y={y - radius}
            fill={theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {isDecimal ? waveHeight.toFixed(1) : waveHeight.toFixed(0) + " ft"}
        </text>
    );
};

const WaterTemperature = () => {
    const { VITE_NOAA_STATION, VITE_TIME_INTERVAL } = import.meta.env;

    const noaaAPI = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const waterTemperature = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `${noaaAPI}?date=latest&station=${VITE_NOAA_STATION}&product=water_temperature&units=english&time_zone=lst_ldt&format=json`
    );

    if (!waterTemperature?.data) return null;
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <DeviceThermostat sx={{ fontSize: 20 }} />
            <Typography sx={{ pl: 1, fontSize: 20, fontWeight: 500 }}>
                {parseInt(waterTemperature?.data[0].v) + "°F"}
            </Typography>
        </Box>
    );
};

const setSurfDataWithSplice = (r: any, location: string, id: number, setSurfData: Function) => {
    setSurfData((surfData: any) => {
        const isItem = surfData.some((item: any) => item.name === location);
        surfData.splice(
            isItem ? surfData.findIndex((item: any) => item.name === location) : 0,
            isItem ? 1 : 0,
            {
                id: id,
                name: location,
                waveHeight: calculateTodaysAverage(r.data.data.wave)
            }
        );
        return surfData;
    });
};

const calculateTodaysAverage = (data: any) =>
    data.map((item: any) => item.surf.max).reduce((a: any, b: any) => a + b) / data.length;

export default SurfCard;
