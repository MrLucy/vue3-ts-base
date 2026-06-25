<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="avatar">{{ displayName.charAt(0).toUpperCase() }}</div>
      <h1 class="profile-title">个人中心</h1>
      <p class="profile-subtitle">欢迎回来，{{ displayName }}</p>
    </div>

    <div class="profile-content">
      <div class="info-card">
        <h2>账户信息</h2>
        <div class="info-item">
          <span class="label">用户名</span>
          <span class="value">{{ name }}</span>
        </div>
        <div class="info-item">
          <span class="label">角色</span>
          <span class="value">{{ rolesText }}</span>
        </div>
        <div class="info-item">
          <span class="label">是否管理员</span>
          <span class="value">{{ isAdmin ? '是' : '否' }}</span>
        </div>
        <div class="info-item">
          <span class="label">登录时间</span>
          <span class="value">{{ loginTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">当前主题</span>
          <span class="value">{{ appStore.currentTheme }}</span>
        </div>
        <div class="info-item">
          <span class="label">当前语言</span>
          <span class="value">{{ appStore.languageName }}</span>
        </div>
      </div>

      <div class="info-card">
        <h2>操作</h2>
        <div class="actions">
          <button class="btn-action" @click="handleRefresh">刷新数据</button>
          <button class="btn-action btn-secondary" @click="handleToggleTheme">切换主题</button>
          <button class="btn-action btn-secondary" @click="handleAddAdminRole">
            添加管理员角色
          </button>
          <router-link to="/" class="btn-action btn-secondary">返回首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { storeToRefs } from 'pinia';

import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const appStore = useAppStore();

// 使用 storeToRefs 保持响应性
const { name, displayName, rolesText, isAdmin } = storeToRefs(userStore);

const loginTime = ref(new Date().toLocaleString('zh-CN'));

const handleRefresh = () => {
  loginTime.value = new Date().toLocaleString('zh-CN');
};

const handleToggleTheme = () => {
  appStore.toggleTheme();
};

const handleAddAdminRole = () => {
  userStore.addRole('admin');
};
</script>

<style scoped lang="less">
.profile-view {
  padding: 48px 24px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  background: #42b883;
  border-radius: 50%;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.profile-subtitle {
  color: #6b7280;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #6b7280;
  }

  .value {
    color: #1f2937;
    font-weight: 500;
  }
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-action {
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: #42b883;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #369870;
  }

  &.btn-secondary {
    color: #374151;
    background: #f3f4f6;

    &:hover {
      background: #e5e7eb;
    }
  }
}
</style>
