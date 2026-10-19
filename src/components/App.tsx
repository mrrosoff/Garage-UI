import { CssBaseline, PaletteMode } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import { DateTime } from "luxon";

import config from "../config";
import useExternalAPIOnInterval from "../hooks/useExternalAPIOnInterval";
import Dashboard from "./Dashboard";

const App = () => {
    const sunData = useExternalAPIOnInterval(
        config.timeInterval,
        `https://api.sunrise-sunset.org/json?lat=${config.latitude}&lng=${config.longitude}&formatted=0`
    );

    let mode: PaletteMode = "light";

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
                <Dashboard />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
