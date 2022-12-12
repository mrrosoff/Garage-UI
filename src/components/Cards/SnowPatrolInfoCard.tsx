import { Alert, AlertTitle, Box } from "@mui/material";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const SnowPatrolInfoCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
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
        <Box height={"100%"} width={"100%"}>
            {snowPatrolAlert === "--" ? (
                <Alert severity="info">
                    <AlertTitle>Snow Patrol Information</AlertTitle>
                    {snowPatrolReport}
                </Alert>
            ) : (
                <Alert severity="error">
                    <AlertTitle>Important Alert From Snow Patrol</AlertTitle>
                    {snowPatrolAlert}
                </Alert>
            )}
        </Box>
    );
};

export default SnowPatrolInfoCard;
