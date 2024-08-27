import {Component, DefineComponent} from "vue";
import {LocationQueryRaw, RouteRecordRaw, useRoute} from "vue-router";
import {vueRouterKey} from "./install.ts";

type TypeRouterConfig = {
    path: string;
    component: Component | DefineComponent;
};

type TypeRouter<Query extends LocationQueryRaw> = {
    router: RouteRecordRaw;
    push: (query: Query) => void;
    getQuery: () => Query;
};

//todo 检查path 是否重复，通过闭包来实现
// 支持 name 和 params
export function createTypeRouter<T extends LocationQueryRaw>(routerConfig: TypeRouterConfig): TypeRouter<T> {
    return {
        router: routerConfig,
        getQuery: () => {
            const route = useRoute();
            return route.query as T;
        },
        push: (query: T) => {
            const vueRouter = window[vueRouterKey as any] as any;
            vueRouter.push({
                path: routerConfig.path,
                query
            });
        }
    };
}


