<script setup lang="ts">
import { ref } from "vue";
import http from "../utils/http";
import { useRouter } from "vitepress";
import { trackEvent } from "../utils/posthog";

const router = useRouter();
const loading = ref(false);
const form = ref({
  phone: "",
  password: "",
});

const toLogin = () => {
  let { phone, password } = form.value;
  if (!phone || !password) {
    return alert("账号密码不能为空");
  }
  if (password.length < 6) {
    return alert("密码至少6位");
  }
  loading.value = true;
  http
    .post("/users/login", form.value)
    .then((res: any) => {
      loading.value = false;
      if (res?.code == 20001) {
        trackEvent('login_failed', { phone, error: res.message });
        return alert(res.message);
      }
      if (res?.code == 200) {
        // 跟踪登录成功
        trackEvent('login_success', { phone });
        localStorage.setItem("ruidoc_token", res.token);
        setTimeout(() => {
          location.href = "/";
        }, 1000);
      }
    })
    .catch((err) => {
      loading.value = false;
      trackEvent('login_error', { phone, error: err?.message || 'network_error' });
      alert("登录失败");
    });
  // console.log(form.value);
};

const toRegister = () => {
  router.go("/invite");
};
</script>

<template>
  <section class="cus-login-comp">
    <div class="card login-box">
      <div class="card-header text-center p-3">
        <h4>登录</h4>
      </div>
      <div class="card-body p-4">
        <div class="mb-3">
          <label class="form-label">手机号</label>
          <input
            type="phone"
            class="form-control"
            v-model="form.phone"
            placeholder="输入手机号"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input
            type="password"
            class="form-control"
            v-model="form.password"
            placeholder="输入密码"
          />
        </div>
        <div class="mb-4 text-end">
          <a
            href=""
            @click="toRegister"
            class="form-check-label text-decoration-none icon-link"
          >
            没有账号？注册
            <svg class="bi" width="32" height="32" fill="currentColor">
              <use
                xlink:href="~bootstrap-icons/bootstrap-icons.svg#arrow-right"
              />
            </svg>
          </a>
        </div>
        <div class="d-grid gap-2">
          <button
            :class="['btn', 'btn-primary', { disabled: loading }]"
            @click="toLogin"
          >
            {{ loading ? "登录中..." : "登录" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.cus-login-comp {
  .login-box {
    margin: 10vh auto 0 auto;
    max-width: 400px;
    input {
      font-size: 16px;
    }
    label {
      display: inline-block;
    }
  }
}
</style>
