import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import { getVehicle, getTrip, getRoute, googleMapsSignUrl, getStop } from "../lib/data";

// import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// import { agencies } from "../Common/Agencies";
import { HideTripBackHeader } from "./HideTripBackHeader";
import { VehicleNumber } from "../Common/VehicleNumber";
import { CommonFooter } from "../Common/CommonFooter";
// import { setLinkCanonical } from "../Common/CommonFunc";
import { VehicleAlart } from "./VehicleAlart";

export default function Vehicle() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState<Schema["Vehicle"]["type"]>();
  const [mapUri, setMapUri] = useState<string>();
  const [route, setRoute] = useState<Schema["Route"]["type"]>();
  const [stop, setStop] = useState<Schema["Stop"]["type"]>();
  const [errorStatus, setErrorStatus] = useState<boolean>(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const trip_id = query.get("trip_id");
  const seq = query.get("seq");
  const stop_id = query.get("stop_id");

  let vehicle_num = null;
  if (route && vehicleId) {
    const n = route.agency_id.length + 1;
    vehicle_num = vehicleId.slice(n);
  }

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) return;
      const vehicle = await getVehicle(vehicleId);
      if (!vehicle) {
        setErrorStatus(true);
        return;
      }
      setVehicle(vehicle);
      const key = "&key=AIzaSyBcHbDCehfqxRKabPLW77AIY4qFLNDiq3U";
      const zoom = "&zoom=16";
      let width = window.innerWidth - 32;
      if (width > 412) width = 412;
      const size = "&size=" + width + "x" + width;
      const center =
        vehicle.latitude + "," + vehicle.longitude;
      const markers =
        "&markers=anchor:bottom%7Cicon:https://t2.mame2.link/marker.png%7C" +
        center;
      const noSignUrl =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        center +
        markers +
        zoom +
        size +
        key;

      const mapUri = await googleMapsSignUrl(noSignUrl);
      if (mapUri.data) setMapUri(mapUri.data);

      // trip
      let tid = trip_id;
      if (tid === null && vehicle.trip_id) {
        tid = vehicle.trip_id;
      }
      if (tid === null) return;
      const trip = await getTrip(tid);
      if (!trip) return;

      // route
      const route = await getRoute(trip.route_id!);
      if (!route) return;
      setRoute(route);

      // title description
      // let title = "車両情報 ";
      // let description = "の車両情報です";
      // let vehicle_num = null;

      // const n = route.agency_id.length + 1;
      // vehicle_num = vehicleId.slice(n);
      // const agency_name = agencies.get(route.agency_id).agency_name;
      // title = title + vehicle_num + " " + agency_name;
      // description = agency_name + " " + vehicle_num + " " + description;
      // document.title = title;
      // document
      //   .querySelector('meta[name="description"]')
      //   .setAttribute("content", description);
      // const canonical_url = "https://t2.mame2.link/vehicle/" + vehicleId;
      // setLinkCanonical(canonical_url);

      // stop
      if (!stop_id) return;
      const stop = await getStop(stop_id);
      if (!stop.data) return;
      setStop(stop.data);
    }
    fetchVehicle();
  }, []);

  let dt = null;
  let latest_trip_url = null;
  let past_min = null;
  let device_map_url = null;

  // let severity = "info";
  if (vehicle) {
    const vDate = new Date(vehicle.timestamp! * 1000);
    dt = vDate.toLocaleTimeString();
    if (vehicle.trip_id && vehicle.trip_id !== trip_id) {
      latest_trip_url = "/trip/" + vehicle.trip_id + "?seq=1";
    }
    past_min = Math.round((Date.now() - vDate.getTime()) / 1000 / 60);
    // if (past_min > 4) {
    //   severity = "warning";
    // }
    // if (past_min > 9) {
    //   severity = "error";
    // }

    const latlng = vehicle.latitude + "," + vehicle.longitude;
    let appleDevice = false;
    const ua = window.navigator.userAgent.toLowerCase();
    if (
      ua.indexOf("iphone") !== -1 ||
      ua.indexOf("ipad") !== -1 ||
      ua.indexOf("mac os x") !== -1
    ) {
      appleDevice = true;
    }
    let map_url = "https://www.google.com/maps/search/?api=1&query=";
    if (appleDevice) {
      map_url = "https://maps.apple.com/?q=";
    }
    device_map_url = map_url + latlng;
  }

  if (errorStatus) {
    // let title = "車番が見つかりません";
    // document.title = title;
    // // description
    // document
    //   .querySelector('meta[name="description"]')
    //   .setAttribute("content", title);

    // // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'exception', { 'description': vehicleId, 'fatal': false });
    // window.gtag('config', 'G-L8YDJSX9JX');
  }

  return (
    <>
      {stop && trip_id && seq &&(
        <HideTripBackHeader
          trip_id={trip_id}
          seq={seq}
          stop={stop}
        ></HideTripBackHeader>
      )}
      <main>
        {errorStatus && (
          <Typography sx={{ m: 2 }}>
            車両が見つかりません😔<Link href="/vehicle_search">車両検索</Link>
          </Typography>
        )}
        {past_min && (
          <Stack sx={{ m: 2 }}>
            <VehicleAlart past_min={past_min} />
          </Stack>
        )}
        {vehicle_num && (
          <Box sx={{ ml: 2, display: "inline" }}>
            <VehicleNumber vehicle_number={vehicle_num}></VehicleNumber>
          </Box>
        )}
        {dt && <Box sx={{ ml: 2, display: "inline" }}>{dt}</Box>}
        {latest_trip_url && (
          <Link sx={{ ml: 2 }} href={latest_trip_url}>
            この車両の最新バス便情報
          </Link>
        )}
        {mapUri && (
          <Box sx={{ p: 2 }}>
            <img alt="map" src={mapUri} />
          </Box>
        )}
        {device_map_url && (
          <Box sx={{ ml: 2 }}>
            <Link href={device_map_url} target="_blank" rel="noopener" >地図アプリで開く</Link>
          </Box>
        )}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
