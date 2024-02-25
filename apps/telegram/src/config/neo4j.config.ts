export default (): Record<string, unknown> => ({
  neo4j: {
    scheme: 'neo4j',
    host: process.env.NEO4J_HOST,
    port: process.env.NEO4J_PORT,
    username: process.env.NEO4J_USERNAME,
    password: process.env.NEO4J_PASSWORD,
  },
});
