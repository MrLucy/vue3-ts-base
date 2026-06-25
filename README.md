# vite3-ts-base

一个基于 Vue 3 + TypeScript 的现代化前端项目模板，集成了主流开发工具链和最佳实践。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | ^3.5.38 | 渐进式 JavaScript 框架，Composition API |
| [Vue Router 4](https://router.vuejs.org/) | ^4.6.4 | 官方路由管理器，支持嵌套路由、导航守卫 |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.4 | 官方状态管理库，支持持久化 |
| [Vite](https://vitejs.dev/) | ^8.1.0 | 下一代前端构建工具 |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0.2 | 类型安全的 JavaScript 超集 |
| [Less](https://lesscss.org/) | ^4.6.7 | CSS 预处理器，支持变量、混合、嵌套 |
| [Axios](https://axios-http.com/) | ^1.18.1 | HTTP 客户端，已封装 HttpClient 类 |
| [ESLint](https://eslint.org/) | ^10.5.0 | 代码质量检查，含 import 排序规则 |
| [Prettier](https://prettier.io/) | ^3.8.4 | 代码格式化 |
| [Stylelint](https://stylelint.io/) | ^16.26.1 | CSS/Less 代码检查 |

## 项目结构

```
vite3-ts-base/
├── .vscode/                      # VS Code 编辑器配置
│   └── settings.json             # 自动格式化、保存时修复
├── node_modules/                 # 依赖包
├── public/                       # 静态资源
├── src/
│   ├── api/                      # API 接口封装
│   │   └── index.ts              # 用户、文件等 API 模块
│   ├── layouts/                  # 布局组件
│   │   └── DefaultLayout.vue     # 默认布局（导航 + 页脚）
│   ├── plugins/                  # 全局插件
│   │   └── index.ts              # 插件安装入口
│   ├── router/                   # 路由配置
│   │   ├── index.ts              # 路由实例 + 导航守卫
│   │   └── routes.ts             # 路由表定义（懒加载）
│   ├── stores/                   # Pinia 状态管理
│   │   ├── index.ts              # Pinia 实例 + 持久化插件
│   │   ├── user.ts               # 用户状态（localStorage 持久化）
│   │   └── app.ts                # 应用状态（sessionStorage 持久化）
│   ├── utils/                    # 工具函数
│   │   ├── http-client.ts        # Axios 封装（拦截器、重试、防抖）
│   │   └── http-client-plugin.ts  # Vue HTTP 插件
│   ├── views/                    # 页面组件
│   │   ├── HomeView.vue          # 首页
│   │   ├── AboutView.vue         # 关于页
│   │   ├── LoginView.vue         # 登录页
│   │   ├── ProfileView.vue       # 个人中心（需登录）
│   │   └── NotFoundView.vue      # 404 页面
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件
│   └── style.less                # 全局 Less 样式
├── .gitignore                    # Git 忽略配置
├── .prettierrc                   # Prettier 配置
├── .stylelintrc.json             # Stylelint 配置（支持 Vue/Less）
├── eslint.config.mjs             # ESLint 配置（Flat Config）
├── index.html                    # HTML 入口
├── package.json                  # 项目配置 & 脚本
├── tsconfig.json                 # TypeScript 配置（含 @ 别名）
├── vite.config.ts                # Vite 配置（Vue 插件 + @ 别名）
└── package-lock.json             # 锁定依赖版本
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动 Vite 开发服务器，支持热模块替换（HMR）。

### 构建生产版本

```bash
npm run build
```

执行 TypeScript 类型检查 + Vite 构建。

### 预览生产构建

```bash
npm run preview
```

本地预览生产构建结果。

## 代码规范脚本

```bash
# ESLint 检查（含 .vue 文件）
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run format

# Stylelint 检查 CSS/Less/Vue
npm run stylelint

# Stylelint 自动修复
npm run stylelint:fix
```

## 核心功能

### 1. 路由系统（Vue Router 4）

- **History 模式**：`createWebHistory()`
- **路由懒加载**：动态 `import()` 实现代码分割
- **导航守卫**：全局前置守卫实现权限验证 + 页面标题设置
- **嵌套路由**：`DefaultLayout.vue` 作为父布局，页面组件作为子路由
- **滚动行为**：保存位置 / 平滑滚动到顶部

**路由表**：

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | `HomeView` | 首页（嵌套在 DefaultLayout） |
| `/about` | `AboutView` | 关于页 |
| `/profile` | `ProfileView` | 个人中心（`requiresAuth: true`） |
| `/login` | `LoginView` | 登录页（无导航） |
| `/*` | `NotFoundView` | 404 页面（无导航） |

### 2. 状态管理（Pinia + 持久化）

#### userStore（localStorage 持久化）

```typescript
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 登录
userStore.login({ name: '张三', token: 'xxx', roles: ['user'] });

// 使用 storeToRefs 保持响应性
const { isLoggedIn, displayName, isAdmin } = storeToRefs(userStore);

// 登出
userStore.logout();
```

| State | 类型 | 说明 |
|-------|------|------|
| `name` | `string` | 用户名 |
| `token` | `string` | 登录令牌 |
| `roles` | `string[]` | 角色列表 |
| `isLoggedIn` | `boolean` | 登录状态 |

**Getters**: `displayName`, `isAdmin`, `hasRole`, `rolesText`  
**Actions**: `login`, `logout`, `setUserInfo`, `addRole`, `removeRole`

#### appStore（sessionStorage 持久化）

```typescript
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

// 切换主题
appStore.toggleTheme();

// 切换侧边栏
appStore.toggleSidebar();

// 设置语言
appStore.setLanguage('en-US');
```

| State | 类型 | 说明 |
|-------|------|------|
| `theme` | `'light' \| 'dark' \| 'auto'` | 主题模式 |
| `sidebarCollapsed` | `boolean` | 侧边栏折叠 |
| `language` | `string` | 当前语言 |
| `device` | `'desktop' \| 'mobile' \| 'tablet'` | 设备类型 |

### 3. HTTP 客户端（Axios 封装）

```typescript
import { httpClient } from '@/utils/http-client';

// GET 请求
const { data } = await httpClient.get<User>('/user/1');

// POST 请求（带重试）
const { data } = await httpClient.post<LoginResult>('/login', params, {
  retryCount: 3,
  retryDelay: 1000,
});

// 搜索（带防抖）
const { data } = await httpClient.get<User[]>('/search', {
  params: { keyword },
  requestId: 'search-users',
  debounce: true,
  debounceWait: 300,
});

// 取消请求
const { request, cancel } = httpClient.createCancelableRequest();
cancel();
```

**功能特性**：

| 功能 | 说明 |
|------|------|
| 请求/响应拦截器 | 支持添加多个自定义拦截器 |
| 取消请求 | `AbortController` + `CancelToken` 双重支持 |
| 超时配置 | 默认 10 秒 |
| 请求重试 | 可配置重试次数和延迟 |
| 防抖/节流 | 通过 `requestId` 实现 |
| 日志输出 | 开发环境自动打印请求信息 |
| 错误处理 | `ApiError` 类统一封装网络/超时/HTTP 错误 |

### 4. Import 排序规则（ESLint）

自动排序 import 语句，分组规则：

```typescript
// 1. builtin (Node.js 内置)
import path from 'path';

// 2. external (外部依赖)
import { createApp } from 'vue';
import { defineStore } from 'pinia';

// 3. internal (项目内部 @/alias)
import { useUserStore } from '@/stores/user';

// 4. parent (父目录)
import { helper } from '../utils';

// 5. sibling (同级目录)
import { config } from './config';

// 6. type (类型导入)
import type { User } from './types';
```

### 5. Less 预处理器

```less
// 变量
@primary-color: #42b883;
@spacing-unit: 8px;

// 混合
.flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 使用
.app {
  .flex-center();
  gap: @spacing-unit * 2;
  color: @primary-color;
}
```

### 6. @ 别名配置

Vite + TypeScript 已配置 `@` 指向 `src` 目录：

```typescript
// 之前
import router from '../router';

// 现在
import router from '@/router';
```

## 开发环境配置

### VS Code 推荐设置

项目已包含 `.vscode/settings.json`：

- 保存时自动格式化（Prettier）
- 保存时自动修复 ESLint/Stylelint 问题
- 支持 Vue 文件验证

### 浏览器开发者工具

- **Vue Devtools**：自动识别 Vue 3 + Pinia
- **Pinia 状态树**：查看 state、getter、action 调用记录

## 配置文件说明

| 文件 | 用途 |
|------|------|
| `vite.config.ts` | Vite 构建配置（Vue 插件、@ 别名） |
| `tsconfig.json` | TypeScript 配置（路径映射、严格模式） |
| `eslint.config.mjs` | ESLint Flat Config（Vue、TypeScript、Import 排序） |
| `.prettierrc` | 代码格式化规则（单引号、2 空格、100 字符换行） |
| `.stylelintrc.json` | CSS/Less/Vue 样式检查规则 |
| `.gitignore` | Git 忽略配置（含 ESLint/Stylelint 缓存） |

## 浏览器兼容性

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

[MIT](LICENSE)
