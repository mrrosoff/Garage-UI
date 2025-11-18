import { useEffect, useState } from "react";

import { Box, Grid, LinearProgress, Typography, useTheme } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { grey, purple } from "@mui/material/colors";

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

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

interface TideData {
    t: string;
    v: string;
}

interface ReformatttedTideData {
    time: number;
    prediction: number;
    actual?: number;
}

interface TideTimes {
    highTide: number;
    lowTide: number;
    nextTideIsLow: boolean | null;
}

const formatString = "yyyy-MM-dd HH:mm";

const TideCard = () => {
    const { VITE_TIME_INTERVAL, VITE_NOAA_STATION } = import.meta.env;
    const noaaAPI = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const noaaPredicationApi = `${noaaAPI}?date=today&station=${VITE_NOAA_STATION}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
    const noaaActualApi = `${noaaAPI}?date=today&station=${VITE_NOAA_STATION}&product=one_minute_water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;

    const tidePredictionData: { predictions: TideData[] } = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        noaaPredicationApi
    );
    const tideActualData: { data: TideData[] } = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        noaaActualApi
    );

    const [graphMinHeight, setGraphMinHeight] = useState<number>();
    const [graphMaxHeight, setGraphMaxHeight] = useState<number>();
    const [graphData, setGraphData] = useState<ReformatttedTideData[]>();

    useEffect(() => {
        if (!tidePredictionData?.predictions) return;

        let toBeGraphData: ReformatttedTideData[] = tidePredictionData.predictions.map(
            (prediction) => ({
                time: DateTime.fromFormat(prediction.t, formatString).toMillis(),
                prediction: parseFloat(prediction.v || "0")
            })
        );

        setGraphMinHeight(Math.min(...toBeGraphData.map((item) => item.prediction)) - 0.5);
        setGraphMaxHeight(Math.max(...toBeGraphData.map((item) => item.prediction)) + 0.5);

        if (tideActualData && tideActualData.data) {
            const actualData = tideActualData.data
                .map((item) => ({
                    time: DateTime.fromFormat(item.t, formatString).toMillis(),
                    actual: parseFloat(item.v || "0")
                }))
                .filter((datapoint) => datapoint.actual);

            toBeGraphData = toBeGraphData.map((prediction) => ({
                ...prediction,
                ...actualData.find((actual: any) => actual.time === prediction.time)
            }));
        }

        setGraphData(toBeGraphData);
    }, [tidePredictionData, tideActualData]);

    return (
        <Box
            pt={1}
            pl={2}
            pr={2}
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: grey[300],
                borderRadius: 1,
                height: "100%"
            }}
            display={"flex"}
            flexDirection={"column"}
        >
            <Grid container justifyContent={"space-between"}>
                <Grid>
                    <Typography style={{ fontSize: 30, fontWeight: 500 }}>Tide</Typography>
                </Grid>
                <Grid>
                    {graphData && (
                        <TideTimes graphData={graphData} tideActualData={tideActualData?.data} />
                    )}
                </Grid>
            </Grid>
            <Box pt={1} flexGrow={1}>
                {graphMinHeight && graphMaxHeight && graphData ? (
                    <TideGraph
                        graphData={graphData}
                        minHeight={graphMinHeight}
                        maxHeight={graphMaxHeight}
                        showTideActualData={!!tideActualData}
                    />
                ) : (
                    <LoadingTideData />
                )}
            </Box>
        </Box>
    );
};

const LoadingTideData = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const TideTimes = (props: { graphData: ReformatttedTideData[]; tideActualData: TideData[] }) => {
    const [highTide, setHighTide] = useState<number>();
    const [lowTide, setLowTide] = useState<number>();
    const [nextTideIsLow, setNextTideIsLow] = useState<boolean | null>();

    useEffect(() => {
        const { highTide, lowTide, nextTideIsLow } = getTideTimes(
            props.graphData,
            props.tideActualData
        );
        setHighTide(highTide);
        setLowTide(lowTide);
        setNextTideIsLow(nextTideIsLow);
    }, [props.graphData, props.tideActualData]);

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

const TideTime = (props: any) => {
    if (!props.data) return null;
    const Icon = props.tide === "low" ? ArrowDownwardIcon : ArrowUpwardIcon;
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Icon sx={{ fontSize: 20 }} />
            <Typography sx={{ pl: 1, fontSize: 20, fontWeight: 500 }}>
                {DateTime.fromMillis(props.data).toLocaleString(DateTime.TIME_SIMPLE)}
            </Typography>
        </Box>
    );
};

const TideGraph = (props: {
    graphData: any;
    minHeight: number;
    maxHeight: number;
    showTideActualData: boolean;
}) => {
    const theme = useTheme();
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={props.graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    interval="preserveStartEnd"
                    minTickGap={40}
                    tickFormatter={(tickItem) =>
                        DateTime.fromMillis(tickItem).toLocaleString(DateTime.TIME_SIMPLE)
                    }
                    domain={["dataMin", "dataMax"]}
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
                />
                {props.showTideActualData && (
                    <Line
                        name="Actual"
                        type="monotone"
                        dataKey="actual"
                        stroke={theme.palette.secondary.main}
                        dot={false}
                        strokeWidth={5}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
};

const getTideTimes = (
    predictionData: ReformatttedTideData[],
    actualData: TideData[]
): TideTimes => {
    if (!actualData) {
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
    let graphStartsDown = currentPrediction > nextPrediction;
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
        returnObject[graphStartsDown ? "highTide" : "lowTide"] = null as any;
    }
    return returnObject;
};

export default TideCard;
