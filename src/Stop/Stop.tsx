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
import {
  toHalfWidth,
  // setLinkCanonical,
  // setMetaOgTitle,
} from "../Common/CommonFunc";
import { agencies } from "../Common/Agencies";
const MAX_HEADSING = 3;

export default function Stop() {
  const { stopId } = useParams();
  const [stop, setStop] = useState<Schema["Stop"]["type"]>();
  const [errorStatus, setErrorStatus] = useState(false);

  // location query
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  const page = pageStr === null ? null : parseInt(pageStr);

  useEffect(() => {
    const fetchData = async () => {
      const value = await getStop(stopId!);
      if (!value.data) {
        setErrorStatus(true);
        return;
      }
      setStop(value.data);
    };
    fetchData();
    // indexedDB
    addStopId(stopId!).catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (!stop) return;
    console.log(stop);
    let description = "#busStopの時刻表です。";
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

    // canonical
    // const canonical_url = "https://noreta.net/stop/" + stop.stop_id;
    // setLinkCanonical(canonical_url);

    // GA4
    // console.log(window.gtag);
    // console.log(window.dataLayer);
    window.gtag('js', new Date());
    window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search });
  }, [stop, page, location.pathname, location.search]);

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
        {stop && <StopName stop={stop} />}
        {stop && <StopTimes stop={stop} page={page} />}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
      {stop && <BusStopSchema stop={stop} />}
    </>
  );
}
