import { useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    ThemeProvider,
    useTheme
} from "@mui/material";
import { grey, blue, green } from "@mui/material/colors";
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
            width="77%"
            height="100%"
            allowFullScreen
            title="Vicomap"
        />
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
