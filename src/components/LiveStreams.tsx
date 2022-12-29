import { useRef, useState } from "react";

import {
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
            <IconButton edge={"end"} color={"inherit"} onClick={() => setDialogOpen(true)}>
                <VideocamIcon sx={{ fontSize: 24 }} />
            </IconButton>
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

export default LiveStreams;
