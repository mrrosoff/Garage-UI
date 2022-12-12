import { Box, Divider } from "@mui/material";

import SnowPatrolInfoCard from "./Cards/SnowPatrolInfoCard";
import WeatherCard from "./Cards/WeatherCard";
import MountainMapCard from "./Cards/MountainMapCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"} p={0}>
            <Box width={"25%"} height={"100%"} display={"flex"} flexDirection={"column"} p={2}>
                <Box width={"100%"}>
                    <SnowPatrolInfoCard />
                </Box>
                <Box width={"100%"} minHeight={"33%"}>
                    <WeatherCard />
                </Box>
                <Box >
                    <Divider />
                </Box>
            </Box>
            <Box flexGrow={1} height={"100%"} >
                <MountainMapCard />
            </Box>
        </Box>
    );
};

export default DashBoard;
