import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import Alert, { type AlertColor } from "@mui/material/Alert";


export function VehicleAlart({ vehicle }: { vehicle: Schema["Vehicle"]["type"] }) {

    const [pastMin, setPastMin] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const vDate = new Date(vehicle.timestamp! * 1000);
            setPastMin(Math.round((Date.now() - vDate.getTime()) / 1000 / 60));
        }
        fetchData();
    });

    let severity: AlertColor = "info";
    if (pastMin > 4) {
        severity = "warning";
    }
    if (pastMin > 9) {
        severity = "error";
    }

    let unit = "分";
    if (pastMin >= 60) {
        unit = "時間";
    }
    if (pastMin >= 60 * 24) {  // 24時間以上
        unit = "日";
    }

    let m = pastMin;
    if (unit === "時間") {
        m = Math.round(pastMin / 60);
    }
    if (unit === "日") {
        m = Math.round(pastMin / 60 / 24);
    }

    return <Alert severity={severity}>約{m}{unit}前の車両の位置です</Alert>;
}