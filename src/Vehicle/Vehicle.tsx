import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
// import { generateClient } from "aws-amplify/api";
// import {
//   getVehicles,
//   getTrips,
//   getRoutes,
//   getStops,
//   signUrl,
// } from "../../graphql/queries";

// import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { agencies } from "../Common/Agencies";
import { HideTripBackHeader } from "./HideTripBackHeader";
import { VehicleNumber } from "../Common/VehicleNumber";
import { CommonFooter } from "../Common/CommonFooter";
import { setLinkCanonical } from "../Common/CommonFunc";
import { VehicleAlart } from "./VehicleAlart";

export default function Vehicle() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState();
  const [mapUri, setMapUri] = useState();
  const [route, setRoute] = useState();
  const [stop, setStop] = useState();
  const [errorStatus, setErrorStatus] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const trip_id = query.get("trip_id");
  const seq = query.get("seq");
  const stop_id = query.get("stop_id");

  async function fetchVehicle() {
    const v = await client.graphql({
      query: getVehicles,
      variables: { vehicle_id: vehicleId },
    });
    if (!v.data.getVehicles) {
      setErrorStatus(true);
      return;
    }
    setVehicle(v.data.getVehicles);
    const key = "&key=AIzaSyBcHbDCehfqxRKabPLW77AIY4qFLNDiq3U";
    const zoom = "&zoom=16";
    let width = window.innerWidth - 32;
    if (width > 412) width = 412;
    const size = "&size=" + width + "x" + width;
    const center =
      v.data.getVehicles.latitude + "," + v.data.getVehicles.longitude;
    let markers =
      "&markers=anchor:bottom%7Cicon:https://t2.mame2.link/marker.png%7C" +
      center;
    const noSignUrl =
      "https://maps.googleapis.com/maps/api/staticmap?center=" +
      center +
      markers +
      zoom +
      size +
      key;
    const u = await client.graphql({
      query: signUrl,
      variables: { url: noSignUrl },
    });
    setMapUri(u.data.signUrl);

    // trip
    let tid = trip_id;
    if (tid === null && v.data.getVehicles.trip_id) {
      tid = v.data.getVehicles.trip_id;
    }
    if (tid === null) return;
    const t = await client.graphql({
      query: getTrips,
      variables: { trip_id: tid },
    });
    if (!t.data.getTrips) return;

    // route
    const r = await client.graphql({
      query: getRoutes,
      variables: { route_id: t.data.getTrips.route_id },
    });
    if (!r.data.getRoutes) return;
    const route = r.data.getRoutes;
    setRoute(r.data.getRoutes);

    // title description
    let title = "車両情報 ";
    let description = "の車両情報です";
    let vehicle_num = null;

    const n = route.agency_id.length + 1;
    vehicle_num = vehicleId.slice(n);
    const agency_name = agencies.get(route.agency_id).agency_name;
    title = title + vehicle_num + " " + agency_name;
    description = agency_name + " " + vehicle_num + " " + description;
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);
    const canonical_url = "https://t2.mame2.link/vehicle/" + vehicleId;
    setLinkCanonical(canonical_url);

    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');

    // stop
    if (!stop_id) return;
    const s = await client.graphql({
      query: getStops,
      variables: { stop_id: stop_id },
    });
    if (!s.data.getStops) return;
    setStop(s.data.getStops);

  }

  let vehicle_num = null;
  if (route) {
    const n = route.agency_id.length + 1;
    vehicle_num = vehicleId.slice(n);
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  let dt = null;
  let latest_trip_url = null;
  let past_min = null;


  let device_map_url = null;



  // let severity = "info";
  if (vehicle) {
    const vDate = new Date(vehicle.timestamp * 1000);
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
      {stop && (
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
