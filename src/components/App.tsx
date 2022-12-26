import { CssBaseline } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import DashBoard from "./Dashboard";

/* eslint-disable no-unused-vars */
declare module "@mui/material/styles" {
    interface Palette {
        neutral: Palette["primary"];
    }
    interface PaletteOptions {
        neutral: PaletteOptions["primary"];
    }

    interface PaletteColor {
        medium?: string;
        mediumDark?: string;
    }
    interface SimplePaletteColorOptions {
        medium?: string;
        mediumDark?: string;
    }
}
/* eslint-enable no-unused-vars */

const App = () => {
    const theme = responsiveFontSizes(
        createTheme({
            palette: {
                primary: { main: blue[800] },
                secondary: { main: red[600], dark: red[800] },
                neutral: {
                    main: "#FFFFFF",
                    light: grey[100],
                    medium: grey[200],
                    mediumDark: grey[300],
                    dark: grey[600]
                }
            }
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
