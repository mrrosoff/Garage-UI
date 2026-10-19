import { DateTime } from "luxon";

export interface SpecialDay {
    month: number;
    day: number;
    text: string;
    emoji: string;
}

const specialDays: SpecialDay[] = [
    { month: 1, day: 1, text: "Happy New Year", emoji: "🎉" },
    { month: 2, day: 14, text: "Happy Valentine's Day", emoji: "💖" },
    { month: 5, day: 16, text: "Happy Birthday Max", emoji: "🎉" },
    { month: 5, day: 24, text: "Happy Birthday Jaden", emoji: "🎉" },
    { month: 7, day: 4, text: "Happy Fourth Of July", emoji: "🇺🇸" },
    { month: 7, day: 19, text: "Happy Birthday Mother", emoji: "🎉" },
    { month: 10, day: 31, text: "Happy Halloween", emoji: "🎃" },
    { month: 12, day: 17, text: "Happy Birthday Jack", emoji: "🎉" }
];

// Compare month and day only, so dates keep matching after the year rolls over without a restart
export const getSpecialDay = (date = DateTime.now()) =>
    specialDays.find(
        (specialDay) => specialDay.month === date.month && specialDay.day === date.day
    );

export default specialDays;
