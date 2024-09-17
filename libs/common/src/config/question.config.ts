export const questionConfig = (): Record<string, unknown> => ({
  question: {
    uri: process.env.QUESTION_SERVICE_URI,
  },
});
