import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  hhmm,
  initBaseTimestamp,
  delayMin,
  getTimeString,
  spentSec,
  toHalfWidth,
  HOUR9SEC,
  hasPastTimestamp,
  isDepartureProspects,
  StoptimeStatus,
} from "../Common/CommonFunc";
import { agencies } from "../Common/Agencies";
import { ExtraBus } from "../Common/ExtraBus";
import { VehicleNumber } from "../Common/VehicleNumber";
import { StopTimesState } from "../lib/stop_times_state";

export function CardList({ states }: { states: StopTimesState }) {
  const stopTimes = states.stop_times;
  const tripMap = states.tripMap;
  const routeMap = states.routeMap;
  // const uncertain = props.uncertain === true ? true : false;
  const cards = [];
  const timestamp0 = initBaseTimestamp(); // 遅れを計算する前に実行
  const now_str = getTimeString();
  // let o = 10;
  for (const stopTime of stopTimes) {
    const trip = tripMap.get(stopTime.trip_id);
    if (!trip) continue;
    const route = routeMap.get(trip.route_id!);
    if (!route) continue;
    const departureTime = hhmm(stopTime.departure_time!); // 表示用
    const departure_time = stopTime.departure_time; // 計算用
    const datetimeStr =
      new Date((timestamp0 + spentSec(departure_time!) + HOUR9SEC) * 1000)
        .toISOString()
        .slice(0, -1) + "+09:00";
    const stop_sequence = stopTime.stop_sequence;
    const tripUrl = "/trip/" + trip.trip_id + "?seq=" + stop_sequence;
    let headsign = stopTime.stop_headsign;
    if (!headsign || headsign.length < 1) {
      headsign = trip.trip_headsign;
    }
    const route_short_name = toHalfWidth(route.route_short_name ?? "");
    const agency_name = agencies.get(route.agency_id)?.agency_name;
    const agency_color = agencies.get(route.agency_id)?.agency_color;

    // 遅れ
    let delay_str = "";
    let tColor = "text.primary";
    const timestamp = stopTime.timestamp;
    if (hasPastTimestamp(stopTime)) {
      let delay_min = delayMin(timestamp!, departure_time!);
      if (delay_min < 0) delay_min = 0;
      if (delay_min === 0) delay_str = "定刻発車";

      if (isDepartureProspects(stopTime)) {
        delay_str += "見込み";
      }
      if (delay_min > 0) {
        delay_str = "遅れ" + delay_min + "分発車";
        tColor = "error";
      }
    }

    // 遅れ上書き
    if (stopTime.delayMin !== undefined) {
      let waitMin = Math.round(
        (spentSec(departure_time!) +
          Number(stopTime.delayMin) * 60 -
          spentSec(now_str)) /
        60
      );
      if (waitMin <= 0) waitMin = 0;
      if (stopTime.delayMin === 0) {
        // delay_str = "定刻見込み";
        if (waitMin < 1) {
          delay_str = "まもなく到着";
        } else {
          delay_str = "あと" + waitMin + "分で到着";
        }
      } else {
        tColor = "error";
        // delay_str = "遅れ" + stopTime.delayMin + "分";
        if (waitMin < 1) {
          delay_str = "まもなく到着";
        } else {
          delay_str = "あと" + waitMin + "分で到着";
        }
      }
    }
    if (stopTime.status === StoptimeStatus.passed) {
      delay_str = "通過";
    }
    if (stopTime.status === StoptimeStatus.unknown) {
      tColor = "error";
      delay_str = "バスロケなし";
    }

    let vehicle_num = null;
    if (route && trip && trip.vehicle_id) {
      const n = route.agency_id.length + 1;
      vehicle_num = trip.vehicle_id.slice(n);
    }

    // o--;

    cards.push(
      <Card key={stopTime.trip_id} sx={{ bgcolor: "grey.200" }}> {/* order={{ o }}*/}
        <CardActionArea>
          <Link color="inherit" underline="none" href={tripUrl}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  p: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    component="time"
                    variant="h5"
                    dateTime={datetimeStr}
                  >
                    {departureTime}
                  </Typography>
                  {trip.is_added && (
                    <Box sx={{ ml: 0.25, display: "inline" }}>
                      <ExtraBus></ExtraBus>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography component="div" variant="h6" color={tColor}>
                    {delay_str}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Stack direction="row" sx={{ mb: 1 }}>
                    <DirectionsBusIcon
                      sx={{ color: agency_color }}
                      fontSize="small"
                    />
                    <Typography
                      sx={{ color: agency_color }}
                      variant="subtitle2"
                    >
                      {agency_name}
                    </Typography>
                  </Stack>
                </Box>
                {vehicle_num && <VehicleNumber vehicle_number={vehicle_num} />}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  p: 1,
                  borderRadius: 1,
                  bgcolor: "grey.900",
                }}
              >
                {route_short_name &&
                  <Box
                    sx={{
                      color: "secondary.main",
                      border: 2,
                      borderRadius: 1,
                      p: 1,
                      typography: "h6",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {route_short_name}
                  </Box>
                }
                <Box
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    border: 2,
                    borderColor: "grey.900",
                    p: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "clip",
                    typography: "h6",
                    color: "common.white",
                  }}
                >
                  {headsign}
                </Box>
              </Box>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    );
  }

  return <>{cards}</>;
}
