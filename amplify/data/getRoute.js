import { util } from "@aws-appsync/utils";

/**
 * Sends a request to get an item with route_id `ctx.args.route_id` from the DynamoDB table.
 * @param {import('@aws-appsync/utils').Context<{route_id: unknown;}>} ctx the context
 * @returns {import('@aws-appsync/utils').DynamoDBGetItemRequest} the request
 */
export function request(ctx) {
  const { route_id } = ctx.args;
  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({ route_id }),
  };
}

/**
 * Returns the fetched DynamoDB item.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the DynamoDB item
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}
