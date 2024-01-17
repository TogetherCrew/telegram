export default (): Record<string, unknown> => ({
  telegram: {
    apiId: process.env.API_ID,
    apiHash: process.env.API_HASH,
    session: process.env.SESSION,
  },
});
