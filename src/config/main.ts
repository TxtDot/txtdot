import { ConfigService } from "./config.service";

let configSvc: ConfigService | undefined;

export default function getConfig(): ConfigService {
  if (configSvc) {
    return configSvc;
  }

  configSvc = new ConfigService();
  return configSvc;
}
