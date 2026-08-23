function required(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: required("DB_HOST"),
  DB_USER: required("DB_USER"),
  DB_PASS: required("DB_PASS"),
  DB_NAME_CORE: required("DB_NAME_CORE"),
  DB_NAME_ANALYTICS: required("DB_NAME_ANALYTICS"),
  DB_NAME_AUTH: required("DB_NAME_AUTH"),
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  PORT: Number(process.env.PORT ?? 3000),

  API_KEY_WEBSITE: process.env.API_KEY_WEBSITE,
  API_KEY_DISCORD: process.env.API_KEY_DISCORD,
  API_KEY_ADMIN: process.env.API_KEY_ADMIN,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),

  YOUTUBE_BASE_URL: required("YOUTUBE_BASE_URL"),
  YOUTUBE_API_KEY: required("YOUTUBE_API_KEY"),
  YOUTUBE_CLIENT_ID: required("YOUTUBE_CLIENT_ID"),
  YOUTUBE_CLIENT_SECRET: required("YOUTUBE_CLIENT_SECRET"),
  YOUTUBE_REDIRECT_URI: required("YOUTUBE_REDIRECT_URI"),
  YOUTUBE_REFRESH_TOKEN: required("YOUTUBE_REFRESH_TOKEN"),
  YOUTUBE_ANALYTICS_DELAY_DAYS: Number(required("YOUTUBE_ANALYTICS_DELAY_DAYS")),
  YOUTUBE_SNAPSHOT_RETENTION_YEARS: Number(required("YOUTUBE_SNAPSHOT_RETENTION_YEARS")),

  //DISCORD_CLIENT_ID: required("DISCORD_CLIENT_ID"),
  //DISCORD_CLIENT_SECRET: required("DISCORD_CLIENT_SECRET"),
  //DISCORD_REDIRECT_URI: required("DISCORD_REDIRECT_URI"),

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3002",
  AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN
};