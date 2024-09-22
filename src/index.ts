import type { LocationQueryRaw } from "vue-router";
import { useRoute } from "vue-router";
import type { App, Component, DefineComponent } from "vue";
import { PathParamsToObject, PushParams } from "./type-utils";
import { getPath } from "./utils";

export const vueRouterKey = Symbol("vueRouterKey");
export const typesafeRouterPlugin = {
  install(app: App) {
    //@ts-ignore
    window[vueRouterKey] = app.config.globalProperties.$router;
  },
};

type TypesafeRouteConfig<Params extends string> = {
  path: Params;
  component: Component | DefineComponent;
};

export function create<Params extends string>(
  routeConfig: TypesafeRouteConfig<Params>
) {
  const getParams = () => {
    const route = useRoute();
    return route.params as PathParamsToObject<Params>;
  };

  return {
    config: routeConfig,
    withQuery<Query extends LocationQueryRaw>() {
      return {
        config: routeConfig,
        push(obj: PushParams<Query, Params>) {
          const vueRouter = window[vueRouterKey as any] as any;
          const path =
            obj && "params" in obj
              ? getPath(routeConfig.path, obj.params)
              : getPath(routeConfig.path);
          vueRouter.push({ path, query: obj.query });
        },
        getQuery: () => {
          const route = useRoute();
          return route.query as Query;
        },
        getParams,
      };
    },
    push(obj: PushParams<undefined, Params>) {
      const vueRouter = window[vueRouterKey as any] as any;
      const path =
        obj && "params" in obj
          ? getPath(routeConfig.path, obj.params)
          : getPath(routeConfig.path);
      vueRouter.push(path);
    },
    getParams,
  };
}
