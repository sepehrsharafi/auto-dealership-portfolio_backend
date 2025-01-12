import "dotenv/config";
import * as url from "url";

const parsedUrl = new url.URL(process.env.DATABASE_URL);

const PG_SECRETS = {
  host: parsedUrl.hostname,
  database: parsedUrl.pathname.split("/")[1],
  user: parsedUrl.username,
  password: parsedUrl.password,
  port: parsedUrl.port,
  ssl: parsedUrl.searchParams.get("sslmode") === "require",
};

const JWT_SECRETS = {
  signKey: process.env.SIGN_KEY,
};

export { PG_SECRETS, JWT_SECRETS };
