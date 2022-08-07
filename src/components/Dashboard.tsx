import { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import axios from "axios";
import { DateTime } from "luxon";

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import specialDays, { SpecialDay } from "../specialDays";

import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

const DashBoard = () => {
    const { VITE_TIME_INTERVAL } = import.meta.env;

    const [specialDay, setSpecialDay] = useState<SpecialDay>();

    useEffect(() => {
        const getSpecialDay = async () => {
            const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
            if (specialDay) {
                setSpecialDay(specialDay);
            }
        };

        const interval = setInterval(getSpecialDay, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box height={"100%"} p={3}>
            <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                <Box width={"33.33%"} height={"100%"} paddingRight={3}>
                    <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 3 }}>
                        <SideBar specialDay={specialDay} />
                    </Paper>
                </Box>
                <Box width={"66.66%"} height={"100%"}>
                    <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 3 }}>
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
                                <Box pl={3} flexGrow={1}>
                                    <SurfCard />
                                </Box>
                            </Box>
                            <Box pt={3} flexGrow={1}>
                                <TideCard />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default DashBoard;
