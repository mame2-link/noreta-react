import { getBatchStops } from "../lib/data";

function idbConnect() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BrowsingHistory", 1);
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    request.onerror = () => reject(new Error("indexedDB open Error"));
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore("stops", { keyPath: "stop_id" });
      objectStore.createIndex("last", "last", { unique: true });
      objectStore.createIndex("num", "num", { unique: false });
      request.onerror = () => {
        reject(new Error("indexedDb create ObjectStore Error"));
      };
    };
  });
}

function getIndexedStops(db: IDBDatabase): Promise<string[] | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("stops", "readonly");
    const objectStore = transaction.objectStore("stops");
    const index = objectStore.index("last");
    let cnt = 0;
    const MAX = 5;
    const ids: string[] = [];
    const onfinished = () => {
      resolve(ids);
    };
    index.openCursor(null, "prev").onsuccess = (event: Event) => {
      const target = event.target as IDBRequest<IDBCursorWithValue | null>;
      const cursor = target.result;
      if (cursor && cnt < MAX) {
        if (cursor.primaryKey) {
          ids.push(String(cursor.primaryKey));
          cnt += 1;
        }
        cursor.continue();
      } else {
        onfinished();
      }
    };
    index.openCursor(null, "prev").onerror = () =>
      reject(new Error("indexedDb openCursor Error"));
  });
}

export async function getStopsData() {
  const db = await idbConnect() as IDBDatabase;
  let value = await getIndexedStops(db);
  if (!value) value = ["0975-01"];
  if (value.length > 0) {
    const stops = await getBatchStops(value);
    return stops;
  } else {
    const stopIds = ["0975-01"]; // 東京タワー
    const stops = await getBatchStops(stopIds);
    return stops;
  }
}

/**
 *
 * @param {*} stopId
 * @returns
 */
export async function addStopId(stopId: string) {
  if (typeof stopId !== "string") return;
  const db = await idbConnect() as IDBDatabase;;
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
