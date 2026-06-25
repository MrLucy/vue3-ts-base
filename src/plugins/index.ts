import type { App } from 'vue';

import { installHttpClient } from '../utils/http-client-plugin';

/**
 * 全局插件安装
 */
export function installPlugins(app: App): void {
  app.use(installHttpClient);
}
