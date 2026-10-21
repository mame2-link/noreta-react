import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import { getStop } from '../lib/data';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { StopName } from "./StopName";
import { BusStopSchema } from "./BusStopSchema";
import { StopTimes } from "./StopTimes";
import { HideHomeHeader } from "../Common/HideHomeHeader";
import { CommonFooter } from "../Common/CommonFooter";
import { addStopId } from "../Common/IndexedDb";
import { agencies } from "../Common/Agencies";
import {
  toHalfWidth,
  setLinkCanonical,
  setMetaOgTitle,
} from "../Common/CommonFunc";

const MAX_HEADSING = 3;

export default function Stop() {
  const { stopId } = useParams();
  const [stop, setStop] = useState<Schema["Stop"]["type"] | null>(null);
  const [errorStatus, setErrorStatus] = useState(false);

  // location query
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  const page = pageStr === null ? null : parseInt(pageStr);

  const updateTitle = (stop: Schema["Stop"]["type"] | null) => {
    let description = "#busStopの時刻表です。";
    if (stop === null) return;
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
    if (page !== null) title += " page " + page;
    document.title = title;
    setMetaOgTitle(title);

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
    document?.querySelector('meta[name="description"]')?.setAttribute("content", description);

    // canonical
    const canonical_url = "https://noreta.net/stop/" + stop.stop_id;
    setLinkCanonical(canonical_url);

    // GA4
    window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search });

  }


  useEffect(() => updateTitle(stop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [location.key]);


  useEffect(() => {
    const fetchData = async () => {
      const value = await getStop(stopId!);
      if (!value.data) {
        setErrorStatus(true);
        return;
      }
      updateTitle(value.data);
      setStop(value.data);
    };
    fetchData();

    // indexedDB
    addStopId(stopId!).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} /> */}
      {stop && <HideHomeHeader stop={stop} />}
      <main>
        {errorStatus && (
          <Typography sx={{ m: 2 }}>バス停が見つかりません😔</Typography>
        )}
        {stop !== null && <StopName stop={stop} />}
        {stop && <StopTimes stop={stop} page={page} />}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
      {stop && <BusStopSchema stop={stop} />}
    </>
  );
}
