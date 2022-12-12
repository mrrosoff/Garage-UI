import { useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    useTheme
} from "@mui/material";
import { grey } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";
import SnowPatrolInfoCard from "./SnowPatrolInfoCard";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

const MountainMapCard = () => {
    return (
        <>
            <Box height={"100%"} width={"100%"} sx={{ position: "absolute" }}>
                <SteamboatInteractiveMap />
            </Box>
            <Box
                width={"80%"}
                height={"100%"}
                sx={{
                    pt: 1,
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start-flex"
                }}
            >
                <SnowPatrolInfoCard />
            </Box>
            <Box pt={1} pl={1}>
                <LiveStreams />
            </Box>
            <Box pl={1} width={"100%"} height={"17%"} sx={{ position: "absolute", bottom: 0 }}>
                <LiftAndTrailStatus />
            </Box>
        </>
    );
};

const SteamboatInteractiveMap = () => {
    return (
        <iframe
            id="Steamboat Map"
            src="https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=true&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.5"
            width="77%"
            height="100%"
            allowFullScreen
            title="Vicomap"
        />
    );
};

const LiftAndTrailStatus = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const theme = useTheme();
    const snowReport = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    )?.SnowReport;

    const totalOpenLifts = snowReport?.TotalOpenLifts;
    const totalLifts = snowReport?.TotalLifts;
    const totalOpenTrails = snowReport?.TotalOpenTrails;
    const totalTrails = snowReport?.TotalTrails;
    const totalOpenNightTrails = snowReport?.OpenNightTrails;
    const totalNightTrails = snowReport?.TotalNightTrails;

    return (
        <Box
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                backgroundColor:
                    theme.palette.mode === "dark" ? "#121212" : theme.palette.neutral.light,
                borderRadius: 5,
                position: "absolute",
                width: "30%"
            }}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-around"}
        >
            <MountainPieChart
                chartting={"Trails"}
                totalOpen={totalOpenTrails}
                totalAmount={totalTrails - totalOpenTrails}
            />
            <MountainPieChart
                chartting={"Lifts"}
                totalOpen={totalOpenLifts}
                totalAmount={totalLifts - totalOpenLifts}
            />
            <MountainPieChart
                chartting={"Night Trails"}
                totalOpen={totalOpenNightTrails}
                totalAmount={totalNightTrails - totalOpenNightTrails}
            />
        </Box>
    );
};

function CustomLabel(props: any) {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";
    return (
        <>
            <text
                x={cx}
                y={cy - 10}
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={22}
                fontWeight={500}
            >
                {props.value2}
            </text>
            <text
                fill={textColor}
                x={cx}
                y={cy + 15}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
            >
                {props.value1}
            </text>
        </>
    );
}

const MountainPieChart = (props: any) => {
    const { chartting, totalOpen, totalAmount } = props;
    const data = [
        { name: "Open", value: totalOpen },
        { name: "All Available", value: totalAmount }
    ];
    const theme = useTheme();

    const COLORS = [theme.palette.primary.light, grey[300]];

    return (
        <ResponsiveContainer width={"95%"} height={130}>
            <PieChart>
                <Pie
                    data={data}
                    cx={"50%"}
                    cy={"50%"}
                    startAngle={90}
                    endAngle={450}
                    innerRadius={50}
                    outerRadius={60}
                    paddingAngle={0}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                        width={30}
                        position="center"
                        content={<CustomLabel value1={chartting} value2={totalOpen} />}
                    ></Label>
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

const LiveStreams = () => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINKS, VITE_LIVE_STREAM_BUTTON_TITLES } = import.meta.env;
    const [open, setOpen] = useState(false);
    const [liveStreamLink, setLiveStreamLink] = useState(
        VITE_YOUTUBE_LIVE_STREAM_LINKS.split(",")[0]
    );
    const theme = useTheme();
    return (
        <>
            <Button
                sx={{
                    borderRadius: 5,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                        backgroundColor: theme.palette.secondary.dark
                    }
                }}
                variant={"contained"}
                size={"medium"}
                onClick={() => {
                    setOpen(true);
                }}
            >
                <VideocamIcon />
            </Button>

            <Dialog
                fullScreen={true}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogActions style={{ justifyContent: "space-between" }}>
                    <FormControl size="medium" sx={{ display: "flex" }}>
                        <Select
                            displayEmpty
                            disableUnderline
                            value={liveStreamLink}
                            onChange={(event: SelectChangeEvent) => {
                                event.target.value;
                                setLiveStreamLink(event.target.value);
                                setOpen(true);
                            }}
                            sx={{
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#121212"
                                        : theme.palette.neutral.main,
                                borderRadius: 5,
                                width: "100%"
                            }}
                            variant={"standard"}
                        >
                            {VITE_LIVE_STREAM_BUTTON_TITLES.split(",").map(
                                (title: string, index: number) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={VITE_YOUTUBE_LIVE_STREAM_LINKS.split(",")[index]}
                                            sx={{ borderRadius: 5 }}
                                        >
                                            {title}
                                        </MenuItem>
                                    );
                                }
                            )}
                        </Select>
                    </FormControl>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent sx={{ pt: 0 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={liveStreamLink + "?autoplay=1&vq=hd1080"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MountainMapCard;
