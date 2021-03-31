import React from "react";

import { CssBaseline } from "@material-ui/core";
import { blueGrey, green } from "@material-ui/core/colors";

import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";

import { SnackbarProvider } from "notistack";

import DashBoard from "./Dashboard";

const App = () => {
  let theme = createMuiTheme({
    palette: {
      type: "light",
      primary: { main: green[500] },
      secondary: { main: blueGrey[500] },
    },
  });
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} preventDuplicate>
        <DashBoard />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;