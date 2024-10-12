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
function getPath(path: string, params?: Record<string, string>) {
  if (!params) {
    return path;
  }
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

// 提取路径中的参数名
type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

// 将提取的参数名转换为对象类型
type PathParamsToObject<T extends string> = {
  [K in ExtractPathParams<T>]: string;
};

// 检查路径是否包含动态参数
type HasParams<T extends string> = T extends `${string}:${string}`
  ? true
  : false;

// 修改 PushParams 类型
type PushParams<Query, Params extends string> = HasParams<Params> extends true
  ? Query extends undefined
    ? { params: PathParamsToObject<Params> }
    : { params: PathParamsToObject<Params>; query: Query }
  : Query extends undefined
  ? void
  : { query: Query };

type TypesafeRouteConfig<Params extends string> = {
  path: Params;
  component: Component | DefineComponent;
};

export function create<Params extends string>(
  routeConfig: TypesafeRouteConfig<Params>
) {
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
        getParams: () => {
          const route = useRoute();
          return route.params as PathParamsToObject<Params>;
        },
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
    getParams: () => {
      const route = useRoute();
      return route.params as PathParamsToObject<Params>;
    },
  };
}
