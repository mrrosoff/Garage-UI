import React, { Fragment } from "react";

import { Box, Divider, Typography, useTheme } from "@mui/material";

import { DateTime } from "luxon";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";


const ForecastCard = (props: any) => {
	const theme = useTheme();
	const { VITE_TIME_INTERVAL, VITE_RESORT_SNOWFALL, VITE_SKI_RESORT } = import.meta.env;
	const resortData= callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        "https://mtnpowder.com/feed?resortId=6" //TODO: Replace
    );
	const forecastData = resortData?.Forecast;
	if (!forecastData) {
		return null;
	}

	const days = ["Two", "Three", "Four", "Five"];
	const weatherForecast = days.map((day) => forecastData[`${day}Day`]);
	
	return (
		<Box p={2} >
			<Box height={"100%"} display={"flex"} flexDirection={"column"}>
				<Typography style={{ fontSize: 32, fontWeight: 500 }}>Forecast</Typography>
				<Box
					pt={2}
					height={"100%"}
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"space-between"}
				>
					{weatherForecast.map((day, index) => {
						const shouldHaveDivider = index !== weatherForecast.length - 1;
						return (
							<Fragment key={index}>
								<Box
									p={1}
									display={"flex"}
									justifyContent={"space-between"}
									alignItems={"center"}
								>
									<span
										className={`weather-icon ico-${day.conditions}`}
										alt={"Weather Icon"}
										style={{ fontSize: 50 }}
									/>
									<Box>
										<Typography>
											{DateTime.fromISO(day.date).toFormat("EEE dd")}
										</Typography>
										<Typography>
											{day.temp_high_f} °F / {day.temp_low_f} °F
										</Typography>
									</Box>
									<Typography>{day.forecasted_snow_in} in</Typography>
									<Typography>
										{day.avewind ? day.avewind.dir : "N/A"} {day.avewind ? day.avewind.mph: "0mph"}
									</Typography>
								</Box>
								{shouldHaveDivider && <Divider />}
							</Fragment>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
};

export default ForecastCard;
