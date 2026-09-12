import type uk from "../messages/uk.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof uk;
  }
}
