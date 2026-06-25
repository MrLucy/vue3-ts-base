import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/stores/user';

import { routes } from './routes';

/**
 * 创建 Vue Router 实例
 * 使用 History 模式
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为配置
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  },
});

// ============================================================================
// 全局前置守卫 - 权限验证 & 页面标题设置
// ============================================================================

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  const title = to.meta.title as string | undefined;
  if (title) {
    document.title = `${title} - Vite Vue App`;
  } else {
    document.title = 'Vite Vue App';
  }

  // 权限验证 - 使用 Pinia store
  const requiresAuth = to.meta.requiresAuth as boolean | undefined;
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn;

  if (requiresAuth && !isAuthenticated) {
    // 未登录且需要认证，重定向到登录页
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' });
    return;
  }

  next();
});

// ============================================================================
// 全局后置钩子 - 日志记录
// ============================================================================

router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`[Router] ${from.path} -> ${to.path}`);
  }
});

// ============================================================================
// 全局错误处理
// ============================================================================

router.onError((error) => {
  console.error('[Router] Navigation error:', error);
});

export default router;
