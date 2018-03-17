import Home from '@pages/Home.vue'

export default [
  { path: '/', component: Home, },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/Error404')
  }
]
