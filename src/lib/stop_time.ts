import type { Schema } from "../../amplify/data/resource";

export type StopTime = Schema["StopTimes"]["type"] & {
    status:
    "passed"
    | "waiting"
    | "unknown"
    | "timeout",
    delayMin: number
}