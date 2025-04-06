interface RouteInfo {
  path: string
  regex: RegExp
  pathParams: string[]
  view: (
    pathParam?: Record<string, string>,
    queryParam?: Record<string, string>,
  ) => void
}

export class Router {
  private defaultRoute: RouteInfo | null = null
  private routeTable: RouteInfo[] = []

  constructor() {
    window.addEventListener('popstate', () => this.route())
  }

  private getPathParams(path: string): { regex: RegExp; pathParams: string[] } {
    const pathParams: string[] = []
    const regexPath = path.replace(/:([^\/]+)/g, (_, paramName) => {
      pathParams.push(paramName)
      return '([^\\/]+)'
    })
    const regex = new RegExp(`^${regexPath}\\/?$`)
    return { regex, pathParams }
  }

  private getQueryParams(): Record<string, string> {
    const queryParam: Record<string, string> = {}
    const searchParams = new URLSearchParams(window.location.search)
    for (const [key, value] of searchParams.entries()) {
      queryParam[key] = value
    }
    return queryParam
  }

  setDefaultRoute(
    view: (
      pathParam?: Record<string, string>,
      queryParam?: Record<string, string>,
    ) => void,
    path: string = '',
  ): void {
    const { regex, pathParams } = this.getPathParams(path)
    this.defaultRoute = { path, regex, pathParams, view }
  }

  addRoute(
    path: string,
    view: (
      pathParams?: Record<string, string>,
      queryParams?: Record<string, string>,
    ) => void,
  ): void {
    const { regex, pathParams } = this.getPathParams(path)
    this.routeTable.push({ path, regex, pathParams, view })
  }

  go(): void {
    this.route()
  }

  navigate(path: string): void {
    history.pushState({}, '', path)
    this.route()
  }

  private route(): void {
    const path = window.location.pathname
    const queryParams = this.getQueryParams()

    for (const route of this.routeTable) {
      const match = path.match(route.regex)
      if (match) {
        const pathParam: Record<string, string> = {}
        route.pathParams.forEach((name, index) => {
          pathParam[name] = match[index + 1]
        })
        route.view(pathParam, queryParams)
        return
      }
    }

    if (this.defaultRoute) {
      const match = path.match(this.defaultRoute.regex)
      const pathParam: Record<string, string> = {}
      if (match) {
        this.defaultRoute.pathParams.forEach((name, index) => {
          pathParam[name] = match[index + 1]
        })
      }
      this.defaultRoute.view(pathParam, queryParams)
    }
  }
}
