export default (): Record<string, unknown> => ({
  rabbitmq: {
    host: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT),
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    uri: [
      'amqp://',
      process.env.RABBITMQ_USER,
      ':',
      process.env.RABBITMQ_PASS,
      '@',
      process.env.RABBITMQ_HOST,
      ':',
      Number(process.env.RABBITMQ_PORT),
    ].join(''),
  },
});
