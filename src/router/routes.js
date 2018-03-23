import Home from '@pages/Home.vue'
import Error404 from '@pages/Error404.vue'

export default [
  { path: '/', component: Home, },

  { // Always leave this as last one
    path: '*', component: Error404
  }
]
