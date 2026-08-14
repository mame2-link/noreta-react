import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "./HeadsignList";
import { Hit } from "algoliasearch";
import { Schema } from "../../amplify/data/resource";

export function SearchHit({ hit }: { hit: Hit, key: string }) {
  // const hit = props.hit;
  const stopUrl = "/stop/" + hit.objectID;
  let stopName = String(hit.stopName);
  
  const platform_code = hit.platform_code as string ?? "";
  const stopkana = String(hit.stopKana);
  // const lat = String(hit._geoloc?.lat);
  const headsigns = hit.headsigns as Schema["Headsign"]["type"][]
  if (platform_code && platform_code.length > 0) {
    stopName += " のりば " + platform_code;
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
        <Typography>{stopkana}</Typography>
      </Box>
      <meta itemProp="name" content={stopName} />
      {/* <meta itemProp="latitude" content={lat} />
      <meta itemProp="longitude" content={hit._geoloc.lng} /> */}
      <HeadsignList headsign={headsigns} />
    </Paper>
  );
}
