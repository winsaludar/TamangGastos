import knex from "knex";
import knexFile from "../../../knexfile.js";

// Get the current environment (default to 'development')
const environment = process.env.NODE_ENV || "development";

// Initialize Knex with the appropriate configuration
export const knexInstance = knex(knexFile[environment]);
