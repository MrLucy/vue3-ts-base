import type { App } from 'vue';

import httpClient from './http-client';

import type { ApiResponse, HttpClient, RequestConfig } from './http-client';

/**
 * Vue 插件安装函数
 */
export function installHttpClient(app: App): void {
  app.config.globalProperties.$http = httpClient;
  app.provide('httpClient', httpClient);
}

/**
 * Vue Composition API 中使用 HTTP 客户端
 */
export function useHttpClient(): HttpClient {
  return httpClient;
}

/**
 * 导出类型和实例
 */
export type { ApiResponse, RequestConfig };
export { httpClient, createHttpClient } from './http-client';
export { ApiError } from './http-client';
