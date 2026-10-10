<script setup lang="ts">
import { ref, watch } from "vue";
import http from "../utils/http";
import { trackEvent } from "../utils/posthog";

const loading = ref(false);
const form = ref({
  phone: "",
  username: "",
  city: "",
  sex: 1,
  password: "",
  password_c: "",
  invite_code: "",
});

const props = defineProps<{
  code: string;
}>();

const toLogin = () => {
  let { phone, username, password, password_c } = form.value;
  if (!phone || !username || !password) {
    return alert("表单不能为空");
  }
  if (password.length < 6) {
    return alert("密码至少6位");
  }
  if (password != password_c) {
    return alert("两次密码输入不一致");
  }
  let sub_form = JSON.parse(JSON.stringify(form.value));
  sub_form.status = 0;
  delete sub_form.password_c;
  loading.value = true;
  http
    .post("/users/create", sub_form)
    .then((res: any) => {
      loading.value = false;
      trackEvent('register_success', { phone });
      location.href = "/users";
    })
    .catch((err) => {
      loading.value = false;
      if (err.status == 400) {
        alert(err.data.message);
      } else if (err.status == 500) {
        if (err.data.name == "MongoServerError") {
          return alert("手机号错误，请联系作者");
        }
        alert("服务器异常");
      } else {
        alert("注册失败");
      }
      trackEvent('register_failed', { phone, error: err?.message || 'network_error' });
    });
};

watch(
  () => props.code,
  (code) => {
    if (code) {
      form.value.invite_code = code;
    }
  }
);
</script>

<template>
  <section class="cus-invite-page">
    <div class="card login-box">
      <div class="card-header text-center p-3">
        <h4>用户注册</h4>
        <div>请确保信息真实</div>
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
          <label class="form-label">姓名</label>
          <input
            type="phone"
            class="form-control"
            v-model="form.username"
            placeholder="输入姓名"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">城市</label>
          <input
            type="phone"
            class="form-control"
            v-model="form.city"
            placeholder="输入城市"
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
        <div class="mb-3">
          <label class="form-label">确认密码</label>
          <input
            type="password"
            class="form-control"
            v-model="form.password_c"
            placeholder="再次输入密码"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">邀请码</label>
          <input
            type="text"
            class="form-control"
            :disabled="!!props.code"
            v-model="form.invite_code"
            placeholder="输入邀请码，选填"
          />
        </div>
        <div class="mb-4 text-end"></div>
        <div class="d-grid gap-2">
          <button
            :class="['btn', 'btn-primary', { disabled: loading }]"
            @click="toLogin"
          >
            {{ loading ? "注册中..." : "注册" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.cus-invite-page {
  .login-box {
    margin: 0 auto;
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
