import React from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Modal,
    Typography,
    useTheme
} from "@mui/material";
import { grey, blue } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { DateTime, Duration } from "luxon";
import callExternalAPIOnInterval from "../../hooks/callExternalAPIOnInterval";

const MountainInfoCard = () => {
    const { VITE_TIME_INTERVAL, VITE_SKI_RESORT_ID } = import.meta.env;
    const snowfallData: any | undefined = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed/${VITE_SKI_RESORT_ID}/snowfall`
    );
    const resortData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
        `https://mtnpowder.com/feed?resortId=${VITE_SKI_RESORT_ID}`
    );
    const snowReport = resortData?.SnowReport;
    const mountainAreas = resortData?.MountainAreas;

    // TODO: Replace with loading screen
    if (!snowfallData || !snowReport || !mountainAreas) {
        return null;
    }

    const fullMonthData = getFullMonthData(snowfallData);

    const totalOpenLifts = snowReport.TotalOpenLifts;
    const totalLifts = snowReport.TotalLifts;

    const totalOpenTrails = snowReport.TotalOpenTrails;
    const totalTrails = snowReport.TotalTrails;

    return (
        <Box
            p={2}
            display={"flex"}
            flexDirection={"column"}
            sx={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: grey[300],
                borderRadius: 5,
                height: "100%"
            }}
        >
            <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                <Typography style={{ fontSize: 32, fontWeight: 500 }}>Mountain</Typography>
                <LiveStreamModal />
            </Box>
            <Box pt={2} flexGrow={1} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"space-around"}>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Typography style={{ fontSize: 24, fontWeight: 500 }}>
                            Trails Open
                        </Typography>
                        <TrailInfo totalOpenTrails={totalOpenTrails} totalTrails={totalTrails} />
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Typography style={{ fontSize: 24, fontWeight: 500 }}>
                            Lifts Open
                        </Typography>
                        <LiftsInfo totalOpenLifts={totalOpenLifts} totalLifts={totalLifts} />
                    </Box>
                </Box>
                <Box width={"100%"} height={"100%"} mb={-1} ml={-3}>
                    <SnowfallChart snowfallData={fullMonthData} />
                </Box>
            </Box>
        </Box>
    );
};

const getFullMonthData = (snowfallData: any) => {
    const transformData = snowfallData.SnowfallEvents.map((snowfallEvent: any) => ({
        SnowIn: snowfallEvent.SnowIn,
        time: DateTime.fromISO(snowfallEvent.CreateDate).toMillis()
    })).filter((snowfallEvent: any) => {
        const lastMonth = Duration.fromObject({ month: 1 });
        return snowfallEvent.time > DateTime.now().minus(lastMonth).toMillis();
    });
    const fullMonthData = [];
    for (let i = 0; i < 30; i++) {
        const iDays = Duration.fromObject({ days: 30 - i });
        const iDaysAgo = DateTime.now().minus(iDays);
        const foundPoint = transformData.find(
            (point: any) =>
                DateTime.fromMillis(point.time).day === iDaysAgo.day &&
                DateTime.fromMillis(point.time).month === iDaysAgo.month
        );

        if (foundPoint) {
            fullMonthData.push(foundPoint);
        } else {
            fullMonthData.push({ SnowIn: 0, time: iDaysAgo.toMillis() });
        }
    }

    let accumilation = 0;

    for (let i = 0; i < 30; i++) {
        accumilation += parseFloat(fullMonthData[i].SnowIn);
        fullMonthData[i] = { ...fullMonthData[i], Accumilation: accumilation };
    }
    return fullMonthData;
};

const getLiftsOpen = (liftData: any) => {
    return liftData.filter((lift: any) => lift.Status === "Open");
};

const getTrailsOpen = (liftData: any) => {
    return liftData
        .map((lift: any) => lift.Trails.filter((trail: any) => trail.Status !== "Closed"))
        .flat()
        .reduce(
            (accumulator: any, nextTrail: any) =>
                accumulator.map((trail: any) => trail.Name).includes(nextTrail.Name)
                    ? accumulator
                    : [...accumulator, nextTrail],
            []
        )
        .sort((a: any, b: any) => a.Name.localeCompare(b.Name));
};

const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    const radius = 12;
    const theme = useTheme();
    return (
        <g>
            <text
                x={x + width / 2}
                y={y - radius}
                textAnchor="middle"
                dominantBaseline="middle"
                color={theme.palette.primary.main}
                fontSize={15}
            >
                {value != 0 ? value + '"' : ""}
            </text>
        </g>
    );
};

const pieChartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="black"
            fontSize={20}
            fontWeight={500}
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {value}
        </text>
    );
};
const LiftsInfo = (props: any) => {
    return <TrailInfo totalOpenTrails={props.totalOpenLifts} totalTrails={props.totalLifts} />;
};

const TrailInfo = (props: any) => {
    const theme = useTheme();
    const trailsData = [
        {
            name: "Open",
            value: props.totalOpenTrails
        },
        {
            name: "Closed",
            value: props.totalTrails - props.totalOpenTrails
        }
    ];
    const colors = [theme.palette.primary.main, theme.palette.neutral.mediumDark];
    return (
        <PieChart width={200} height={200}>
            <Pie
                data={trailsData}
                labelLine={false}
                label={pieChartLabel}
                outerRadius={80}
                dataKey="value"
            >
                {trailsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
        </PieChart>
    );
};

const LiveStreamModal = (props: any) => {
    const { VITE_YOUTUBE_LIVE_STREAM_LINK, VITE_LIVE_STREAM_BUTTON_TITLE } = import.meta.env;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                sx={{ borderRadius: 5, height: "80%" }}
                startIcon={<VideocamIcon />}
                variant={"contained"}
                size={"small"}
                onClick={handleOpen}
            >
                {VITE_LIVE_STREAM_BUTTON_TITLE}
            </Button>
            <Dialog
                fullScreen={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogActions>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent sx={{ pt: 0 }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={VITE_YOUTUBE_LIVE_STREAM_LINK + "?autoplay=1"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const SnowfallChart = (props: any) => {
    const theme = useTheme();
    const snowInMax =
        Math.max(...props.snowfallData.map((data: any) => parseFloat(data.SnowIn))) + 2;
    const accumMax =
        Math.max(...props.snowfallData.map((data: any) => parseFloat(data.Accumilation))) + 10;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={props.snowfallData}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }}
            >
                <CartesianGrid stroke={theme.palette.neutral.medium} />
                <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    interval="preserveStartEnd"
                    minTickGap={40}
                    tickFormatter={(tickItem) => DateTime.fromMillis(tickItem).toFormat("MMMM d")}
                    domain={["dataMin", "dataMax"]}
                />
                <YAxis dataKey="Accumilation" scale={"linear"} domain={[0, accumMax]} yAxisId="1" />
                <YAxis hide dataKey="SnowIn" scale={"linear"} domain={[0, snowInMax]} yAxisId="2" />
                <Area
                    type="monotone"
                    dataKey="Accumilation"
                    fill={theme.palette.neutral.mediumDark}
                    stroke={theme.palette.neutral.dark}
                    yAxisId="1"
                />
                <Bar dataKey="SnowIn" barSize={5} fill={theme.palette.primary.main} yAxisId="2">
                    <LabelList dataKey="SnowIn" content={renderCustomizedLabel} />
                </Bar>
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default MountainInfoCard;
