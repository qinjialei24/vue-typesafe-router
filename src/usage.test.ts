import { create } from ".";

// 基本用法
const basicRoute = create({
  path: "/user/:id",
  component: {} as any,
});

const optionalParamRoute = create({
  path: "/post/:id",
  component: {} as any,
});

// 带有查询参数的路由
const queryParamRoute = create({
  path: "/search",
  component: {} as any,
}).withQuery<{ q: string; page: string }>();

// 混合使用路径参数和查询参数
const mixedRoute = create({
  path: "/product/:category/:id",
  component: {} as any,
});

// 使用示例

// 基本路由跳转
basicRoute.push({ params: { id: "123" } });

// 可选参数路由跳转
optionalParamRoute.push({ params: { id: "456" } }); // 提供id

// 查询参数路由跳转
queryParamRoute.push({ query: { q: "typescript", page: "1" } });

// 混合参数路由跳转
mixedRoute.push({
  params: { category: "electronics", id: "789" },
});

// 原始示例
const originalRoute = create({
  path: "/test/:id",
  component: {} as any,
});

originalRoute.push({ params: { id: "123" } });
