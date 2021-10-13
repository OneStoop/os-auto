import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: loadView('Home')},
    { path: '/inventory', name: 'inventory', component: loadView('Inventory'), meta: { requiresAuth: true } },
    { path: '/inventory/edit', name: 'inventoryEdit', component: loadView('InventoryEdit'), meta: { requiresAuth: true } },
    { path: '/log', name: 'log', component: loadView('Log'), meta: { requiresAuth: true } },
    { path: '/reports', name: 'reports', component: loadView('Reports'), meta: { requiresAuth: true } },
    { path: '/settings', name: 'settings', component: loadView('Settings'), meta: { requiresAuth: true } },
    { path: '/fueling', name: 'fueling', component: loadView('Fueling'), meta: { requiresAuth: true } },
    { path: '/profile/:id', component: loadView('Profile') },
    { path: '/signin', component: loadView('Signin'), meta: { requiresNoAuth: true } },
    { path: '/signup', component: loadView('Signup'), meta: { requiresNoAuth: true } },
    { path: '/signout', component: loadView('Signout'), meta: { requiresAuth: true } }
  ]
})

Vue.use(VueRouter)

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/signin')
  } else {
    next()
  }
})
export default router
