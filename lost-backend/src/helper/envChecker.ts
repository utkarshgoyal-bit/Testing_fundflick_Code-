import logger from "../lib/logger";

export default function envChecker() {
  if (process.env.NODE_ENV === "production") {
    logger.warn("Production mode detected");
    if (!process.env.DOMAIN) {
      logger.error("DOMAIN is not set");
      process.exit(1);
    } else if (!process.env.ORIGIN) {
      logger.error("ORIGIN is not set");
      process.exit(1);
    } else if (!process.env.PORT) {
      logger.error("PORT is not set");
      process.exit(1);
    } else if (!process.env.DB_ENV) {
      logger.error("DB_ENV is not set");
      process.exit(1);
    } else if (!process.env.JWT_SECRET_SALT) {
      logger.error("JWT_SECRET_SALT is not set");
      process.exit(1);
    } else if (!process.env.JWT_SECRET) {
      logger.error("JWT_SECRET is not set");
      process.exit(1);
    } else if (!process.env.DATABASE_URL) {
      logger.error("DATABASE_URL is not set");
      process.exit(1);
    } else if (!process.env.DB_CONFIG) {
      logger.error("DB_CONFIG is not set");
      process.exit(1);
    } else if (!process.env.OUTLOOK_USER) {
      logger.error("OUTLOOK_USER is not set");
      process.exit(1);
    } else if (!process.env.OUTLOOK_PASS) {
      logger.error("OUTLOOK_PASS is not set");
      process.exit(1);
    } else if (!process.env.API_SECRET) {
      logger.error("API_SECRET is not set");
      process.exit(1);
    } else if (!process.env.API_KEY) {
      logger.error("API_KEY is not set");
      process.exit(1);
    } else if (!process.env.CLOUD_NAME) {
      logger.error("CLOUD_NAME is not set");
      process.exit(1);
    } else if (!process.env.AWS_REGION) {
      logger.error("AWS_REGION is not set");
      process.exit(1);
    } else if (!process.env.AWS_ACCESS_KEY_ID) {
      logger.error("AWS_ACCESS_KEY_ID is not set");
      process.exit(1);
    } else if (!process.env.AWS_SECRET_ACCESS_KEY) {
      logger.error("AWS_SECRET_ACCESS_KEY is not set");
      process.exit(1);
    } else if (!process.env.AWS_BUCKET_NAME) {
      logger.error("AWS_BUCKET_NAME is not set");
      process.exit(1);
    } else if (!process.env.SMS_API_KEY) {
      logger.error("SMS_API_KEY is not set");
      process.exit(1);
    } else if (!process.env.SMS_API_ROUTE) {
      logger.error("SMS_API_ROUTE is not set");
      process.exit(1);
    } else if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      logger.error("FIREBASE_SERVICE_ACCOUNT is not set");
      process.exit(1);
    }
    return false;
  }
}
