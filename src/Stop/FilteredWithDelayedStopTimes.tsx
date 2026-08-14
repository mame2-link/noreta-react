import { useState, useEffect } from "react";

import { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";

import { getBatchRoutes, getBatchTrips, queryStopTimesByTripId } from "../lib/data";
import { StopTime } from "../lib/stop_time";
import { StopTimesState } from "../lib/stop_times_state";

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
  const [states, setStates] = useState<StopTimesState | null>(null);

  // delay check
  let n = idx - 1;
  let m = 0;
  const LOOP_MAX = 20;
  // const DIFF_SEC_MAX = 3600; // 1 hour
  // const nowStr = getTimeString();
  const delayMins = [];
  const tmpStopTimes: StopTime[] = [];
  while (n >= 0 && m < LOOP_MAX) {
    if (diffSec(nowStr, stopTimes[n].departure_time!) > DIFF_SEC_MAX) break;
    if (stopTimes[n].timestamp === null) {
      // タイムスタンプがない、到着確認がとれない便を確認するリストに追加
      tmpStopTimes.push(stopTimes[n]);
    } else {
      let delay_min = delayMin(
        stopTimes[n].timestamp!,
        stopTimes[n].departure_time!
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
  const sum = states ? states.stop_times.length + filtered.length : filtered.length;
  //  uncertainStopTimes
  //   ? uncertainStopTimes.length + filtered.length
  //   : filtered.length;

  useEffect(() => {
    const fetchData = async (tmpStopTimes: StopTime[]) => {
      const uStArr: StopTime[] = [];
      for (const stopTime of tmpStopTimes) {
        const tripId = stopTime.trip_id;
        const seq = stopTime.stop_sequence;
        const datas = await queryStopTimesByTripId(tripId);
        if (datas === null) continue;

        const m_idx = getSeqIndex(datas, seq);
        if (m_idx === null) continue;
        // 当該バス停以降で到着確認がある
        let l_idx = m_idx + 1;
        while (l_idx < datas.length) {
          if (datas[l_idx].timestamp) {
            stopTime.status = StoptimeStatus.passed;
            break;
          }
          l_idx++;
        }
        // 該当バス停より前の到着時刻があるか（バスロケがあるか）
        l_idx = m_idx - 1;
        let hasTimestamp = false;
        while (l_idx >= 0 && stopTime.status !== StoptimeStatus.passed) {
          if (datas[l_idx].timestamp) {
            hasTimestamp = true;
            if (isVaildTimestamp(datas[l_idx].timestamp!)) {
              stopTime.delayMin = delayMin(
                datas[l_idx].timestamp!,
                datas[l_idx].departure_time!
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
          if (isNoBuslocationTimeout(datas[0].departure_time!)) {
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

      // trips
      const tripIdSet = new Set<string>();
      for (const stopTime of uStArr) {
        tripIdSet.add(stopTime.trip_id);
      }
      const tripIds = Array.from(tripIdSet);
      const trips = await getBatchTrips(tripIds);
      const tMap = new Map<string, Schema["Trip"]["type"]>();
      if (trips) {
        for (const tData of trips) {
          tMap.set(tData!.trip_id, tData!);
        }
      }

      // routes
      const rSet = new Set<string>();
      for (const key of tMap.keys()) {
        rSet.add(tMap.get(key)!.route_id!);
      }
      const routes = await getBatchRoutes(Array.from(rSet));
      if (!routes) return;
      const rMap = new Map<string, Schema["Route"]["type"]>();
      for (const route of routes) {
        rMap.set(route.route_id, route);
      }

      const states = {
        tripMap: tMap,
        routeMap: rMap,
        stop_times: uStArr,
      }
      setStates(states);

    }

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
        {states && (<CardList states={states} />)}
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
