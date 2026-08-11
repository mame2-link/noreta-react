import { generateClient } from "aws-amplify/api";

import { getBatchStops } from "../../graphql/queries";

function idbConnect() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BrowsingHistory", 1);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = () => reject(new Error("indexedDB open Error"));
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("stops", { keyPath: "stop_id" });
      objectStore.createIndex("last", "last", { unique: true });
      objectStore.createIndex("num", "num", { unique: false });
      request.onerror = (event) => {
        reject(new Error("indexedDb create ObjectStore Error"));
      };
    };
  });
}

function getIndexedStops(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("stops", "readonly");
    const objectStore = transaction.objectStore("stops");
    const index = objectStore.index("last");
    let cnt = 0;
    const MAX = 5;
    const ids = [];
    const onfinished = () => {
      resolve(ids);
    };
    index.openCursor(null, "prev").onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor && cnt < MAX) {
        if (cursor.primaryKey) {
          ids.push(cursor.primaryKey);
          cnt += 1;
        }
        cursor.continue();
      } else {
        onfinished();
      }
    };
    index.openCursor(null, "prev").onerror = (event) =>
      reject(new Error("indexedDb openCursor Error"));
  });
}

export async function getStopsData() {
  const db = await idbConnect();
  const value = await getIndexedStops(db);
  const client = generateClient();
  if (value.length > 0) {
    const stops = await client.graphql({
      query: getBatchStops,
      variables: { ids: value },
    });
    return stops.data.getBatchStops;
  } else {
    const stopIds = ["0975-01"]; // 東京タワー
    const stops = await client.graphql({
      query: getBatchStops,
      variables: { ids: stopIds },
    });
    return stops.data.getBatchStops;
  }
}

/**
 *
 * @param {*} stopId
 * @returns
 */
export async function addStopId(stopId) {
  if (typeof stopId !== "string") return;

  const db = await idbConnect();

  const objectStore = db
    .transaction(["stops"], "readwrite")
    .objectStore("stops");

  const request = objectStore.get(stopId);

  request.onsuccess = () => {
    if (!request.result) {
      objectStore.add({ stop_id: stopId, num: 1, last: Date.now() });
    } else {
      const num = request.result.num + 1;
      objectStore.put({ stop_id: stopId, num: num, last: Date.now() });
    }
  };
}
