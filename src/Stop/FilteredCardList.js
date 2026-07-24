import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { generateClient } from "aws-amplify/api";

import {
  queryStopTimesByTripId,
  getBatchTrips,
  getBatchRoutes,
} from "../../graphql/queries";

import { CardList } from "./CardList";
import {
  getTimeString,
  getSeqIndex,
  diffSec,
  delayMin,
  StoptimeStatus,
  // isVaildTimestamp,
} from "../Common/CommonFunc";
export function FilteredCardList(props) {
  const idx = props.idx;

  const stopTimes = props.stopTimes;
  const client = generateClient();
  // const [fStopTimes, setFStopTimes] = useState();
  // const [tripMap, setTripMap] = useState();
  // const [routeMap, setRouteMap] = useState();
  const [states, setStates] = useState(null);

  async function fetchData(tripIds, stopTimes) {

    // trips
    const tMap = new Map();
    const t = await client.graphql({
      query: getBatchTrips,
      variables: { ids: tripIds },
    });
    for (const tData of t.data.getBatchTrips) {
      tMap.set(tData.trip_id, tData);
    }
    // setTripMap(tMap);

    // timestamp確認
    for (const stopTime of stopTimes) {
      const tripId = stopTime.trip_id;
      const seq = stopTime.stop_sequence;
      if (diffSec(nowStr, stopTime.departure_time) > 0 && !stopTime.timestamp) {
        const sts = await client.graphql({
          query: queryStopTimesByTripId,
          variables: { trip_id: tripId },
        });
        const { items: datas /* nextToken */ } =
          sts.data.queryStopTimesByTripId;
        const m_idx = getSeqIndex(datas, seq);
        // 当該バス停以降で到着確認がある
        let l_idx = m_idx + 1;
        while (l_idx < datas.length) {
          if (datas.at(l_idx).timestamp) {
            stopTime.status = StoptimeStatus.passed;
            break;
          }
          l_idx++;
        }
        // 該当バス停より前の到着時刻があるか（バスロケがあるか）
        l_idx = m_idx - 1;
        while (l_idx >= 0 && stopTime.status !== StoptimeStatus.passed) {
          if (datas.at(l_idx).timestamp) {
            stopTime.delayMin = delayMin(
              datas.at(l_idx).timestamp,
              datas.at(l_idx).departure_time
            );
            if (stopTime.delayMin < 0) stopTime.delayMin = 0;
            stopTime.status = StoptimeStatus.waiting;
            break;
          }
          l_idx--;
        }
      } else if (!stopTime.timestamp && tMap.get(stopTime.trip_id).vehicle_id) {
        const sts = await client.graphql({
          query: queryStopTimesByTripId,
          variables: { trip_id: tripId },
        });
        const { items: datas /* nextToken */ } =
          sts.data.queryStopTimesByTripId;
        const m_idx = getSeqIndex(datas, seq);
        let l_idx = m_idx - 1;
        while (l_idx >= 0) {
          if (datas.at(l_idx).timestamp) {
            stopTime.delayMin = delayMin(
              datas.at(l_idx).timestamp,
              datas.at(l_idx).departure_time
            );
            if (stopTime.delayMin < 0) stopTime.delayMin = 0;
            stopTime.status = StoptimeStatus.waiting;
            break;
          }
          l_idx--;
        }
      }
    }
    // setFStopTimes(stopTimes);

    // routes
    const rSet = new Set();
    const rMap = new Map();
    for (const key of tMap.keys()) {
      rSet.add(tMap.get(key).route_id);
    }
    const r = await client.graphql({
      query: getBatchRoutes,
      variables: { ids: Array.from(rSet) },
    });
    const routes = r.data.getBatchRoutes;
    for (const route of routes) {
      rMap.set(route.route_id, route);
    }
    // setRouteMap(rMap);

    const states = {
      tripMap: tMap,
      routeMap: rMap,
      stop_times: stopTimes,
    }
    setStates(states);
  }

  // uncertain;
  const nowStr = getTimeString();

  // trips
  const tripSet = new Set();
  for (const stopTime of stopTimes) {
    tripSet.add(stopTime.trip_id);
  }
  const tripIds = Array.from(tripSet);

  useEffect(() => {
    if (tripIds.length > 0) {
      fetchData(tripIds, stopTimes);
    }
  }, [idx]);

  return (
    <>
      {states && (
        <CardList
          states={states}
        // stopTimes={fStopTimes}
        // tripMap={tripMap}
        // routeMap={routeMap}
        />
      )}
    </>
  );
}
