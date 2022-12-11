import { useState } from "react";

import {
    Box,
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

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

const MountainMapCard = () => {
    return (
        <Box height={"100%"}>
            <Box height={"100%"} width={"100%"} sx={{ position: "absolute" }}>
                <SteamboatInteractiveMap />
            </Box>
            <Box pt={1} pl={1}>
                <LiveStreams />
            </Box>
            <Box pt={80} pl={1}>
                <LiftAndTrailStatus />
            </Box>
        </Box>
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
    console.log(snowReport);
    const totalOpenLifts = snowReport?.TotalOpenLifts;
    const totalLifts = snowReport?.TotalLifts;
    const totalOpenTrails = snowReport?.TotalOpenTrails;
    const totalTrails = snowReport?.TotalTrails;
    const totalOpenNightTrails = snowReport?.OpenNightTrails;
    const totalNightTrails = snowReport?.TotalNightTrails;
    console.log(totalOpenNightTrails);
    console.log(totalNightTrails);
    return (
        <Box
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? theme.palette.neutral.dark
                        : theme.palette.neutral.light,
                borderRadius: 5,
                position: "absolute",
                width: "30%"
            }}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-around"}
        >
            <MountainPieChart
                chartting={"Lifts"}
                totalOpen={totalOpenLifts}
                totalAmount={totalLifts - totalOpenLifts}
            />
            <MountainPieChart
                chartting={"Trails"}
                totalOpen={totalOpenTrails}
                totalAmount={totalTrails - totalOpenTrails}
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
    return (
        <>
            <text
                x={cx}
                y={cy - 5}
                fill="rgba(0, 0, 0, 0.87)"
                className="recharts-text recharts-label"
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan alignmentBaseline="middle" fontSize="22px">
                    {props.value2}
                </tspan>
            </text>
            <text
                x={cx}
                y={cy + 20}
                className="recharts-text recharts-label"
                textAnchor="middle"
                dominantBaseline="central"
            >
                <tspan fontSize="16px">{props.value1}</tspan>
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
    console.log(data);
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

const LiveStreams = (props: any) => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINKS, VITE_LIVE_STREAM_BUTTON_TITLES } = import.meta.env;
    const [open, setOpen] = useState(false);
    const [liveStreamLink, setLiveStreamLink] = useState("");
    const theme = useTheme();
    return (
        <>
            <FormControl size="medium" sx={{ width: "18%" }}>
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
                                ? theme.palette.neutral.dark
                                : theme.palette.neutral.main,
                        borderRadius: 5
                    }}
                    renderValue={() => {
                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    width: "100%",
                                    height: "100%"
                                }}
                            >
                                <VideocamIcon />
                                <Box sx={{ ml: 1 }}>Show Live Streams</Box>
                            </Box>
                        );
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
            <Dialog
                fullScreen={true}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogActions style={{ justifyContent: "space-between" }}>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent sx={{ pt: 0 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={liveStreamLink + "?autoplay=1"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MountainMapCard;
