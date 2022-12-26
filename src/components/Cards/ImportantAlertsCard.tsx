import { Alert, AlertTitle, Box, Collapse, Divider, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const ImportantAlertsCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID, VITE_NATIONAL_WEATHER_SERVICE_ZONE } =
        import.meta.env;
    const [showNationalWeatherAlert, setShowNationalWeatherAlert] = useState(true);
    const [showSnowPatrolAlert, setShowSnowPatrolAlert] = useState(true);
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );

    const nationalWeatherServiceAlert = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://api.weather.gov/alerts/active?zone=${VITE_NATIONAL_WEATHER_SERVICE_ZONE}`
    )?.features[0]?.properties?.description;

    const snowPatrolAlert: string = resortData?.SnowReport?.Alert;

    if (snowPatrolAlert === "--" && !nationalWeatherServiceAlert) {
        return null;
    }

    return (
        <>
            <Box width={"30%"}>
                {nationalWeatherServiceAlert && (
                    <CustomAlert
                        severity={"warning"}
                        showAlert={showNationalWeatherAlert}
                        setShowAlert={setShowNationalWeatherAlert}
                        title={"National Weather Service Alert"}
                        message={nationalWeatherServiceAlert}
                    />
                )}
                {snowPatrolAlert && snowPatrolAlert !== "--" && (
                    <CustomAlert
                        severity={"warning"}
                        showAlert={showSnowPatrolAlert}
                        setShowAlert={setShowSnowPatrolAlert}
                        title={"Snow Patrol Alert"}
                        message={snowPatrolAlert}
                    />
                )}
            </Box>
            {(nationalWeatherServiceAlert || (snowPatrolAlert && snowPatrolAlert !== "--")) && (
                <Divider sx={{ mt: 2, mb: 2 }} />
            )}
        </>
    );
};

const CustomAlert = (props: any) => {
    return (
        <Collapse in={props.showAlert}>
            <Alert
                severity={props.severity}
                onChange={() => {
                    props.setShowAlert(true);
                }}
                color={props.severity === "warning" ? "error" : "info"}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            props.setShowAlert(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                <AlertTitle>{props.title}</AlertTitle>
                {props.message.split("*").map((i: string) => {
                    return (
                        <>
                            <Typography fontSize={14}>{i}</Typography>
                            <br />
                        </>
                    );
                })}
            </Alert>
        </Collapse>
    );
};

export default ImportantAlertsCard;
