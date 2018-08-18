import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Pokemon from './views/Pokemon.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:pokemon',
      name: 'pokemon',
      component: Pokemon
    }
  ]
})
