import { AppBar, Box, LinearProgress, Paper, Tab, Tabs, Typography, useTheme } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import BlackDiamond from "../../assets/difficulty-icons/blackdiamond.svg";
import BlueBlackSquare from "../../assets/difficulty-icons/blueblacksquare.svg";
import BlueSquare from "../../assets/difficulty-icons/bluesquare.svg";
import DoubleBlackDiamond from "../../assets/difficulty-icons/doubleblackdiamond.svg";
import GreenCircle from "../../assets/difficulty-icons/greencircle.svg";
import Grooming from "../../assets/difficulty-icons/grooming.svg";
import GroomingLight from "../../assets/difficulty-icons/grooming_light.svg";
import SnowShoeing from "../../assets/difficulty-icons/snowshoeing.svg";
import SnowShoeingLight from "../../assets/difficulty-icons/snowshoeing_light.svg";
import TerrainPark from "../../assets/difficulty-icons/terrain_park_large.svg";

import { Fragment, useState } from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
            style={{ overflow: "auto", maxHeight: 300 }}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}

const LiftAndTrailDetailsCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const mountainAreas = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    )?.MountainAreas[0];

    if (!mountainAreas) return <LoadingScreen />;

    const trailsOpen = getOnlyOpenData(mountainAreas?.Trails);
    const liftsOpen = getOnlyOpenData(mountainAreas?.Lifts);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%"
            }}
        >
            <AppBar position="static" color="transparent" elevation={0}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    variant="fullWidth"
                    sx={{
                        backgroundColor:
                            theme.palette.mode === "light" ? theme.palette.neutral.light : "#121212"
                    }}
                >
                    <Tab
                        label="Trails"
                        {...a11yProps(0)}
                        sx={{
                            backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#121212"
                        }}
                    />
                    <Tab
                        label="Lifts"
                        {...a11yProps(1)}
                        sx={{
                            backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#121212"
                        }}
                    />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {trailsOpen.map((data: any, index: number) => (
                        <Fragment key={index}>
                            <ListOpenTrails data={data} />
                        </Fragment>
                    ))}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {liftsOpen.map((data: any, index: number) => (
                        <Fragment key={index}>
                            <ListOpenLifts data={data} />
                        </Fragment>
                    ))}
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
};

const ListOpenTrails = (props: { data: any }) => {
    const theme = useTheme();

    let trailIcon = null;
    switch (props.data.TrailIcon) {
        case "BlackDiamond":
            trailIcon = <img src={BlackDiamond} alt="BlackDiamond" />;
            break;
        case "GreenCircle":
            trailIcon = <img src={GreenCircle} alt="GreenCircle" />;
            break;
        case "BlueSquare":
            trailIcon = <img src={BlueSquare} alt="BlueSquare" />;
            break;
        case "DoubleBlackDiamond":
            trailIcon = <img src={DoubleBlackDiamond} alt="DoubleBlackDiamond" />;
            break;
        case "Snowshoe":
            if (theme.palette.mode === "dark") {
                trailIcon = <img src={SnowShoeingLight} alt="SnowShoe" />;
            } else {
                trailIcon = <img src={SnowShoeing} alt="SnowShoe" />;
            }
            break;
        case "TerrainPark":
            trailIcon = <img src={TerrainPark} alt="TerrainPark" />;
            break;
        case "BlueBlackSquare":
            trailIcon = <img src={BlueBlackSquare} alt="BlueBlackSquare" />;
            break;

        default:
            trailIcon = "";
    }

    return (
        <Paper sx={{ p: 2, mt: 2, mr: 1, ml: 1, borderRadius: 2 }}>
            <Box
                flexDirection={"row"}
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography>{props.data.Name}</Typography>
                <Box flexDirection={"row"} justifyContent={"space-evenly"}>
                    {trailIcon}
                    {props.data.Grooming === "Yes" ? (
                        theme.palette.mode === "dark" ? (
                            <img
                                src={GroomingLight}
                                alt="GroomingLight"
                                style={{ paddingLeft: 8 }}
                            />
                        ) : (
                            <img src={Grooming} alt="Grooming" style={{ paddingLeft: 8 }} />
                        )
                    ) : null}
                </Box>
            </Box>
        </Paper>
    );
};

const ListOpenLifts = (props: { data: any }) => {
    const todaysDayOfTheWeek = new Date().toLocaleString("en-us", { weekday: "long" });

    return (
        <Paper sx={{ p: 2, mt: 2, mr: 1, ml: 1, borderRadius: 2 }}>
            <Box
                flexDirection={"row"}
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography>{props.data.Name}</Typography>
                <Typography sx={{ fontSize: 14 }}>
                    {props.data.Hours[todaysDayOfTheWeek].Open} -{" "}
                    {props.data.Hours[todaysDayOfTheWeek].Close}
                </Typography>
            </Box>
        </Paper>
    );
};

const LoadingScreen = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <LinearProgress sx={{ height: 8 }} />
            </Box>
        </Box>
    );
};

const getOnlyOpenData = (data: any) => {
    return data
        .filter((lift: any) => lift.Status.toLowerCase() === "open")
        .sort((a: any, b: any) => a.Name.localeCompare(b.Name));
};

export default LiftAndTrailDetailsCard;
