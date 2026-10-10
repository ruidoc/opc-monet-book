<script setup lang="ts">
import { ref, watch } from "vue";
import http from "../utils/http";
import CusLogin from "./CusLogin.vue";
import { is_login, user_info } from "../state";
import CusModel from "./CusModel.vue";

const loading = ref(false);
const is_edit = ref(false);
const reset_pass = ref(false);
const passfm = ref({
  old_password: "",
  new_password: "",
  cnew_password: "",
});
const form_uinfo = ref(user_info);

const toUpdate = () => {
  if (!is_edit.value) {
    is_edit.value = true;
    return false;
  }
  console.log(form_uinfo.value);
  loading.value = true;
  http
    .put("/users/update/self", form_uinfo.value)
    .then((res: any) => {
      loading.value = false;
      alert("更新成功");
      is_edit.value = false;
    })
    .catch((err) => {
      loading.value = false;
      alert("更新失败");
    });
};

const resetPass = () => {
  let { old_password, new_password, cnew_password } = passfm.value;
  if (!old_password || !new_password || !cnew_password) {
    return alert("填写密码不能为空");
  }
  if (new_password.length < 6) {
    return alert("密码至少6位");
  }
  if (new_password != cnew_password) {
    return alert("两次密码输入不一致");
  }
  loading.value = true;
  http
    .put("/users/reset_pass", {
      old_password,
      new_password,
    })
    .then((res: any) => {
      loading.value = false;
      alert("修改成功");
      reset_pass.value = false;
    })
    .catch((err) => {
      loading.value = false;
      if (err.status == 400) {
        alert(err.data.message);
      } else {
        alert("修改失败");
      }
    });
};

const logout = () => {
  if (confirm("确认退出登录？")) {
    localStorage.removeItem("ruidoc_token");
    location.reload();
  }
};

watch(user_info, (data) => {
  form_uinfo.value = data;
});
</script>

<template>
  <section class="cus-user-page">
    <CusLogin v-if="!is_login" />
    <!-- 用户信息面板 -->
    <div class="uinfo-box mt-4" v-else>
      <div class="card">
        <div class="card-header p-3 d-flex justify-content-between">
          <span>{{ reset_pass ? "重置密码" : "用户中心" }}</span>
          <a href="" v-if="!reset_pass" @click="logout">退出</a>
        </div>
        <div class="card-body" v-if="form_uinfo">
          <template v-if="!reset_pass">
            <div class="row mb-3">
              <label class="col-sm-2 col-form-label">姓名：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  :disabled="is_edit ? false : true"
                  v-model="form_uinfo.username"
                />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-2 col-form-label">手机号：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  :disabled="is_edit && !form_uinfo.status ? false : true"
                  v-model="form_uinfo.phone"
                />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-2">性别：</label>
              <div class="col-sm-8">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    :disabled="is_edit ? false : true"
                    id="inlineRadio1"
                    v-model="form_uinfo.sex"
                    :value="1"
                  />
                  <label class="form-check-label" for="inlineRadio1">男</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    :disabled="is_edit ? false : true"
                    id="inlineRadio2"
                    v-model="form_uinfo.sex"
                    :value="2"
                  />
                  <label class="form-check-label" for="inlineRadio2">女</label>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-2 col-form-label">简介：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  placeholder="请输入简介"
                  :disabled="is_edit ? false : true"
                  v-model="form_uinfo.introduc"
                />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-2">状态：</label>
              <div class="col-sm-8">
                <div class="d-flex justify-content-between">
                  <b
                    :class="form_uinfo.status ? 'text-success' : 'text-danger'"
                    >{{ form_uinfo.status ? "已激活" : "未激活" }}</b
                  >
                  <a
                    href=""
                    class="text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#WxModal"
                    v-if="!form_uinfo.status"
                    >去激活</a
                  >
                </div>
              </div>
            </div>
            <div class="row mb-3" v-if="form_uinfo.status && !is_edit">
              <label class="col-sm-2">邀请码：</label>
              <div class="col-sm-8">
                <div class="d-flex justify-content-between">
                  <b>{{ form_uinfo.invite_code }}</b>
                  <a
                    target="_blank"
                    :href="`/invite?code=${form_uinfo.invite_code}`"
                    >邀请链接</a
                  >
                </div>
                <span class="invdesc">使用邀请链接注册并激活，返10元红包</span>
              </div>
            </div>
            <div class="row mb-3" v-if="!is_edit">
              <label class="col-sm-2">密码：</label>
              <div class="col-sm-8">
                <a href="" @click="reset_pass = true">修改密码</a>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-10 offset-sm-2 gap-2">
                <button
                  :class="
                    is_edit ? 'btn btn-primary' : 'btn btn-outline-secondary'
                  "
                  @click="toUpdate"
                >
                  {{ is_edit ? "确认修改" : "编辑信息" }}
                </button>
                &nbsp;
                <button
                  v-if="is_edit"
                  class="btn btn-secondary"
                  @click="is_edit = false"
                >
                  取消
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label">旧密码：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  placeholder="输入旧密码"
                  v-model="passfm.old_password"
                />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label">新密码：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  placeholder="输入新密码"
                  v-model="passfm.new_password"
                />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label">确认新密码：</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  placeholder="再次输入新密码"
                  v-model="passfm.cnew_password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-10 offset-sm-3 gap-2">
                <button class="btn btn-primary" @click="resetPass">
                  确认修改
                </button>
                &nbsp;
                <button class="btn btn-secondary" @click="reset_pass = false">
                  取消
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <CusModel />
  </section>
</template>

<style lang="scss">
.cus-user-page {
  .uinfo-box {
    margin: 10vh auto 0 auto;
    max-width: 600px;
    input {
      font-size: 16px;
    }
    .invdesc {
      font-size: 14px;
      opacity: 0.5;
    }
  }
}
</style>
