module.exports = {
  projectName: process.env.PROJECT_NAME,

  host: process.env.HOST,
  port: process.env.PORT,

  databaseHost: process.env.DB_HOST,
  databasePort: process.env.DB_PORT,
  databaseUser: process.env.DB_USER,
  databasePass: process.env.DB_PASS,
  databaseName: process.env.DB_NAME,
  databaseConnectionLimit: process.env.DB_CONN_LIMIT,

  secret_key: process.env.SECRET_KEY,
}
