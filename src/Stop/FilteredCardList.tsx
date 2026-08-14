import { useState, useEffect } from "react";

import { Schema } from "../../amplify/data/resource";
import { getBatchTrips, queryStopTimesByTripId, getBatchRoutes } from "../lib/data";
import { StopTime } from "../lib/stop_time";
import { StopTimesState } from "../lib/stop_times_state";

import { CardList } from "./CardList";
import {
  getTimeString,
  getSeqIndex,
  diffSec,
  delayMin,
  StoptimeStatus,
  // isVaildTimestamp,
} from "../Common/CommonFunc";


export function FilteredCardList({ stopTimes, idx }: { stopTimes: StopTime[], idx: number }) {
  const [states, setStates] = useState<StopTimesState>();

  // uncertain;
  const nowStr = getTimeString();

  // trips
  const tripSet = new Set<string>();
  for (const stopTime of stopTimes) {
    tripSet.add(stopTime.trip_id);
  }
  const tripIds = Array.from(tripSet);

  useEffect(() => {
    const fetchData = async () => {
      const tMap = new Map();
      const trips = await getBatchTrips(tripIds);
      if (!trips) return;
      for (const tData of trips) {
        tMap.set(tData.trip_id, tData);
      }
      // timestamp確認
      for (const stopTime of [...stopTimes]) {
        const tripId = stopTime.trip_id;
        const seq = stopTime.stop_sequence;
        if (diffSec(nowStr, stopTime.departure_time!) > 0 && !stopTime.timestamp) {
          const datas = await queryStopTimesByTripId(tripId);
          if (!datas) return;
          const m_idx = getSeqIndex(datas, seq);
          if (!m_idx) return;
          // 当該バス停以降で到着確認がある
          let l_idx = m_idx! + 1;
          while (l_idx < datas.length) {
            if (datas[l_idx]!.timestamp) {
              stopTime.status = StoptimeStatus.passed;
              break;
            }
            l_idx++;
          }
          // 該当バス停より前の到着時刻があるか（バスロケがあるか）
          l_idx = m_idx - 1;
          while (l_idx >= 0 && stopTime.status !== StoptimeStatus.passed) {
            if (datas[l_idx].timestamp) {
              stopTime.delayMin = delayMin(
                datas[l_idx].timestamp!,
                datas[l_idx].departure_time!
              );
              if (stopTime.delayMin < 0) stopTime.delayMin = 0;
              stopTime.status = StoptimeStatus.waiting;
              break;
            }
            l_idx--;
          }
        } else if (!stopTime.timestamp && tMap.get(stopTime.trip_id).vehicle_id) {
          const datas = await queryStopTimesByTripId(tripId);
          if (!datas) return;
          const m_idx = getSeqIndex(datas, seq);
          if (!m_idx) return;
          let l_idx = m_idx - 1;
          while (l_idx >= 0) {
            if (datas[l_idx].timestamp) {
              stopTime.delayMin = delayMin(
                datas[l_idx].timestamp!,
                datas[l_idx].departure_time!
              );
              if (stopTime.delayMin < 0) stopTime.delayMin = 0;
              stopTime.status = StoptimeStatus.waiting;
              break;
            }
            l_idx--;
          }
        }
      }

      // routes
      const rSet = new Set<string>();
      const rMap = new Map<string, Schema["Route"]["type"]>();
      for (const key of tMap.keys()) {
        rSet.add(tMap.get(key).route_id);
      }
      const routes = await getBatchRoutes(Array.from(rSet));
      if (!routes) return;
      for (const route of routes) {
        rMap.set(route.route_id, route);
      }
      // setRouteMap(rMap);

      const states: StopTimesState = {
        tripMap: tMap,
        routeMap: rMap,
        stop_times: stopTimes,
      }
      setStates(states);
    }
    if (tripIds.length > 0) {
      fetchData();
    }
  }, [idx]);

  return (
    <>
      {states && (<CardList states={states} />)}
    </>
  );
}
