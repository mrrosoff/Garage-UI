import { Box, Divider } from "@mui/material";

import WeatherCard from "./Cards/WeatherCard";
import MoreDetailsOnLiftsAndTrailsCard from "./Cards/MoreDetailsOnLiftsAndTrailsCard";
import MountainMapCard from "./Cards/MountainMapCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"}>
            <Box width={"25%"} height={"100%"} display={"flex"} flexDirection={"column"} p={3} >
                <Box width={"100%"} pb={3}>
                    <WeatherCard />
                </Box>
                <Divider />
                <Box flexGrow={1} width={"100%"} pt={3}>
                    <MoreDetailsOnLiftsAndTrailsCard />
                </Box>
            </Box>
            <Box flexGrow={1} height={"100%"}>
                <MountainMapCard />
            </Box> 
        </Box>
    );
};

export default DashBoard;
