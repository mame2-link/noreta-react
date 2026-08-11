import React from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "../Home/HeadsignList";

export function StopInfo(props) {
  const stop = props.stop;
  const stopUrl = "/stop/" + stop.stop_id;
  let stopName = stop.stop_name;
  if (stop.platform_code && stop.platform_code.length > 0) {
    stopName += " のりば " + stop.platform_code;
  }
  return (
    <Paper
      sx={{ p: 1, mt: 1, bgcolor: "#e0e0e0" }}
      itemScope
      itemType="https://schema.org/BusStop"
    >
      <Box>
        <Link href={stopUrl}>
          <Typography component="div" variant="h6">
            {stopName}
          </Typography>
        </Link>
        <Typography>{stop.stop_kana}</Typography>
      </Box>
      <meta itemProp="name" content={stop.stop_name} />
      <meta itemProp="latitude" content={stop.stop_lat} />
      <meta itemProp="longitude" content={stop.stop_lon} />
      <HeadsignList headsign={stop.headsigns} />
    </Paper>
  );
}
