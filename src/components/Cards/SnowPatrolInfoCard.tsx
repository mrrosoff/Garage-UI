import { Alert, AlertTitle, Box, Collapse, IconButton } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
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

    return (
        <Box width={"30%"}>
            {snowPatrolAlert === "--" ? (
                <CustomAlert
                    severity={"info"}
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    title={"Snow Patrol Information"}
                    message={snowPatrolReport}
                />
            ) : (
                <CustomAlert
                    severity={"warning"}
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    title={"Important Alert From Snow Patrol"}
                    message={snowPatrolAlert}
                />
            )}
        </Box>
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
                {props.message}
            </Alert>
        </Collapse>
    );
};

export default SnowPatrolInfoCard;
