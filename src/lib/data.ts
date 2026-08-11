import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function getStop(stopId: string) {
    return await client.queries.getStop({ stop_id: stopId });
}

export async function getBatchStops(ids: string[]) {
    const { data: stops, errors } = await client.queries.getBatchStops({ ids: ids });
    return stops;
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

export async function queryStopTimesByTripId(trip_id: string) {
    const { data: stopTimes, errors } = await client.queries.queryStopTimesByTripId({ trip_id: trip_id });
    return stopTimes!.items;
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
        return trips;
    }
}

export async function getBatchRoutes(ids: string[]) {
    const { data: routes, errors } = await client.queries.getBatchRoutes({ ids: ids });
    return routes;
}

export async function getRoute(id: string) {
    const { data: route, errors } = await client.queries.getRoute({ route_id: id });
    if (!errors) {
        return route;
    }
};