<script setup lang="ts">
import { computed } from 'vue';

import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();

const { isLoggedIn, displayName } = storeToRefs(userStore);
const { isDark } = storeToRefs(appStore);

// 是否隐藏导航（登录页、404页等）
const hideNav = computed(() => route.meta.hideNav as boolean);

// 导航菜单项
const navItems = [
  {
    title: '首页',
    path: '/',
    icon: 'home',
  },
  {
    title: '关于',
    path: '/about',
    icon: 'info',
  },
  {
    title: '个人中心',
    path: '/profile',
    icon: 'user',
  },
];

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

// 切换主题
const handleToggleTheme = () => {
  appStore.toggleTheme();
  // 应用主题到 html 元素
  const html = document.documentElement;
  if (appStore.isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

// 获取用户头像缩写
const userInitials = computed(() => {
  const name = displayName.value || '用户';
  return name.charAt(0).toUpperCase();
});
</script>

<template>
  <div v-if="hideNav" class="min-h-svh">
    <router-view />
  </div>

  <SidebarProvider v-else>
    <Sidebar>
      <!-- Sidebar Header -->
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <router-link to="/" class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    />
                  </svg>
                </div>
                <span class="font-semibold">Vite Vue App</span>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <!-- 主导航 -->
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in navItems" :key="item.path">
                <SidebarMenuButton as-child :is-active="route.path === item.path">
                  <router-link :to="item.path" class="flex items-center gap-3">
                    <svg
                      v-if="item.icon === 'home'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <svg
                      v-else-if="item.icon === 'info'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <svg
                      v-else-if="item.icon === 'user'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{{ item.title }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <!-- Sidebar Footer -->
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <!-- 主题切换 -->
            <SidebarMenuButton @click="handleToggleTheme">
              <svg
                v-if="isDark"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator />

        <!-- 用户菜单 -->
        <SidebarMenu>
          <SidebarMenuItem v-if="isLoggedIn">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage src="" :alt="displayName" />
                    <AvatarFallback class="rounded-lg bg-primary text-primary-foreground text-xs">
                      {{ userInitials }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ displayName }}</span>
                    <span class="truncate text-xs text-muted-foreground">在线</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="ml-auto"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage src="" :alt="displayName" />
                      <AvatarFallback class="rounded-lg bg-primary text-primary-foreground text-xs">
                        {{ userInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ displayName }}</span>
                      <span class="truncate text-xs text-muted-foreground">user@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="router.push('/profile')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleToggleTheme">
                  <svg
                    v-if="isDark"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                  {{ isDark ? '切换浅色' : '切换深色' }}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  @click="handleLogout"
                  class="text-destructive focus:text-destructive"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem v-else>
            <SidebarMenuButton as-child>
              <router-link to="/login" class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
                <span>登录</span>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset class="flex flex-col min-h-svh">
      <!-- 顶部栏 -->
      <header class="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="h-6" />
        <div class="flex-1">
          <h1 class="text-sm font-semibold lg:text-base">
            {{ route.meta.title || 'Vite Vue App' }}
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" @click="handleToggleTheme">
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </Button>
        </div>
      </header>

      <!-- 主内容区 -->
      <main class="flex-1 p-4 lg:p-6">
        <router-view v-slot="{ Component, route: routeInstance }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="routeInstance.path" />
          </transition>
        </router-view>
      </main>

      <!-- 页脚 -->
      <footer class="border-t py-4 px-4 lg:px-6">
        <p class="text-center text-sm text-muted-foreground">
          © 2024 Vite Vue App. All rights reserved.
        </p>
      </footer>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
