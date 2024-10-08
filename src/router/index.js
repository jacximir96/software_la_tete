import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Mesas from '../components/Mesas.vue'
import Cocina from '../components/Cocina.vue'
import Administracion from '../components/Administracion.vue'
import Login from '../components/Login.vue'
import Gastos from '../components/Gastos.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
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
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: Administracion
  },
  {
    path: '/gastos',
    name: 'gastos',
    component: Gastos
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/backoffice',
    name: 'backoffice',
    beforeEnter() {
      window.open("http://161.22.40.50/software_la_tete_administrador/public", "_blank");
    }
  }
]

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes
})

export default router
