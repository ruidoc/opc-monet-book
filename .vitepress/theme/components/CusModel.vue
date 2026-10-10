<script setup lang="ts">
import { is_login } from "../state";
</script>

<template>
  <div
    class="modal fade cus-model"
    id="WxModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">联系作者</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <img width="270" style="display: inline" src="/wechat.jpeg" />
          <p class="text-warning fs-6">
            扫码添加作者微信，{{ is_login ? "激活" : "获取" }}账号
          </p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            我知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cus-model p {
  margin: 20px 0;
}
</style>
