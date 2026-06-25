<template>
  <div class="not-found-view">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="btn-home">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 页面组件
</script>

<style scoped lang="less">
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #e5e7eb;
  line-height: 1;
  margin-bottom: 16px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.error-desc {
  color: #6b7280;
  margin-bottom: 24px;
}

.btn-home {
  display: inline-block;
  padding: 12px 24px;
  color: #fff;
  background: #42b883;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background: #369870;
  }
}
</style>
