export default (): Record<string, unknown> => ({
  base: {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
  },
});
