import { useEffect, useRef } from "react";

import { Box, Button, Divider, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import SpecialDays from "./Map/SpecialDays";

const Map = () => {
    const theme = useTheme();
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
                    <SpecialDays />
                </Box>
                <Box pb={2} pr={2} display={"flex"} justifyContent={"end"}>
                    <Box
                        display={"flex"}
                        sx={{ backgroundColor: theme.palette.neutral.main, borderRadius: 5 }}
                    >
                        <Button
                            variant={"text"}
                            sx={{
                                pointerEvents: "auto",
                                backgroundColor: theme.palette.neutral.main,
                                color: theme.palette.neutral.dark,
                                borderTopLeftRadius: 28,
                                borderBottomLeftRadius: 28
                            }}
                        >
                            <RemoveIcon sx={{ fontSize: 15 }} />
                        </Button>
                        <Divider orientation={"vertical"} flexItem />
                        <Button
                            variant={"text"}
                            sx={{
                                pointerEvents: "auto",
                                backgroundColor: theme.palette.neutral.main,
                                color: theme.palette.neutral.dark,
                                borderTopRightRadius: 28,
                                borderBottomRightRadius: 28
                            }}
                        >
                            <AddIcon sx={{ fontSize: 15 }} />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <SteamboatInteractiveMap />
        </Box>
    );
};

const SteamboatInteractiveMap = () => {
    const { VITE_MAP_ANIMATIONS } = import.meta.env;
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
                            "https://raw.githubusercontent.com/matthewfernst/Mountain-UI/main/src/assets/images/vectorized_mountain.png"
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
            src={`https://vicomap-cdn.resorts-interactive.com/map/1800?fullscreen=true&menu=3.7,3.10,3.14&openLiftAnimation=${VITE_MAP_ANIMATIONS}&openLiftColor=green&liftHighlightOpacity=0.1&backgroundOpacity=0.5`}
            width="100%"
            height="100%"
            allowFullScreen
            style={{ border: "none", pointerEvents: "auto" }}
            ref={mapRef}
        />
    );
};

export default Map;
