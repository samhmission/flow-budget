import { Client } from "pg";
import { getConfig } from "./config.js";

async function createTestDatabase() {
  // Get the test environment config
  const testConfig = getConfig("test");

  // Connect to postgres database (default) to create our test database
  const client = new Client({
    host: testConfig.host,
    port: testConfig.port,
    user: testConfig.user,
    password: testConfig.password,
    database: "postgres", // Connect to default postgres database
  });

  try {
    await client.connect();

    // Check if test database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [testConfig.database]
    );

    if (result.rows.length === 0) {
      // Create the test database if it doesn't exist
      await client.query(`CREATE DATABASE "${testConfig.database}"`);
      console.log(
        `Test database "${testConfig.database}" created successfully`
      );
    } else {
      console.log(`Test database "${testConfig.database}" already exists`);
    }
  } catch (error) {
    console.error("Error creating test database:", error);
  } finally {
    await client.end();
  }
}

createTestDatabase();
