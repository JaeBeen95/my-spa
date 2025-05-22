/* @jsx createElement */
import { createDOM } from './react/createDom';
import type { VNode } from './types';

interface RouteInfo {
  path: string;
  regex: RegExp;
  pathParams: string[];
  page: (
    pathParams?: Record<string, string>,
    queryParams?: Record<string, string>,
  ) => VNode;
}

let routerInstance: Router | null = null;

export function useRouter(): Router {
  if (!routerInstance) {
    routerInstance = new Router();
  }
  return routerInstance;
}

export function useNavigate(): (path: string) => void {
  return (path: string) => useRouter().navigate(path);
}

export function resetRouter() {
  routerInstance = null;
}

export class Router {
  private defaultRoute: RouteInfo | null = null;
  private routeTable: RouteInfo[] = [];

  constructor() {
    window.addEventListener('popstate', () => this.renderPage());
  }

  private compilePath(path: string): { regex: RegExp; pathParams: string[] } {
    const pathParams: string[] = [];
    const regexPath = path.replace(/:([^/]+)/g, (_, name) => {
      pathParams.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPath}/?$`);
    return { regex, pathParams };
  }

  private getQueryParams(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of new URLSearchParams(window.location.search)) {
      result[key] = value;
    }
    return result;
  }

  setDefaultRoute(page: RouteInfo['page'], path = '') {
    const { regex, pathParams } = this.compilePath(path);
    this.defaultRoute = { path, regex, pathParams, page };
  }

  addRoute(path: string, page: RouteInfo['page']) {
    const { regex, pathParams } = this.compilePath(path);
    this.routeTable.push({ path, regex, pathParams, page });
  }

  navigate(path: string) {
    history.pushState({}, '', path);
    this.renderPage();
  }

  createPage(): VNode {
    const path = window.location.pathname;
    const queryParams = this.getQueryParams();

    for (const route of this.routeTable) {
      const match = path.match(route.regex);
      if (match) {
        const pathParams: Record<string, string> = {};
        route.pathParams.forEach((name, index) => {
          pathParams[name] = match[index + 1];
        });
        return route.page(pathParams, queryParams);
      }
    }

    if (this.defaultRoute) {
      return this.defaultRoute.page({}, queryParams);
    }
  }

  renderPage() {
    const root = document.getElementById('root');
    if (!root) return;

    const pageVNode = this.createPage();
    root.innerHTML = '';
    root.appendChild(createDOM(pageVNode));
  }
}
