import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";
import store from "./store";
import "@/plugins/axios";
import "@/access";
import "bytemd/dist/index.css";
import "highlight.js/styles/darcula.css";
import "katex/dist/katex.css";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
createApp(App)
  .use(ArcoVue)
  .use(store)
  .use(ArcoVueIcon)
  .use(router)
  .mount("#app");
