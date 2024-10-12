import { typesafeRouterPlugin, create } from "vue-typesafe-router";

import { createApp } from "vue";
import App from "./App.vue";
import AboutView from "./views/AboutView.vue";
import { createRouter, createWebHistory } from "vue-router";
import Demo from "./views/Demo.vue";
import UserProfile from "./views/UserProfile.vue";
import UserDetail from "./views/UserDetail.vue";
import User from "./views/User.vue";

export const homeRoute = create({
  path: "/home",
  component: import("./views/HomeView.vue"),
}).defineQuery<{ id: number; name: string }>();

export const aboutRoute = create({
  path: "/about",
  component: AboutView,
}).defineQuery<{ id: number; name: string }>();

export const userProfileRoute = create({
  path: "/user/:name/profile",
  component: UserProfile,
}).defineQuery<{ id: number; name: string }>();

export const userRoute = create({
  path: "/user/:name",
  component: User,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/demo", component: Demo },
    {
      ...userRoute.config,
      children: [
        userProfileRoute.config,
        {
          path: "detail",
          name: "user-detail",
          component: UserDetail,
        },
      ],
    },
    {
      ...homeRoute.config,
    },
    aboutRoute.config,
  ],
});
const app = createApp(App);
app.use(router).use(typesafeRouterPlugin);
app.mount("#app");
