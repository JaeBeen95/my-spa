/* @JSX createElement */

import { createDOM } from './react'

interface RouteInfo {
  path: string
  regex: RegExp
  pathParams: string[]
  view: (
    pathParams?: Record<string, string>,
    queryParams?: Record<string, string>,
  ) => JSX.Element
}

export class Router {
  private defaultRoute: RouteInfo | null = null
  private routeTable: RouteInfo[] = []

  constructor() {
    window.addEventListener('popstate', () => this.refresh())
    this.delegateLinkClicks()
  }

  private delegateLinkClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.matches('[data-route]')) {
        e.preventDefault()
        const href = target.getAttribute('href')
        if (href) this.navigate(href)
      }
    })
  }

  private getPathParams(path: string) {
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
      pathParams?: Record<string, string>,
      queryParams?: Record<string, string>,
    ) => JSX.Element,
    path: string = '',
  ) {
    const { regex, pathParams } = this.getPathParams(path)
    this.defaultRoute = { path, regex, pathParams, view }
  }

  addRoute(
    path: string,
    view: (
      pathParams?: Record<string, string>,
      queryParams?: Record<string, string>,
    ) => JSX.Element,
  ) {
    const { regex, pathParams } = this.getPathParams(path)
    this.routeTable.push({ path, regex, pathParams, view })
  }

  navigate(path: string) {
    history.pushState({}, '', path)
    this.refresh()
  }

  getView(): JSX.Element {
    const path = window.location.pathname
    const queryParams = this.getQueryParams()

    for (const route of this.routeTable) {
      const match = path.match(route.regex)
      if (match) {
        const pathParams: Record<string, string> = {}
        route.pathParams.forEach((name, index) => {
          pathParams[name] = match[index + 1]
        })
        return route.view(pathParams, queryParams)
      }
    }

    if (this.defaultRoute) {
      return this.defaultRoute.view({}, queryParams)
    }
  }

  refresh() {
    const root = document.getElementById('root')
    if (root) {
      root.innerHTML = ''
      root.appendChild(createDOM(this.getView()))
    }
  }
}
