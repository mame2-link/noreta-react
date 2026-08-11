import type { Schema } from "../../data/resource";
import crypto from "crypto";
import url from "url";
/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString: string) {
    return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString: string) {
    return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {Buffer}
 */
function decodeBase64Hash(code: string): Buffer {
    // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
    return Buffer.from ? Buffer.from(code, 'base64') : new Buffer(code, 'base64');
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {Buffer} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
function encodeBase64Hash(key: Buffer, data: string) {
    return crypto.createHmac('sha1', key).update(data).digest('base64');
}

export const handler: Schema["googleMapsSignUrl"]["functionHandler"] = async (event) => {
    // arguments typed from `.arguments()`
    const { path } = event.arguments
    const uri = url.parse(path);
    const safeSecret = decodeBase64Hash(removeWebSafe("fMcZ5gfuPhDUpQLYHDxGNW--xDE="));
    const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, uri.path!));
    return url.format(uri) + '&signature=' + hashedSignature;
}