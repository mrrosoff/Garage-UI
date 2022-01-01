import React, { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import WeatherCard from "./Cards/WeatherCard";

import axios from "axios";
import { DateTime } from "luxon";
import SnowfallCard from "./Cards/SnowfallCard";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3)
	}
}));

const formatString = "MM-dd";

const specialDays = [
	{ date: DateTime.fromFormat("01-01", formatString), text: "Happy New Year", emoji: "🎉" },
	{ date: DateTime.fromFormat("02-14", formatString), text: "Happy Valentines Day", emoji: "💖" },
	{ date: DateTime.fromFormat("05-16", formatString), text: "Happy Birthday Max", emoji: "🎉" },
	{ date: DateTime.fromFormat("05-24", formatString), text: "Happy Birthday Jaden", emoji: "🎉" },
	{ date: DateTime.fromFormat("07-04", formatString), text: "Happy Forth Of July", emoji: "🇺🇸" },
	{
		date: DateTime.fromFormat("07-19", formatString),
		text: "Happy Birthday Mother",
		emoji: "🎉"
	},
	{ date: DateTime.fromFormat("10-31", formatString), text: "Happy Halloween", emoji: "🎃" },
	{ date: DateTime.fromFormat("12-17", formatString), text: "Happy Birthday Jack", emoji: "🎉" }
];

const DashBoard = (props) => {
	const classes = useStyles();

	const [weatherData, setWeatherData] = useState();
	const [snowfallData, setSnowfallData] = useState();
	const [specialDay, setSpecialDay] = useState();

	useEffect(() => {
		const getWeatherFromAPI = async () => {
			const { data } = await axios.get(
				// Steamboat Resort API
				"https://mtnpowder.com/feed/6/weather"
			);
			
			setWeatherData(data.CurrentConditions);
		};

		getWeatherFromAPI();
		const interval = setInterval(getWeatherFromAPI, 60000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const getSnowfallFromAPI = async () => {
			const { data } = await axios.get(
				// Steamboat Resort API
				"https://mtnpowder.com/feed/6/snowfall"
			);
			
			setSnowfallData(data.SnowfallEvents);
		};

		getSnowfallFromAPI();
		const interval = setInterval(getSnowfallFromAPI, 60000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const getSpecialDay = async () => {
			const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
			if (specialDay) {
				setSpecialDay(specialDay);
			}
		};

		const interval = setInterval(getSpecialDay, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Box height={"100%"} p={3}>
			<Box height={"100%"} display={"flex"} flexDirection={"row"}>
				<Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"}>
					<Box display={"flex"}>
						<Box>{weatherData && <WeatherCard weatherData={weatherData} />}</Box>
						<Box pl={3} flexGrow={1}></Box>
					</Box>
					<Box pt={3} flexGrow={1}>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default DashBoard;
