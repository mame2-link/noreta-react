
import Alert from "@mui/material/Alert";

export function VehicleAlart(props) {
    const past_min = props.past_min;

    let severity = "info";
    if (past_min > 4) {
        severity = "warning";
    }
    if (past_min > 9) {
        severity = "error";
    }

    let unit = "分";
    if (past_min >= 60) {
        unit = "時間";
    }
    if (past_min >= 60 * 24) {  // 24時間以上
        unit = "日";
    }

    let m = past_min;
    if (unit === "時間") {
        m = Math.round(past_min / 60);
    }
    if (unit === "日") {
        m = Math.round(past_min / 60 / 24);
    }

    return <Alert severity={severity}>約{m}{unit}前の車両の位置です</Alert>;
}