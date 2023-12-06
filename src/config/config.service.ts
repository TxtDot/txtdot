import { config } from 'dotenv';

export class ConfigService {
  public readonly host: string;
  public readonly port: number;
  public readonly reverse_proxy: boolean;
  public readonly proxy_res: boolean;
  public readonly swagger: boolean;

  constructor() {
    config();

    this.host = process.env.HOST || '0.0.0.0';
    this.port = Number(process.env.PORT) || 8080;

    this.reverse_proxy = this.parseBool(process.env.REVERSE_PROXY, false);

    this.proxy_res = this.parseBool(process.env.PROXY_RES, true);
    this.swagger = this.parseBool(process.env.SWAGGER, false);
  }

  parseBool(value: string | undefined, def: boolean): boolean {
    if (!value) return def;
    return value === 'true' || value === '1';
  }
}
