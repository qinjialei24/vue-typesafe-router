# vue-typesafe-router

[中文文档](./README.zh-CN.md) | [English](./README.md)

The easiest way to define typesafe router in Vue3. Just 2 api to define your routes, and the rest is done for you.
![image](https://raw.githubusercontent.com/qinjialei24/vue-typesafe-router/main/assets/code.png)

## Install

```bash
npm i vue-typesafe-router
or
pnpm i vue-typesafe-router
```

## Usage

### 1. use typesafeRouterPlugin in your app

```ts
import { typesafeRouterPlugin } from "vue-typesafe-router";
import { createApp } from "vue";

createApp(App).use(typesafeRouterPlugin);
```

### 2. Define your routes

```ts
import { typesafeRouterPlugin, createTypesafeRoute } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = createTypesafeRoute<{ id: number; name: string }>({
  path: "/home",
  component: import("./Home.vue"),
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // use homeRoute.config as one of the routes
    homeRoute.config,
    // you can also add normal routes as well
    { path: "/demo", component: Demo },
  ],
});
```

### 3. Use the route navigation and query in your app, it's fully typesafe

```ts
import { homeRoute } from "./your-routes";
// navigate to the home route with a query
homeRoute.push({ id: 1, name: "home" });

//get the query from the home route
homeRoute.getQuery();
```
