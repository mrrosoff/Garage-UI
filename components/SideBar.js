import React from "react";

import { Button, Grid, SvgIcon } from "@mui/material";

import { remote } from "electron";

const SideBar = (props) => {
	let mainProcess;
	if (remote) {
		mainProcess = remote.require("./main");
	}

	return (
		<Grid
			container
			direction={"column"}
			spacing={1}
			style={{ height: "100%" }}
			justifyContent={"center"}
			alignItems={"center"}
			alignContent={"center"}
		>
			<Grid item style={{ height: "100%", width: "100%" }}>
				<Button
					style={{ height: "100%", width: "100%" }}
					onClick={() => {
						if (mainProcess) mainProcess.garageSwitch();
						else console.log("Not Supported Platform");
					}}
				>
					<HomeIcon />
				</Button>
			</Grid>
		</Grid>
	);
};

const HomeIcon = (props) => (
	<SvgIcon color="primary" style={{ fontSize: 220 }}>
		<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="black" strokeWidth={1} />
	</SvgIcon>
);

export default SideBar;
