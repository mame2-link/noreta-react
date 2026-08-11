import { useState, useEffect } from "react";

import { getBatchRoutes, getBatchTrips, queryStopTimesByTripId } from "../lib/data";

import { StopTime } from "../lib/stop_time";

import Box from "@mui/material/Box";

import {
  diffSec,
  delayMin,
  getSeqIndex,
  getStopTimesAnchorIndex,
  DIFF_SEC_MAX,
  StoptimeStatus,
  isVaildTimestamp,
  isNoBuslocationTimeout,
} from "../Common/CommonFunc";

import { CardList } from "./CardList";
import { DelayAlert } from "./DelayAlert";
import { FilteredCardList } from "./FilteredCardList";
import { HourlyAverage } from "./HourlyAverage";

export function FilteredWithDelayedStopTimes({ stopTimes, nowStr }: { stopTimes: StopTime[], nowStr: string }) {
  const idx = getStopTimesAnchorIndex(stopTimes);
  // const [uncertainStopTimes, setUncertainStopTimes] = useState();
  // const [tripMap, setTripMap] = useState();
  // const [routeMap, setRouteMap] = useState();
  const [states, setStates] = useState(null);

  async function fetchData(stopTimes: StopTime[]) {
    const uStArr = [];
    for (const stopTime of stopTimes) {
      const tripId = stopTime.trip_id;
      const seq = stopTime.stop_sequence;
      const datas = await queryStopTimesByTripId(tripId);
      const m_idx = getSeqIndex(datas, seq);

      console.log("m_idx =", m_idx);

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
      let hasTimestamp = false;
      while (l_idx >= 0 && stopTime.status !== StoptimeStatus.passed) {
        if (datas.at(l_idx).timestamp) {
          hasTimestamp = true;
          if (isVaildTimestamp(datas.at(l_idx).timestamp)) {
            stopTime.delayMin = delayMin(
              datas.at(l_idx).timestamp,
              datas.at(l_idx).departure_time
            );
            if (stopTime.delayMin < 0) stopTime.delayMin = 0;
            stopTime.status = StoptimeStatus.waiting;
          } else {
            stopTime.status = StoptimeStatus.timeout;
          }
          break;
        }
        l_idx--;
      }
      if (!hasTimestamp && stopTime.status !== StoptimeStatus.passed) {
        if (isNoBuslocationTimeout(datas.at(0).departure_time)) {
          stopTime.status = StoptimeStatus.timeout;
        } else {
          stopTime.status = StoptimeStatus.unknown;
        }
      }
      // 通過なし 先頭バス停出発時刻から15分バスロケなし
      if (
        stopTime.status === StoptimeStatus.waiting ||
        stopTime.status === StoptimeStatus.unknown
      ) {
        uStArr.push(stopTime);
      }
    }

    if (uStArr.length === 0) {
      setStates(null);
      return;
    }

    uStArr.reverse();
    // setUncertainStopTimes(uStArr);

    // trips
    const tripIdSet = new Set();
    for (const stopTime of uStArr) {
      tripIdSet.add(stopTime.trip_id);
    }
    const tripIds  = Array.from(tripIdSet) as Array<string>;
    const trips = await getBatchTrips(tripIds);
    const tMap = new Map();
    for (const tData of trips) {
      tMap.set(tData.trip_id, tData);
    }
    // setTripMap(tMap);
    // routes
    const rSet = new Set();
    for (const key of tMap.keys()) {
      rSet.add(tMap.get(key).route_id);
    }
    const routes = await getBatchRoutes(Array.from(rSet));
    const rMap = new Map();
    for (const route of routes) {
      rMap.set(route.route_id, route);
    }
    // setRouteMap(rMap);

    const states = {
      tripMap: tMap,
      routeMap: rMap,
      stop_times: uStArr,
    }
    setStates(states);
  }

  // delay check
  let n = idx - 1;
  let m = 0;
  const LOOP_MAX = 20;
  // const DIFF_SEC_MAX = 3600; // 1 hour
  // const nowStr = getTimeString();
  const delayMins = [];
  const tmpStopTimes = [];
  while (n >= 0 && m < LOOP_MAX) {
    if (diffSec(nowStr, stopTimes.at(n).departure_time) > DIFF_SEC_MAX) break;
    if (stopTimes.at(n).timestamp === null) {
      // タイムスタンプがない、到着確認がとれない便を確認するリストに追加
      tmpStopTimes.push(stopTimes.at(n));
    } else {
      let delay_min = delayMin(
        stopTimes.at(n).timestamp,
        stopTimes.at(n).departure_time
      );
      if (delay_min < 0) delay_min = 0;
      delayMins.push(delay_min);
    }
    n--;
    m++;
  }
  const NUM = 5;
  const len = stopTimes.length;
  const end = idx + NUM > len ? len : idx + NUM;
  const filtered = stopTimes.slice(idx, end);

  // 表示本数
  const sum = states?.stop_times ? states.stop_times.length + filtered.length : filtered.length;
  //  uncertainStopTimes
  //   ? uncertainStopTimes.length + filtered.length
  //   : filtered.length;

  useEffect(() => {
    fetchData(tmpStopTimes);
  }, [nowStr]);

  return (
    <>
      {delayMins.length > 0 && sum > 0 && <DelayAlert delays={delayMins} />}
      <Box
        sx={{
          m: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: 2,
        }}
      >
        {states && (
          <CardList
            states={states}
          // stopTimes={uncertainStopTimes}
          // tripMap={tripMap}
          // routeMap={routeMap}
          />
        )}
        {filtered.length > 0 && <FilteredCardList stopTimes={filtered} idx={idx} />}
      </Box>
      {sum === 0 && (
        <>
          <Box sx={{ m: 2 }}>本日の運行は終了しました</Box>
          <HourlyAverage stopTimes={stopTimes} />
        </>
      )}
    </>
  );
}
