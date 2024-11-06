# vue-typesafe-router

[中文文档](./README.zh-CN.md) | [English](./README.md)

The easiest way to define a typesafe route in Vue.js 3.x, you can pass and get route data with typesafe.

The React.js version is also available here (https://github.com/qinjialei24/react-typesafe-router).

## Install

```bash
npm i vue-typesafe-router
# or
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

#### Define route with query

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = create({
  path: "/home",
  component: import("./Home.vue"),
}).defineQuery<{ id: string; name: string }>();

const router = createRouter({
  history: createWebHistory(),
  routes: [homeRoute.config, { path: "/demo", component: Demo }],
});
```

Now, you can enjoy the typesafe router

- Navigate to home route with a typesafe query

```ts
homeRoute.push({ query: { id: "1", name: "home" } });
```

- Get the typesafe query from the home route

```ts
homeRoute.getQuery();
```

#### Define route with params

Note: we will use the string that starts with `:` as params in the path, and generate the typesafe params object automatically.

In this example, we will generate the typesafe params object `{ id: string; name: string }` automatically.

> All the params can only be string type

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

- Navigate to home route with a typesafe params

```ts
homeRoute.push({ params: { id: "1", name: "home" } });
```

- Get the typesafe params from the home route

```ts
homeRoute.getParams(); // { id: "1", name: "home" }
```

#### Define route with both query and params

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

export const homeRoute = create({
  path: "/home/:id/:name",
  component: import("./Home.vue"),
}).defineQuery<{ id: string; name: string }>();

const router = createRouter({
  history: createWebHistory(),
  routes: [homeRoute.config, { path: "/demo", component: Demo }],
});
```

- Navigate to home route with a typesafe query and params

```ts
homeRoute.push({
  params: { id: "1", name: "home" },
  query: { id: "1", name: "home" },
});
```

- Get the typesafe query and params from the home route

```ts
homeRoute.getQuery(); // { id: "1", name: "home" }
homeRoute.getParams(); // { id: "1", name: "home" }
```

## Extensibility

The library is designed to be extensible. we have't change any behavior of `vue-router`.

When you use `create` to create a route and access the route config .

```ts
const homeRoute = create({
  path: "/home",
  component: Home,
});
```

homeRoute.config will be `{ path: "/home", component: Home }`

So you can use the `vue-router`'s api to extend the route.

```ts
import { create } from "vue-typesafe-router";
import { createRouter, createWebHistory } from "vue-router";

createRouter({
  history: createWebHistory(),
  routes: [
    {
      // use destructuring to extend the route
      ...homeRoute.config,

      // you can add more config here
      name: "home",
      meta: { requiresAuth: true },
    },

    { path: "/demo", component: Demo },
  ],
});
```

## License

MIT
