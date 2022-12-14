import { useRef, useState } from "react";

import {
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Select,
    SelectChangeEvent,
    useTheme
} from "@mui/material";

import { grey } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";
import { Cell, Label, Pie, PieChart } from "recharts";

const MountainMapCard = () => {
    return (
        <Box position={"relative"} width={"100%"} height={"100%"} sx={{ pointerEvents: "none" }}>
            <Box
                position={"absolute"}
                top={0}
                left={0}
                width={"100%"}
                height={"100%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
            >
                <Box pt={2} pl={2}>
                    <LiveStreams />
                </Box>
                <Box pb={2} pl={2}>
                    <LiftAndTrailStatus />
                </Box>
            </Box>
            <SteamboatInteractiveMap />
        </Box>
    );
};

const SteamboatInteractiveMap = () => {
    return (
        <iframe
            id="Steamboat Map"
            src="https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=true&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.5"
            width="100%"
            height="100%"
            allowFullScreen
            title="Vicomap"
            style={{ pointerEvents: "auto" }}
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
                width: "40%",
                borderWidth: 2,
                borderStyle: "solid",
                backgroundColor:
                    theme.palette.mode === "dark" ? "#121212" : theme.palette.neutral.light,
                borderRadius: 5
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
        <PieChart width={120} height={200}>
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
    );
};

const LiveStreams = () => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINKS, VITE_LIVE_STREAM_BUTTON_TITLES } = import.meta.env;
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [popperOpen, setPopperOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const liveStreamLinks = VITE_YOUTUBE_LIVE_STREAM_LINKS.split(",");
    const liveStreamTitles = VITE_LIVE_STREAM_BUTTON_TITLES.split(",");
    const handleMenuItemClick = (
        _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number
    ) => {
        setSelectedIndex(index);
        setPopperOpen(false);
    };

    const handleToggle = () => {
        setPopperOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        setPopperOpen(false);
    };

    return (
        <>
            <Button
                sx={{
                    borderRadius: 5,
                    pointerEvents: "auto"
                }}
                color={"secondary"}
                variant={"contained"}
                size={"medium"}
                onClick={() => {
                    setDialogOpen(true);
                }}
            >
                <VideocamIcon />
            </Button>

            <Dialog fullScreen={true} open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogActions style={{ justifyContent: "space-between" }}>
                    <ButtonGroup
                        sx={{ borderRadius: 5 }}
                        variant="contained"
                        ref={anchorRef}
                        color="primary"
                    >
                        <Button
                            sx={{
                                borderRadius: 5
                            }}
                            onClick={handleToggle}
                        >
                            {liveStreamTitles[selectedIndex]}
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1
                        }}
                        popperOptions={{
                            modifiers: [
                                {
                                    name: "preventOverflow",
                                    options: {
                                        padding: 2
                                    }
                                }
                            ]
                        }}
                        open={popperOpen}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom"
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList autoFocusItem>
                                            {liveStreamTitles.map(
                                                (title: string, index: number) => (
                                                    <MenuItem
                                                        key={index}
                                                        selected={index === selectedIndex}
                                                        value={
                                                            VITE_YOUTUBE_LIVE_STREAM_LINKS.split(
                                                                ","
                                                            )[index]
                                                        }
                                                        onClick={(event) =>
                                                            handleMenuItemClick(event, index)
                                                        }
                                                        sx={{ borderRadius: 5 }}
                                                    >
                                                        {title}
                                                    </MenuItem>
                                                )
                                            )}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <IconButton onClick={() => setDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent sx={{ pt: 0 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={liveStreamLinks[selectedIndex] + "?autoplay=1&vq=hd1080"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MountainMapCard;
