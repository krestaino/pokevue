import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from './views/Pokemon.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'pokemon',
      component: Pokemon
    },
    {
      path: '/:pokemon',
      name: 'pokemon',
      component: Pokemon
    }
  ]
})
