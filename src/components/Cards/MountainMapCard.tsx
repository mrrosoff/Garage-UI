import { useEffect, useRef, useState } from "react";

import {
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    useTheme
} from "@mui/material";
import { grey } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";

import { Cell, Label, Pie, PieChart } from "recharts";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

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
                <Box display={"flex"} justifyContent={"end"}>
                    <Box pt={2} pr={2}>
                        <LiveStreams />
                    </Box>
                </Box>
                <Box pb={1} pl={1}>
                    <LiftAndTrailStatus />
                </Box>
            </Box>
            <SteamboatInteractiveMap />
        </Box>
    );
};

const SteamboatInteractiveMap = () => {
    const mapRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframeReactLoadDelayTimeout = setTimeout(() => {
            if (mapRef.current) {
                const iframeWindow = mapRef.current.contentWindow;
                setUserAgent(iframeWindow, "Mozilla/5.0");

                const iframeDocument = iframeWindow?.document;
                if (iframeDocument) {
                    [
                        iframeDocument.getElementById("fullscreen"),
                        iframeDocument.getElementById("zoomControls"),
                        iframeDocument.getElementById("menu")
                    ].forEach((element) => element?.remove());
                }
            }
        }, 5000);
        return () => clearTimeout(iframeReactLoadDelayTimeout);
    }, [mapRef]);

    const setUserAgent = (window: Window | null, userAgent: string) => {
        if (window && window.navigator.userAgent != userAgent) {
            const userAgentProp = { get: () => userAgent };
            try {
                Object.defineProperty(window.navigator, "userAgent", userAgentProp);
            } catch (e) {
                (window as any).navigator = Object.create(navigator, { userAgent: userAgentProp });
            }
        }
    };

    return (
        <iframe
            src="https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=false&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.5"
            width="100%"
            height="100%"
            allowFullScreen
            style={{ border: "none", pointerEvents: "auto" }}
            ref={mapRef}
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

    const totalOpenLifts = parseInt(snowReport?.TotalOpenLifts);
    const totalLifts = parseInt(snowReport?.TotalLifts);
    const totalOpenTrails = parseInt(snowReport?.TotalOpenTrails);
    const totalTrails = parseInt(snowReport?.TotalTrails);
    const totalOpenAcres = parseInt(snowReport?.OpenTerrainAcres);
    const totalAcres = parseInt(snowReport?.TotalTerrainAcres);

    return (
        <Box
            p={1}
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
                chartUnit={"Trails"}
                totalOpen={totalOpenTrails}
                totalAmount={totalTrails}
            />
            <MountainPieChart
                chartUnit={"Lifts"}
                totalOpen={totalOpenLifts}
                totalAmount={totalLifts}
            />
            <MountainPieChart
                type={"Percent"}
                chartUnit={"Acres"}
                totalOpen={totalOpenAcres}
                totalAmount={totalAcres}
            />
        </Box>
    );
};

const MountainPieChart = (props: {
    totalOpen: number;
    totalAmount: number;
    chartUnit: string;
    type?: "Fraction" | "Percent";
}) => {
    const percentOpen = (props.totalOpen / props.totalAmount) * 100;
    const data = [
        { name: "open", value: props.totalOpen },
        { name: "not open", value: props.totalAmount - props.totalOpen }
    ];

    const theme = useTheme();
    const COLORS = [theme.palette.primary.light, grey[300]];

    const labelType = props.type || "Fraction";
    return (
        <PieChart width={100} height={120}>
            <Pie
                data={data}
                cx={"50%"}
                cy={"50%"}
                startAngle={90}
                endAngle={450}
                innerRadius={42}
                outerRadius={50}
                dataKey="value"
            >
                {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                    width={30}
                    position="center"
                    content={
                        labelType === "Fraction" ? (
                            <FractionLabel
                                totalOpen={props.totalOpen}
                                totalAmount={props.totalAmount}
                                chartUnit={props.chartUnit}
                            />
                        ) : (
                            <PercentLabel percentOpen={percentOpen} chartUnit={props.chartUnit} />
                        )
                    }
                ></Label>
            </Pie>
        </PieChart>
    );
};

const FractionLabel = (
    props: { totalOpen: number; totalAmount: number; chartUnit: string } & any
) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";
    return (
        <>
            <text
                x={cx - 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
            >
                {props.totalOpen}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={10}
                fontWeight={500}
            >
                / {props.totalAmount}
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
    );
};

const PercentLabel = (props: { percentOpen: number; chartUnit: string } & any) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";

    return (
        <>
            <text
                x={cx - 5}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={22}
                fontWeight={700}
            >
                {props.percentOpen.toFixed(0)}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={14}
                fontWeight={500}
            >
                %
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
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
                size={"large"}
                onClick={() => setDialogOpen(true)}
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
