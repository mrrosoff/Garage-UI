import React from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import OpacityIcon from "@mui/icons-material/Opacity";
import { grey } from "@mui/material/colors";

import { DateTime } from "luxon";

const useStyles = makeStyles((theme) => ({
	cardBox: {
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: grey[300],
		borderRadius: 5,
		width: 240,
		height: 200
	}
}));

const WeatherCard = (props) => {

	if (!props.weatherData) {
		return null;
	}

	const classes = useStyles();
	
	return (
		<Box p={2} className={classes.cardBox}>
			<Grid container direction={"column"} spacing={1}>
				<Grid item>
					<Typography style={{ fontSize: 32, fontWeight: 500 }}>Weather</Typography>
				</Grid>
				<Grid item>
					<Grid container direction={"column"} spacing={2}>
						<Grid item>
							<Box display={"flex"} alignItems={"center"}>
								<Box display={"flex"} flexDirection={"column"}>
									<Typography
										style={{
											fontSize: 28,
											fontWeight: 500
										}}
									>
										{Math.floor(props.weatherData[0].TempF) + " °F"}
									</Typography>
									<Typography style={{ fontSize: 18 }}>
										{DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
									</Typography>
								</Box>
								<Box pl={4}>
									<i
										className={`wi wi-owm-${props.weatherData[0].Conditions}`}
										alt={"Weather Icon"}
										style={{ fontSize: 50 }}
									/>
								</Box>
							</Box>
						</Grid>
						<Grid item>
							<OtherDetails {...props} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

const OtherDetails = (props) => {
	const theme = useTheme();
	
	return (
		<Grid container spacing={2}>
			<Grid item>
				<Box display={"flex"} alignItems={"center"}>
					<OpacityIcon
						style={{
							fontSize: 18,
							fill: theme.palette.primary.main
						}}
					/>
					<Box pl={1}>
						<Typography style={{ fontSize: 16, fontWeight: 400 }}>
							{props.weatherData[0].Humidity + "%"}
						</Typography>
					</Box>
				</Box>
			</Grid>
			<Grid item>
				<Box display={"flex"} alignItems={"center"}>
					{/* <i
						className={`wi wi-wind from--deg`}
						style={{
							fontSize: 22,
							color: theme.palette.primary.main
						}}
					/> */}
					<Box pl={1}>
						<Typography style={{ fontSize: 16, fontWeight: 400 }}>
							{Math.floor(props.weatherData[0].WindMph) + " mi/h"}
						</Typography>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default WeatherCard;
