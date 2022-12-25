import { Box } from "@mui/material";

import SideBar from "./Cards/SideBar";
import MountainMapCard from "./Cards/MountainMapCard";

const DashBoard = () => {
    return (
        <Box height={"100%"} display={"flex"} flexDirection={"row"}>
            <Box width={400} height={"100%"}>
                <SideBar />
            </Box>
            <Box flexGrow={1} height={"100%"}>
                <MountainMapCard />
            </Box>
        </Box>
    );
};

export default DashBoard;
