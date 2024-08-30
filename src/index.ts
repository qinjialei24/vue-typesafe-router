import type { LocationQueryRaw, RouteRecordRaw, } from "vue-router";
import {useRoute, useRouter} from "vue-router";

import type { Component, App, DefineComponent } from 'vue';

export const vueRouterKey = Symbol('vueRouterKey');
export const typesafeRouterPlugin = {
  install(app: App) {
    //@ts-ignore
    window[vueRouterKey] = app.config.globalProperties.$router;
  }
};

type TypesafeRouteConfig = {
  path: string;
  component: Component | DefineComponent;
};

type TypesafeRoute<Query extends LocationQueryRaw> = {
  config: RouteRecordRaw;
  push: (query: Query) => void;
  getQuery: () => Query;
};

export function createTypesafeRoute<T extends LocationQueryRaw>(routeConfig: TypesafeRouteConfig): TypesafeRoute<T> {
  return {
    config: routeConfig,
    getQuery: () => {
      const route = useRoute();
      return route.query as T;
    },
    push: (query: T) => {
      const vueRouter = window[vueRouterKey as any] as any;
      vueRouter.push({
        path: routeConfig.path,
        query
      });
    }
  }
}