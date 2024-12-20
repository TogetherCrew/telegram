export const temporalConfig = (): Record<string, unknown> => ({
  temporal: {
    uri: process.env.TEMPORAL_URI,
    queue: process.env.TEMPORAL_QUEUE,
  },
});
