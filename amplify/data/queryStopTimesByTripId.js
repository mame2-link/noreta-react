import { util } from "@aws-appsync/utils";

/**
 * Queries a DynamoDB table for items.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {import('@aws-appsync/utils').DynamoDBQueryRequest} the request
 */
export function request(ctx) {
  const { trip_id, first = 100, after } = ctx.args;
  return dynamodbQueryRequest("trip_id", trip_id, first, after);
}

/**
 * Returns the result or throws an error if the operation failed.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}

/**
 * Helper function to format a DynamoDB query request
 * @param  {string} key key name
 * @param  {any} value key value
 * @param  {number} limit max number of items to return
 * @param  {string} nextToken? token specifying where the query should start reading from
 * @returns {*} the request
 */
function dynamodbQueryRequest(key, value, limit, nextToken) {
  const expression = `#key = :key`;
  const expressionNames = { "#key": key };
  const expressionValues = util.dynamodb.toMapValues({ ":key": value });

  return {
    operation: "Query",
    query: { expression, expressionNames, expressionValues },
    limit,
    nextToken,
    scanIndexForward: true,
    select: "ALL_ATTRIBUTES",
  };
}
