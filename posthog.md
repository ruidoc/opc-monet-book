# PostHog 集成配置说明

## 🎯 功能概述

本项目已成功集成 PostHog 用户行为分析，可以跟踪以下数据：

### 📊 自动收集的数据
- **页面浏览量 (PV)**: 自动跟踪所有页面访问
- **独立访客 (UV)**: 自动识别不同用户
- **日活/月活 (DAU/MAU)**: 自动计算活跃用户数
- **页面停留时间**: 记录用户在每个页面的停留时长
- **路由访问记录**: 跟踪用户的页面跳转路径

### 🔍 自定义事件跟踪
- **用户行为**:
  - `login_attempt` - 登录尝试
  - `login_success` - 登录成功
  - `login_failed` - 登录失败
  - `user_logout` - 用户登出
  
- **内容访问**:
  - `chapter_access` - 章节访问
  - `page_leave` - 页面离开（含停留时间）
  
- **付费相关**:
  - `payment_attempted` - 付费尝试
  - `activate_account_clicked` - 激活账号点击
  
- **用户操作**:
  - `profile_edit_started` - 开始编辑个人资料
  - `profile_update_success` - 个人资料更新成功
  - `password_reset_attempted` - 密码重置尝试

## 🚀 配置步骤

### 1. 注册 PostHog 账号
1. 访问 [PostHog.com](https://posthog.com/) 注册账号
2. 创建新项目
3. 获取项目 API Key 和 Host URL

### 2. 配置环境变量
1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中填入你的 PostHog 配置：
   ```env
   VITE_POSTHOG_API_KEY=phc_your_actual_api_key_here
   VITE_POSTHOG_HOST=https://us.i.posthog.com
   ```

### 3. 更新配置文件
如果不使用环境变量，可以直接在 `.vitepress/theme/utils/posthog.ts` 中修改配置：

```typescript
export const POSTHOG_CONFIG = {
  apiKey: 'phc_your_actual_api_key_here',
  apiHost: 'https://us.i.posthog.com',
  debug: false, // 开发环境可以设置为 true
};
```

### 4. 重启开发服务器
```bash
yarn dev
```

## 📈 查看数据

### PostHog 控制台
登录 PostHog 控制台查看详细分析数据：
- **Insights**: 创建自定义分析图表
- **Persons**: 查看用户详情和行为轨迹
- **Events**: 查看所有事件记录
- **Session Recordings**: 观看用户会话录制（如果启用）

### 关键指标位置
1. **总览数据**: Dashboard > Insights
2. **页面分析**: Insights > Pageviews
3. **用户路径**: Insights > Paths
4. **转化漏斗**: Insights > Funnels
5. **留存分析**: Insights > Retention

## 🔧 自定义配置

### 启用/禁用功能
在 `posthog.ts` 中可以调整以下配置：

```typescript
posthog.init(POSTHOG_CONFIG.apiKey, {
  // 自动捕获点击事件
  autocapture: true,
  
  // 会话录制
  session_recording: {
    recordCrossOriginIframes: true,
  },
  
  // 性能监控
  capture_performance: true,
  
  // 页面访问跟踪
  capture_pageview: 'history_change',
  
  // 页面离开跟踪
  capture_pageleave: true,
});
```

### 添加自定义事件
在任何 Vue 组件中使用：

```typescript
import { trackEvent } from '../utils/posthog';

// 跟踪自定义事件
trackEvent('custom_event_name', {
  property1: 'value1',
  property2: 'value2'
});
```

## 🛡️ 隐私说明

- 所有数据收集都是匿名的
- 不收集敏感个人信息
- 用户可以通过浏览器设置禁用跟踪
- 符合 GDPR 和其他隐私法规

## 📚 相关资源

- [PostHog 官方文档](https://posthog.com/docs)
- [Vue.js 集成指南](https://posthog.com/docs/libraries/vue-js)
- [事件跟踪最佳实践](https://posthog.com/docs/product-analytics/events)

## 🐛 故障排除

### 常见问题

1. **数据不显示**
   - 检查 API Key 是否正确
   - 确认网络连接正常
   - 查看浏览器控制台是否有错误

2. **事件未触发**
   - 确认 PostHog 已正确初始化
   - 检查事件名称是否正确
   - 查看 PostHog 调试模式输出

3. **页面跳转未跟踪**
   - 确认使用了 `capture_pageview: 'history_change'`
   - 检查 Vue Router 配置是否正确

### 调试模式
开启调试模式查看详细日志：

```typescript
export const POSTHOG_CONFIG = {
  // ...
  debug: true,
};
```

## ✅ 验证集成

访问网站并执行以下操作来验证集成：

1. 浏览不同页面
2. 尝试登录/登出
3. 访问付费页面
4. 编辑个人资料

然后在 PostHog 控制台的 "Live Events" 中查看事件是否正确记录。 