import posthog from 'posthog-js';

// PostHog配置
export const POSTHOG_CONFIG = {
  // 请替换为你的PostHog项目API密钥
  apiKey: 'phc_xFTmeHywOd5qVUbjoomL5t5BefhVqDnE2C7NZITlMpx', // 在生产环境中请通过环境变量设置
  // PostHog实例地址，如果使用PostHog Cloud，通常是https://us.i.posthog.com
  apiHost: 'https://us.i.posthog.com',
  // 是否启用调试模式
  debug: false, // 在开发环境中可以设置为true
};

// 初始化PostHog
export function initPostHog() {
  if (typeof window === 'undefined') return;

  posthog.init(POSTHOG_CONFIG.apiKey, {
    api_host: POSTHOG_CONFIG.apiHost,
    debug: POSTHOG_CONFIG.debug,
    // 使用最新的默认配置，自动跟踪SPA页面访问
    defaults: '2025-05-24',
    // 启用自动捕获
    autocapture: true,
    // 启用会话录制（可选）
    session_recording: {
      recordCrossOriginIframes: true,
    },
    // 启用性能监控
    capture_performance: true,
    // 启用页面视图跟踪
    capture_pageview: 'history_change',
    // 跟踪页面停留时间
    capture_pageleave: true,
    // 自定义属性
    loaded: (posthog) => {
      if (POSTHOG_CONFIG.debug) {
        console.log('PostHog loaded successfully');
      }
    },
  });
}

// 跟踪页面访问
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;
  
  posthog.capture('$pageview', {
    $current_url: window.location.href,
    $pathname: path,
    $title: title || document.title,
    $referrer: document.referrer,
    page_type: getPageType(path),
    section: getSection(path),
  });
}

// 跟踪自定义事件
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  posthog.capture('ebook_'+eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    pathname: window.location.pathname,
  });
}

// 设置用户属性
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  posthog.people.set(properties);
}

// 识别用户
export function identifyUser(userId: string, userInfo: Record<string, any>) {
  if (typeof window === 'undefined') return;
  posthog.identify(userId, {
    username: userInfo?.username,
    phone: userInfo?.phone,
    status: userInfo?.status,
    created_at: userInfo?.created_at,
  });
}

// 跟踪用户注销
export function trackLogout() {
  trackEvent('user_logout');
  posthog.reset();
}

// 跟踪付费事件
export function trackPayment(amount?: number, plan?: string) {
  trackEvent('payment_attempted', {
    amount,
    plan,
    currency: 'CNY',
  });
}

// 跟踪章节访问
export function trackChapterAccess(chapter: string, stage?: string) {
  trackEvent('chapter_access', {
    chapter,
    stage,
    access_type: 'read',
  });
}

// 跟踪搜索行为
export function trackSearch(query: string, results?: number) {
  trackEvent('search', {
    query,
    results_count: results,
  });
}

// 跟踪页面停留时间
let pageStartTime: number | null = null;

export function startPageTimer() {
  pageStartTime = Date.now();
}

export function trackPageLeave(path: string) {
  if (pageStartTime) {
    const duration = Date.now() - pageStartTime;
    trackEvent('page_leave', {
      pathname: path,
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
    });
    pageStartTime = null;
  }
}

// 获取页面类型
function getPageType(path: string): string {
  if (path.includes("lectures")) {
    return "chapter";
  } else {
    return path.replace(/\.md$/, "");
  }
}

function getSection(path: string): string | null {
  const match = path.match(/e(\d+)/);
  return match ? `e${match[1]}` : null;
}

// 获取PostHog实例
export function getPostHog() {
  return posthog;
}

export default posthog; 