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
    Popper
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import ImportantAlertsCard from "./Map/ImportantAlerts";
import SpecialDays from "./Map/SpecialDays";

const Map = () => {
    return (
        <Box position={"relative"} width={"100%"} height={"100%"} sx={{ pointerEvents: "none" }}>
            <Box
                position={"absolute"}
                top={0}
                left={0}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                width={"100%"}
                height={"100%"}
            >
                <Box pt={2} pr={2} alignSelf={"end"}>
                    <ImportantAlertsCard />
                    <SpecialDays />
                </Box>
                <Box pb={2} pl={2} display={"flex"}>
                    <LiveStreams />
                    <Button variant={"contained"} size={"large"} sx={{ ml: 2, borderRadius: 5 }}>
                        <ZoomInIcon sx={{ fontSize: 30 }} />
                    </Button>
                    <Button variant={"contained"} size={"large"} sx={{ ml: 2, borderRadius: 5 }}>
                        <ZoomOutIcon sx={{ fontSize: 30 }} />
                    </Button>
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

                    const map = iframeDocument.getElementById("_Image1");
                    if (map) {
                        map.setAttributeNS(
                            "http://www.w3.org/1999/xlink",
                            "xlink:href",
                            "https://raw.githubusercontent.com/matthewfernst/Mountain-UI/refactor/src/assets/images/vectorized_mountain.png"
                        );
                    }
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

const LiveStreams = () => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINKS, VITE_LIVE_STREAM_BUTTON_TITLES } = import.meta.env;

    const liveStreamLinks = VITE_YOUTUBE_LIVE_STREAM_LINKS.split(",");
    const liveStreamTitles = VITE_LIVE_STREAM_BUTTON_TITLES.split(",");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [popperOpen, setPopperOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const anchorRef = useRef<HTMLDivElement>(null);

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
                <VideocamIcon sx={{ fontSize: 30 }} />
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
                            onClick={() => setPopperOpen((prevOpen) => !prevOpen)}
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
                                    <ClickAwayListener onClickAway={() => setPopperOpen(false)}>
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
                                                        onClick={(event) => {
                                                            setSelectedIndex(index);
                                                            setPopperOpen(false);
                                                        }}
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

export default Map;
