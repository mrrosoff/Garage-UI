import { useState } from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const MountainMapCard = () => {
    return (
        <Box height={"100%"}>
            <Box height={"100%"} width={"100%"} sx={{ position: "absolute" }}>
                <SteamboatInteractiveMap />
            </Box>
            <Box pt={1} pl={1}>
                <LiveStreams />
            </Box>
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
        />
    );
};

const LiveStreams = (props: any) => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINK, VITE_LIVE_STREAM_BUTTON_TITLE } = import.meta.env;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                sx={{ borderRadius: 5 }}
                startIcon={<VideocamIcon />}
                variant={"contained"}
                size={"medium"}
                onClick={() => setOpen(true)}
            >
                {VITE_LIVE_STREAM_BUTTON_TITLE}
            </Button>
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
                        src={VITE_YOUTUBE_LIVE_STREAM_LINK + "?autoplay=1"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MountainMapCard;
