/*
 * @Description: 路由配置
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 垃圾信息关系
  {
    path: '/garbage',
    component: Layout,
    redirect: '/garbage/index',
    name: 'Garbage',
    meta: { title: '垃圾信息管理', icon: 'example' },
    children: [
      {
        path: 'category',
        name: 'GarbageCategory',
        component: () => import('@/views/garbage/category.vue'),
        meta: { title: '分类信息', icon: 'form' }
      },
      {
        path: 'index',
        name: 'GarbageIndex',
        component: () => import('@/views/garbage/index'),
        meta: { title: '垃圾信息', icon: 'example' }
      }
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: '/config/pinlei',
    name: 'config',
    meta: {
      title: '系统配置',
      icon: 'form'
    },
    children: [
       // 品类配置管理
      {
        path: 'pinlei',
        name: 'PinleiConfig',
        component: () => import('@/views/pinleiConfig/index'),
        meta: { title: '品类配置', icon: 'form' }
      },
      // 菜谱管理
      {
        path: 'shipu',
        name: 'ShipuConfig',
        component: () => import('@/views/systemConfig/index'),
        meta: { title: '食谱参数配置', icon: 'form' }
      }
      // 模块配置
      // {
      //   path: 'model',
      //   name: 'ModelConfig',
      //   component: () => import('@/views/config/model'),
      //   meta: { title: '模块配置', icon: 'form' }
      //   meta: { title: '模块配置', icon: 'form' }
      // },
      // // 页面配置
      // {
      //   path: 'page',
      //   name: 'PageConfig',
      //   component: () => import('@/views/config/page'),
      //   meta: { title: '页面配置', icon: 'form' }
      // }
    ]
  },
  // 食材管理
    {
    path: '/foodmanager',
    component: Layout,
    redirect: '/foodmanager/list',
    name: 'foodmanager',
    meta: {
      title: '食材管理',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/foodManager/create'),
        name: 'CreateFood',
        meta: { title: '新建食材', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/foodManager/edit'),
        name: 'EditArticle',
        meta: { title: '编辑食材', noCache: true, activeMenu: '/foodManager/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/foodManager/list'),
        name: 'ArticleList',
        meta: { title: '食材列表', icon: 'list' }
      }
    ]
  },

  // 食谱管理
  {
    path: '/recipesManager',
    component: Layout,
    redirect: '/recipesManager/list',
    name: 'recipesManager',
    meta: {
      title: '食谱管理',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/recipesManager/create'),
        name: 'CreateRecipe',
        meta: { title: '新建食谱', icon: 'edit' },
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/recipesManager/edit'),
        name: 'EditRecipe',
        meta: { title: '编辑食谱', noCache: true, activeMenu: '/recipesManager/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/recipesManager/list'),
        name: 'RecipeList',
        meta: { title: '食谱列表', icon: 'list' }
      }
    ]
  },
  // 食材管理
  {
    path: '/tagmanager',
    component: Layout,
    redirect: '/tagmanager/list',
    name: 'tagmanager',
    meta: {
      title: '标签管理',
      icon: 'example'
    },
    children: [
      {
        path: 'season',
        component: () => import('@/views/tagManager/season'),
        name: 'Season',
        meta: { title: '时令', icon: 'example' }
      },
      {
        path: 'festival',
        component: () => import('@/views/tagManager/festival'),
        name: 'Festival',
        meta: { title: '节日', icon: 'example' }
      },
      {
        path: 'crowd',
        component: () => import('@/views/tagManager/crowd'),
        name: 'Crowd',
        meta: { title: '人群', icon: 'example' }
      },
      {
        path: 'lifestage',
        component: () => import('@/views/tagManager/lifeStage'),
        name: 'LifeStage',
        meta: { title: '生理阶段', icon: 'example' }
      },
      {
        path: 'effect',
        component: () => import('@/views/tagManager/effect'),
        name: 'Effect',
        meta: { title: '功效', icon: 'example' }
      },
      {
        path: 'disease',
        component: () => import('@/views/tagManager/disease'),
        name: 'Disease',
        meta: { title: '疾病', icon: 'example' }
      },
      {
        path: 'foodtype',
        component: () => import('@/views/tagManager/foodType'),
        name: 'Foodtype',
        meta: { title: '食材分类', icon: 'example' }
      },
      {
        path: 'recipestype',
        component: () => import('@/views/tagManager/recipesType'),
        name: 'RecipesType',
        meta: { title: '食谱分类', icon: 'example' }
      },
      {
        path: 'taste',
        component: () => import('@/views/tagManager/taste'),
        name: 'Taste',
        meta: { title: '口味', icon: 'example' }
      },
      {
        path: 'caixi',
        component: () => import('@/views/tagManager/caixi'),
        name: 'Caixi',
        meta: { title: '菜系', icon: 'example' }
      },
      {
        path: 'caishi',
        component: () => import('@/views/tagManager/caishi'),
        name: 'Caishi',
        meta: { title: '菜式', icon: 'example' }
      },
      {
        path: 'shebeiPinlei',
        component: () => import('@/views/tagManager/shebeiPinlei'),
        name: 'ShebeiPinlei',
        meta: { title: '设备品类', icon: 'example' }
      },
      {
        path: 'pengrenFangshi',
        component: () => import('@/views/tagManager/pengrenFangshi'),
        name: 'PengrenFangshi',
        meta: { title: '烹饪方式', icon: 'example' }
      },
      {
        path: 'zhiye',
        component: () => import('@/views/tagManager/zhiye'),
        name: 'Zhiye',
        meta: { title: '职业', icon: 'example' }
      }
    ]
  },
  // 运营管理
  {
    path: '/yunying',
    component: Layout,
    redirect: '/yunying/feedback',
    name: 'yunying',
    meta: { title: '运营管理', icon: 'example' },
    children: [
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/yunying/feedback'),
        meta: { title: '用户反馈', icon: 'form' }
      }
      // {
      //   path: 'holiday',
      //   component: () => import('@/views/care/holiday'),
      //   name: 'Holiday',
      //   meta: { title: '节日配置', icon: 'example' },
      //   hidden: true
      // },
      // {
      //   path: 'care',
      //   component: () => import('@/views/care/index'),
      //   name: 'Care',
      //   meta: { title: '关怀管理', icon: 'example' }
      // },
      // {
      //   path: 'careAdd',
      //   component: () => import('@/views/care/add'),
      //   name: 'CareAdd',
      //   meta: { title: '关怀管理添加', icon: 'example' },
      //   hidden: true
      // },
      // {
      //   path: 'careUpdate',
      //   component: () => import('@/views/care/edit'),
      //   name: 'careUpdate',
      //   meta: { title: '关怀管理编辑', icon: 'example' },
      //   hidden: true
      // }
    ]
  },

  // 大屏统计
  // {
  //   path: '/statistics',
  //   component: Layout,
  //   redirect: '/statistics/foodincome',
  //   name: 'statistics',
  //   meta: { title: '大屏统计', icon: 'example' },
  //   children: [
  //     {
  //       path: 'foodincome',
  //       name: 'foodincome',
  //       component: () => import('@/views/statistics/foodincome'),
  //       meta: { title: '食材收入统计', icon: 'form' }
  //     },
  //     {
  //       path: 'foodorder',
  //       name: 'foodorder',
  //       component: () => import('@/views/statistics/foodorder'),
  //       meta: { title: '食材订单统计', icon: 'example' }
  //     }
  //   ]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

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

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
