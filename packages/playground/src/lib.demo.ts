
import { create } from "./lib";

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