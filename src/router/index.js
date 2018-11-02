import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  // 系统管理
  {
    path: '/system',
    component: Layout,
    // redirect: '/example/table',
    name: 'system',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'admin_manage',
        name: 'admin_manage',
        component: () => import('@/views/AdminManage'),
        meta: { title: '账号管理', icon: 'table' }
      },
      {
        path: 'role_manage',
        name: 'role_manage',
        component: () => import('@/views/RoleManage'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('@/views/tree/index'),
        meta: { title: '权限管理', icon: 'tree' }
      }
    ]
  },
  // 公众号管理
  {
    path: '/public',
    name: 'public',
    component: Layout,
    hidden:false,
    meta: { title: '公众号管理', icon: 'example' },
    children: [
      {
        path: 'wechat_public_manage',
        name: 'wechat_public_manage',
        component: () => import('@/views/WechatPublicManage'),
        meta: { title: '公众号管理', icon: 'form' }
      },
    ]
  },
  // 数据概况
  {
    path: '/data',
    name: 'data',
    component: Layout,
    hidden:false,
    meta: { title: '数据概况', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'dataIndex',
        component: () => import('@/views/form/index'),
        meta: { title: '数据概况', icon: 'form' }
      },
    ]
  },
  // 粉丝管理
  {
    path: '/fans',
    name: 'fans',
    component: Layout,
    hidden:false,
    meta: { title: '粉丝管理', icon: 'example' },
    children: [
      {
        path: 'fansSummary',
        name: 'fansSummary',
        component: () => import('@/views/form/index'),
        meta: { title: '粉丝汇总', icon: 'form' }
      },
      {
        path: 'user_manage',
        name: 'user_manage',
        component: () => import('@/views/UserManage'),
        meta: { title: '粉丝明细', icon: 'form' }
      },
    ]
  },
  // 订单管理
  {
    path: '/order',
    name: 'order',
    component: Layout,
    hidden:false,
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'orderSummary',
        name: 'orderSummary',
        component: () => import('@/views/form/index'),
        meta: { title: '订单汇总', icon: 'form' }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/form/index'),
        meta: { title: '订单明细', icon: 'form' }
      },
    ]
  },
  // 小说管理
  {
    path: '/novel',
    name: 'novel',
    component: Layout,
    hidden:false,
    meta: { title: '小说管理', icon: 'example' },
    children: [
      {
        path: 'novel_manage',
        name: 'novel_manage',
        component: () => import('@/views/NovelManage'),
        meta: { title: '小说库', icon: 'form' }
      },
      {
        path: 'novel_type_manage',
        name: 'novel_type_manage',
        component: () => import('@/views/NovelTypeManage'),
        meta: { title: '小说分类', icon: 'form' }
      },
    ]
  },
  // 推广管理
  {
    path: '/toPromote',
    name: 'toPromote',
    component: Layout,
    hidden:false,
    meta: { title: '推广管理', icon: 'example' },
    children: [
      {
        path: 'extrapolation',
        name: 'extrapolation',
        component: () => import('@/views/form/index'),
        meta: { title: '外推管理', icon: 'form' }
      },
      {
        path: 'push',
        name: 'push',
        component: () => import('@/views/form/index'),
        meta: { title: '内推管理', icon: 'form' }
      },
      {
        path: 'smart_push',
        name: 'smart_push',
        component: () => import('@/views/form/index'),
        meta: { title: '智能推送', icon: 'form' }
      },
      {
        path: 'keyword',
        name: 'keyword',
        component: () => import('@/views/form/index'),
        meta: { title: '关键字回复', icon: 'form' }
      },
      {
        path: 'promotion',
        name: 'promotion',
        component: () => import('@/views/form/index'),
        meta: { title: '促销活动', icon: 'form' }
      },
      {
        path: 'template',
        name: 'template',
        component: () => import('@/views/form/index'),
        meta: { title: '模板信息', icon: 'form' }
      },
      {
        path: 'customer_service_info',
        name: 'customer_service_info',
        component: () => import('@/views/form/index'),
        meta: { title: '客服信息', icon: 'form' }
      },
      {
        path: 'promote_income',
        name: 'promote_income',
        component: () => import('@/views/form/index'),
        meta: { title: '推广收入', icon: 'form' }
      },
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
