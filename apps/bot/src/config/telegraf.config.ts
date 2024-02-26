export default (): Record<string, unknown> => ({
  telegram: {
    token: process.env.TELEGRAF_TOKEN,
  },
});
