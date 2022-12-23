import { Box, Divider } from "@mui/material";

import WeatherCard from "./Cards/WeatherCard";
import LiftAndTrailDetailsCard from "./Cards/LiftAndTrailDetailsCard";
import MountainMapCard from "./Cards/MountainMapCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"}>
            <Box width={"25%"} height={"100%"} display={"flex"} flexDirection={"column"} p={2}>
                <Box width={"100%"} pb={2}>
                    <WeatherCard />
                </Box>
                <Divider />
                <Box flexGrow={1} width={"100%"}>
                    <LiftAndTrailDetailsCard />
                </Box>
            </Box>
            <Box flexGrow={1} height={"100%"}>
                <MountainMapCard />
            </Box>
        </Box>
    );
};

export default DashBoard;
