import { Box, Divider } from "@mui/material";

import WeatherCard from "./Cards/WeatherCard";
import MoreDetailsOnLiftsAndTrailsCard from "./Cards/MoreDetailsOnLiftsAndTrailsCard";
import MountainMapCard from "./Cards/MountainMapCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"} p={0}>
            <Box width={"25%"} height={"100%"} display={"flex"} flexDirection={"column"} p={2}>
                <Box width={"100%"} minHeight={"33%"}>
                    <WeatherCard />
                </Box>

                <Divider />

                <Box width={"100%"}>
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
