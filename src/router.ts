interface RouteInfo {
  path: string
  view: () => void
}

export class Router {
  private defaultRoute: RouteInfo | null = null
  private routeTable: RouteInfo[] = []

  constructor() {
    window.addEventListener('popstate', () => this.route())
  }

  setDefaultRoute(view: () => void): void {
    this.defaultRoute = { path: '', view }
  }

  addRoute(path: string, view: () => void): void {
    this.routeTable.push({ path, view })
  }

  go(): void {
    this.route()
  }

  navigate(path: string, updateView: boolean = true): void {
    history.pushState({}, '', path)
    if (updateView) {
      this.route()
    }
  }

  private route(): void {
    const path = window.location.pathname

    if ((path === '/' || path === '') && this.defaultRoute) {
      this.defaultRoute.view()
      return
    }

    for (const route of this.routeTable) {
      if (path.startsWith(route.path)) {
        route.view()
        return
      }
    }
  }
}
