import { Avatar, Box, Divider, Typography } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

const Leaderboard = () => {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <LeaderboardIcon sx={{ fontSize: 30, alignSelf: "end" }} />
            <Box mt={-3} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Matthew Ernst" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
                            Matthew Ernst
                        </Typography>
                        <Typography sx={{ mt: -0.5, fontSize: 15, fontWeight: 400 }}>
                            10,200 ft
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ m: 1 }} />
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Max Rosoff" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Max Rosoff</Typography>
                        <Typography sx={{ mt: -0.5, fontSize: 15, fontWeight: 400 }}>
                            8,400 ft
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ m: 1 }} />
                <Box display={"flex"} alignItems={"center"}>
                    <Avatar alt="Dante Delee" src="/static/images/avatar/1.jpg" />
                    <Box ml={2} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Dante Delee</Typography>
                        <Typography sx={{ mt: -0.5, fontSize: 15, fontWeight: 400 }}>
                            6,920 ft
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Leaderboard;
