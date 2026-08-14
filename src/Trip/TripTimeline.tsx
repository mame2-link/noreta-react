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
  toHalfWidth,
  setMetaOgTitle,
  // setLinkCanonical,
} from "../Common/CommonFunc";

import { agencies } from "../Common/Agencies";
import { trip_state } from "../lib/trip_state";

export default function TripTimeline({ state }: { state: trip_state }) {
  useEffect(() => {
    scrollToAnchor();
  }, []);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const seq = query.get("seq");
  const stopTimes = state.stop_times;
  const stops = state.stops;
  const trip = state.trip;
  const route = state.route;
  const route_short_name = route.route_short_name;
  const route_color = "#" + route.route_color;
  const agency_name = agencies.get(route.agency_id)?.agency_name;
  const HOUR9SEC = 32400; // 9 Hour === 32400 Seconds
  let title = agency_name + " ";
  const stopMap = new Map();
  for (const stop of stops) {
    stopMap.set(stop.stop_id, stop);
  }
  if (route_short_name) title += "(" + route_short_name + ")";
  let headsign = "";
  let s2 = null;
  for (let i = 0; i < stopTimes.length; i++) {
    if (stopTimes[i].stop_sequence === Number(seq)) {
      headsign = stopTimes[i].stop_headsign!;
      // const canonical_url =
      //   "https://t2.mame2.link/stop/" + stopTimes[i].stop_id;
      // setLinkCanonical(canonical_url);
      if (i > 0) {
        const s = stopMap.get(stopTimes[i].stop_id);
        s2 = hhmm(stopTimes[i].departure_time!) + " " + s.stop_name;
        if (s.platform_code) s2 += " のりば" + s.platform_code;
      }
      break;
    }
  }
  if (!headsign || headsign.length < 1) headsign = trip.trip_headsign!;
  title += " " + headsign + " " + hhmm(stopTimes[0].departure_time!);
  const s = stopMap.get(stopTimes[0].stop_id);

  let stopName = s.stop_name;
  if (s.platform_code) stopName += " のりば" + s.platform_code;
  title += " " + stopName;
  if (s2) title += " - " + s2;
  title = toHalfWidth(title);
  // document.title = title;

  // og:title
  setMetaOgTitle(title);

  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

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

  // GA4
  // window.gtag('js', new Date());
  // window.gtag('event', 'page_view', { page_title: document.title, page_location: location.pathname + location.search })
  // window.gtag('config', 'G-L8YDJSX9JX');

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
