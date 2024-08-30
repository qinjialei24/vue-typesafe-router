import type { LocationQueryRaw, RouteRecordRaw, } from "vue-router";
import { useRoute, useRouter } from "vue-router";

import type { Component, App, DefineComponent } from 'vue';

export const vueRouterKey = Symbol('vueRouterKey');
export const typeRouterPlugin = {
  install(app: App) {
    //@ts-ignore
    window[vueRouterKey] = app.config.globalProperties.$router;
  }
};

type TypeRouteConfig = {
  path: string;
  component: Component | DefineComponent;
};

type TypeRoute<Query extends LocationQueryRaw> = {
  config: RouteRecordRaw;
  push: (query: Query) => void;
  getQuery: () => Query;
};

export function createTypesafeRoute<T extends Record<string, any>>(routeConfig: { path: string; component: any }) {
  return {
    config: routeConfig,
    push: (query: T) => {
      const router = useRouter()
      router.push({
        path: routeConfig.path,
        query
      })
    },
    getQuery: () => {
      const router = useRouter()
      return router.currentRoute.value.query as T
    }
  }
}