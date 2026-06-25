<script setup lang="ts">
import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';

  if (!username.value.trim() || !password.value.trim()) {
    error.value = '请输入用户名和密码';
    return;
  }

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

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <!-- Logo / Brand -->
      <div class="flex flex-col items-center gap-2 mb-8">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-shield"
          >
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            />
          </svg>
        </div>
        <span class="text-xl font-semibold">Vite Vue App</span>
      </div>

      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl">欢迎回来</CardTitle>
          <CardDescription>请输入您的账号信息以登录系统</CardDescription>
        </CardHeader>

        <CardContent>
          <form class="grid gap-4" @submit.prevent="handleLogin">
            <!-- 错误提示 -->
            <div
              v-if="error"
              class="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {{ error }}
            </div>

            <div class="grid gap-2">
              <Label for="username">用户名</Label>
              <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                required
                :disabled="isLoading"
                autocomplete="username"
              />
            </div>

            <div class="grid gap-2">
              <div class="flex items-center justify-between">
                <Label for="password">密码</Label>
                <a href="#" class="text-sm text-muted-foreground hover:text-primary">
                  忘记密码？
                </a>
              </div>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="请输入密码"
                required
                :disabled="isLoading"
                autocomplete="current-password"
              />
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading">
              <svg
                v-if="isLoading"
                class="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ isLoading ? '登录中...' : '登录' }}
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          <div class="relative w-full">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-card px-2 text-muted-foreground">或者</span>
            </div>
          </div>

          <Button variant="outline" class="w-full" :disabled="isLoading">
            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            使用 Google 登录
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            还没有账号？
            <a href="#" class="text-primary hover:underline">立即注册</a>
          </p>
        </CardFooter>
      </Card>

      <!-- 返回首页 -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← 返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>
