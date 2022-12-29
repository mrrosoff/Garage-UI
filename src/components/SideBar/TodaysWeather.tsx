import { Box, Typography, useTheme } from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import ScaleIcon from "@mui/icons-material/Scale";
import AcUnitIcon from "@mui/icons-material/AcUnit";

const TodaysWeather = (props: { todaysWeather: any; todaysSnow: any }) => {
    const theme = useTheme();
    const todaysConditions = props.todaysWeather.Conditions.replace("_", "-");

    const getConditionsInHumanReadableFormat = (condition: string) => {
        if (
            (condition.includes("partly") || condition.includes("mostly")) &&
            !condition.includes("-")
        ) {
            return (
                condition.substring(0, 1).toUpperCase() +
                condition.substring(1, condition.indexOf("y") + 1) +
                " " +
                condition.charAt(condition.indexOf("y") + 1).toUpperCase() +
                condition.substring(condition.indexOf("y") + 2, condition.length)
            );
        }
        let conditions = condition.split("-");
        for (let i = 0; i < conditions.length; i++) {
            conditions[i] = conditions[i].charAt(0).toUpperCase() + conditions[i].slice(1);
        }
        return conditions.join(" ");
    };

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography align={"center"} sx={{ fontSize: 22, pb: 2 }}>
                {getConditionsInHumanReadableFormat(todaysConditions)}
            </Typography>
            <span
                className={`wi wi-${
                    theme.palette.mode === "dark" ? "night" : "day"
                }-${todaysConditions}`}
                style={{ fontSize: 60, display: "table", margin: "auto" }}
            />
            <Typography align={"center"} style={{ fontSize: 24 }}>
                {parseInt(props.todaysWeather.TemperatureF)}°
            </Typography>
            <Typography align={"center"} style={{ fontSize: 16 }}>
                H:{parseInt(props.todaysWeather.TemperatureHighF)}° L:
                {parseInt(props.todaysWeather.TemperatureLowF)}°
            </Typography>
            <Box mt={3} pl={2} pr={2} display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>
                        {props.todaysWeather.WindStrengthMph} mph{" "}
                        {props.todaysWeather.WindDirection}
                    </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <ScaleIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>{props.todaysWeather.PressureIN} Hg</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <AcUnitIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 1 }}>
                        {props.todaysSnow.forecasted_snow_day_in}{" "}"
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TodaysWeather;
