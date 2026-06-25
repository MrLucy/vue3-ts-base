import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

/**
 * 用户 Store
 * 管理用户登录状态、信息和权限
 * 持久化到 localStorage
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 用户名 */
    const name = ref<string>('');
    /** 登录令牌 */
    const token = ref<string>('');
    /** 用户角色列表 */
    const roles = ref<string[]>([]);
    /** 登录状态 */
    const isLoggedIn = ref<boolean>(false);

    // ============================================================================
    // Getters
    // ============================================================================

    /**
     * 用户显示名称（优先使用 name，否则显示 '访客'）
     */
    const displayName = computed(() => {
      return name.value || '访客';
    });

    /**
     * 是否拥有管理员角色
     */
    const isAdmin = computed(() => {
      return roles.value.includes('admin');
    });

    /**
     * 是否拥有指定角色
     */
    const hasRole = computed(() => {
      return (role: string) => roles.value.includes(role);
    });

    /**
     * 用户角色描述文本
     */
    const rolesText = computed(() => {
      return roles.value.join(', ') || '无角色';
    });

    // ============================================================================
    // Actions
    // ============================================================================

    /**
     * 设置用户信息
     */
    function setUserInfo(userInfo: { name: string; token: string; roles?: string[] }) {
      name.value = userInfo.name;
      token.value = userInfo.token;
      roles.value = userInfo.roles || [];
      isLoggedIn.value = true;
    }

    /**
     * 登录
     */
    function login(userInfo: { name: string; token: string; roles?: string[] }) {
      setUserInfo(userInfo);
    }

    /**
     * 登出
     */
    function logout() {
      name.value = '';
      token.value = '';
      roles.value = [];
      isLoggedIn.value = false;
    }

    /**
     * 更新角色
     */
    function updateRoles(newRoles: string[]) {
      roles.value = newRoles;
    }

    /**
     * 添加角色
     */
    function addRole(role: string) {
      if (!roles.value.includes(role)) {
        roles.value.push(role);
      }
    }

    /**
     * 移除角色
     */
    function removeRole(role: string) {
      const index = roles.value.indexOf(role);
      if (index > -1) {
        roles.value.splice(index, 1);
      }
    }

    return {
      // State
      name,
      token,
      roles,
      isLoggedIn,

      // Getters
      displayName,
      isAdmin,
      hasRole,
      rolesText,

      // Actions
      setUserInfo,
      login,
      logout,
      updateRoles,
      addRole,
      removeRole,
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ['name', 'token', 'roles', 'isLoggedIn'],
    },
  }
);
