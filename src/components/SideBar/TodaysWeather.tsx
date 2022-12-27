import { Box, Typography, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import WavesIcon from "@mui/icons-material/Waves";
import AirIcon from "@mui/icons-material/Air";

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
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <span
                    className={`wi wi-${
                        theme.palette.mode === "dark" ? "night" : "day"
                    }-${todaysConditions}`}
                    style={{ fontSize: 65 }}
                />
                <Box ml={4} display={"flex"} flexDirection={"column"}>
                    <Typography style={{ fontSize: 25 }}>
                        {parseInt(props.todaysWeather.TemperatureF)} °F
                    </Typography>
                    <Typography sx={{ fontSize: 14, mt: -0.5 }}>
                        {getConditionsInHumanReadableFormat(todaysConditions)}
                    </Typography>
                    <Typography>{props.todaysSnow.forecasted_snow_day_in}"</Typography>
                </Box>
            </Box>
            <Box mt={3} pl={2} pr={2} display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                    <AirIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>
                        {props.todaysWeather.WindGustsMph} mph {props.todaysWeather.WindDirection}
                    </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <LightModeIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>{props.todaysWeather.UvIndex}</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <WavesIcon style={{ fontSize: "15", verticalAlign: "middle" }} />
                    <Typography sx={{ pl: 2 }}>{props.todaysWeather.Humidity}%</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TodaysWeather;
