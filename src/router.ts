interface RouteInfo {
  path: string
  view: () => void
}

let defaultRoute: RouteInfo | null = null
const routeTable: RouteInfo[] = []

export function setDefaultRoute(view: () => void): void {
  defaultRoute = { path: '', view }
}

export function addRoute(path: string, view: () => void): void {
  routeTable.push({ path, view })
}

export function router(): void {
  const path = window.location.pathname

  if ((path === '/' || path === '') && defaultRoute) {
    defaultRoute.view()
    return
  }

  for (const route of routeTable) {
    if (path.startsWith(route.path)) {
      route.view()
      return
    }
  }
}

export function navigate(path: string, updateView: boolean = true): void {
  history.pushState({}, '', path)
  if (updateView) {
    router()
  }
}
