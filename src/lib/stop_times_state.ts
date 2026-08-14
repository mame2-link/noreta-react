import { Schema } from "../../amplify/data/resource";
import { StopTime } from "./stop_time";

export type StopTimesState = {
  tripMap: Map<string, Schema["Trip"]["type"]>,
  routeMap: Map<string, Schema["Route"]["type"]>,
  stop_times: StopTime[],
}