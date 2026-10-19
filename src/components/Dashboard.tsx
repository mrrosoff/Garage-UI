import { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import config from "../config";
import { getSpecialDay } from "../specialDays";

import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

const Dashboard = () => {
    const { timeInterval, showGarageButton, flipDisplay } = config;

    const [specialDay, setSpecialDay] = useState(getSpecialDay);

    useEffect(() => {
        const interval = setInterval(() => setSpecialDay(getSpecialDay()), timeInterval);
        return () => clearInterval(interval);
    }, [timeInterval]);

    return (
        <Box
            height={"100%"}
            sx={{
                transform: flipDisplay ? "rotate(180deg) translateZ(0)" : undefined,
                backfaceVisibility: flipDisplay ? "hidden" : undefined,
                willChange: flipDisplay ? "transform" : undefined
            }}
        >
            <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                {showGarageButton && (
                    <Box width={"33.33%"} height={"100%"} paddingRight={3}>
                        <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 2 }}>
                            <SideBar specialDay={specialDay} />
                        </Paper>
                    </Box>
                )}
                <Box width={showGarageButton ? "66.66%" : "100%"} height={"100%"}>
                    <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 2 }}>
                        <Box
                            width={"100%"}
                            height={"100%"}
                            display={"flex"}
                            flexDirection={"column"}
                        >
                            <Box display={"flex"}>
                                <Box>
                                    <WeatherCard />
                                </Box>
                                <Box pl={2} flexGrow={1}>
                                    <SurfCard />
                                </Box>
                            </Box>
                            <Box pt={2} flexGrow={1}>
                                <TideCard />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
