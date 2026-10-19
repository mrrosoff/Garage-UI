import { useMemo, useState } from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { purple } from "@mui/material/colors";

import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import { DateTime } from "luxon";

import config from "../../config";
import useExternalAPIOnInterval from "../../hooks/useExternalAPIOnInterval";
import Card, { LoadingBar } from "./Card";

interface TideData {
    t: string;
    v: string;
}

interface ReformattedTideData {
    time: number;
    prediction: number;
    actual?: number;
}

interface TideTimes {
    highTide: number | null;
    lowTide: number | null;
    nextTideIsLow: boolean | null;
}

const formatString = "yyyy-MM-dd HH:mm";

const TideCard = () => {
    const noaaAPI = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const noaaPredictionApi = `${noaaAPI}?date=today&station=${config.noaaStation}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
    const noaaActualApi = `${noaaAPI}?date=today&station=${config.noaaStation}&product=one_minute_water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;

    const tidePredictionData = useExternalAPIOnInterval<{ predictions?: TideData[] }>(
        config.timeInterval,
        noaaPredictionApi
    );
    const tideActualData = useExternalAPIOnInterval<{ data?: TideData[] }>(
        config.timeInterval,
        noaaActualApi
    );

    const graph = useMemo(() => {
        if (!tidePredictionData?.predictions) return undefined;

        let graphData: ReformattedTideData[] = tidePredictionData.predictions.map((prediction) => ({
            time: DateTime.fromFormat(prediction.t, formatString).toMillis(),
            prediction: parseFloat(prediction.v || "0")
        }));

        const minHeight = Math.min(...graphData.map((item) => item.prediction)) - 0.5;
        const maxHeight = Math.max(...graphData.map((item) => item.prediction)) + 0.5;

        if (tideActualData?.data) {
            const actualData = tideActualData.data
                .filter((item) => item.v)
                .map((item) => ({
                    time: DateTime.fromFormat(item.t, formatString).toMillis(),
                    actual: parseFloat(item.v)
                }));

            graphData = graphData.map((prediction) => ({
                ...prediction,
                ...actualData.find((actual) => actual.time === prediction.time)
            }));
        }

        return { graphData, minHeight, maxHeight };
    }, [tidePredictionData, tideActualData]);

    return (
        <Card
            title={"Tide"}
            height={"100%"}
            action={
                graph && (
                    <TideTimes graphData={graph.graphData} tideActualData={tideActualData?.data} />
                )
            }
        >
            {graph ? (
                <TideGraph
                    graphData={graph.graphData}
                    minHeight={graph.minHeight}
                    maxHeight={graph.maxHeight}
                    showTideActualData={!!tideActualData?.data}
                />
            ) : (
                <LoadingBar />
            )}
        </Card>
    );
};

const TideTimes = (props: { graphData: ReformattedTideData[]; tideActualData?: TideData[] }) => {
    const { highTide, lowTide, nextTideIsLow } = useMemo(
        () => getTideTimes(props.graphData, props.tideActualData),
        [props.graphData, props.tideActualData]
    );

    if (nextTideIsLow === null) return null;

    return (
        <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
            <Grid>
                <TideTime
                    tide={nextTideIsLow ? "low" : "high"}
                    data={nextTideIsLow ? lowTide : highTide}
                />
            </Grid>
            <Grid>
                <TideTime
                    tide={nextTideIsLow ? "high" : "low"}
                    data={nextTideIsLow ? highTide : lowTide}
                />
            </Grid>
        </Grid>
    );
};

const TideTime = (props: { tide: "low" | "high"; data: number | null }) => {
    if (!props.data) return null;
    const Icon = props.tide === "low" ? ArrowDownwardIcon : ArrowUpwardIcon;
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Icon sx={{ fontSize: 28 }} />
            <Typography sx={{ pl: 1, fontSize: 28, fontWeight: 500 }}>
                {DateTime.fromMillis(props.data).toFormat("h:mm a")}
            </Typography>
        </Box>
    );
};

const TideGraph = (props: {
    graphData: ReformattedTideData[];
    minHeight: number;
    maxHeight: number;
    showTideActualData: boolean;
}) => {
    const theme = useTheme();
    const [hasAnimated, setHasAnimated] = useState(false);
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={props.graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    interval="preserveStartEnd"
                    minTickGap={40}
                    tickFormatter={(tickItem) => DateTime.fromMillis(tickItem).toFormat("h:mm a")}
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 16 }}
                />
                <YAxis hide scale={"linear"} domain={[props.minHeight, props.maxHeight]} />
                <CartesianGrid strokeDasharray="4 4" horizontalPoints={[0]} />
                <ReferenceLine x={DateTime.now().toMillis()} stroke={purple[500]} strokeWidth={2} />
                <Line
                    name="Predicted"
                    type="monotone"
                    dataKey="prediction"
                    stroke={theme.palette.primary.main}
                    dot={false}
                    strokeWidth={6}
                    isAnimationActive={!hasAnimated}
                    onAnimationEnd={() => setHasAnimated(true)}
                />
                {props.showTideActualData && (
                    <Line
                        name="Actual"
                        type="monotone"
                        dataKey="actual"
                        stroke={theme.palette.secondary.main}
                        dot={false}
                        strokeWidth={5}
                        isAnimationActive={!hasAnimated}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
};

const getTideTimes = (
    predictionData: ReformattedTideData[],
    actualData?: TideData[]
): TideTimes => {
    if (!actualData?.length) {
        return { highTide: 0, lowTide: 0, nextTideIsLow: null };
    }
    let i = 0;
    const lastActualDate = DateTime.fromFormat(
        actualData[actualData.length - 1].t,
        formatString
    ).toMillis();

    for (; i < predictionData.length; i++) {
        if (predictionData[i].time > lastActualDate) break;
    }

    if (i + 1 >= predictionData.length) {
        return { highTide: 0, lowTide: 0, nextTideIsLow: null };
    }
    const currentPrediction = predictionData[i].prediction;
    const nextPrediction = predictionData[i + 1].prediction;
    const graphStartsDown = currentPrediction > nextPrediction;
    let firstInflectionPoint = predictionData[i + 1];
    i += 2;
    if (i >= predictionData.length) {
        return { highTide: 0, lowTide: 0, nextTideIsLow: null };
    }

    for (; i < predictionData.length; i++) {
        const lastPrediction = firstInflectionPoint.prediction;
        const currentPrediction = predictionData[i].prediction;
        const nextDataPointIsBelow = lastPrediction > currentPrediction;
        if (graphStartsDown !== nextDataPointIsBelow) break;
        firstInflectionPoint = predictionData[i];
    }

    let secondInflectionPoint = firstInflectionPoint;
    i += 1;
    if (i >= predictionData.length) {
        return { highTide: 0, lowTide: 0, nextTideIsLow: null };
    }

    for (; i < predictionData.length; i++) {
        const lastPrediction = secondInflectionPoint.prediction;
        const currentPrediction = predictionData[i].prediction;
        const nextDataPointIsBelow = lastPrediction > currentPrediction;
        if (!graphStartsDown !== nextDataPointIsBelow) break;
        secondInflectionPoint = predictionData[i];
    }

    const highTide = graphStartsDown ? secondInflectionPoint.time : firstInflectionPoint.time;
    const lowTide = graphStartsDown ? firstInflectionPoint.time : secondInflectionPoint.time;

    const returnObject: TideTimes = { highTide, lowTide, nextTideIsLow: lowTide < highTide };
    if (i === predictionData.length) {
        returnObject[graphStartsDown ? "highTide" : "lowTide"] = null;
    }
    return returnObject;
};

export default TideCard;
