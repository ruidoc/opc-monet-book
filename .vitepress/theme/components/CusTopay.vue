<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vitepress";
import { is_login, user_info } from "../state";
import CusModel from "./CusModel.vue";
import { trackEvent } from "../utils/posthog";

const router = useRouter();
</script>

<template>
  <section class="to-pay-page">
    <div class="d-flex box-wrap">
      <img class="b-img" src="/book.png" />
      <div class="desc-wrap">
        <p class="desc">
          {{
            user_info?.status === 0
              ? "当前账号未激活，激活后可阅读全书"
              : "此章节需要登录后阅读"
          }}
        </p>
      </div>
      <button
        class="btn btn-primary"
        @click="router.go('/users')"
        v-if="!is_login"
      >
        去登录
      </button>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#WxModal"
        @click="()=> trackEvent('activate_account_clicked')"
        v-else-if="user_info?.status === 0"
      >
        激活账号
      </button>
      <button class="btn btn-primary" v-else @click="router.go('/')">
        返回
      </button>
      <CusModel />
    </div>
  </section>
</template>

<style lang="scss">
.to-pay-page {
  .box-wrap {
    width: 400px;
    height: 500px;
    flex-direction: column;
    align-items: center;
    margin: 16vh auto 0 auto;
    .desc-wrap {
      margin: 30px 0 13px 0;
      font-size: 17px;
    }
  }
  .b-img {
    width: 170px;
  }
}
</style>
