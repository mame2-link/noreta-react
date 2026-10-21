import { useEffect } from "react";
import { useLocation } from "react-router";

import Link from "@mui/material/Link";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";

import {
  hhmm,
  initBaseTimestamp,
  delayMin,
  scrollToAnchor,
  spentSec,
} from "../Common/CommonFunc";
import { trip_state } from "../lib/trip_state";

export default function TripTimeline({ state }: { state: trip_state }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const seq = query.get("seq");
  const stopTimes = state.stop_times;
  const stops = state.stops;
  const route = state.route;
  const route_color = "#" + route.route_color;
  const HOUR9SEC = 32400; // 9 Hour === 32400 Seconds

  const stopMap = new Map();
  for (const stop of stops) {
    stopMap.set(stop.stop_id, stop);
  }

  const list = [];
  const timestamp0 = initBaseTimestamp(); // 遅れを計算する前に実行
  let i = 0;
  for (const stopTime of stopTimes) {
    const timestamp = stopTime.timestamp;
    let isAnchor = false;
    if (String(stopTime.stop_sequence) === seq) {
      isAnchor = true;
    }
    let isLast = false;
    if (i === stopTimes.length - 1) {
      isLast = true;
    }
    i++;
    let pickup_enable = true;
    if (stopTime.pickup_type === 1) {
      pickup_enable = false;
    }
    let tColor = "text.primary";
    let delay_str = "";
    if (timestamp) {
      let delay_min = delayMin(stopTime.timestamp!, stopTime.departure_time!);
      if (delay_min < 0) delay_min = 0;
      if (delay_min === 0) delay_str = "定刻";
      else {
        delay_str = "遅れ" + delay_min + "分";
        tColor = "error";
      }
    }
    const stop = stopMap.get(stopTime.stop_id);
    const stopUrl = "/stop/" + stop.stop_id;
    let sName = stop.stop_name;
    if (stop.platform_code) sName += " " + stop.platform_code;
    const dTStr =
      new Date(
        (timestamp0 + spentSec(stopTime.departure_time!) + HOUR9SEC) * 1000
      )
        .toISOString()
        .slice(0, -1) + "+09:00";
    const departure_time = hhmm(stopTime.departure_time!);
    list.push(
      <TimelineItem key={stopTime.stop_sequence}>
        <TimelineOppositeContent>
          {isAnchor && (
            <Typography id="anchor" component="time" dateTime={dTStr}>
              {departure_time}
            </Typography>
          )}
          {!isAnchor && (
            <Typography component="time" dateTime={dTStr}>
              {departure_time}
            </Typography>
          )}
        </TimelineOppositeContent>
        <TimelineSeparator>
          {isAnchor && <TimelineDot sx={{ bgcolor: route_color }} />}
          {!isAnchor && (
            <TimelineDot variant="outlined" sx={{ borderColor: route_color }} />
          )}
          {!isLast && <TimelineConnector sx={{ bgcolor: route_color }} />}
        </TimelineSeparator>
        <TimelineContent itemScope itemType="https://schema.org/BusStop">
          {pickup_enable && (
            <>
              <Link href={stopUrl}>{sName}</Link>
              {timestamp && <Typography color={tColor}>{delay_str}</Typography>}
              <meta itemProp="name" content={stop.stop_name} />
              <meta itemProp="latitude" content={stop.stop_lat} />
              <meta itemProp="longitude" content={stop.stop_lon} />
              <meta itemProp="url" content={stop.stop_url} />
            </>
          )}
          {!pickup_enable && (
            <>
              <Typography itemProp="name">{stop.stop_name}</Typography>
              {timestamp && <Typography color={tColor}>{delay_str}</Typography>}
              <meta itemProp="latitude" content={stop.stop_lat} />
              <meta itemProp="longitude" content={stop.stop_lon} />
              <meta itemProp="url" content={stop.stop_url} />
            </>
          )}
        </TimelineContent>
      </TimelineItem>
    );
  }

  useEffect(() => {
    scrollToAnchor();
  }, []);

  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
    >
      {list}
    </Timeline>
  );
}
