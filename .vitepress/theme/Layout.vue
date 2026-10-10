<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData, useRoute, useRouter } from "vitepress";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { is_login, user_info, setLogin, setUInfo } from "./state";
import http from "./utils/http";
import { 
  initPostHog, 
  trackPageView, 
  identifyUser, 
  trackChapterAccess,
  startPageTimer,
  trackPageLeave 
} from "./utils/posthog";

const { Layout } = DefaultTheme;
const { page, site } = useData();
const router = useRouter();
const { isDark } = useData();
const is_dark = ref(true);

const normalizePath = (value: string) => {
  let path = value.split("?")[0];
  if (path.includes(".")) {
    path = path.split(".")[0];
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
};

const isFreePath = (value: string) => {
  const path = normalizePath(value);
  return [
    "/",
    "/index",
    "/about",
    "/users",
    "/invite",
    "/topay",
    "/lectures/e01",
  ].includes(path);
};

const checkFn = (value: string) => {
  if ((!is_login.value || user_info.value?.status === 0) && !isFreePath(value)) {
    router.go("/topay");
  }
};

const getUser = () => {
  http
    .get("/users/info/self")
    .then((res: any) => {
      setLogin(true);
      setUInfo(res);
      // 跟踪用户信息更新
      identifyUser(res.id, res);
      checkFn("/" + page.value.filePath);
    })
    .catch((err) => {
      setLogin(false);
    });
};

router.onBeforePageLoad = (to) => {
  checkFn(to);
};
watch(
  () => isDark.value,
  (v) => {
    is_dark.value = v;
  }
);
onBeforeMount(() => {
  // 初始化PostHog
  initPostHog();
  getUser();
});
onMounted(() => {
  import("bootstrap/dist/js/bootstrap.bundle.min.js");
  is_dark.value = isDark.value;
  
  // 开始页面计时
  startPageTimer();
  
  // 跟踪当前页面访问
  const currentPath = page.value.filePath || '/';
  trackPageView(currentPath, page.value.title);
  if (currentPath.includes("lectures")) {
    const match = currentPath.match(/e(\d+)/);
    if (match) {
      trackChapterAccess(`e${match[1]}`);
    }
  }
});

// 监听路由变化
watch(
  () => page.value.filePath,
  (newPath, oldPath) => {
    // console.log('路由切换：',newPath, oldPath, page.value.title);
    if (newPath && newPath !== oldPath) {
      // 跟踪页面离开
      if (oldPath) {
        trackPageLeave(oldPath);
      }
      
      // 开始新页面计时
      startPageTimer();
      
      // 跟踪新页面访问
      trackPageView(newPath, page.value.title);
      
      if (newPath.includes("lectures")) {
        const match = newPath.match(/e(\d+)/);
        if (match) {
          trackChapterAccess(`e${match[1]}`);
        }
      }
    }
  }
);
</script>

<template>
  <Layout :data-bs-theme="is_dark ? 'dark' : 'light'">
    <template #nav-bar-content-after>
      <a href="" class="cus-login-a" @click="router.go('/users')">
        <svg
          class="bi"
          width="22"
          height="22"
          fill="currentColor"
          v-if="is_login"
        >
          <use xlink:href="~bootstrap-icons/bootstrap-icons.svg#person" />
        </svg>
        <span class="t" v-else>登录</span>
      </a>
    </template>
  </Layout>
</template>

<style lang="scss">
.cus-login-a {
  margin-left: 16px;
  transition: color 0.25s;
  &:hover {
    color: var(--vp-c-brand-1);
  }
  .t {
    font-size: 14px;
    font-weight: 500;
  }
}
#VPSidebarNav {
  .group {
    min-width: 130px;
  }
}
#VPContent {
  .vp-doc {
    p,
    summary {
      margin: 20px 0;
    }
  }
}
</style>
