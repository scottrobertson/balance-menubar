import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Index from "../pages/index.vue";
import Connections from "../pages/connections.vue";
import TrueLayer from "../pages/truelayer.vue";

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
    },
    {
      path: "/connections",
      name: "connections",
      component: Connections,
    },
    {
      path: "/truelayer",
      name: "truelayer",
      component: TrueLayer,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
