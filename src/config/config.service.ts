import { config } from 'dotenv';

export class ConfigService {
  public readonly host: string;
  public readonly port: number;
  public readonly timeout: number;
  public readonly reverse_proxy: boolean;
  public readonly proxy: ProxyConfig;
  public readonly swagger: boolean;
  public readonly search: SearchConfig;

  constructor() {
    config();

    this.host = process.env.HOST || '0.0.0.0';
    this.port = Number(process.env.PORT) || 8080;

    this.timeout = Number(process.env.TIMEOUT) || 0;

    this.reverse_proxy = this.parseBool(process.env.REVERSE_PROXY, false);

    this.proxy = {
      enabled: this.parseBool(process.env.PROXY_RES, true),
      img_compress: this.parseBool(process.env.IMG_COMPRESS, true),
    };

    this.swagger = this.parseBool(process.env.SWAGGER, false);

    this.search = {
      enabled: this.parseBool(process.env.SEARCH_ENABLED, false),
      searx_url: process.env.SEARX_URL,
    };
  }

  parseBool(value: string | undefined, def: boolean): boolean {
    if (!value) return def;
    return value === 'true' || value === '1';
  }
}

interface ProxyConfig {
  enabled: boolean;
  img_compress: boolean;
}

interface SearchConfig {
  enabled: boolean;
  searx_url?: string;
}
