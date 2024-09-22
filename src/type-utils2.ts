import { LocationQueryRaw } from "vue-router";

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
type HasParams<T extends string> = T extends `${string}:${string}` ? true : false;

// 修改 PushParams 类型
type PushParams<Query, Params extends string> = HasParams<Params> extends true
  ? Query extends undefined
    ? { params: PathParamsToObject<Params> }
    : { params: PathParamsToObject<Params>; query: Query }
  : Query extends undefined
  ? {}
  : { query: Query };

// 修改 test 函数
function test<Params extends string>(path: Params) {
  return {
    withQuery<Query extends LocationQueryRaw>() {
      return {
        push(obj: PushParams<Query, Params>) {
          console.log("push", obj);
        },
      };
    },
    push(obj: PushParams<undefined, Params>) {
      console.log("push", obj);
    },
  };
}

// 使用示例
const routeWithParams = test("/test/:id/:id2");
routeWithParams.push({ params: { id: "123", id2: "456" } }); // 正确
// routeWithParams.push({ params: { id: "123", id2: "456" }, query: { foo: "bar" } }); // 错误，没有指定 query 类型

const routeWithParamsAndQuery = test("/test/:id/:id2").withQuery<{ foo: string }>();
routeWithParamsAndQuery.push({ params: { id: "123", id2: "456" }, query: { foo: "bar" } }); // 正确
// routeWithParamsAndQuery.push({ params: { id: "123", id2: "456" } }); // 错误，缺少 query

const routeWithoutParams = test("/test");
routeWithoutParams.push({}); // 正确
// routeWithoutParams.push({ query: { foo: "bar" } }); // 错误，没有指定 query 类型

const routeWithoutParamsWithQuery = test("/test").withQuery<{ foo: string }>();
routeWithoutParamsWithQuery.push({ query: { foo: "bar" } }); // 正确
// routeWithoutParamsWithQuery.push({}); // 错误，缺少 query
