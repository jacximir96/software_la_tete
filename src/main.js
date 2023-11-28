import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './assets/css/tailwind.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueCookies from 'vue-cookies';
/* import { BootstrapVue, IconsPlugin } from 'bootstrap-vue' */

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.use(VueCookies);
/* Vue.use(BootstrapVue);
Vue.use(IconsPlugin); */

/* import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css' */

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
