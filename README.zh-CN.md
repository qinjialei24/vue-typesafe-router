# vue-typesafe-router

[中文文档](./README.zh-CN.md) | [English](./README.md)

一种在 Vue.js 3.x 中定义类型安全路由的简单方法，从此路由传参和获取参数都是完全类型安全的。

React.js 版本也可以在这里找到 (https://github.com/qinjialei24/react-typesafe-router)。

## 安装

```bash
pnpm i vue-typesafe-router
```

## 使用方法

### 1. 在你的应用中使用 typesafeRouterPlugin

```ts
import { typesafeRouterPlugin } from "vue-typesafe-router";
import { createApp } from "vue";

createApp(App).use(typesafeRouterPlugin);
```

### 2. 定义你的路由

#### 定义带查询参数的路由

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = create({
  path: "/home",
  component: import("./Home.vue"),
}).withQuery<{ id: string; name: string }>();

const router = createRouter({
  history: createWebHistory(),
  routes: [homeRoute.config, { path: "/demo", component: Demo }],
});
```

现在，你可以享受类型安全的路由了

- 使用类型安全的查询参数导航到首页路由

```ts
homeRoute.push({ query: { id: "1", name: "home" } });
```

- 从首页路由获取类型安全的查询参数

```ts
homeRoute.getQuery();
```

#### 定义带路径参数的路由

注意：我们将使用以 `:` 开头的字符串作为路径中的参数，并自动生成类型安全的参数对象。

在这个例子中，我们将自动生成类型安全的参数对象 `{ id: string; name: string }`。

> 所有参数只能是字符串类型

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = create({
  path: "/home/:id/:name",
  component: import("./Home.vue"),
});

const router = createRouter({
  history: createWebHistory(),
  routes: [homeRoute.config, { path: "/demo", component: Demo }],
});
```

- 使用类型安全的路径参数导航到首页路由

```ts
homeRoute.push({ params: { id: "1", name: "home" } });
```

- 从首页路由获取类型安全的路径参数

```ts
homeRoute.getParams(); // { id: "1", name: "home" }
```

#### 定义同时带有查询参数和路径参数的路由

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = create({
  path: "/home/:id/:name",
  component: import("./Home.vue"),
}).withQuery<{ id: string; name: string }>();

const router = createRouter({
  history: createWebHistory(),
  routes: [homeRoute.config, { path: "/demo", component: Demo }],
});
```

- 使用类型安全的查询参数和路径参数导航到首页路由

```ts
homeRoute.push({
  params: { id: "1", name: "home" },
  query: { id: "1", name: "home" },
});
```

- 从首页路由获取类型安全的查询参数和路径参数

```ts
homeRoute.getQuery(); // { id: "1", name: "home" }
homeRoute.getParams(); // { id: "1", name: "home" }
```

## 可扩展性

该库设计为可扩展的。我们没有改变 `vue-router` 的任何行为。

当你使用 `create` 创建路由并访问路由配置时：

```ts
const homeRoute = create({
  path: "/home",
  component: Home,
});
```

homeRoute.config 将是 `{ path: "/home", component: Home }`

因此，你可以使用 `vue-router` 的 API 来扩展路由。

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 使用解构来扩展路由
      ...homeRoute.config,

      // 你可以在这里添加更多配置
      name: "home",
      meta: { requiresAuth: true },
    },

    { path: "/demo", component: Demo },
  ],
});
```

## 许可证

MIT
