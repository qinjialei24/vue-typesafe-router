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
  DynamicParams extends Record<string, string> = Record<string, never>
> = {
  config: RouteRecordRaw;
  getQuery: () => Query;
  getDynamicParams: () => DynamicParams;
  pushQuery: (query: Query) => void;
  pushDynamicParamsAndQuery: (
    query: Query,
    dynamicParams: DynamicParams
  ) => void;
  pushDynamicParams: (dynamicParams: DynamicParams) => void;
};

export function createTypesafeRoute<
  T extends LocationQueryRaw,
  DynamicParams extends Record<string, string> = Record<string, never>
>(routeConfig: TypesafeRouteConfig): TypesafeRoute<T, DynamicParams> {
  return {
    config: routeConfig,
    getQuery: () => {
      const route = useRoute();
      return route.query as T;
    },
    getDynamicParams: () => {
      const route = useRoute();
      return route.params as DynamicParams;
    },
    pushQuery: (query: T) => {
      const vueRouter = window[vueRouterKey as any] as any;
      vueRouter.push({
        path: routeConfig.path,
        query,
      });
    },
    pushDynamicParamsAndQuery: (query: T, dynamicParams: DynamicParams) => {
      const vueRouter = window[vueRouterKey as any] as any;
      const path = getPath(routeConfig.path, dynamicParams);
      vueRouter.push({
        path,
        query,
      });
    },
    pushDynamicParams: (dynamicParams: DynamicParams) => {
      const vueRouter = window[vueRouterKey as any] as any;
      const path = getPath(routeConfig.path, dynamicParams);
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
