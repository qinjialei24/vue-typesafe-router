import type { LocationQueryRaw } from "vue-router";
import { useRoute } from "vue-router";
import type { App, Component, DefineComponent } from "vue";
import { getPath } from "./utils";

//extract the params name from path
type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

//transform params name to object type
export type PathParamsToObject<T extends string> = {
  [K in ExtractPathParams<T>]: string;
};

//check if path has params
type HasParams<T extends string> = T extends `${string}:${string}`
  ? true
  : false;

//change PushParams type
export type PushParams<Query, Params extends string> =
  HasParams<Params> extends true
    ? Query extends undefined
      ? { params: PathParamsToObject<Params> }
      : { params: PathParamsToObject<Params>; query: Query }
    : Query extends undefined
      ? void
      : { query: Query };

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
  routeConfig: TypesafeRouteConfig<Params>,
) {
  const getParams = () => {
    const route = useRoute();
    return route.params as PathParamsToObject<Params>;
  };

  return {
    config: routeConfig,
    defineQuery<Query extends LocationQueryRaw>() {
      return {
        config: routeConfig,
        push(obj: PushParams<Query, Params>) {
          const vueRouter = window[vueRouterKey as any] as any;
          if (obj && typeof obj === "object") {
            const path =
              "params" in obj
                ? getPath(routeConfig.path, obj.params)
                : getPath(routeConfig.path);
            if ("query" in obj) {
              vueRouter.push({ path, query: obj.query });
            } else {
              vueRouter.push(path);
            }
          } else {
            vueRouter.push(getPath(routeConfig.path));
          }
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
      if (obj && typeof obj === "object" && "params" in obj) {
        vueRouter.push(getPath(routeConfig.path, obj.params));
      } else {
        vueRouter.push(getPath(routeConfig.path));
      }
    },
    getParams,
  };
}
