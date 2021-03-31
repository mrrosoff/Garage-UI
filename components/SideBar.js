import React from "react";

import { Box, Grid, IconButton, Paper } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import HomeIcon from "@material-ui/icons/Home";

import { remote } from "electron";
const mainProcess = remote.require("./main.js");

const useStyles = makeStyles((theme) => ({
  garageIcon: {
    width: "80%",
    height: "80%",
  },
}));

const SideBar = (props) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction={"column"}
      spacing={1}
      style={{ height: "100%" }}
      justify={"center"}
      alignItems={"center"}
      alignContent={"center"}
    >
      <Grid item style={{ width: "100%" }}>
        <IconButton
          style={{ width: "100%" }}
          onClick={() => mainProcess.garageSwitch()}
        >
          <HomeIcon className={classes.garageIcon} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default SideBar;