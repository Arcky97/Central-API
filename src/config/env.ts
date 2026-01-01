function required(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

export const env = {
  DB_HOST: required("DB_HOST"),
  DB_USER: required("DB_USER"),
  DB_PASS: required("DB_PASS"),
  DB_NAME: required("DB_NAME"),
  DB_PORT: Number(process.env.DB_PORT ?? 3306)
};