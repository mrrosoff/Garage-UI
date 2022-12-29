import { useState } from "react";

import {
    Alert,
    AlertTitle,
    Badge,
    Collapse,
    IconButton,
    Popover,
    Typography
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    if (!props.showAlert) {
        return (
            <IconButton edge={"end"} color={"inherit"} onClick={() => props.setShowAlert(true)}>
                <Badge badgeContent={1} color={"error"}>
                    <ReportProblemIcon sx={{ fontSize: 24 }} />
                </Badge>
            </IconButton>
        );
    }

    return (
        <Popover
            open={props.showAlert}
            anchorEl={anchorEl}
            onClose={() => {
                setAnchorEl(null);
            }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
        >
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
        </Popover>
    );
};

export default ImportantAlerts;
