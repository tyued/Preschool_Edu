import Vue from 'vue'
import Router from 'vue-router'

import readList from '@/components/read-list'
import readDetail from '@/components/read-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'readList',
      component: readList
    },
    // {
    //   path: '/readList',
    //   name: 'readList',
    //   component: readList
    // },
    {
      path: '/readDetail',
      name: 'readDetail',
      component: readDetail
    },
  ]
})
