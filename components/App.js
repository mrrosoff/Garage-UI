import React, { useEffect, useState } from "react";

import { CssBaseline } from "@mui/material";
import { blue, green } from "@mui/material/colors";

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import { SnackbarProvider } from "notistack";

import DashBoard from "./Dashboard";

const App = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		setInterval(() => setCurrentDate(new Date()), 180000);
	}, []);

	let theme = createTheme({
		palette: {
			mode: currentDate.getHours() < 4 || currentDate.getHours() > 20 ? "dark" : "light",
			primary: { main: blue[500] },
			secondary: { main: green[500] }
		}
	});
	theme = responsiveFontSizes(theme);

	return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider maxSnack={3} preventDuplicate>
                    <DashBoard />
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
