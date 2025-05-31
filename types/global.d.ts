declare global {
  interface CloudflareEnv {
    DB: D1Database;
    ENVIRONMENT: string;
  }
}

export type Env = CloudflareEnv;