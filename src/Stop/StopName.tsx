import { useLocation } from "react-router";
import type { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  toHalfWidth,
  // setLinkCanonical,
  // setMetaOgTitle,
} from "../Common/CommonFunc";
import { agencies } from "../Common/Agencies";

const MAX_HEADSING = 3;

export function StopName({ stop }: { stop: Schema["Stop"]["type"] }) {

  // location query
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  const page = pageStr === null ? null : parseInt(pageStr);

  let description = "#busStopの時刻表です。";
  // stopName
  let stopName = stop.stop_name;
  if (stop.platform_code) stopName += " " + stop.platform_code; // のりば

  let sub = "";
  let i = 0;
  let shortSub = "";
  const aSet = new Set();
  const rSet = new Set();
  const hSet = new Set();
  if (stop.headsigns) {
    for (const headsign of stop.headsigns) {
      if (i >= MAX_HEADSING) break;
      if (!headsign) continue;
      const agencyName = agencies.get(headsign.agency_id)?.agency_name;
      const routeShortName = headsign.route_short_name;
      const stopHeadsign = headsign.headsign;
      aSet.add(agencyName);
      rSet.add(routeShortName);
      hSet.add(stopHeadsign);
      sub = sub + " " + routeShortName + " " + stopHeadsign;
      if (i === 0) {
        shortSub = sub + " " + agencyName;
      }
      i++;
    }
  }
  // if (stop.headsigns.length > MAX_HEADSING) sub += " など";
  sub += " " + Array.from(aSet).toString();

  // title
  let title = toHalfWidth(stopName + shortSub);
  if (page) title += " page " + page;

  // description
  stopName = stop.stop_name;
  if (stop.platform_code) stopName += " " + stop.platform_code;
  // const description = toHalfWidth(stopName + sub);
  description = description.replace("#busStop", stopName!);
  if (rSet.size > 0) {
    description +=
      "系統番号は " + Array.from(rSet).toString().replace(/,/g, " ") + " ";
  }
  if (hSet.size > 0) {
    description +=
      "行先は " + Array.from(hSet).toString().replace(/,/g, " ") + " ";
  }
  if (aSet.size > 0) {
    description +=
      "運行会社は" +
      Array.from(aSet).toString().replace(/,/g, " ") +
      "です。";
  }
  description = toHalfWidth(description);

  // canonical
  // const canonical_url = "https://t2.mame2.link/stop/" + stop.stop_id;
  // setLinkCanonical(canonical_url);

  // GA4
  // window.gtag('js', new Date());
  // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
  // window.gtag('config', 'G-L8YDJSX9JX');

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-around",
          // alignItems: "center",
          m: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component="h1" variant="h6">
            <ruby>
              {stop.stop_name}
              <rp>(</rp>
              <rt>{stop.stop_kana}</rt>
              <rp>)</rp>
            </ruby>
          </Typography>
          {stop.platform_code && (
            <Box
              sx={{
                ml: 1,
                px: 1,
                bgcolor: "primary.main",
                color: "#ffffff",
                borderRadius: 5,
              }}
            >
              <Typography component="h2" variant="h6">
                {stop.platform_code}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </>
  );
}
