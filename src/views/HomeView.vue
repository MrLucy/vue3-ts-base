<template>
  <div class="home-view">
    <section class="hero">
      <h1 class="title">欢迎来到 Vite Vue App</h1>
      <p class="subtitle">基于 Vite + Vue 3 + TypeScript + Vue Router 构建的现代化前端项目</p>
      <div class="actions">
        <router-link to="/about" class="btn-primary">了解更多</router-link>
        <router-link to="/profile" class="btn-secondary">个人中心</router-link>
      </div>
    </section>

    <section class="features">
      <h2 class="section-title">技术栈</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>Vite</h3>
          <p>下一代前端构建工具，极速的 HMR 和构建速度</p>
        </div>
        <div class="feature-card">
          <h3>Vue 3</h3>
          <p>渐进式 JavaScript 框架，Composition API</p>
        </div>
        <div class="feature-card">
          <h3>TypeScript</h3>
          <p>类型安全的 JavaScript 超集</p>
        </div>
        <div class="feature-card">
          <h3>Vue Router</h3>
          <p>Vue.js 官方路由管理器</p>
        </div>
        <div class="feature-card">
          <h3>Less</h3>
          <p>动态样式语言，支持变量和混合</p>
        </div>
        <div class="feature-card">
          <h3>ESLint + Prettier</h3>
          <p>代码质量检查和自动格式化</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 首页组件
</script>

<style scoped lang="less">
.home-view {
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 64px 0;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary {
  color: #fff;
  background: #42b883;

  &:hover {
    background: #369870;
  }
}

.btn-secondary {
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #e5e7eb;
  }
}

.features {
  padding: 64px 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 48px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #42b883;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    line-height: 1.6;
  }
}
</style>
