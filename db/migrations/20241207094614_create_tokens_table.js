/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.bigIncrements("id").primary();
    table.uuid("user_id").notNullable();
    table.text("token").notNullable();
    table.string("token_type", 20).notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Define a foregin key relationship
    table
      .foreign("user_id")
      .references("id")
      .inTable("user_accounts")
      .onDelete("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("tokens");
}
