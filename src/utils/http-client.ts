import axios from 'axios';

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
  InternalAxiosRequestConfig,
} from 'axios';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * API 响应数据标准格式
 * @template T 响应数据的类型
 */
export interface ApiResponse<T = unknown> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
  /** 请求时间戳 */
  timestamp?: number;
}

/**
 * 自定义请求配置，继承 AxiosRequestConfig 并扩展自定义配置项
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示加载状态 */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 请求重试次数 */
  retryCount?: number;
  /** 请求重试延迟（毫秒） */
  retryDelay?: number;
  /** 请求唯一标识，用于防抖/节流 */
  requestId?: string;
  /** 是否启用防抖 */
  debounce?: boolean;
  /** 防抖等待时间（毫秒） */
  debounceWait?: number;
  /** 是否启用节流 */
  throttle?: boolean;
  /** 节流等待时间（毫秒） */
  throttleWait?: number;
}

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptor = (
  response: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse>;

/**
 * 错误拦截器函数类型
 */
export type ErrorInterceptor = (error: AxiosError) => Promise<AxiosError>;

// ============================================================================
// 自定义错误类
// ============================================================================

/**
 * API 错误类，统一封装各类请求错误
 */
export class ApiError extends Error {
  /** HTTP 状态码 */
  status?: number;
  /** 业务错误码 */
  code?: number;
  /** 原始错误对象 */
  originalError?: AxiosError;
  /** 请求配置 */
  config?: RequestConfig;
  /** 是否是取消请求 */
  isCanceled: boolean;
  /** 是否是超时错误 */
  isTimeout: boolean;
  /** 是否是网络错误 */
  isNetworkError: boolean;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: number;
      originalError?: AxiosError;
      config?: RequestConfig;
      isCanceled?: boolean;
      isTimeout?: boolean;
      isNetworkError?: boolean;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.originalError = options.originalError;
    this.config = options.config;
    this.isCanceled = options.isCanceled ?? false;
    this.isTimeout = options.isTimeout ?? false;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

// ============================================================================
// 日志工具
// ============================================================================

/**
 * 日志级别
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 日志工具类，仅在开发环境输出
 */
class Logger {
  private static isDev = import.meta.env.DEV;

  static log(level: LogLevel, message: string, ...args: unknown[]) {
    if (!this.isDev) return;

    const timestamp = new Date().toISOString();
    const prefix = `[HttpClient][${level.toUpperCase()}][${timestamp}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  static debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }

  static info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
  }

  static warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  static error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }
}

// ============================================================================
// 防抖/节流工具
// ============================================================================

/**
 * 防抖/节流管理器
 */
class RequestThrottleManager {
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private throttleTimers = new Map<string, boolean>();
  private pendingRequests = new Map<string, Canceler>();

  /**
   * 执行防抖
   */
  debounce<T>(
    requestId: string,
    wait: number,
    execute: () => Promise<T>,
    cancel: Canceler
  ): Promise<T> {
    // 清除之前的定时器
    const existingTimer = this.debounceTimers.get(requestId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      // 取消之前的请求
      const existingCancel = this.pendingRequests.get(requestId);
      if (existingCancel) {
        existingCancel('Debounced');
      }
    }

    // 保存新的取消函数
    this.pendingRequests.set(requestId, cancel);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.debounceTimers.delete(requestId);
        this.pendingRequests.delete(requestId);
        execute().then(resolve).catch(reject);
      }, wait);

      this.debounceTimers.set(requestId, timer);
    });
  }

  /**
   * 执行节流
   */
  throttle<T>(
    requestId: string,
    wait: number,
    execute: () => Promise<T>,
    cancel: Canceler
  ): Promise<T> {
    // 如果正在节流中，取消当前请求
    if (this.throttleTimers.get(requestId)) {
      cancel('Throttled');
      return Promise.reject(new ApiError('Request throttled', { isCanceled: true }));
    }

    // 设置节流标记
    this.throttleTimers.set(requestId, true);

    setTimeout(() => {
      this.throttleTimers.delete(requestId);
    }, wait);

    return execute();
  }

  /**
   * 清理所有定时器
   */
  clear() {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    this.throttleTimers.clear();
    this.pendingRequests.clear();
  }
}

// ============================================================================
// HttpClient 主类
// ============================================================================

/**
 * HTTP 客户端类，封装 Axios 提供增强功能
 */
export class HttpClient {
  /** Axios 实例 */
  private instance: AxiosInstance;
  /** 请求拦截器数组 */
  private requestInterceptors: RequestInterceptor[] = [];
  /** 响应拦截器数组 */
  private responseInterceptors: ResponseInterceptor[] = [];
  /** 错误拦截器数组 */
  private errorInterceptors: ErrorInterceptor[] = [];
  /** 防抖/节流管理器 */
  private throttleManager = new RequestThrottleManager();
  /** 默认配置 */
  private defaultConfig: RequestConfig = {
    timeout: 10000,
    retryCount: 0,
    retryDelay: 1000,
    showLoading: true,
    showError: true,
  };

  constructor(config: RequestConfig = {}) {
    this.instance = axios.create({
      ...this.defaultConfig,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  // ============================================================================
  // 拦截器管理
  // ============================================================================

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * 设置内置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        Logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`, config);

        // 执行自定义请求拦截器
        let currentConfig = config;
        for (const interceptor of this.requestInterceptors) {
          currentConfig = await interceptor(currentConfig);
        }

        return currentConfig;
      },
      (error: AxiosError) => {
        Logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      async (response: AxiosResponse) => {
        Logger.info(`Response: ${response.config.url}`, response.data);

        // 执行自定义响应拦截器
        let currentResponse = response;
        for (const interceptor of this.responseInterceptors) {
          currentResponse = await interceptor(currentResponse);
        }

        return currentResponse;
      },
      async (error: AxiosError) => {
        Logger.error('Response error:', error);

        // 执行自定义错误拦截器
        let currentError = error;
        for (const interceptor of this.errorInterceptors) {
          try {
            currentError = await interceptor(currentError);
          } catch (e) {
            currentError = e as AxiosError;
            break;
          }
        }

        return Promise.reject(currentError);
      }
    );
  }

  // ============================================================================
  // 错误处理
  // ============================================================================

  /**
   * 统一处理错误
   */
  private handleError(error: AxiosError): ApiError {
    const config = error.config as RequestConfig | undefined;

    // 请求被取消
    if (axios.isCancel(error)) {
      return new ApiError('Request canceled', {
        originalError: error,
        config,
        isCanceled: true,
      });
    }

    // 网络错误
    if (!error.response) {
      // 超时错误
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new ApiError('Request timeout', {
          originalError: error,
          config,
          isTimeout: true,
        });
      }

      return new ApiError('Network error', {
        originalError: error,
        config,
        isNetworkError: true,
      });
    }

    // HTTP 状态码错误
    const status = error.response.status;
    const responseData = error.response.data as { message?: string; code?: number };
    const message = responseData?.message || `HTTP Error ${status}`;

    return new ApiError(message, {
      status,
      code: responseData?.code,
      originalError: error,
      config,
    });
  }

  // ============================================================================
  // 请求重试
  // ============================================================================

  /**
   * 执行带重试的请求
   */
  private async requestWithRetry<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryCount: number,
    retryDelay: number
  ): Promise<AxiosResponse<T>> {
    let lastError: AxiosError | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as AxiosError;

        // 如果是取消请求，直接抛出
        if (axios.isCancel(lastError)) {
          throw lastError;
        }

        // 如果不是最后一次尝试，等待后重试
        if (attempt < retryCount) {
          Logger.warn(`Retry attempt ${attempt + 1}/${retryCount} after ${retryDelay}ms`);
          await this.delay(retryDelay);
        }
      }
    }

    throw lastError;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // 核心请求方法
  // ============================================================================

  /**
   * 执行 HTTP 请求
   * @template T 响应数据类型
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
    const mergedConfig: RequestConfig = {
      ...this.defaultConfig,
      ...config,
    };

    // 创建 AbortController 用于取消请求
    const abortController = new AbortController();
    const cancelToken = axios.CancelToken.source();

    // 绑定取消信号
    abortController.signal.addEventListener('abort', () => {
      cancelToken.cancel('Request aborted by user');
    });

    // 创建实际请求函数
    const executeRequest = async (): Promise<AxiosResponse<ApiResponse<T>>> => {
      return this.instance.request<ApiResponse<T>>({
        ...mergedConfig,
        cancelToken: cancelToken.token,
        signal: abortController.signal,
      });
    };

    // 防抖处理
    if (mergedConfig.debounce && mergedConfig.requestId) {
      return this.throttleManager.debounce(
        mergedConfig.requestId,
        mergedConfig.debounceWait ?? 300,
        async () => {
          const response = await this.requestWithRetry(
            executeRequest,
            mergedConfig.retryCount ?? 0,
            mergedConfig.retryDelay ?? 1000
          );
          return response.data;
        },
        cancelToken.cancel
      );
    }

    // 节流处理
    if (mergedConfig.throttle && mergedConfig.requestId) {
      return this.throttleManager.throttle(
        mergedConfig.requestId,
        mergedConfig.throttleWait ?? 1000,
        async () => {
          const response = await this.requestWithRetry(
            executeRequest,
            mergedConfig.retryCount ?? 0,
            mergedConfig.retryDelay ?? 1000
          );
          return response.data;
        },
        cancelToken.cancel
      );
    }

    // 普通请求
    try {
      const response = await this.requestWithRetry(
        executeRequest,
        mergedConfig.retryCount ?? 0,
        mergedConfig.retryDelay ?? 1000
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = this.handleError(axiosError);

      // 如果配置了显示错误，可以在这里调用错误提示
      if (mergedConfig.showError) {
        Logger.error('API Error:', apiError.message);
      }

      throw apiError;
    }
  }

  /**
   * GET 请求
   * @template T 响应数据类型
   * @param url 请求地址
   * @param config 请求配置
   */
  get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST 请求
   * @template T 响应数据类型
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT 请求
   * @template T 响应数据类型
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE 请求
   * @template T 响应数据类型
   * @param url 请求地址
   * @param config 请求配置
   */
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * PATCH 请求
   * @template T 响应数据类型
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // ============================================================================
  // 取消请求
  // ============================================================================

  /**
   * 创建可取消的请求
   * @returns { request: HttpClient, cancel: () => void }
   */
  createCancelableRequest(): {
    request: HttpClient;
    cancel: () => void;
    abortController: AbortController;
  } {
    const abortController = new AbortController();

    // 创建新的实例，绑定同一个 abortController
    const client = new HttpClient();
    const originalRequest = client.request.bind(client);

    client.request = async <T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> => {
      return originalRequest({
        ...config,
        signal: abortController.signal,
      });
    };

    return {
      request: client,
      cancel: () => abortController.abort(),
      abortController,
    };
  }

  /**
   * 取消所有请求（清理防抖/节流）
   */
  cancelAll(): void {
    this.throttleManager.clear();
  }
}

// ============================================================================
// 导出单例实例
// ============================================================================

/**
 * 全局 HTTP 客户端实例
 */
export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

/**
 * 创建新的 HTTP 客户端实例（用于特殊场景）
 */
export function createHttpClient(config?: RequestConfig): HttpClient {
  return new HttpClient(config);
}

export default httpClient;
