import { Box, Button, SvgIcon, Typography } from "@mui/material";

import config from "../config";
import { SpecialDay } from "../specialDays";

const SideBar = (props: { specialDay: SpecialDay | undefined }) => {
    return (
        <Box
            style={{ height: "100%", width: "100%" }}
            sx={{ display: "flex", flexDirection: "column" }}
        >
            {props.specialDay && (
                <Box
                    style={{ width: "100%" }}
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                >
                    <Typography sx={{ fontSize: 30, mr: 2 }}>{props.specialDay.emoji}</Typography>
                    <Typography style={{ fontWeight: 500, fontSize: 30, textAlign: "center" }}>
                        {props.specialDay.text}
                    </Typography>
                    <Typography sx={{ fontSize: 30, ml: 2 }}>{props.specialDay.emoji}</Typography>
                </Box>
            )}
            <Button
                style={{ height: "100%", width: "100%" }}
                onClick={async () => {
                    const result = await window.garageAPI.garageSwitch(
                        config.relayWiring,
                        config.relayPin
                    );
                    if (!result) {
                        console.log("Unsupported Platform or Unknown Error Occurred");
                    }
                }}
            >
                <HomeIcon />
            </Button>
        </Box>
    );
};

const HomeIcon = () => (
    <SvgIcon color="primary" style={{ fontSize: 220 }}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="black" strokeWidth={1} />
    </SvgIcon>
);

export default SideBar;
