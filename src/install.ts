import {App} from "vue"

export const vueRouterKey = Symbol('vueRouterKey');

export const typeRouterPlugin = {
    install(app: App) {
        //@ts-ignore
        window[vueRouterKey] = app.config.globalProperties.$router;
    }
};