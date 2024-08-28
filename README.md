# vue-type-router
The easiest way to define type safe router in Vue.
## Usage
### Use the plugin in your `main.ts`
```ts
import {typeRouterPlugin} from "vue-type-router";

createApp(App).use(typeRouterPlugin).mount('#app');
```

### Define your type safe router
For example, we want to define a `home` router with query data.

```ts
type HomeQuery = {
    id: number;
    name?: string;
};
```

```ts
// router.ts
import {createTypeRouter} from "vue-type-router";

import Detail from './Detail.vue';
import Home from "./Home.vue";

type HomeQuery = {
    id: number;
    name?: string;
};

export const typeRouterHome = createTypeRouter<HomeQuery>({
    path: '/home',
    component: Home,
});

const routes = [
    {
        path: '/',
        component: Home,
    },
    typeRouterHome.route,
    {path: '/detail', component: Detail},
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
```
### Pass router query data with full type safe
```vue
<!--Detail.vue-->

<template>
  <h1>Hello detail!</h1>
  <button @click="goHome">Go Home</button>
</template>

<script setup lang="ts">
import {typeRouterHome} from "./router.ts";
const goHome = () => {
  typeRouterHome.push({
    id: 1,
    name: 'John'
  });
};
</script>
```
Now, You can pass query data with full type safe!

![img_1.png](img_1.png)

### Get router query data with full type safe
```vue
<!--Home.vue-->
<template>
  <h1>Hello home! {{ query }}</h1>
</template>

<script setup lang="ts">
import {typeRouterHome} from "./router.ts";
const query = typeRouterHome.getQuery();
</script>
```
Now, You can get query data with full type safe!

![img.png](img.png)