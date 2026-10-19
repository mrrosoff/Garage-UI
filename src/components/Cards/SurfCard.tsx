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

import config from "../../config";
import useExternalAPIOnInterval from "../../hooks/useExternalAPIOnInterval";
import { getSurfConditions, SurfConditions } from "../../surfConditions";
import Card, { LoadingBar } from "./Card";

interface SurfSpotData {
    name: string;
    maxHeight: number;
    label: string;
}

const toSpotData = (conditions: SurfConditions, name: string): SurfSpotData => ({
    name,
    maxHeight: conditions.maxHeight,
    label:
        conditions.minHeight === conditions.maxHeight
            ? `${conditions.maxHeight} ft`
            : `${conditions.minHeight}-${conditions.maxHeight} ft`
});

const SurfCard = () => {
    const { timeInterval, surfSpots } = config;

    const [surfData, setSurfData] = useState<SurfSpotData[]>([]);

    useEffect(() => {
        // Cheap to call often: it only hits the API when a scheduled refresh is due
        const updateSurfData = async () => {
            const conditions = await getSurfConditions();
            setSurfData(
                conditions.flatMap((spot, index) =>
                    spot ? [toSpotData(spot, surfSpots[index].name)] : []
                )
            );
        };

        updateSurfData();
        const interval = setInterval(updateSurfData, timeInterval);
        return () => clearInterval(interval);
    }, [timeInterval, surfSpots]);

    return (
        <Card
            title={"Surf"}
            height={240}
            action={
                <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                    <Grid>
                        <WaterTemperature />
                    </Grid>
                </Grid>
            }
        >
            {surfData.length > 0 ? <SurfGraph surfData={surfData} /> : <LoadingBar />}
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
                    dataKey="maxHeight"
                    domain={[0, Math.max(...props.surfData.map((item) => item.maxHeight)) + 3]}
                    hide
                />
                <XAxis dataKey="name" tick={{ fontSize: 18 }} />
                <Bar
                    dataKey="maxHeight"
                    fill={theme.palette.primary.main}
                    minPointSize={5}
                    isAnimationActive={!hasAnimated}
                    onAnimationEnd={() => setHasAnimated(true)}
                >
                    <LabelList
                        dataKey="label"
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
    return (
        <text
            style={{ fontWeight: 600, fontSize: 18 }}
            x={x + width / 2}
            y={y - radius}
            fill={color}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {value}
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
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <DeviceThermostat sx={{ fontSize: 28 }} />
            <Typography sx={{ pl: 1, fontSize: 28, fontWeight: 500 }}>
                {parseInt(waterTemperature.data[0].v) + "°F"}
            </Typography>
        </Box>
    );
};

export default SurfCard;
