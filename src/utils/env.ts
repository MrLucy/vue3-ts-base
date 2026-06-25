import type { App } from 'vue';

/**
 * 环境变量工具类
 * 提供类型安全的环境变量访问
 */
export class Env {
  /**
   * 获取环境变量
   */
  static get(key: string): string | undefined {
    return import.meta.env[key];
  }

  /**
   * 获取字符串类型的环境变量
   */
  static getString(key: string, defaultValue: string): string {
    return (import.meta.env[key] as string) || defaultValue;
  }

  /**
   * 获取布尔类型的环境变量
   */
  static getBoolean(key: string, defaultValue: boolean): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * 获取数值类型的环境变量
   */
  static getNumber(key: string, defaultValue: number): number {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * 当前环境
   */
  static get mode(): string {
    return import.meta.env.MODE;
  }

  /**
   * 是否是开发环境
   */
  static get isDev(): boolean {
    return import.meta.env.DEV;
  }

  /**
   * 是否是生产环境
   */
  static get isProd(): boolean {
    return import.meta.env.PROD;
  }

  /**
   * 应用名称
   */
  static get appName(): string {
    return this.getString('VITE_APP_NAME', 'Vite Vue App');
  }

  /**
   * API 基础地址
   */
  static get apiBaseUrl(): string {
    return this.getString('VITE_API_BASE_URL', '/api');
  }

  /**
   * 应用版本
   */
  static get appVersion(): string {
    return this.getString('VITE_APP_VERSION', '1.0.0');
  }

  /**
   * 是否启用 Mock
   */
  static get useMock(): boolean {
    return this.getBoolean('VITE_USE_MOCK', false);
  }

  /**
   * 是否启用开发工具
   */
  static get enableDevtools(): boolean {
    return this.getBoolean('VITE_ENABLE_DEVTOOLS', false);
  }
}

/**
 * 全局属性注入
 */
export function installEnv(app: App): void {
  app.config.globalProperties.$env = Env;
  app.provide('env', Env);
}

export default Env;
