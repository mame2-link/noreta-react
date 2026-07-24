import { useEffect } from "react";

// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
// import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import {
  hhmm,
  initBaseTimestamp,
  delayMin,
  scrollToAnchor,
  spentSec,
  toHalfWidth,
} from "../Common/CommonFunc";
import { agencies } from "../Common/Agencies";

export default function StopTimesCards(props) {
  const stopTimes = props.stopTimes;
  const tripMap = props.tripMap;
  const routes = props.routes;
  const warning = props.warning;
  const HOUR9SEC = 32400; // 9 Hour === 32400 Seconds

  // let isAnchor = false;
  // const timezone = "Asia/Tokyo";
  // const t = getTimeString(timezone);

  const cards = [];
  const timestamp0 = initBaseTimestamp(); // 遅れを計算する前に実行
  for (const stopTime of stopTimes) {
    const trip = tripMap.get(stopTime.trip_id);
    const departure_time = hhmm(stopTime.departure_time);
    const stop_sequence = stopTime.stop_sequence;
    const tripUrl = "/trip/" + trip.trip_id + "?seq=" + stop_sequence;
    const dTStr =
      new Date(
        (timestamp0 + spentSec(stopTime.departure_time) + HOUR9SEC) * 1000
      )
        .toISOString()
        .slice(0, -1) + "+09:00";
    let headsign = stopTime.stop_headsign;
    if (!headsign || headsign.length < 1) {
      headsign = trip.trip_headsign;
    }
    let delay_str = "";
    let tColor = "text.primary";
    const timestamp = stopTime.timestamp;
    if (timestamp) {
      let delay_min = delayMin(timestamp, stopTime.departure_time);
      if (delay_min < 0) delay_min = 0;
      if (delay_min === 0) delay_str = "定刻";
      else {
        delay_str = "遅れ" + delay_min + "分";
        tColor = "error";
      }
    }
    if (warning && timestamp) {
      delay_str = "遅れ";
      let delay_min = delayMin(timestamp, stopTime.departure_time);
      if (delay_min < 0) delay_min = 0;
      else {
        delay_str += delay_min;
      }
      delay_str += "分?";
      tColor = "error";
    } else if (warning && !timestamp) {
      delay_str = "バスロケなし";
      tColor = "error";
    }
    let route = null;
    for (const r of routes) {
      if (r.route_id === tripMap.get(stopTime.trip_id).route_id) {
        route = r;
      }
    }
    const route_short_name = toHalfWidth(route.route_short_name);
    const agency_name = agencies.get(route.agency_id)?.agency_name;

    // anchor
    // if (i === 0 && t < stopTime.departure_time) {
    //   isAnchor = true;
    // }
    // if (
    //   i > 0 &&
    //   i < stopTimes.length - 1 &&
    //   !isAnchor &&
    //   stopTime.departure_time <= t &&
    //   t <= stopTimes[i + 1].departure_time
    // ) {
    //   isAnchor = true;
    // }
    // if (i === stopTimes.length - 1 && !isAnchor) {
    //   isAnchor = true;
    // }

    cards.push(
      <Grid
        key={stopTime.trip_id}
        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      >
        <Card variant="outlined" sx={{ bgcolor: "#e0e0e0" }}>
          <CardActionArea>
            <Link color="inherit" underline="none" href={tripUrl}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      component="time"
                      variant="h5"
                      sx={{ p: 1 }}
                      dateTime={dTStr}
                    >
                      {departure_time}
                    </Typography>
                  </Box>
                  <Typography>{agency_name}</Typography>
                  <Box>
                    <Typography
                      component="div"
                      variant="h6"
                      color={tColor}
                      sx={{ p: 1 }}
                    >
                      {delay_str}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    borderRadius: 1,
                    bgcolor: "#757575",
                    color: "#ffffff",
                  }}
                >
                  <Box
                    sx={{ color: "secondary.main", border: 2, borderRadius: 1 }}
                  >
                    <Typography component="div" variant="h6">
                      {route_short_name}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography component="div" variant="h6">
                      {headsign}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  useEffect(() => {
    scrollToAnchor();
  }, []);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        {cards}
      </Grid>
      {/* <Fab
        color="secondary"
        size="small"
        sx={{ position: "fixed", bottom: 48, right: 32 }}
        onClick={() => {
          scrollToAnchor();
        }}
      >
        <AccessTimeIcon />
      </Fab> */}
    </Box>
  );
}
