import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "../Home/HeadsignList";
import { Schema } from "../../amplify/data/resource";

export function StopInfo({ stop }: { stop: Schema["Stop"]["type"] }) {
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
      <meta itemProp="name" content={stop.stop_name!} />
      <meta itemProp="latitude" content={String(stop.stop_lat)} />
      <meta itemProp="longitude" content={String(stop.stop_lon)} />
      {stop.headsigns && <HeadsignList headsign={stop.headsigns as Schema["Headsign"]["type"][]} />}
    </Paper>
  );
}
