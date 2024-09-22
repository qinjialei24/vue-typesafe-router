import { Component, DefineComponent } from "vue";
import { LocationQueryRaw } from "vue-router";
import { useRoute } from "vue-router";
export const vueRouterKey = Symbol("vueRouterKey");

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

// 修改 test 函数
function create<Params extends string>(
  routeConfig: TypesafeRouteConfig<Params>
) {
  const vueRouter = window[vueRouterKey as any] as any;

  return {
    config: routeConfig,
    withQuery<Query extends LocationQueryRaw>() {
      return {
        push(obj: PushParams<Query, Params>) {
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
      // no query
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

// 使用示例
const routeWithParams = create({ path: "/test/:id/:id2", component: {} });
routeWithParams.push({ params: { id: "123", id2: "456" } }); // 正确
// routeWithParams.push({ params: { id: "123", id2: "456" }, query: { foo: "bar" } }); // 错误，没有指定 query 类型

const routeWithParamsAndQuery = create({
  path: "/test/:id/:name",
  component: {},
}).withQuery<{
  foo: string;
}>();

routeWithParamsAndQuery.push({
  params: { id: "123", name: "456" },
  query: { foo: "bar" },
}); // 正确
// routeWithParamsAndQuery.push({ params: { id: "123", id2: "456" } }); // 错误，缺少 query
routeWithParamsAndQuery.getParams().id; // 正确
routeWithParamsAndQuery.getParams().name; // 正确
routeWithParamsAndQuery.getQuery().foo; // 正确

const routeWithoutParams = create({ path: "/test", component: {} });
routeWithoutParams.push(); // 正确
// routeWithoutParams.push({}); // 错误，不应该传入任何参数

const routeWithParamsWithoutQuery = create({
  path: "/test/:id",
  component: {},
});
routeWithParamsWithoutQuery.push({ params: { id: "123" } }); // 正确
// routeWithParamsWithoutQuery.push({ params: { id: "123" }, query: { foo: "bar" } }); // 错误，不能传入 query 类型

const routeWithoutParamsWithQuery = create({
  path: "/test",
  component: {},
}).withQuery<{ foo: string }>();
routeWithoutParamsWithQuery.push({ query: { foo: "bar" } }); // 正确
// routeWithoutParamsWithQuery.push({}); // 错误，缺少 query
