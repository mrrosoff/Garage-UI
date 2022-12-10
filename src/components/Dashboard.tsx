import { Box } from "@mui/material";

import TodayInfoCard from "./Cards/TodayInfoCard";
import MountainInfoCard from "./Cards/MountainInfoCard";
import ForecastCard from "./Cards/ForecastCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"} p={3}>
            <Box width={"33%"} height={"100%"} display={"flex"} flexDirection={"column"}>
                <Box width={"100%"} minHeight={"33%"}>
                    <TodayInfoCard />
                </Box>
                <Box pt={3} flexGrow={1}>
                    <ForecastCard />
                </Box>
            </Box>
            <Box flexGrow={1} height={"100%"} pl={3}>
                <MountainInfoCard />
            </Box>
        </Box>
    );
};

export default DashBoard;
