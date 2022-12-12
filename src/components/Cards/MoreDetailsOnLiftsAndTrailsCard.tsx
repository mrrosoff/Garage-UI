import {
    Box,
    Button,
    Card,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
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
        <Box flexDirection={"column"}>
            <Box
                p={2}
                height={"100%"}
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
                    flexDirection={"column"}
                    height={300}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography align={"center"}>Select an attribute to see more data.</Typography>
                </Box>
            ) : dataToList.length === 0 ? (
                <Box
                    flexDirection={"column"}
                    height={300}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Typography align={"center"}>No data available for this attribute.</Typography>
                    <Typography align={"center"}>Please try again later.</Typography>
                </Box>
            ) : (
                <List
                    dense
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        overflow: "auto",
                        maxHeight: 300,
                        bgcolor:
                            theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212",
                        padding: 0
                    }}
                >
                    {dataToList.map((data: any, index: number) => (
                        <Fragment key={index}>
                            <ListItem>{getListItemText(data)}</ListItem>
                        </Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

const getListItemText = (data: any) => {
    const theme = useTheme();
    if (data.Difficulty) {
        let trailIcon = null;
        switch (data.TrailIcon) {
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
            <ListItemText>
                <Card variant="outlined">
                    <CardContent>
                        <Box
                            flexDirection={"row"}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "10%"
                            }}
                        >
                            <Typography>{data.Name}</Typography>
                            <Box flexDirection={"row"} justifyContent={"space-evenly"}>
                                {trailIcon}
                                {data.Grooming === "Yes" ? (
                                    theme.palette.mode === "dark" ? (
                                        <img
                                            src={GroomingLight}
                                            alt="GroomingLight"
                                            style={{ paddingLeft: 8 }}
                                        />
                                    ) : (
                                        <img
                                            src={Grooming}
                                            alt="Grooming"
                                            style={{ paddingLeft: 8 }}
                                        />
                                    )
                                ) : null}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </ListItemText>
        );
    }

    const todaysDayOfTheWeek = new Date().toLocaleString("en-us", { weekday: "long" });

    return (
        <ListItemText>
            <Card variant="outlined">
                <CardContent>
                    <Typography>{data.Name}</Typography>
                    <Typography sx={{ fontSize: 12 }}>
                        {data.Hours[todaysDayOfTheWeek].Open} -{" "}
                        {data.Hours[todaysDayOfTheWeek].Close}
                    </Typography>
                </CardContent>
            </Card>
        </ListItemText>
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
