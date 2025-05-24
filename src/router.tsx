/** @jsx createElement */
import { createElement, useState, useEffect } from './react';
import { VNode, ComponentType } from './types';

export interface RouteParams {
  [key: string]: string;
}

export interface RouteConfig {
  path: string;
  element: ComponentType | ((params: RouteParams) => VNode);
}

interface LocationState {
  pathname: string;
  search: string;
  hash: string;
}

let currentLocation: LocationState = {
  pathname: location.pathname,
  search: location.search,
  hash: location.hash,
};

const listeners = new Set<() => void>();
let currentParams: RouteParams = {};

function updateLocation(): void {
  currentLocation = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  listeners.forEach((fn) => fn());
}

addEventListener('popstate', updateLocation);

export function navigate(to: string | number, replace = false): void {
  if (typeof to === 'number') {
    history.go(to);
  } else {
    replace ? history.replaceState({}, '', to) : history.pushState({}, '', to);
    updateLocation();
  }
}

export function useNavigate() {
  return (to: string | number, { replace = false } = {}) =>
    navigate(to, replace);
}

export function useLocation(): LocationState {
  const [location, setLocation] = useState(currentLocation);
  useEffect(() => {
    const handler = () => setLocation({ ...currentLocation });
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);
  return location;
}

export function useParams(): RouteParams {
  const [params, setParams] = useState(currentParams);
  useEffect(() => {
    const handler = () => setParams({ ...currentParams });
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);
  return params;
}

export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void,
] {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(currentLocation.search),
  );

  useEffect(() => {
    const handler = () =>
      setSearchParams(new URLSearchParams(currentLocation.search));
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const setParams = (params: URLSearchParams | Record<string, string>) => {
    const search =
      params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(params).toString();

    const url = `${currentLocation.pathname}${search ? '?' + search : ''}${
      currentLocation.hash
    }`;
    navigate(url, true);
  };

  return [searchParams, setParams];
}

function matchRoute(
  routePattern: string,
  currentPath: string,
): RouteParams | null {
  const routeSegments = routePattern.split('/').filter(Boolean);
  const pathSegments = currentPath.split('/').filter(Boolean);
  if (routeSegments.length !== pathSegments.length) return null;

  const params: RouteParams = {};
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const pathSegment = pathSegments[i];
    if (routeSegment.startsWith(':')) {
      params[routeSegment.slice(1)] = pathSegment;
    } else if (routeSegment !== pathSegment) {
      return null;
    }
  }
  return params;
}

export function Routes({ routes }: { routes: RouteConfig[] }): VNode | null {
  const { pathname } = useLocation();

  for (const { path, element } of routes) {
    const params = matchRoute(path, pathname);
    if (!params) continue;

    currentParams = params;
    return typeof element === 'function' && element.length > 0
      ? (element as (params: RouteParams) => VNode)(params)
      : (element as ComponentType)();
  }

  return null;
}

export function Link({
  to,
  replace = false,
  children,
  ...props
}: {
  to: string;
  replace?: boolean;
  children?: VNode | VNode[];
  [key: string]: any;
}): VNode {
  return (
    <a
      href={to}
      onClick={(e: Event) => {
        e.preventDefault();
        navigate(to, replace);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function Navigate({
  to,
  replace = false,
}: {
  to: string;
  replace?: boolean;
}): null {
  const nav = useNavigate();
  useEffect(() => nav(to, { replace }), [to, replace]);
  return null;
}
