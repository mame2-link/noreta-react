import { StopTime } from "../lib/stop_time";

// 日付変更線
const AM = 4;

const TIMEOUT_SEC = 900;

export const HOUR9SEC = 32400; // 9 Hour === 32400 Seconds
/**
 * 00:00 timestamp
 */
let ts0 =
  Math.floor((Math.floor(Date.now() / 1000) - 3600 * AM + HOUR9SEC) / 86400) *
  86400 -
  HOUR9SEC;

export const DIFF_SEC_MAX = 1800; // 1 hour

/**
 * set timestamp 00:00:00 JST
 * @returns timestamp
 */
export function initBaseTimestamp(): number {
  ts0 =
    Math.floor((Math.floor(Date.now() / 1000) - 3600 * AM + HOUR9SEC) / 86400) *
    86400 -
    HOUR9SEC;
  return ts0;
}

/**
 *
 * @returns date
 */
export function getDate() {
  return new Date(Date.now() - AM * 3600 * 1000);
}

export function hhmm(hhmmss: string) {
  const strs = hhmmss.split(":");
  if (strs.length < 2) {
    return hhmmss;
  }
  return Number(strs[0]) + ":" + strs[1];
}

/**
 *
 * @param {string} hhmmss
 * @returns {number} 00:00:00 からの経過秒
 */
export function spentSec(hhmmss: string) {
  const strs = hhmmss.split(":");
  return parseInt(strs[0]) * 3600 + parseInt(strs[1]) * 60 + parseInt(strs[2]);
}

/**
 *
 * @param {string} hhmmss1 hh:mm:ss
 * @param {string} hhmmss2 hh:mm:ss
 * @returns {number} diff seconds hhmmss1 hhmmss2
 */
export function diffSec(hhmmss1: string, hhmmss2: string) {
  const str1 = hhmmss1.split(":");
  const num1 =
    parseInt(str1[0]) * 3600 + parseInt(str1[1]) * 60 + parseInt(str1[2]);
  const str2 = hhmmss2.split(":");
  const num2 =
    parseInt(str2[0]) * 3600 + parseInt(str2[1]) * 60 + parseInt(str2[2]);
  return num1 - num2;
}

/**
 *
 * @param {Number} timestamp
 * @param {string} departureTime
 * @returns {Number} delay sec
 */
export function delaySec(timestamp: number, departureTime: string) {
  return timestamp - (ts0 + spentSec(departureTime));
}

/**
 *
 * @param {Number} timestamp
 * @param {string} departureTime
 * @returns {Number} delay min
 */
export function delayMin(timestamp, departureTime) {
  return Math.floor(delaySec(timestamp, departureTime) / 60);
}

const OFFSET = 200;
/**
 * Scroll To Anchor
 * @param {Number} offset
 */
export function scrollToAnchor(offset = OFFSET) {
  if (!document.getElementById("anchor")) return;
  const top =
    document.getElementById("anchor").getBoundingClientRect().top +
    window.scrollY;
  window.scrollTo({
    top: top,
    behavior: "smooth",
  });
}

/**
 * Scroll To Top
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    // スムーズなアニメーションを有効にする
    behavior: 'smooth'
  });
}

/**
 * string time
 * @returns {stirng} hh:mm:ss
 */
export function getTimeString(/*timezone = "Asia/Tokyo"*/) {
  // const tz = { timeZone: timezone };
  const d = new Date().toLocaleTimeString("ja", { timeZone: "Asia/Tokyo" });
  const str = d.split(":");
  // let hh = d.getHours();
  let hh = parseInt(str[0]);
  if (hh < AM) {
    hh = hh + 24;
  }
  const mm = parseInt(str[1]);
  const ss = parseInt(str[2]);
  // const mm = d.getMinutes();
  // const ss = d.getSeconds();
  return (
    ("00" + hh).slice(-2) +
    ":" +
    ("00" + mm).slice(-2) +
    ":" +
    ("00" + ss).slice(-2)
  );
}

/**
 * 発車時刻をhh:mm:59に変更する
 * @param {string} timeStr
 * @returns {string} hh:mm:59
 */
export function departureTimeMargin(timeStr) {
  return timeStr.slice(0, -2) + "59";
}

/**
 *
 * @param {Array} stopTimes
 * @returns: number
 */
export function getStopTimesAnchorIndex(stopTimes: StopTime[]): number {
  const len = stopTimes.length;
  if (len === 0) return 0;
  const jst = getTimeString();
  const t = jst.slice(0, -2) + "00"; // seconds floor
  if (stopTimes[len - 1].departure_time <= t) return len;
  let left = 0;
  let right = len;
  let index = Math.floor((left + right) / 2);
  while (right > left) {
    [right, left] =
      t <= stopTimes[index].departure_time ? [index, left] : [right, index + 1];
    index = Math.floor((left + right) / 2);
  }
  return index;
}

