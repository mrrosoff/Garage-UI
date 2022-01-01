import React from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { grey, blue } from "@mui/material/colors";

import {
	ComposedChart,
	Area,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList
} from "recharts";
import { DateTime, Duration } from "luxon";

const useStyles = makeStyles((theme) => ({
	cardBox: {
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: grey[300],
		borderRadius: 5,
		height: "100%"
	}
}));

const SnowfallCard = (props) => {
	const classes = useStyles();

	if (!props.snowfallData) {
		return null;
	}

	const transformData = props.snowfallData
		.map(({ SnowIn, CreateDate }) => ({
			SnowIn,
			time: DateTime.fromISO(CreateDate).toMillis()
		}))
		.filter(({ time }) => {
			const lastMonth = Duration.fromObject({ month: 1 });
			return time > DateTime.now().minus(lastMonth).toMillis();
		});

	const fullMonthData = [];
	for (let i = 0; i < 30; i++) {
		const iDays = Duration.fromObject({ days: 30 - i });
		const iDaysAgo = DateTime.now().minus(iDays);
		const foundPoint = transformData.find(
			({ time }) =>
				DateTime.fromMillis(time).day === iDaysAgo.day &&
				DateTime.fromMillis(time).month === iDaysAgo.month
		);

		if (foundPoint) {
			fullMonthData.push(foundPoint);
		} else {
			fullMonthData.push({ SnowIn: 0, time: iDaysAgo.toMillis() });
		}
	}

	let accumilation = 0;

	for (let i = 0; i < 30; i++) {
		accumilation += parseFloat(fullMonthData[i].SnowIn);
		fullMonthData[i] = { ...fullMonthData[i], Accumilation: accumilation };
	}

	console.log(fullMonthData);

	return (
		<Box p={2} className={classes.cardBox} display={"flex"} flexDirection={"column"}>
			<Grid item container justifyContent={"space-between"}>
				<Grid item>
					<Typography style={{ fontSize: 32, fontWeight: 500 }}>
						Snowfall Chart
					</Typography>
				</Grid>
			</Grid>
			<Box pt={2} flexGrow={1}>
				<SnowfallChart snowfallData={fullMonthData} />
			</Box>
		</Box>
	);
};

const renderCustomizedLabel = (props) => {
	const { x, y, width, value } = props;
	const radius = 12;
	const theme = useTheme();
	return (
		<g>
			<text
				x={x + width / 2}
				y={y - radius}
				textAnchor="middle"
				dominantBaseline="middle"
				color={theme.palette.primary.main}
				fontSize={15}
			>
				{value != 0 ? value + '"' : ""}
			</text>
		</g>
	);
};

const SnowfallChart = (props) => {
	const snowInMax = Math.max(...props.snowfallData.map((data) => parseFloat(data.SnowIn))) + 2;
	const accumMax =
		Math.max(...props.snowfallData.map((data) => parseFloat(data.Accumilation))) + 10;

	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart
				data={props.snowfallData}
				margin={{
					top: 20,
					right: 20,
					bottom: 20,
					left: 20
				}}
			>
				<CartesianGrid stroke="#f5f5f5" />
				<XAxis
					dataKey="time"
					type="number"
					scale="time"
					interval="preserveStartEnd"
					minTickGap={40}
					tickFormatter={(tickItem) => DateTime.fromMillis(tickItem).toFormat("MMMM d")}
					domain={["dataMin", "dataMax"]}
				/>

				<YAxis dataKey="Accumilation" scale={"linear"} domain={[0, accumMax]} yAxisId="1" />
				<YAxis hide dataKey="SnowIn" scale={"linear"} domain={[0, snowInMax]} yAxisId="2" />

				<Area
					type="monotone"
					dataKey="Accumilation"
					fill="#CCCCCC"
					stroke="#808080"
					yAxisId="1"
				/>

				<Bar dataKey="SnowIn" barSize={5} fill={blue[500]} yAxisId="2">
					<LabelList dataKey="SnowIn" content={renderCustomizedLabel} />
				</Bar>
			</ComposedChart>
		</ResponsiveContainer>
	);
};

export default SnowfallCard;
