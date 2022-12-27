import { useState, useEffect } from "react";

import { Box, Paper, Typography } from "@mui/material";

import { DateTime } from "luxon";

export interface SpecialDay {
    emoji: string;
    text: string;
    date: DateTime;
}

const formatString = "MM-dd";

const specialDays: SpecialDay[] = [
    { date: DateTime.fromFormat("01-01", formatString), text: "Happy New Year", emoji: "🎉" },
    { date: DateTime.fromFormat("02-14", formatString), text: "Happy Valentines Day", emoji: "💖" },
    {
        date: DateTime.fromFormat("03-17", formatString),
        text: "Happy St. Patricks Day",
        emoji: "🍀"
    },
    { date: DateTime.fromFormat("03-23", formatString), text: "Happy Birthday Mom", emoji: "🎉" },
    {
        date: DateTime.fromFormat("04-01", formatString),
        text: "Happy April Fools Day",
        emoji: "🤡"
    },
    {
        date: DateTime.fromFormat("05-17", formatString),
        text: "Happy Birthday Matt and Anna",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("06-21", formatString), text: "Happy Birthday Jesse", emoji: "🎉" },
    {
        date: DateTime.fromFormat("06-23", formatString),
        text: "Happy Birthday Helena",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("07-04", formatString), text: "Happy Forth Of July", emoji: "🇺🇸" },
    {
        date: DateTime.fromFormat("07-21", formatString),
        text: "Happy Belgian National Day",
        emoji: "🇧🇪"
    },
    {
        date: DateTime.fromFormat("08-06", formatString),
        text: "Happy Birthday Floris",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("09-29", formatString), text: "Happy Birthday Lem", emoji: "🎉" },
    { date: DateTime.fromFormat("10-07", formatString), text: "Happy Birthday Dante", emoji: "🎉" },
    { date: DateTime.fromFormat("10-31", formatString), text: "Happy Halloween", emoji: "🎃" },
    { date: DateTime.fromFormat("12-25", formatString), text: "Merry Christmas", emoji: "🎄" }
];

const SpecialDays = () => {
    const { VITE_TIME_INTERVAL } = import.meta.env;
    const [specialDay, setSpecialDay] = useState<SpecialDay>();

    useEffect(() => {
        const getSpecialDay = async () => {
            const specialDay = specialDays.find((day) => DateTime.now().hasSame(day.date, "day"));
            if (specialDay) {
                setSpecialDay(specialDay);
            }
        };

        getSpecialDay();
        const interval = setInterval(getSpecialDay, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    console.log(specialDay);
    if (!specialDay) return null;
    return (
        <Box display={"flex"} alignItems={"center"} style={{ width: "100%" }} mb={2}>
            <Typography sx={{ fontSize: 30, mr: 2 }}>{specialDay.emoji}</Typography>
            <Typography style={{ fontWeight: 600, fontSize: 30 }}>
                {specialDay.text}
            </Typography>
            <Typography sx={{ fontSize: 30, ml: 2 }}>{specialDay.emoji}</Typography>
        </Box>
    );
};

export default SpecialDays;
