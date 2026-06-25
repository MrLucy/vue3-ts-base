import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

/**
 * 应用 Store
 * 管理应用级状态（主题、侧边栏、语言等）
 * 持久化到 sessionStorage
 */
export const useAppStore = defineStore(
  'app',
  () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 主题模式：light | dark | auto */
    const theme = ref<'light' | 'dark' | 'auto'>('light');
    /** 侧边栏是否折叠 */
    const sidebarCollapsed = ref<boolean>(false);
    /** 当前语言 */
    const language = ref<string>('zh-CN');
    /** 页面加载状态 */
    const isLoading = ref<boolean>(false);
    /** 设备类型：desktop | mobile | tablet */
    const device = ref<'desktop' | 'mobile' | 'tablet'>('desktop');

    // ============================================================================
    // Getters
    // ============================================================================

    /**
     * 当前实际主题（auto 时根据系统偏好判断）
     */
    const currentTheme = computed(() => {
      if (theme.value === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme.value;
    });

    /**
     * 是否暗黑模式
     */
    const isDark = computed(() => currentTheme.value === 'dark');

    /**
     * 是否移动端
     */
    const isMobile = computed(() => device.value === 'mobile');

    /**
     * 侧边栏状态文本
     */
    const sidebarStatusText = computed(() => {
      return sidebarCollapsed.value ? '已折叠' : '已展开';
    });

    /**
     * 语言显示名称
     */
    const languageName = computed(() => {
      const names: Record<string, string> = {
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文',
        'en-US': 'English',
        'ja-JP': '日本語',
      };
      return names[language.value] || language.value;
    });

    // ============================================================================
    // Actions
    // ============================================================================

    /**
     * 切换主题
     */
    function toggleTheme() {
      const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
      const currentIndex = themes.indexOf(theme.value);
      theme.value = themes[(currentIndex + 1) % themes.length];
    }

    /**
     * 设置主题
     */
    function setTheme(newTheme: 'light' | 'dark' | 'auto') {
      theme.value = newTheme;
    }

    /**
     * 切换侧边栏折叠状态
     */
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    }

    /**
     * 设置侧边栏折叠状态
     */
    function setSidebarCollapsed(collapsed: boolean) {
      sidebarCollapsed.value = collapsed;
    }

    /**
     * 设置语言
     */
    function setLanguage(lang: string) {
      language.value = lang;
    }

    /**
     * 设置加载状态
     */
    function setLoading(loading: boolean) {
      isLoading.value = loading;
    }

    /**
     * 设置设备类型
     */
    function setDevice(newDevice: 'desktop' | 'mobile' | 'tablet') {
      device.value = newDevice;
      // 移动端自动折叠侧边栏
      if (newDevice === 'mobile') {
        sidebarCollapsed.value = true;
      }
    }

    /**
     * 监听窗口大小变化
     */
    function initDeviceListener() {
      const checkDevice = () => {
        const width = window.innerWidth;
        if (width < 768) {
          setDevice('mobile');
        } else if (width < 1024) {
          setDevice('tablet');
        } else {
          setDevice('desktop');
        }
      };

      checkDevice();
      window.addEventListener('resize', checkDevice);

      // 返回清理函数
      return () => window.removeEventListener('resize', checkDevice);
    }

    return {
      // State
      theme,
      sidebarCollapsed,
      language,
      isLoading,
      device,

      // Getters
      currentTheme,
      isDark,
      isMobile,
      sidebarStatusText,
      languageName,

      // Actions
      toggleTheme,
      setTheme,
      toggleSidebar,
      setSidebarCollapsed,
      setLanguage,
      setLoading,
      setDevice,
      initDeviceListener,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['theme', 'sidebarCollapsed', 'language'],
    },
  }
);
