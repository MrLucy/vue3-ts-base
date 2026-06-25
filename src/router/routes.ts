import type { RouteRecordRaw } from 'vue-router';

/**
 * 路由表定义
 * 使用动态导入实现路由懒加载
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
        meta: {
          title: '首页',
          requiresAuth: false,
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/AboutView.vue'),
        meta: {
          title: '关于我们',
          requiresAuth: false,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hideNav: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false,
      hideNav: true,
    },
  },
];
