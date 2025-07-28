import { Pool } from "pg";
import { PostgresDialect } from "kysely";

interface DbConfig {
  database: string;
  host: string;
  user: string;
  port: number;
  password: string;
  max?: number;
}

type Environment = "development" | "test" | "production";

const configs: Record<Environment, DbConfig> = {
  development: {
    database: "flow-budget-dev",
    host: "127.0.0.1",
    user: "postgres",
    port: 5434,
    password: "dev",
    max: 10,
  },
  test: {
    database: "flow-budget-dev",
    host: "127.0.0.1",
    user: "postgres",
    port: 5434,
    password: "dev",
    max: 10,
  },
  production: {
    database: process.env.DB_NAME || "flow-budget",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    port: Number(process.env.DB_PORT || 5432),
    password: process.env.DB_PASSWORD || "",
    max: Number(process.env.DB_POOL_SIZE || 20),
  },
};

export function getConfig(env: Environment): DbConfig {
  return configs[env];
}

export function createDialect(env: Environment): PostgresDialect {
  const config = getConfig(env);
  return new PostgresDialect({
    pool: new Pool(config),
  });
}
