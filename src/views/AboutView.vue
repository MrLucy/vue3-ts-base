<template>
  <div class="about-view">
    <section class="about-hero">
      <h1 class="title">关于我们</h1>
      <p class="subtitle">了解这个项目的更多信息</p>
    </section>

    <section class="about-content">
      <div class="content-card">
        <h2>项目简介</h2>
        <p>
          这是一个基于 Vue 3 生态系统的现代化前端项目模板，集成了 Vue Router、TypeScript、
          Less、ESLint、Prettier 等主流技术栈，旨在为开发者提供一个开箱即用的开发环境。
        </p>
      </div>

      <div class="content-card">
        <h2>主要特性</h2>
        <ul class="feature-list">
          <li><strong>Vue 3 Composition API</strong> - 使用组合式 API，逻辑复用更灵活</li>
          <li><strong>Vue Router 4</strong> - 支持路由懒加载、导航守卫、嵌套路由</li>
          <li><strong>TypeScript</strong> - 完整的类型支持，提升代码质量和开发体验</li>
          <li><strong>Vite</strong> - 极速的开发服务器和构建工具</li>
          <li><strong>Less</strong> - 支持变量、混合、嵌套等高级 CSS 特性</li>
          <li><strong>代码规范</strong> - ESLint + Prettier + Stylelint 确保代码质量</li>
        </ul>
      </div>

      <div class="content-card">
        <h2>路由演示</h2>
        <p>尝试访问以下路由来测试功能：</p>
        <div class="route-links">
          <router-link to="/" class="route-link">返回首页</router-link>
          <router-link to="/profile" class="route-link">个人中心（需登录）</router-link>
          <router-link to="/non-existent" class="route-link">404 页面</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>

<style scoped lang="less">
.about-view {
  padding: 48px 24px;
  max-width: 800px;
  margin: 0 auto;
}

.about-hero {
  text-align: center;
  padding: 48px 0;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-card {
  padding: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #42b883;
    margin-bottom: 16px;
  }

  p {
    color: #4b5563;
    line-height: 1.7;
  }
}

.feature-list {
  list-style: none;
  padding: 0;

  li {
    padding: 12px 0;
    color: #4b5563;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #1f2937;
      display: block;
      margin-bottom: 4px;
    }
  }
}

.route-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.route-link {
  padding: 10px 20px;
  color: #42b883;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: #42b883;
    color: #fff;
  }
}
</style>
