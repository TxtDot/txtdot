class DynConfig {
  public routes: Set<string> = new Set();
  constructor() {}
  addRoute(route: string) {
    this.routes.add(route);
  }
}

const dyn_config = new DynConfig();
export default dyn_config;
