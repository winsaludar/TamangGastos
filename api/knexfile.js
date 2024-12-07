// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "P@$$w0rd1",
      database: "tamang_gastos",
    },
    migrations: {
      directory: "../db/migrations",
    },
    seeds: {
      directory: "../db/seeds",
    },
  },
};
// export const staging = {
//   client: "postgresql",
//   connection: {
//     database: "my_db",
//     user: "username",
//     password: "password",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
// };
// export const production = {
//   client: "postgresql",
//   connection: {
//     database: "my_db",
//     user: "username",
//     password: "password",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
// };
