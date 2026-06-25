<template>
  <div class="login-view">
    <div class="login-card">
      <h1 class="login-title">用户登录</h1>
      <p class="login-subtitle">请登录以访问个人中心</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input id="username" v-model="username" type="text" placeholder="请输入用户名" required />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-tips">
        <p>提示：输入任意用户名和密码即可模拟登录</p>
        <router-link to="/" class="link-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;

  // 模拟登录请求
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 使用 Pinia store 保存登录状态
  userStore.login({
    name: username.value || '用户',
    token: 'mock-token-123',
    roles: ['user'],
  });

  isLoading.value = false;

  // 登录成功后重定向到原页面或首页
  const redirect = route.query.redirect as string;
  router.push(redirect || '/');
};
</script>

<style scoped lang="less">
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: #f9fafb;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 10px 14px;
    font-size: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #42b883;
    }
  }
}

.btn-submit {
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: #42b883;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #369870;
  }
}

.login-tips {
  margin-top: 24px;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: #9ca3af;
    margin-bottom: 12px;
  }
}

.link-home {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>
