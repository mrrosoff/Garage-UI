import React from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import makeStyles from "@mui/styles/makeStyles";
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

const useStyles = makeStyles((theme) => ({
	cardBox: {
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: grey[300],
		borderRadius: 5,
		height: "100%"
	}
}));

const formatString = "yyyy-MM-dd HH:mm";

const TideCard = (props) => {
	const classes = useStyles();

	if (!props.tidePredictionData.predictions) {
		return null;
	}

	const domain = DateTime.fromISO(
		DateTime.fromFormat(props.tidePredictionData.predictions[0].t, formatString).toISODate()
	);

	const predictionData = props.tidePredictionData.predictions.map(({ t, v }) => ({
		time: DateTime.fromFormat(t, formatString).toMillis(),
		prediction: v
	}));

	let data = predictionData;
	const { highTide, lowTide, nextTideIsLow } = getTideTimes(predictionData, props.tideActualData);

	if (props.tideActualData && props.tideActualData.data) {
		const actualData = props.tideActualData.data.map(({ t, v }) => ({
			time: DateTime.fromFormat(t, formatString).toMillis(),
			actual: v
		}));
		data = predictionData.map((obj) => ({
			...obj,
			...actualData.find((item) => item.time === obj.time)
		}));
	}

	return (
		<Box p={2} className={classes.cardBox} display={"flex"} flexDirection={"column"}>
			<Grid item container justifyContent={"space-between"}>
				<Grid item>
					<Typography style={{ fontSize: 32, fontWeight: 500 }}>Tide</Typography>
				</Grid>
				{/* <Grid item>
					{(lowTide || highTide) && (
						<Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
							<Grid item>
								<TideTime
									tide={nextTideIsLow ? "low" : "high"}
									data={nextTideIsLow ? lowTide : highTide}
								/>
							</Grid>
							<Grid item>
								<TideTime
									tide={nextTideIsLow ? "high" : "low"}
									data={nextTideIsLow ? highTide : lowTide}
								/>
							</Grid>
						</Grid>
					)}
				</Grid> */}
			</Grid>
			<Box pt={2} flexGrow={1}>
				<TideGraph
					data={data}
					domain={domain}
					predictionData={predictionData}
					showTideActualData={!!props.tideActualData}
				/>
			</Box>
		</Box>
	);
};

const TideTime = (props) => {
	if (!props.data) return null;
	const Icon = props.tide === "low" ? ArrowDownwardIcon : ArrowUpwardIcon;
	return (
		<Box display={"flex"} justifyContent={"center"} alignItems={"center"} spacing={1}>
			<Icon sx={{ fontSize: 20 }} />
			<Typography sx={{ pl: 1, fontSize: 20, fontWeight: 500 }}>
				{DateTime.fromMillis(props.data).toLocaleString(DateTime.TIME_SIMPLE)}
			</Typography>
		</Box>
	);
};

const TideGraph = (props) => {
	const theme = useTheme();
	const minHeight = Math.min(...props.predictionData.map((item) => item.prediction)) - 0.5;
	const maxHeight = Math.max(...props.predictionData.map((item) => item.prediction)) + 0.5;
	return (
		<ResponsiveContainer width={"100%"} height={"100%"}>
			<LineChart data={props.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
				<YAxis hide scale={"linear"} domain={[minHeight, maxHeight]} />
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

const getTideTimes = (predictionData, actualData) => {
	if (!actualData || !actualData.data) {
		return { highTide: null, lowTide: null, nextTideIsLow: null };
	}
	let i = 0;
	const lastActualDate = DateTime.fromFormat(
		actualData.data[actualData.data.length - 1].t,
		formatString
	).toMillis();

	for (; i < predictionData.length; i++) {
		if (predictionData[i].time > lastActualDate) break;
	}

	if (i + 1 >= predictionData.length) {
		return { highTide: null, lowTide: null, nextTideIsLow: null };
	}
	const currentPrediction = parseFloat(predictionData[i].prediction);
	const nextPrediction = parseFloat(predictionData[i + 1].prediction);
	let graphStartsDown = currentPrediction > nextPrediction;
	let firstInflectionPoint = predictionData[i + 1];
	i += 2;
	if (i >= predictionData.length) {
		return { highTide: null, lowTide: null, nextTideIsLow: null };
	}

	for (; i < predictionData.length; i++) {
		const lastPrediction = parseFloat(firstInflectionPoint.prediction);
		const currentPrediction = parseFloat(predictionData[i].prediction);
		const nextDataPointIsBelow = lastPrediction > currentPrediction;
		if (graphStartsDown !== nextDataPointIsBelow) break;
		firstInflectionPoint = predictionData[i];
	}

	let secondInflectionPoint = firstInflectionPoint;
	i += 1;
	if (i >= predictionData.length) {
		return { highTide: null, lowTide: null, nextTideIsLow: null };
	}

	for (; i < predictionData.length; i++) {
		const lastPrediction = parseFloat(secondInflectionPoint.prediction);
		const currentPrediction = parseFloat(predictionData[i].prediction);
		const nextDataPointIsBelow = lastPrediction > currentPrediction;
		if (!graphStartsDown !== nextDataPointIsBelow) break;
		secondInflectionPoint = predictionData[i];
	}

	const highTide = graphStartsDown ? secondInflectionPoint.time : firstInflectionPoint.time;
	const lowTide = graphStartsDown ? firstInflectionPoint.time : secondInflectionPoint.time;
	let nullTide = "throwAway";

	if (i === predictionData.length) {
		nullTide = graphStartsDown ? "highTide" : "lowTide";
	}

	return { highTide, lowTide, nextTideIsLow: lowTide < highTide, [nullTide]: null };
};

export default TideCard;
