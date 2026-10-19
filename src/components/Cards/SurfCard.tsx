import { useEffect, useState } from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";
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

import axios from "axios";

import config from "../../config";
import useExternalAPIOnInterval from "../../hooks/useExternalAPIOnInterval";
import Card, { LoadingBar } from "./Card";

interface SurfSpotData {
    id: number;
    name: string;
    waveHeight: number;
}

const surfAPI = "https://services.surfline.com/kbyg/spots/forecasts";

const SurfCard = () => {
    const { timeInterval, surfSpots } = config;

    const [surfData, setSurfData] = useState<(SurfSpotData | undefined)[]>([]);

    useEffect(() => {
        const getSurfFromAPI = async () => {
            const results = await Promise.allSettled(
                surfSpots.map((spot) =>
                    axios.get(
                        `${surfAPI}/wave?spotId=${spot.id}&days=1&intervalHours=1&maxHeights=true`
                    )
                )
            );

            // Keep the last good value for any spot whose request failed
            setSurfData((previousData) =>
                results.map((result, index) => {
                    if (result.status === "rejected") {
                        console.error(
                            `Failed to fetch surf for ${surfSpots[index].name}:`,
                            result.reason
                        );
                        return previousData[index];
                    }
                    const waveHeight = calculateTodaysAverage(result.value.data?.data?.wave);
                    if (waveHeight === undefined) return previousData[index];
                    return { id: index, name: surfSpots[index].name, waveHeight };
                })
            );
        };

        getSurfFromAPI();
        const interval = setInterval(getSurfFromAPI, timeInterval);
        return () => clearInterval(interval);
    }, [timeInterval, surfSpots]);

    const loadedSurfData = surfData.filter((data): data is SurfSpotData => !!data);

    return (
        <Card
            title={"Surf"}
            height={240}
            action={
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid>
                        <WaterTemperature />
                    </Grid>
                </Grid>
            }
        >
            {surfSpots.length > 0 && loadedSurfData.length === surfSpots.length ? (
                <SurfGraph surfData={loadedSurfData} />
            ) : (
                <LoadingBar />
            )}
        </Card>
    );
};

const SurfGraph = (props: { surfData: SurfSpotData[] }) => {
    const theme = useTheme();
    const [hasAnimated, setHasAnimated] = useState(false);
    const labelColor = theme.palette.mode === "dark" ? "#FFFFFF" : "#000000";
    return (
        <ResponsiveContainer width={"99%"} height={"100%"}>
            <BarChart data={props.surfData}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                    dataKey="waveHeight"
                    domain={[
                        0,
                        Math.floor(Math.max(...props.surfData.map((item) => item.waveHeight))) + 3
                    ]}
                    hide
                />
                <XAxis dataKey="name" tick={{ fontSize: 18 }} />
                <Bar
                    dataKey="waveHeight"
                    fill={theme.palette.primary.main}
                    minPointSize={5}
                    isAnimationActive={!hasAnimated}
                    onAnimationEnd={() => setHasAnimated(true)}
                >
                    <LabelList
                        dataKey="waveHeight"
                        content={(labelProps: any) => renderCustomizedLabel(labelProps, labelColor)}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const renderCustomizedLabel = (props: any, color: string) => {
    const { x, y, width, value } = props;
    const radius = 10;
    const waveHeight = Math.round(value * 2) / 2;
    const isDecimal = waveHeight % 1 !== 0;
    return (
        <text
            style={{ fontWeight: 600, fontSize: 18 }}
            x={x + width / 2}
            y={y - radius}
            fill={color}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {waveHeight.toFixed(isDecimal ? 1 : 0) + " ft"}
        </text>
    );
};

const WaterTemperature = () => {
    const noaaAPI = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const waterTemperature = useExternalAPIOnInterval(
        config.timeInterval,
        `${noaaAPI}?date=latest&station=${config.noaaStation}&product=water_temperature&units=english&time_zone=lst_ldt&format=json`
    );

    if (!waterTemperature?.data) return null;
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <DeviceThermostat sx={{ fontSize: 28 }} />
            <Typography sx={{ pl: 1, fontSize: 28, fontWeight: 500 }}>
                {parseInt(waterTemperature.data[0].v) + "°F"}
            </Typography>
        </Box>
    );
};

const calculateTodaysAverage = (data?: { surf: { max: number } }[]) => {
    if (!data?.length) return undefined;
    return data.reduce((sum, item) => sum + item.surf.max, 0) / data.length;
};

export default SurfCard;
