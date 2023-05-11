require("dotenv").config();

module.exports = {
  databaseUrl: {
    default: {
      connectionString: process.env.DATABASE_URL,
    },
  },
  migrationsFolder: "migrations",
};
