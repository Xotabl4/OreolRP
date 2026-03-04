import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Wiki from '../views/Wiki.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: Wiki
  },
  {
    // Catch-all route to handle potential article links in the future
    path: '/wiki/:category?/:article?',
    name: 'WikiArticle',
    component: Wiki
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // This helps when navigating back to home page with anchor links (#about)
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
