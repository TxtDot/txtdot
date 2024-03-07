class DynConfigService {
  public routes: Set<string> = new Set();
  constructor() {}
  addRoute(route: string) {
    this.routes.add(route);
  }
}

const config = new DynConfigService();
export default config;
