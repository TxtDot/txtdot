import { config } from "dotenv";

export class ConfigService {
  public readonly host: string;
  public readonly port: number;
  public readonly reverse_proxy: boolean;

  constructor() {
    config();

    this.host = process.env.HOST || "0.0.0.0";
    this.port = Number(process.env.PORT) || 8080;

    this.reverse_proxy = Boolean(process.env.REVERSE_PROXY) || false;
  }
}
