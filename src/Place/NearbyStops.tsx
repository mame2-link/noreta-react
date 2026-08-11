import { useEffect, useState } from "react";

import type { Schema } from "../../amplify/data/resource";
// import { getBatchStops, signUrl } from "../../graphql/queries";
import { getBatchStops } from "../lib/data";

import Box from "@mui/material/Box";

import { StopInfo } from "./StopInfo";

export function NearbyStops({ stop }: { stop: Schema["Stop"]["type"] }) {
  const baseStop = stop;
  const [stops, setStops] = useState();
  const [mapUri, setMapUri] = useState();


  let code = 64;

  function getLabel(platformCode: string) {
    if (platformCode) return platformCode.charAt(0).toUpperCase();
    code++;
    return String.fromCharCode(code);
  }

  async function fetchData(stopIdList: string[]) {
    const stops = await getBatchStops(stopIdList);
    console.log(stops);
    const arr = [];
    for (const n of stops) {
      arr.push(<StopInfo stop={n} key={n.stop_id} />);
    }
    setStops(arr);
  }

  async function sign(noSignUrl: string) {
    const u = await client.graphql({
      query: signUrl,
      variables: { url: noSignUrl },
    });
    setMapUri(u.data.signUrl);
  }

  if (stops) {
    const key = "&key=AIzaSyBcHbDCehfqxRKabPLW77AIY4qFLNDiq3U";
    const zoom = "&zoom=16";
    let width = window.innerWidth - 16;
    if (width > 412) width = 412;
    const size = "&size=" + width + "x" + width;
    const center = baseStop.stop_lat + "," + baseStop.stop_lon;
    let markers =
      "&markers=label:" + getLabel(baseStop.platform_code) + "%7C" + center;
    for (const value of stops) {
      const stop = value.props.stop;
      let label = getLabel(stop.platform_code);
      markers +=
        "&markers=label:" + label + "%7C" + stop.stop_lat + "," + stop.stop_lon;
    }
    const noSignUrl =
      "https://maps.googleapis.com/maps/api/staticmap?center=" +
      center +
      markers +
      zoom +
      size +
      key;
    sign(noSignUrl);
  }

  useEffect(() => {
    fetchData(baseStop.nearby);
  }, []);

  return (
    <>
      <Box sx={{ p: 1 }}>{stops}</Box>
      {mapUri && (
        <Box sx={{ p: 1 }}>
          <img alt="map" src={mapUri} />
        </Box>
      )}
    </>
  );
}
