/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("user_accounts", (table) => {
    table.bigIncrements("id").primary(); // Auto-incremented ID
    table.string("username", 50).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.text("password_hash").notNullable();
    table.string("first_name", 50);
    table.string("last_name", 50);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("user_accounts");
}
