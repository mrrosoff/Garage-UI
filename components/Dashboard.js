import React, { useEffect, useState } from "react";

import { Box, Grid, Paper } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import { makeStyles } from "@material-ui/core/styles";

import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  cardBox: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: grey[300],
    borderRadius: 5,
  },
}));

const DashBoard = (props) => {
  const classes = useStyles();

  const [weatherData, setWeatherData] = useState();
  const [surfData, setSurfData] = useState();
  const [tidePredictionData, setTidePredictionData] = useState();
  const [tideActualData, setTideActualData] = useState();

  useEffect(() => {
    const getWeatherFromAPI = () => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?zip=92130&units=imperial&appid=114e2f8559d9daba8a4ad4e51464c8b6`
        )
        .then((r) => setWeatherData(r.data));
    };

    getWeatherFromAPI();
    const interval = setInterval(getWeatherFromAPI, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getTidesFromAPI = () => {
      axios
        .get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
        )
        .then((r) => setTidePredictionData(r.data));

      axios
        .get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=one_minute_water_level&datum=MLLW&time_zone=lst&units=english&format=json`
        )
        .then((r) => setTideActualData(r.data));
    };

    getTidesFromAPI();
    const interval = setInterval(getTidesFromAPI, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getSurfFromAPI = () => {
      axios
        .get(
          `https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a77088af&days=5&intervalHours=3&maxHeights=true`
        )
        .then((r) => setSurfData(r.data));
    };

    getSurfFromAPI();
    const interval = setInterval(getSurfFromAPI, 60000);
    return () => clearInterval(interval);
  }, []);

  console.log(tideActualData);
  return (
    <Box height={"100vh"} p={4}>
      <Grid container style={{ height: "100%" }} spacing={3}>
        <Grid item sm={4} style={{ height: "100%" }}>
          <SideBar {...props} />
        </Grid>
        <Grid item sm={8} style={{ height: "100%" }}>
            <Paper
              style={{ width: "100%", height: "100%" }}
              className={classes.root}
            >
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  {weatherData ? (
                    <WeatherCard weatherData={weatherData} />
                  ) : null}
                </Grid>
                <Grid item xs={6}>
                  {surfData && surfData.data ? (
                    <SurfCard surfData={surfData} />
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  {tidePredictionData ? (
                    <TideCard
                      tidePredictionData={tidePredictionData}
                      tideActualData={tideActualData}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoard;
