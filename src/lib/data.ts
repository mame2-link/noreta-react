import { Amplify } from "aws-amplify";
import { generateClient } from 'aws-amplify/data';
import outputs from "../../amplify_outputs.json";
import type { Schema } from '../../amplify/data/resource';
import { StopTime } from "./stop_time";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function getStop(stopId: string) {
    return await client.queries.getStop({ stop_id: stopId });
}

export async function getBatchStops(ids: string[]) {
    const { data: stops, errors } = await client.queries.getBatchStops({ ids: ids });
    if (!errors) {
        return stops as Schema["Stop"]["type"][];
    }
    console.error(errors);
    return null;
}

export async function queryStopTimesByStopIdIndex(stopId: string) {
    const { data: stopTimes, errors } = await client.queries.queryStopTimesByStopIdIndex({ stop_id: stopId });
    let st: Array<Schema["StopTimes"]["type"]> = [];
    if (errors || !stopTimes) throw new Error('query Failed');
    st = st.concat((stopTimes.items as Array<Schema["StopTimes"]["type"]>));
    let token = stopTimes.nextToken;
    while (token) {
        const { data: stopTimes, errors } = await client.queries.queryStopTimesByStopIdIndex({ stop_id: stopId, after: token });
        if (errors || !stopTimes) throw new Error('query Failed');
        st = st.concat((stopTimes!.items as Array<Schema["StopTimes"]["type"]>));
        token = stopTimes.nextToken;
    }
    st.sort(function (a: Schema["StopTimes"]["type"], b: Schema["StopTimes"]["type"]) {
        if (a.departure_time! > b.departure_time!) {
            return 1;
        } else {
            return -1;
        }
    });
    st = st.filter((elem) => elem.pickup_type !== 1)
    return st;
}

export async function queryStopTimesByTripId(trip_id: string): Promise<StopTime[] | null> {
    const { data: stop_times, errors } = await client.queries.queryStopTimesByTripId({ trip_id: trip_id });
    if (!errors && stop_times) {
        return stop_times.items as StopTime[];
    }
    console.error(errors);
    return null;
}

export async function getTrip(id: string) {
    const { data: trip, errors } = await client.queries.getTrip({ trip_id: id });
    if (!errors) {
        return trip;
    }
};

export async function getBatchTrips(ids: string[]) {
    const { data: trips, errors } = await client.queries.getBatchTrips({ ids: ids });
    if (!errors) {
        return trips as Schema["Trip"]["type"][];
    }
    return null;
}

export async function getBatchRoutes(ids: string[]): Promise<Schema["Route"]["type"][] | null> {
    const { data: routes, errors } = await client.queries.getBatchRoutes({ ids: ids });
    if (!errors && routes) {
        return routes as Schema["Route"]["type"][];
    }
    return null;
}

export async function getRoute(id: string) {
    const { data: route, errors } = await client.queries.getRoute({ route_id: id });
    if (!errors) {
        return route;
    }
};

export async function getVehicle(id: string) {
    const { data: vehicle, errors } = await client.queries.getVehicle({ vehicle_id: id });
    if (!errors) {
        return vehicle as Schema["Vehicle"]["type"];
    }
    return null;
};

export async function googleMapsSignUrl(noSignUrl: string) {
    return await client.queries.googleMapsSignUrl({ path: noSignUrl });
}