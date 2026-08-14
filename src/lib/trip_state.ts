import { Schema } from "../../amplify/data/resource";
import { StopTime } from "./stop_time";

export type trip_state = {
    trip: Schema["Trip"]["type"],
    stop_times: StopTime[],
    stops: Schema["Stop"]["type"][],
    route: Schema["Route"]["type"]
}