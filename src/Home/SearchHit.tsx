import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "./HeadsignList";

export function SearchHit(props) {
  const hit = props.hit;
  const stopUrl = "/stop/" + hit.objectID;
  let stopName = hit.stopName;
  if (hit.platform_code && hit.platform_code.length > 0) {
    stopName += " のりば " + hit.platform_code;
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
        <Typography>{hit.stopKana}</Typography>
      </Box>
      <meta itemProp="name" content={hit.stopName} />
      <meta itemProp="latitude" content={hit._geoloc.lat} />
      <meta itemProp="longitude" content={hit._geoloc.lng} />
      <HeadsignList headsign={hit.headsigns} />
    </Paper>
  );
}
