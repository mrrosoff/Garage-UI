import {
    Box,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
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

const MoreDetailsOnLiftsAndTrailsCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const theme = useTheme();
    const [dataToList, setDataToList] = useState<[] | null>(null);
    const mountainAreas = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    )?.MountainAreas[0];

    if (!mountainAreas) return <LoadingScreen />;

    const trailsOpen = mountainAreas ? getOnlyOpenData(mountainAreas.Trails) : [];
    const activitiesOpen = mountainAreas ? getOnlyOpenData(mountainAreas.Activities) : [];
    const liftsOpen = mountainAreas ? getOnlyOpenData(mountainAreas.Lifts) : [];

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <Box
                p={2}
                width={"100%"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
            >
                <Button
                    variant={"contained"}
                    onClick={() => {
                        setDataToList(trailsOpen);
                    }}
                >
                    Trails
                </Button>
                <Button
                    variant={"contained"}
                    onClick={() => {
                        setDataToList(activitiesOpen);
                    }}
                >
                    Activities
                </Button>
                <Button
                    variant={"contained"}
                    onClick={() => {
                        setDataToList(liftsOpen);
                    }}
                >
                    Lifts
                </Button>
            </Box>
            {!dataToList ? (
                <Box
                    flexGrow={1}
                    flexDirection={"column"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography align={"center"}>Select an attribute to see more data.</Typography>
                </Box>
            ) : dataToList.length === 0 ? (
                <Box
                    flexGrow={1}
                    flexDirection={"column"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography align={"center"}>No data available for this attribute.</Typography>
                    <Typography align={"center"}>Please try again later.</Typography>
                </Box>
            ) : (
                <Box flexGrow={1} overflow={"hidden"}>
                    {dataToList.map((data: any, index: number) => (
                        <Fragment key={index}>
                            <ListItemText data={data} />
                        </Fragment>
                    ))}
                </Box>
            )}
        </Box>
    );
};

const ListItemText = (props: { data: any }) => {
    const theme = useTheme();
    if (props.data.Difficulty) {
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
            <Paper sx={{ p: 2, mt: 2 }}>
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
    }

    const todaysDayOfTheWeek = new Date().toLocaleString("en-us", { weekday: "long" });

    return (
        <Card variant="outlined" sx={{ borderRadius: 5 }}>
            <CardContent>
                <Typography>{props.data.Name}</Typography>
                <Typography sx={{ fontSize: 12 }}>
                    {props.data.Hours[todaysDayOfTheWeek].Open} -{" "}
                    {props.data.Hours[todaysDayOfTheWeek].Close}
                </Typography>
            </CardContent>
        </Card>
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

export default MoreDetailsOnLiftsAndTrailsCard;
