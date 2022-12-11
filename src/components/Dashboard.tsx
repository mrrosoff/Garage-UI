import { Box, Divider } from "@mui/material";

import WeatherCard from "./Cards/WeatherCard";
import MountainInfoCard from "./Cards/MountainInfoCard";
import ForecastCard from "./Cards/ForecastCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"} p={0}>
            <Box width={"22%"} height={"100%"} display={"flex"} flexDirection={"column"} p={2}>
                <Box width={"100%"} minHeight={"33%"}>
                    <WeatherCard />
                </Box>
                <Box >
                    <Divider />
                </Box>
                <Box pt={3} flexGrow={1}>
                   
                </Box>
            </Box>
            <Box flexGrow={1} height={"100%"} >
                <iframe
                    id="Steamboat Map"
                    src="https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=true&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.5"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    title="Vicomap"
                />
            </Box>
        </Box>
    );
};

export default DashBoard;
