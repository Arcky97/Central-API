function required(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

export const env = {
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

  YOUTUBE_BASE_URL: required(process.env.YOUTUBE_BASE_URL!),
  YOUTUBE_API_KEY: required(process.env.YOUTUBE_API_KEY!),
  YOUTUBE_CHANNEL_ID: required(process.env.YOUTUBE_CHANNEL_ID!)
};