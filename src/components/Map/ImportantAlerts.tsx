import { useState } from "react";

import { Alert, AlertTitle, Button, Collapse, IconButton, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const ImportantAlerts = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID, VITE_NATIONAL_WEATHER_SERVICE_ZONE } =
        import.meta.env;

    const [showNationalWeatherAlert, setShowNationalWeatherAlert] = useState<boolean>(false);
    const [showSnowPatrolAlert, setShowSnowPatrolAlert] = useState<boolean>(false);

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
            {nationalWeatherServiceAlert && (
                <CollapsableAlert
                    severity={"warning"}
                    showAlert={showNationalWeatherAlert}
                    setShowAlert={setShowNationalWeatherAlert}
                    title={"National Weather Service Alert"}
                    message={nationalWeatherServiceAlert}
                />
            )}
            {snowPatrolAlert && snowPatrolAlert !== "--" && (
                <CollapsableAlert
                    severity={"warning"}
                    showAlert={showSnowPatrolAlert}
                    setShowAlert={setShowSnowPatrolAlert}
                    title={"Snow Patrol Alert"}
                    message={snowPatrolAlert}
                />
            )}
        </>
    );
};

const CollapsableAlert = (props: any) => {
    if (!props.showAlert) {
        return (
            <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => props.setShowAlert(true)}
                sx={{ minWidth: 40, height: 50, borderRadius: "50%", pointerEvents: "auto" }}
            >
                <ErrorIcon />
            </Button>
        );
    }

    return (
        <Collapse in={props.showAlert} sx={{ width: 500, pointerEvents: "auto" }}>
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

export default ImportantAlerts;
