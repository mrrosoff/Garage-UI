import { ReactNode } from "react";

import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const Card = (props: {
    title: string;
    action?: ReactNode;
    width?: number | string;
    height: number | string;
    children: ReactNode;
}) => (
    <Box
        sx={{
            pt: 1,
            pl: 2,
            pr: 2,
            display: "flex",
            flexDirection: "column",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: grey[300],
            borderRadius: 1,
            width: props.width,
            height: props.height
        }}
    >
        <Grid container sx={{ justifyContent: "space-between" }}>
            <Grid>
                <Typography style={{ fontSize: 42, fontWeight: 500 }}>{props.title}</Typography>
            </Grid>
            {props.action && <Grid>{props.action}</Grid>}
        </Grid>
        <Box sx={{ pt: 1, flexGrow: 1 }}>{props.children}</Box>
    </Box>
);

export const LoadingBar = () => (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
            <LinearProgress sx={{ height: 8 }} />
        </Box>
    </Box>
);

export default Card;
