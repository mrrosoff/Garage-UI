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
        date: DateTime.fromFormat("03-23", formatString),
        text: "Happy Birthday Christine",
        emoji: "🎉"
    },
    {
        date: DateTime.fromFormat("05-17", formatString),
        text: "Happy Birthday Matthew and Anna",
        emoji: "🎉"
    },
    {
        date: DateTime.fromFormat("06-23", formatString),
        text: "Happy Birthday Helena",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("07-04", formatString), text: "Happy Forth Of July", emoji: "🇺🇸" },
    {
        date: DateTime.fromFormat("08-06", formatString),
        text: "Happy Birthday Floris",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("10-07", formatString), text: "Happy Birthday Dante", emoji: "🎉" },
    { date: DateTime.fromFormat("10-31", formatString), text: "Happy Halloween", emoji: "🎃" },
    { date: DateTime.fromFormat("12-25", formatString), text: "Merry Christmas", emoji: "🎄" },
    { date: DateTime.fromFormat("12-31", formatString), text: "Happy New Year", emoji: "🎉" }
];

export default specialDays;
