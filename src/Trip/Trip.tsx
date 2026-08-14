import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";

import { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import {
  queryStopTimesByTripId,
  getBatchStops,
  getTrip,
  getRoute,
} from "../lib/data";

import { HideBackHeader } from "../Common/HideBackHeader";
import { CommonFooter } from "../Common/CommonFooter";
import { ExtraBus } from "../Common/ExtraBus";
import TripTimeline from "./TripTimeline";
import { toHalfWidth, setMetaRobotsNoindex } from "../Common/CommonFunc";
import { VehicleNumber } from "../Common/VehicleNumber";
import { trip_state } from "../lib/trip_state";
import { StopTime } from "../lib/stop_time";


export default function Trip() {
  const { tripId } = useParams();
  const [states, setStates] = useState<trip_state>();
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const seq = query.get("seq");
  let stop = null;

  // noindex
  setMetaRobotsNoindex();

  function getStopById(stopId: string) {
    if (!states) return null;
    return states.stops.find(stop => stop.stop_id === stopId);
  }
  let headsign = "";
  let vehicle_num = null;
  let vehicleUrl = null;
  if (states) {
    if (states.stop_times) {
      const stopTime = states.stop_times.find(
        stop_time => stop_time.stop_sequence === Number(seq)
      );
      if (stopTime) {
        headsign = stopTime.stop_headsign!;
        stop = getStopById(stopTime.stop_id!);
      }
    }
    if (!headsign || headsign.length < 1) headsign = states.trip.trip_headsign!;


    if (states?.route && states?.trip.vehicle_id) {
      vehicleUrl =
        "/vehicle/" + states.trip.vehicle_id + "?trip_id=" + tripId + "&seq=" + seq;
      if (stop) {
        vehicleUrl += "&stop_id=" + stop.stop_id;
      }
      const n = states.route.agency_id.length + 1;
      vehicle_num = states.trip.vehicle_id.slice(n);
    }
  }

  // if (errorStatus) {
  // let title = "本日は該当便がありません - 便ID: " + tripId + " " + seq;
  // document.title = title;
  // // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

  // GA4
  // window.gtag('js', new Date());
  // window.gtag('event', 'exception', { 'description': 'trip error', 'fatal': false });
  // window.gtag('config', 'G-L8YDJSX9JX');
  // }

  useEffect(() => {
    const fetchStopTimes = async () => {
      // trip
      const trip = await getTrip(tripId!);
      if (!trip) {
        setErrorStatus(true);
        return;
      }

      // stop_times stops
      const stopTimes = await queryStopTimesByTripId(trip.trip_id) as StopTime[];
      if (!stopTimes) return;
      const ids = new Set<string>();
      for (const data of stopTimes) {
        if (!data?.stop_id) continue;
        ids.add(data.stop_id);
      }
      const stops = await getBatchStops(Array.from(ids)) as Schema["Stop"]["type"][];

      // route
      const route = await getRoute(trip.route_id!) as Schema["Route"]["type"];

      const states = {
        trip: trip,
        stop_times: stopTimes,
        stops: stops,
        route: route,
      }
      setStates(states);
    };
    fetchStopTimes();
  }, []);

  return (
    <>
      {stop && <HideBackHeader stop={stop}></HideBackHeader>}
      <main>
        {/* {stopTimes && stops && trip && route && ( */}
        {states && (
          <Box
            component="h1"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              m: 2,
              borderRadius: 1,
              bgcolor: "grey.900",
              maxWidth: 470,
            }}
          >
            {states?.route?.route_short_name && (
              <Box
                sx={{
                  color: "secondary.main",
                  border: 2,
                  borderRadius: 1,
                  p: 1,
                  whiteSpace: "nowrap",
                  typography: "h6",
                }}
              >
                {toHalfWidth(states.route.route_short_name)}
              </Box>
            )}
            <Box
              sx={{
                flexGrow: 1,
                textAlign: "center",
                typography: "h6",
                color: "common.white",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {headsign}
            </Box>
          </Box>
        )}
        {states?.trip && states.trip.is_added && (
          <Box sx={{ ml: 1, display: "inline" }}>
            <ExtraBus></ExtraBus>
          </Box>
        )}
        {vehicle_num && (
          <Box sx={{ m: 2, display: "inline" }}>
            <VehicleNumber vehicle_number={vehicle_num}></VehicleNumber>
          </Box>
        )}
        {vehicleUrl && <Link href={vehicleUrl}>車両情報</Link>}
        {states && (<TripTimeline state={states} />
        )}
        {errorStatus && (
          <Typography sx={{ m: 2 }}>
            本日は該当便がありません。便は平日や土曜日、祝日などの区分で種類が異なります。またダイヤ改正で名前が変更になる場合もあります🫡
            <br />
            <Link href="/">ホームへ</Link>
          </Typography>
        )}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
