import { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import { DateTime } from "luxon";

import specialDays, { SpecialDay } from "../specialDays";

import TideCard from "./Cards/TideCard";
import WeatherCard from "./Cards/WeatherCard";
import SurfCard from "./Cards/SurfCard";
import SideBar from "./SideBar";

const Dashboard = () => {
    const { VITE_TIME_INTERVAL, VITE_SHOW_GARAGE_BUTTON } = import.meta.env;

    const [specialDay, setSpecialDay] = useState<SpecialDay>();

    useEffect(() => {
        const getSpecialDay = async () => {
            const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
            setSpecialDay(specialDay);
        };

        const interval = setInterval(getSpecialDay, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box height={"100%"}>
            <Box height={"100%"} display={"flex"} flexDirection={"row"}>
                {VITE_SHOW_GARAGE_BUTTON && (
                    <Box width={"33.33%"} height={"100%"} paddingRight={3}>
                        <Paper elevation={2} sx={{ width: "100%", height: "100%", p: 2 }}>
                            <SideBar specialDay={specialDay} />
                        </Paper>
                    </Box>
                )}
                <Box width={VITE_SHOW_GARAGE_BUTTON ? "66.66%" : "100%"} height={"100%"}>
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
