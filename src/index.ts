import type { Component, DefineComponent, App } from "vue";
import { useRoute, type LocationQueryRaw, type RouteRecordRaw } from "vue-router";

export const vueRouterKey = Symbol('vueRouterKey');
export const typeRouterPlugin = {
  install(app: App) {
    //@ts-ignore
    window[vueRouterKey] = app.config.globalProperties.$router;
  }
};

type TypeRouterConfig = {
  path: string;
  component: Component | DefineComponent;
};

type TypeRouter<Query extends LocationQueryRaw> = {
  router: RouteRecordRaw;
  push: (query: Query) => void;
  getQuery: () => Query;
};

export function createTypeRouter<T extends LocationQueryRaw>(routerConfig: TypeRouterConfig): TypeRouter<T> {
  return {
    router: routerConfig,
    getQuery: () => {
      const route = useRoute();
      return route.query as T;
    },
    push: (query: T) => {
      const vueRouter = window[vueRouterKey as any] as any;
      vueRouter.push({
        path: routerConfig.path,
        query
      });
    }
  };
}