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

interface PushParams {
  params?: Record<string, string>;
  query?: LocationQueryRaw;
};

type TypesafeRoute<
  Query extends LocationQueryRaw,
  Params extends Record<string, string> = Record<string, never>
> = {
  config: RouteRecordRaw;
  getQuery: () => Query;
  getParams: () => Params;
  push: (pushParams: PushParams) => any;
};

export function createTypesafeRoute<
  Query extends LocationQueryRaw,
  Params extends Record<string, string> = Record<string, never>
>(routeConfig: TypesafeRouteConfig): TypesafeRoute<Query, Params> {
  return {
    config: routeConfig,
    getQuery: () => {
      const route = useRoute();
      return route.query as Query;
    },
    getParams: () => {
      const route = useRoute();
      return route.params as Params;
    },
    push: ({params, query}: PushParams) => {
      const vueRouter = window[vueRouterKey as any] as any;
      if (params) {
        const path = getPath(routeConfig.path, params);
        if (query) {
          return vueRouter.push({ path, query });
        }
        return vueRouter.push(path);
      }
      if (query) {
        return vueRouter.push({
          path: routeConfig.path,
          query,
        });
      }
      return vueRouter.push(routeConfig.path);  
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
