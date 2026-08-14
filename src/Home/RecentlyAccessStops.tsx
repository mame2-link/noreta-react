import { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "./HeadsignList";

function Stop({ stop }: { stop: Schema["Stop"]["type"] }) {
  const stopUrl = "/stop/" + stop.stop_id;
  let stopName = stop.stop_name;
  if (stop.platform_code && stop.platform_code.length > 0) {
    stopName += " のりば " + stop.platform_code;
  }
  return (
    <Paper
      sx={{ p: 2, mt: 2, bgcolor: "grey.300" }}
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
      <meta itemProp="name" content={String(stop.stop_name)} />
      <meta itemProp="latitude" content={String(stop.stop_lat)} />
      <meta itemProp="longitude" content={String(stop.stop_lon)} />
      <HeadsignList headsign={stop.headsigns as Schema["Headsign"]["type"][]} />
    </Paper>
  );
}

export function RecentlyAccessStops({ stops }: { stops: Schema["Stop"]["type"][] }) {
  if (!stops) return;

  const stop_list = [];
  for (const stop of stops) {
    if (stop && stop.stop_id) {
      stop_list.push(stop);
    }
  }

  return (
    <Box>
      {stop_list.map((stop) => (
        <Stop stop={stop} key={stop.stop_id} />
      ))}
    </Box>
  );
}
