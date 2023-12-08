export default (): Record<string, unknown> => ({
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
  },
});
