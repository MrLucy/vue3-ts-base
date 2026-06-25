import httpClient from '../utils/http-client';

import type { ApiResponse } from '../utils/http-client';
import type { AxiosProgressEvent } from 'axios';

/**
 * 用户相关 API 封装示例
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

/**
 * 用户 API 模块
 */
export const userApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
    return httpClient.post<LoginResult>('/auth/login', params);
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Promise<ApiResponse<User>> {
    return httpClient.get<User>('/user/me');
  },

  /**
   * 更新用户信息
   */
  updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    return httpClient.put<User>(`/user/${id}`, data);
  },

  /**
   * 删除用户
   */
  deleteUser(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/user/${id}`);
  },

  /**
   * 获取用户列表（带重试）
   */
  getUserList(params?: { page?: number; size?: number }): Promise<ApiResponse<User[]>> {
    return httpClient.get<User[]>('/user/list', {
      params,
      retryCount: 3,
      retryDelay: 1000,
    });
  },

  /**
   * 搜索用户（带防抖）
   */
  searchUsers(keyword: string): Promise<ApiResponse<User[]>> {
    return httpClient.get<User[]>('/user/search', {
      params: { keyword },
      requestId: 'search-users',
      debounce: true,
      debounceWait: 300,
    });
  },
};

/**
 * 文件上传 API 模块
 */
export const fileApi = {
  /**
   * 上传文件
   */
  uploadFile(file: File, onProgress?: (percent: number) => void): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post<string>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  },

  /**
   * 下载文件
   */
  downloadFile(url: string): Promise<ApiResponse<Blob>> {
    return httpClient.request<Blob>({
      url,
      method: 'GET',
      responseType: 'blob',
    });
  },
};

export default {
  user: userApi,
  file: fileApi,
};
