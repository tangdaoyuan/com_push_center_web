import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import main from '@/pages/main'
import home from '@/pages/main/home'
import dm from '@/pages/main/data_manage'
import adm from '@/pages/main/data_manage/add_data_manage'
import wt from '@/pages/main/work_table'
import nm from '@/pages/main/notify_manage'
import nw from '@/pages/main/notify_watch'
import tc from '@/pages/main/task_config'
import dictionary from '@/pages/main/dictionary_manage'
import root from '@/pages/main/root_manage'
import role from '@/pages/main/role_manage'
import rt from '@/pages/main/root_dic'
const tm = () => import('@/pages/main/title_manage')
const lm = () => import('@/pages/main/title_manage/logo_manage')
const titlem = () => import('@/pages/main/title_manage/title_manage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: '/home',
          name: 'home',
          component: home
        },
        {
          path: '/dm',
          name: 'dm',
          component: dm
        },
        {
          path: '/dm/adm',
          name: 'adm',
          component: adm
        },
        {
          path: '/wt',
          name: 'wt',
          component: wt
        },
        {
          path: '/nm',
          name: 'nm',
          component: nm
        },
        {
          path: '/nw',
          name: 'nw',
          component: nw
        },
        {
          path: '/tc',
          name: 'tc',
          component: tc
        },
        {
          path: '/system',
          name: 'dictionary',
          component: dictionary
        },
        {
          path: '/root',
          name: 'root',
          component: root
        },
        {
          path: '/role',
          name: 'role',
          component: role
        },
        {
          path: '/rt',
          name: 'rt',
          component: rt
        },
        {
          path: '/tm',
          name: 'tm',
          component: tm,
          children: [
            {
              path: '/tm/lm',
              name: 'lm',
              component: lm
            },
            {
              path: '/tm/titlem',
              name: 'titlem',
              component: titlem
            }
          ]
        }
      ]
    }
  ]
})
