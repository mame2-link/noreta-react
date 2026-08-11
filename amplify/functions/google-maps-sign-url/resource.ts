import { defineFunction } from '@aws-amplify/backend';

export const googleMapsSignUrl = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'google-maps-sign-url',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  runtime: 22
});