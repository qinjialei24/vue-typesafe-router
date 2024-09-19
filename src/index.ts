import type { LocationQueryRaw, RouteRecordRaw } from "vue-router";
import { useRoute } from "vue-router";

import type { Component, App, DefineComponent } from "vue";

export const vueRouterKey = Symbol("vueRouterKey");
export const typesafeRouterPlugin = {
  install(app: App) {
    //@ts-ignore
    window[vueRouterKey] = app.config.globalProperties.$router;
  },
};

type TypesafeRouteConfig = {
  path: string;
  component: Component | DefineComponent;
};

type TypesafeRoute<
  Query extends LocationQueryRaw,
  Params extends Record<string, string> = Record<string, never>
> = {
  config: RouteRecordRaw;
  getQuery: () => Query;
  getParams: () => Params;
  pushQuery: (query: Query) => void;
  pushParamsAndQuery: (
    query: Query,
    params: Params
  ) => void;
  pushParams: (params: Params) => void;
};

export function createTypesafeRoute<
  T extends LocationQueryRaw,
  Params extends Record<string, string> = Record<string, never>
>(routeConfig: TypesafeRouteConfig): TypesafeRoute<T, Params> {
  return {
    config: routeConfig,
    getQuery: () => {
      const route = useRoute();
      return route.query as T;
    },
    getParams: () => {
      const route = useRoute();
      return route.params as Params;
    },
    pushQuery: (query: T) => {
      const vueRouter = window[vueRouterKey as any] as any;
      vueRouter.push({
        path: routeConfig.path,
        query,
      });
    },
    pushParamsAndQuery: (query: T, params: Params) => {
      const vueRouter = window[vueRouterKey as any] as any;
      const path = getPath(routeConfig.path, params);
      vueRouter.push({
        path,
        query,
      });
    },
    pushParams: (params: Params) => {
      const vueRouter = window[vueRouterKey as any] as any;
      const path = getPath(routeConfig.path, params);
      vueRouter.push(path);
    },
  };
}

export function getPath(path: string, params: Record<string, string>) {
  return path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        const key = segment.slice(1);
        return params[key as keyof typeof params] || segment;
      }
      return segment;
    })
    .join("/");
}
