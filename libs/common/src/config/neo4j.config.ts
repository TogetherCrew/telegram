export const neo4jConfig = (): Record<string, unknown> => ({
  neo4j: {
    scheme: 'neo4j',
    host: process.env.NEO4J_HOST,
    port: process.env.NEO4J_PORT,
    username: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASS,
    uri: [
      'neo4j://',
      process.env.NEO4J_USER,
      ':',
      process.env.NEO4J_PASS,
      '@',
      process.env.NEO4J_HOST,
      ':',
      process.env.NEO4J_PORT,
    ].join(''),
  },
});
