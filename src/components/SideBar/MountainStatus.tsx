import { Box, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

import { Cell, Label, Pie, PieChart } from "recharts";

import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const MountainStatus = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const snowReport = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    )?.SnowReport;

    return (
        <Box display={"flex"}>
            <MountainPieChart
                chartUnit={"Trails"}
                totalOpen={parseInt(snowReport?.TotalOpenTrails)}
                totalAmount={parseInt(snowReport?.TotalTrails)}
            />
            <MountainPieChart
                chartUnit={"Lifts"}
                totalOpen={parseInt(snowReport?.TotalOpenLifts)}
                totalAmount={parseInt(snowReport?.TotalLifts)}
            />
            <MountainPieChart
                type={"Percent"}
                chartUnit={"Acres"}
                totalOpen={parseInt(snowReport?.OpenTerrainAcres)}
                totalAmount={parseInt(snowReport?.TotalTerrainAcres)}
            />
        </Box>
    );
};

const MountainPieChart = (props: {
    totalOpen: number;
    totalAmount: number;
    chartUnit: string;
    type?: "Fraction" | "Percent";
}) => {
    const percentOpen = (props.totalOpen / props.totalAmount) * 100;
    const data = [
        { name: "open", value: props.totalOpen },
        { name: "not open", value: props.totalAmount - props.totalOpen }
    ];

    const theme = useTheme();
    const COLORS = [theme.palette.primary.light, grey[300]];

    const labelType = props.type || "Fraction";
    return (
        <Box p={1}>
            <PieChart width={100} height={100}>
                <Pie
                    data={data}
                    cx={"50%"}
                    cy={"50%"}
                    startAngle={90}
                    endAngle={450}
                    innerRadius={40}
                    outerRadius={50}
                    dataKey="value"
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                        width={30}
                        position="center"
                        content={
                            labelType === "Fraction" ? (
                                <FractionLabel
                                    totalOpen={props.totalOpen}
                                    totalAmount={props.totalAmount}
                                    chartUnit={props.chartUnit}
                                />
                            ) : (
                                <PercentLabel
                                    percentOpen={percentOpen}
                                    chartUnit={props.chartUnit}
                                />
                            )
                        }
                    ></Label>
                </Pie>
            </PieChart>
        </Box>
    );
};

const FractionLabel = (
    props: { totalOpen: number; totalAmount: number; chartUnit: string } & any
) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";
    return (
        <>
            <text
                x={cx - 5 * props.totalOpen.toString().length}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
            >
                {props.totalOpen}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={10}
                fontWeight={500}
            >
                / {props.totalAmount}
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
    );
};

const PercentLabel = (props: { percentOpen: number; chartUnit: string } & any) => {
    const { cx, cy } = props.viewBox;
    const theme = useTheme();
    const textColor = theme.palette.mode === "dark" ? theme.palette.neutral.light : "#121212";

    return (
        <>
            <text
                x={cx - 5}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
            >
                {props.percentOpen.toFixed(0)}
            </text>
            <text
                x={cx + 15}
                y={cy - 2}
                fill={textColor}
                textAnchor="middle"
                fontSize={14}
                fontWeight={500}
            >
                %
            </text>
            <text fill={textColor} x={cx + 1} y={cy + 18} textAnchor="middle" fontSize={14}>
                {props.chartUnit}
            </text>
        </>
    );
};

export default MountainStatus;