export function getSeqIndex(stopTimes: StopTime[], seq: number) {
  console.log(stopTimes);
  let idx = seq - 1;
  if (stopTimes[idx].stop_sequence === seq) {
    return idx; // ほとんどここで終わるはず
  } else if (stopTimes[idx].stop_sequence > seq) {
    idx++;
    while (idx < stopTimes.length) {
      console.log("ここに来る idx++: " + idx);
      if (stopTimes[idx].stop_sequence === seq) {
        return idx;
      }
      idx++;
    }
  } else {
    idx--;
    while (idx >= 0) {
      console.log("ここに来る idx--: " + idx);
      if (stopTimes.at(idx).stop_sequence === seq) {
        return idx;
      }
      idx--;
    }
  }
  console.error("sequence error!");
}

/**
 * 過去のタイムスタンプがあるか
 * @param {*} stopTime
 * @returns
 */
export function hasPastTimestamp(stopTime) {
  if (!stopTime.hasOwnProperty("timestamp")) {
    return false;
  }
  if (stopTime.timestamp === null) {
    return false;
  }
  if (Math.floor(Date.now() / 1000) - stopTime.timestamp >= 0) {
    return true;
  }
  return false;
}

/**
 * 発車見込み
 * @param {*} stopTime
 * @returns
 */
export function isDepartureProspects(stopTime) {
  if (departureTimeMargin(stopTime.departure_time) >= getTimeString()) {
    return true;
  }
  return false;
}

export const StoptimeStatus = Object.freeze({
  passed: 1, // 通過済み
  waiting: 2, // 通過待ち
  unknown: 3, // バスロケなし
  timeout: 4, // バスロケ有効期限切れ バスロケなしのタイムアウト 非表示対象
});

export function isVaildTimestamp(timestamp) {
  // 900秒 15分
  if (Math.floor(Date.now() / 1000) - timestamp >= TIMEOUT_SEC) {
    return false;
  }
  return true;
}

export function isNoBuslocationTimeout(timeStr) {
  if (spentSec(getTimeString()) - spentSec(timeStr) >= TIMEOUT_SEC) {
    return true;
  }
  return false;
}

/**
 *
 * @param {*} str 全角数字
 * @returns 半角数字
 */
export function toHalfWidth(strVal) {
  // 半角変換
  var halfVal = strVal.replace(/[！-～]/g, function (tmpStr) {
    // 文字コードをシフト
    return String.fromCharCode(tmpStr.charCodeAt(0) - 0xfee0);
  });

  // 文字コードシフトで対応できない文字の変換
  return (
    halfVal
      // .replace(/”/g, '"')
      // .replace(/’/g, "'")
      // .replace(/‘/g, "`")
      // .replace(/￥/g, "\\")
      // .replace(/〜/g, "~")
      .replace(/　/g, " ")
  );
}

/**
 *
 * @param {*} url
 */
export function setLinkCanonical(url) {
  if (document.querySelector('link[rel="canonical"]') === null) {
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", url);
    document.head.appendChild(link);
  } else {
    document.querySelector('link[rel="canonical"]').setAttribute("href", url);
  }
}

/**
 *
 * @param {*} title
 */
export function setMetaOgTitle(title) {
  if (document.querySelector('meta[property="og:title"]') === null) {
    const meta = document.createElement("meta");
    meta.setAttribute("property", "og:title");
    meta.setAttribute("content", title);
    document.head.appendChild(meta);
  } else {
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", title);
  }
}
/**
 *
 */
export function setMetaRobotsNoindex() {
  if (document.querySelector('meta[name="robots"]') === null) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex");
    document.head.appendChild(meta);
  } else {
    document
      .querySelector('meta[name="robots"]')
      .setAttribute("content", "noindex");
  }
}

/**
 *
 * @returns
 */
export function LineIcon() {
  return (
    <img
      src= "/images/LINE_Brand_icon.png"
  alt = "Line Brand"
  width = "20"
  height = "20"
    />
  );
}

/**
 *
 * @param {*} props
 * @returns
 */
// export function SendByLine(props) {
//   const targetUrl = props.targetUrl;
//   const url = "https://line.me/R/msg/text/?" + encodeURIComponent(targetUrl);
//   return (
//     <Button href={url} startIcon={<LineIcon />}>
//       Lineで送る
//     </Button>
//   );
// }

/**
 * https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag?hl=ja
 * Google はウェブランキングにキーワードメタタグを使用しない
 * @param {*} keywords
 */
export function setMetaKeywords(keywords) {
  if (document.querySelector('meta[name="keywords"]') === null) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "keywords");
    meta.setAttribute("content", keywords);
    document.head.appendChild(meta);
  } else {
    document
      .querySelector('meta[name="keywords"]')
      .setAttribute("content", "keywords");
  }
}
