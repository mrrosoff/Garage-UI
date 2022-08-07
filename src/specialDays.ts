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
    { date: DateTime.fromFormat("05-16", formatString), text: "Happy Birthday Max", emoji: "🎉" },
    { date: DateTime.fromFormat("05-24", formatString), text: "Happy Birthday Jaden", emoji: "🎉" },
    { date: DateTime.fromFormat("07-04", formatString), text: "Happy Forth Of July", emoji: "🇺🇸" },
    {
        date: DateTime.fromFormat("07-19", formatString),
        text: "Happy Birthday Mother",
        emoji: "🎉"
    },
    { date: DateTime.fromFormat("10-31", formatString), text: "Happy Halloween", emoji: "🎃" },
    { date: DateTime.fromFormat("12-17", formatString), text: "Happy Birthday Jack", emoji: "🎉" }
];

export default specialDays;
