import { Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import {
    styled,
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import SideBar from "./SideBar";
import MountainMapCard from "./Map";
import ImportantAlertsCard from "./Map/ImportantAlerts";
import { useState } from "react";
import LiveStreams from "./LiveStreams";

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
const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,

    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    })
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})<MuiAppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

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
                    dark: grey[900]
                }
            }
        })
    );
    const [open, setOpen] = useState<boolean>(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                    <AppBar position="fixed" open={open}>
                        <Toolbar
                            variant="dense"
                            sx={{
                                minHeight: 48,
                                justifyContent: "space-between",
                                backgroundColor: theme.palette.neutral.main,
                                color: theme.palette.neutral.dark
                            }}
                        >
                            <Box display={"flex"} alignItems={"center"}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 1 }}
                                >
                                    <ChromeReaderModeIcon sx={{ fontSize: 24, rotate: "180deg" }} />
                                </IconButton>
                                <Typography fontSize={18}>Steamboat Springs</Typography>
                            </Box>
                            <Box display={"flex"} justifyContent={"space-between"} width={60}>
                                <LiveStreams />
                                <ImportantAlertsCard />
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing: "border-box"
                            }
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <SideBar />
                    </Drawer>

                    <Main open={open}>
                        <Box flexGrow={1} height={"100%"} pt={2}>
                            <MountainMapCard />
                        </Box>
                    </Main>
                </Box>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
