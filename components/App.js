import React from "react";

import "dotenv/config";

import { CssBaseline } from "@mui/material";
import { blue, green } from "@mui/material/colors";

import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import { DateTime } from "luxon";

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import DashBoard from "./Dashboard";

const App = () => {
    const sunData = callExternalAPIOnInterval(
        process.env.timeInterval,
        `https://api.sunrise-sunset.org/json?lat=${process.env.lat}&lng=${process.env.lng}&formatted=0`
    );

    let mode = "light";

    if (sunData?.results) {
        const nowHour = DateTime.now().hour;
        const sunsetHour = DateTime.fromISO(sunData.results.sunset).hour;
        const sunriseHour = DateTime.fromISO(sunData.results.sunrise).hour;

        if (nowHour < sunriseHour + 1 || nowHour > sunsetHour + 1) {
            mode = "dark";
        }
    }

    const theme = responsiveFontSizes(
        createTheme({
            palette: { mode, primary: { main: blue[500] }, secondary: { main: green[500] } }
        })
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <DashBoard />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
