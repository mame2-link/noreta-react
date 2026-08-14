import { useEffect, useState } from "react";

import type { Schema } from "../../amplify/data/resource";
import { getBatchStops, googleMapsSignUrl } from "../lib/data";

import Box from "@mui/material/Box";

import { StopInfo } from "./StopInfo";

export function NearbyStops({ stop }: { stop: Schema["Stop"]["type"] }) {
  const baseStop = stop;
  const [stops, setStops] = useState<JSX.Element[]>();
  const [mapUri, setMapUri] = useState<string>();

  let code = 64;

  function getLabel(platformCode: string) {
    if (platformCode) return platformCode.charAt(0).toUpperCase();
    code++;
    return String.fromCharCode(code);
  }

  async function sign(noSignUrl: string) {
    const u = await googleMapsSignUrl(noSignUrl);
    setMapUri(u.data!);
  }

  if (stops) {
    const key = "&key=AIzaSyBcHbDCehfqxRKabPLW77AIY4qFLNDiq3U";
    const zoom = "&zoom=16";
    let width = window.innerWidth - 16;
    if (width > 412) width = 412;
    const size = "&size=" + width + "x" + width;
    const center = baseStop.stop_lat + "," + baseStop.stop_lon;
    let markers =
      "&markers=label:" + getLabel(baseStop.platform_code!) + "%7C" + center;
    for (const value of stops) {
      const stop = value.props.stop;
      const label = getLabel(stop.platform_code);
      markers += "&markers=label:" + label + "%7C" + stop.stop_lat + "," + stop.stop_lon;
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
    const fetchData = async () => {
      // TODO
      const nearbyStops = baseStop.nearby?.filter((id): id is string => !!id) ?? [];
      if (nearbyStops.length < 1) return;
      const stops = await getBatchStops(nearbyStops);
      if (!stops) return;
      const arr: JSX.Element[] = [];
      for (const n of stops) {
        arr.push(<StopInfo stop={n} key={n.stop_id} />);
      }
      setStops(arr);
    };
    fetchData();
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
