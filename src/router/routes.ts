//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: 'Promotion', //菜单文字左侧的图标,支持element-plus全部图标
    },
  },
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    //404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: 'Platform',
    },
  },
]

//异步路由
export const asnycRoute = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          icon: 'Orange',
        },
      },
    ],
  },
  {
    path: '/inv',
    component: () => import('@/layout/index.vue'),
    name: 'Inv',
    meta: {
      title: '存货管理',
      icon: 'Lock',
    },
    redirect: '/inv/invmb',
    children: [
      {
        path: '/inv/invmb',
        component: () => import('@/views/inv/invmb/index.vue'),
        name: 'Invmb',
        meta: {
          title: '品号信息',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/cop',
    component: () => import('@/layout/index.vue'),
    name: 'cop',
    meta: {
      title: '销售管理',
      icon: 'Lock',
    },
    redirect: '/cop/coptc',
    children: [
      {
        path: '/cop/coptc',
        component: () => import('@/views/cop/coptc/index.vue'),
        name: 'coptc',
        meta: {
          title: '订单信息',
          icon: 'User',
        },
      },
      {
        path: '/cop/copth',
        component: () => import('@/views/cop/copth/index.vue'),
        name: 'copth',
        meta: {
          title: '销货信息',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/pur',
    component: () => import('@/layout/index.vue'),
    name: 'pur',
    meta: {
      title: '采购管理',
      icon: 'Lock',
    },
    redirect: '/pur/purma',
    children: [
      {
        path: '/pur/purma',
        component: () => import('@/views/pur/purma/index.vue'),
        name: 'purma',
        meta: {
          title: '供应商信息',
          icon: 'User',
        },
      },
      {
        path: '/pur/purtd',
        component: () => import('@/views/pur/purtd/index.vue'),
        name: 'purtd',
        meta: {
          title: '采购单信息',
          icon: 'User',
        },
      },
      {
        path: '/pur/purth',
        component: () => import('@/views/pur/purth/index.vue'),
        name: 'purth',
        meta: {
          title: '进货单信息',
          icon: 'User',
        },
      },
      {
        path: '/pur/purtb',
        component: () => import('@/views/pur/purtb/index.vue'),
        name: 'purtb',
        meta: {
          title: '请购单信息',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/act',
    component: () => import('@/layout/index.vue'),
    name: 'act',
    meta: {
      title: '财务管理',
      icon: 'Lock',
    },
    redirect: '/act/acttab',
    children: [
      // {
      //   path: '/act/acttab',
      //   component: () => import('@/views/act/acttab/index.vue'),
      //   name: 'acttab',
      //   meta: {
      //     title: '会计凭证',
      //     icon: 'User',
      //   },
      // },
      {
        path: '/acr/acrtb',
        component: () => import('@/views/acr/acrtb/index.vue'),
        name: 'acrtb',
        meta: {
          title: '销售发票',
          icon: 'User',
        },
      },
      // {
      //   path: '/act/acrtkl',
      //   component: () => import('@/views/act/acrtkl/index.vue'),
      //   name: 'acrtkl',
      //   meta: {
      //     title: '收款信息',
      //     icon: 'User',
      //   },
      // },
      {
        path: '/acp/acptb',
        component: () => import('@/views/acp/acptb/index.vue'),
        name: 'acptb',
        meta: {
          title: '采购发票',
          icon: 'User',
        },
      },
      // {
      //   path: '/act/acptkl',
      //   component: () => import('@/views/act/acptkl/index.vue'),
      //   name: 'acptkl',
      //   meta: {
      //     title: '付款信息',
      //     icon: 'User',
      //   },
      // },
    ],
  },
  // {
  //   path: '/moc',
  //   component: () => import('@/layout/index.vue'),
  //   name: 'moc',
  //   meta: {
  //     title: '生产管理',
  //     icon: 'Lock',
  //   },
  //   redirect: '/moc/moctab',
  //   children: [
  //     {
  //       path: '/moc/moctab',
  //       component: () => import('@/views/moc/moctab/index.vue'),
  //       name: 'moctab',
  //       meta: {
  //         title: '工单信息',
  //         icon: 'User',
  //       },
  //     },
  //     {
  //       path: '/moc/moctcd',
  //       component: () => import('@/views/moc/moctcd/index.vue'),
  //       name: 'moctcd',
  //       meta: {
  //         title: '领料信息',
  //         icon: 'User',
  //       },
  //     },
  //     {
  //       path: '/moc/moctfg',
  //       component: () => import('@/views/moc/moctfg/index.vue'),
  //       name: 'moctfg',
  //       meta: {
  //         title: '工单入库信息',
  //         icon: 'User',
  //       },
  //     },
  //     {
  //       path: '/moc/sfcta',
  //       component: () => import('@/views/moc/sfcta/index.vue'),
  //       name: 'sfcta',
  //       meta: {
  //         title: '工单工艺信息',
  //         icon: 'User',
  //       },
  //     },
  //     {
  //       path: '/moc/sfctbc',
  //       component: () => import('@/views/moc/sfctbc/index.vue'),
  //       name: 'sfctbc',
  //       meta: {
  //         title: '工艺转移信息',
  //         icon: 'User',
  //       },
  //     },
  //     {
  //       path: '/moc/bommcd',
  //       component: () => import('@/views/moc/bommcd/index.vue'),
  //       name: 'bommcd',
  //       meta: {
  //         title: 'BOM信息',
  //         icon: 'User',
  //       },
  //     },
  //   ],
  // },
]

//任意路由
export const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: 'DataLine',
  },
}
