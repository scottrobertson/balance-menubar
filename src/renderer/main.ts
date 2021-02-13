import Vue from "vue";
import VueMoment from "vue-moment";
import VueElectron from "vue-electron";

import App from "./App.vue";

import router from "./router";

import store from "./store";

import VueClipboard from "vue-clipboard2";

if (!process.env.IS_WEB) {
  Vue.use(VueElectron);
}

Vue.config.productionTip = false;

Vue.use(VueMoment);

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);

require("./stylesheets/application.css");

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
