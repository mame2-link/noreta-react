import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function getStop(stopId: string) {
    return await client.queries.getStop({ stop_id: stopId });
}