import { Box, Button, SvgIcon, Typography } from "@mui/material";

const SideBar = (props: any) => {
    const { VITE_RELAY_DIRECTION, VITE_RELAY_PIN } = import.meta.env;

    return (
        <Box display={"flex"} flexDirection={"column"} style={{ height: "100%", width: "100%" }}>
            {props.specialDay && (
                <Box display={"flex"} justifyContent={"center"} style={{ width: "100%" }} mb={2}>
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
                        VITE_RELAY_DIRECTION,
                        VITE_RELAY_PIN
                    );
                    if (!result) {
                        console.log("Unsupported Platform or Unknown Error Occured");
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
