import { config } from "dotenv";

export class ConfigService {
  public readonly host: string;
  public readonly port: number;

  constructor() {
    const parsed = config().parsed;

    if (!parsed) {
      throw new Error("Invalid .env file");
    }

    this.host = process.env.HOST || 'localhost';
    this.port = Number(process.env.PORT) || 8080;
  }
}
