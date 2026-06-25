<template>
  <div class="default-layout">
    <header class="header" v-if="!hideNav">
      <nav class="nav">
        <router-link to="/" class="logo">Vite Vue App</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
          <router-link to="/profile" class="nav-link">个人中心</router-link>
        </div>
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <span class="username">{{ displayName }}</span>
            <button class="btn-theme" @click="handleToggleTheme">
              {{ isDark ? '☀️' : '🌙' }}
            </button>
            <button class="btn-logout" @click="handleLogout">退出</button>
          </template>
          <router-link v-else to="/login" class="btn-login">登录</router-link>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <footer class="footer" v-if="!hideNav">
      <p>&copy; 2024 Vite Vue App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();

// 使用 storeToRefs 保持响应性
const { isLoggedIn, displayName } = storeToRefs(userStore);
const { isDark } = storeToRefs(appStore);

// 是否隐藏导航（登录页、404页等）
const hideNav = computed(() => route.meta.hideNav as boolean);

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

// 切换主题
const handleToggleTheme = () => {
  appStore.toggleTheme();
};
</script>

<style scoped lang="less">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #42b883;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #42b883;
  }

  &.router-link-active {
    color: #42b883;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: #6b7280;
  font-size: 0.875rem;
}

.btn-login,
.btn-logout,
.btn-theme {
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-theme {
  background: transparent;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f3f4f6;
  }
}

.btn-login {
  color: #fff;
  background: #42b883;
  text-decoration: none;
  border: none;

  &:hover {
    background: #369870;
  }
}

.btn-logout {
  color: #ef4444;
  background: transparent;
  border: 1px solid #ef4444;

  &:hover {
    color: #fff;
    background: #ef4444;
  }
}

.main-content {
  flex: 1;
}

.footer {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  border-top: 1px solid #e5e7eb;
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
