import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Headsign: a.customType({
    agency_id: a.string(),
    headsign: a.string(),
    route_short_name: a.string(),
  }),
  Stop: a.customType({
    headsigns: a.ref("Headsign").array(),
    nearby: a.string().array(),
    platform_code: a.string(),
    stop_id: a.id().required(),
    stop_kana: a.string(),
    stop_lat: a.float(),
    stop_lon: a.float(),
    stop_name: a.string(),
    stop_url: a.string(),
  }),
  getStop: a
    .query()
    .arguments({ stop_id: a.id().required() })
    .returns(a.ref("Stop"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalStopTableDataSource",
        entry: "./getStop.js",
      })
    ),
  getBatchStops: a
    .query()
    .arguments({ ids: a.string().array().required() })
    .returns(a.ref("Stop").array())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalStopTableDataSource",
        entry: "./getBatchStops.js",
      })
    ),
  StopTimes: a.customType({
    departure_time: a.string(),
    pickup_type: a.integer(),
    stop_headsign: a.string(),
    stop_id: a.string(),
    stop_sequence: a.integer().required(),
    timestamp: a.integer(),
    trip_id: a.id().required(),
  }),
  StopTimesConnection: a.customType({
    items: a.ref("StopTimes").array(),
    nextToken: a.string()
  }),
  queryStopTimesByStopIdIndex: a
    .query()
    .arguments({ stop_id: a.string().required(), after: a.string() })
    .returns(a.ref("StopTimesConnection"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalStopTimesTableDataSource",
        entry: "./queryStopTimesByStopIdIndex.js",
      })
    ),
  queryStopTimesByTripId: a
    .query()
    .arguments({ trip_id: a.string().required(), after: a.string() })
    .returns(a.ref("StopTimesConnection"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalStopTimesTableDataSource",
        entry: "./queryStopTimesByTripId.js",
      })
    ),
  Trip: a.customType({
    is_added: a.boolean(),
    route_id: a.string(),
    trip_headsign: a.string(),
    trip_id: a.string().required(),
    vehicle_id: a.string(),
  }),
  getTrip: a
    .query()
    .arguments({ trip_id: a.id().required() })
    .returns(a.ref("Trip"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalTripTableDataSource",
        entry: "./getTrip.js",
      })
    ),
  getBatchTrips: a
    .query()
    .arguments({ ids: a.string().array().required() })
    .returns(a.ref("Trip").array())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalTripTableDataSource",
        entry: "./getBatchTrips.js",
      })
    ),
  Route: a.customType({
    agency_id: a.string().required(),
    route_id: a.string().required(),
    route_short_name: a.string(),
    route_color: a.string(),
  }),
  getRoute: a
    .query()
    .arguments({ route_id: a.id().required() })
    .returns(a.ref("Route"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalRouteTableDataSource",
        entry: "./getRoute.js",
      })
    ),
  getBatchRoutes: a
    .query()
    .arguments({ ids: a.string().array().required() })
    .returns(a.ref("Route").array())
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalRouteTableDataSource",
        entry: "./getBatchRoutes.js",
      })
    ),
  Vehicle: a.customType({
    bearing: a.integer(),
    latitude: a.float(),
    longitude: a.float(),
    speed: a.integer(),
    timestamp: a.integer(),
    trip_id: a.string(),
    vehicle_id: a.string().required(),
  }),
  getVehicle: a
    .query()
    .arguments({ vehicle_id: a.id().required() })
    .returns(a.ref("Vehicle"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalVehicleTableDataSource",
        entry: "./getVehicle.js",
      })
    ),
  // googleMapsSignUrl: a
  //   .query()
  //   .arguments({
  //     path: a.string().required(),
  //   })
  //   .returns(a.string())
  //   .authorization(allow => [allow.publicApiKey()])
  //   .handler(a.handler.function(googleMapsSignUrl)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 180,
    },
  },
});

// export const data = defineData({
//   schema,
//   authorizationModes: {
//     // defaultAuthorizationMode: "apiKey",
//     defaultAuthorizationMode: 'userPool',
//     // API Key is used for a.allow.public() rules
//     apiKeyAuthorizationMode: {
//       expiresInDays: 30,
//     },
//   },
// });

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
