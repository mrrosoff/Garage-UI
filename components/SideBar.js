import React from "react";

import { Box, Button, SvgIcon, Typography } from "@mui/material";

import { ipcRenderer } from "electron";

ipcRenderer.on("notSupportedPlatform", (_, err) => {
	console.info("Not Supported Platform for Garage Door");
	console.info(err)
});

const SideBar = (props) => {
	return (
		<Box display={"flex"} flexDirection={"column"} style={{ height: "100%", width: "100%" }}>
			{props.specialDay && (
				<Box display={"flex"} justifyContent={"center"} style={{ width: "100%" }} mb={2}>
					<Typography sx={{ fontSize: 30, mr: 2 }}>{props.specialDay.emoji}</Typography>
					<Typography style={{ fontWeight: 500, fontSize: 30, textAlign: "center" }}>
						{props.specialDay.text}
					</Typography>
					<Typography sx={{ fontSize: 30, ml: 2 }}>{props.specialDay.emoji}</Typography>
				</Box>
			)}
			<Button
				style={{ height: "100%", width: "100%" }}
				onClick={() => ipcRenderer.send("garageSwitch")}
			>
				<HomeIcon />
			</Button>
		</Box>
	);
};

const HomeIcon = (props) => (
	<SvgIcon color="primary" style={{ fontSize: 220 }}>
		<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="black" strokeWidth={1} />
	</SvgIcon>
);

export default SideBar;
