export default (): Record<string, unknown> => ({
  telegraf: {
    token: process.env.TELEGRAF_TOKEN,
  },
});
