import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { aws_dynamodb } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
});

const externalDataSourcesStack = backend.createStack("ExternalDataSources");

const externalStopTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "ExternalStopTable",
  "stops"
);

const externalStopTimesTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "ExternalStopTimesTable",
  "stop_times"
);

const externalTripTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "ExternalTripTable",
  "trips"
);

const externalRouteTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "ExternalRouteTable",
  "routes"
);

const externalVehicleTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "ExternalVehicleTable",
  "vehicles"
);

backend.data.addDynamoDbDataSource(
  "ExternalStopTableDataSource",
  externalStopTable
);

backend.data.addDynamoDbDataSource(
  "ExternalStopTimesTableDataSource",
  externalStopTimesTable
);

backend.data.addDynamoDbDataSource(
  "ExternalTripTableDataSource",
  externalTripTable
);

backend.data.addDynamoDbDataSource(
  "ExternalRouteTableDataSource",
  externalRouteTable
);

backend.data.addDynamoDbDataSource(
  "ExternalVehicleTableDataSource",
  externalVehicleTable
);