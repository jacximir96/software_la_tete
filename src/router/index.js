import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Mesas from '../components/Mesas.vue'
import Cocina from '../components/Cocina.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/mesas',
    name: 'mesas',
    component: Mesas
  },
  {
    path: '/cocina',
    name: 'cocina',
    component: Cocina
  }
]

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes
})

export default router
