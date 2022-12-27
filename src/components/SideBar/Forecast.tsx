import { Fragment } from "react";

import { Box, Divider, Typography } from "@mui/material";

import { DateTime } from "luxon";

interface ForecastDay {
    forecasted_snow_day_in: string;
    temp_high_f: string;
    temp_low_f: string;
}

const Forecast = (props: { forecast: ForecastDay[] }) => {
    return (
        <Box display={"flex"} justifyContent={"space-around"}>
            {props.forecast.map((day: any, index: number) => {
                return (
                    <Fragment key={index}>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                            <Typography sx={{ fontWeight: 500 }}>
                                {day.date && DateTime.fromISO(day.date).toFormat("EEEE")}
                            </Typography>
                            <Typography style={{ paddingLeft: 4 }}>
                                {day.forecasted_snow_day_in}"
                            </Typography>
                            <Typography style={{ paddingLeft: 4 }}>
                                {parseFloat(day.temp_low_f).toFixed(0)} -{" "}
                                {parseFloat(day.temp_high_f).toFixed(0)} °F
                            </Typography>
                        </Box>

                        {index !== props.forecast.length - 1 && (
                            <Divider orientation="vertical" flexItem />
                        )}
                    </Fragment>
                );
            })}
        </Box>
    );
};

export default Forecast;
