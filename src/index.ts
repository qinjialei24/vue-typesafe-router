import { useRoute, LocationQueryRaw, RouteRecordRaw, } from "vue-router";
import { Component, App, DefineComponent } from 'vue';

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
  route: RouteRecordRaw;
  push: (query: Query) => void;
  getQuery: () => Query;
};

export function createTypeRouter<T extends LocationQueryRaw>(routerConfig: TypeRouterConfig): TypeRouter<T> {
  return {
    route: routerConfig,
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