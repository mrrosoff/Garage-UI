import { Alert, AlertTitle, Box } from "@mui/material";
import { useState } from "react";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const SnowPatrolInfoCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const [showAlert, setShowAlert] = useState(true);
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );
    const snowPatrolReport: string = resortData?.SnowReport?.Report;
    const snowPatrolAlert: string = resortData?.SnowReport?.Alert;

    if (snowPatrolReport === "Good Morning Skiers & Riders" && snowPatrolAlert === "--") {
        return null;
    }

    const handleClose = () => {
        setShowAlert(false);
    };
    return (
        <Box width={"30%"}>
            {snowPatrolAlert === "--" && showAlert ? (
                <AlertToMake
                    severity="info"
                    title="Snow Patrol Information"
                    message={snowPatrolReport}
                    handleClose={handleClose}
                />
            ) : (
                showAlert && (
                    <AlertToMake
                        severity="error"
                        title="Important Alert From Snow Patrol"
                        message={snowPatrolAlert}
                        handleClose={handleClose}
                    />
                )
            )}
        </Box>
    );
};

const AlertToMake = (props: any) => {
    return (
        <Alert severity={props.severity} onClose={props.handleClose}>
            <AlertTitle>{props.title}</AlertTitle>
            {props.message}
        </Alert>
    );
};

export default SnowPatrolInfoCard;
