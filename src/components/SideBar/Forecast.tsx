import { Fragment } from "react";
import { Box, Divider, Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { DateTime } from "luxon";

interface ForecastDay {
    forecasted_snow_day_in: string;
    temp_high_f: string;
    temp_low_f: string;
}

const Forecast = (props: { forecast: ForecastDay[] }) => {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            {props.forecast.map((day: any, index: number) => {
                return (
                    <Fragment key={index}>
                        <Box
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            pt={1}
                            width={340}
                        >
                            <Typography sx={{ fontWeight: 500 }}>
                                {day.date && DateTime.fromISO(day.date).toFormat("EEE")}
                            </Typography>
                            <span
                                className={`wi wi-forecast-io-${day.conditions.replace("_", "-")}`}
                                style={{ fontSize: 16, display: "table" }}
                            />
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                                <Typography sx={{ paddingRight: 1 }}>
                                    {parseFloat(day.temp_low_f).toFixed(0)}°{" "}
                                </Typography>
                                <div style={{ width: 100 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={100}
                                        sx={{
                                            height: 5,
                                            borderRadius: 5,
                                            [`& .${linearProgressClasses.bar}`]: {
                                                borderRadius: 5,
                                                background: `linear-gradient(to right, ${
                                                    "hsl(" +
                                                    [
                                                        200 - 170 * (day.temp_low_f / 100),
                                                        "90%",
                                                        "50%"
                                                    ] +
                                                    ")"
                                                } 30%, ${
                                                    "hsl(" +
                                                    [
                                                        200 - 170 * (day.temp_high_f / 100),
                                                        "90%",
                                                        "50%"
                                                    ] +
                                                    ")"
                                                } 90%)`
                                            }
                                        }}
                                    />
                                </div>
                                <Typography sx={{ paddingLeft: 1 }}>
                                    {parseFloat(day.temp_high_f).toFixed(0)}°
                                </Typography>
                            </Box>
                            <Box alignItems={"center"} display={"flex"} flexDirection={"column"}>
                                <span
                                    className={`wi wi-forecast-io-snow`}
                                    style={{ fontSize: 16 }}
                                />
                                <Typography>{day.forecasted_snow_day_in}"</Typography>
                            </Box>
                        </Box>

                        {index !== props.forecast.length - 1 && <Divider flexItem />}
                    </Fragment>
                );
            })}
        </Box>
    );
};

export default Forecast;
