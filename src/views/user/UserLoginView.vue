<template>
  <div class="userLoginView">
    <h2 style="margin-bottom: 32px">账户密码登录</h2>
    <a-form
      :model="form"
      size="large"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 320px; margin: 0 auto"
    >
      <a-form-item
        field="userAccount"
        :validate-trigger="['change', 'input']"
        :rules="[
          { minLength: 4, message: '账号长度不能少于4位' },
          { maxLength: 16, message: '账号长度不能超过16位' },
        ]"
      >
        <a-input v-model="form.userAccount" placeholder="账号 (4~16位)" />
      </a-form-item>
      <a-form-item
        field="userPassword"
        :validate-trigger="['change', 'input']"
        :rules="[
          { minLength: 6, message: '密码长度不能少于6位' },
          { maxLength: 16, message: '密码长度不能超过16位' },
        ]"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="密码 (6~16位)"
          aria-required="true"
        />
      </a-form-item>

      <a-form-item field="autoLogin" style="text-aligt: center">
        <a-checkbox v-model="otherform.autoLogin"> 自动登录 </a-checkbox>
        <div style="width: 70%; text-align: right">
          <a style="cursor: pointer; color: #1677ff" @click="ToRegister"
            >没有账号？去注册</a
          >
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 320px"
          >登 录</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);
const router = useRouter();
const store = useStore();

const otherform = reactive({
  autoLogin: true,
});

// 去注册页面
const ToRegister = () => {
  router.push({
    path: "/user/register",
    replace: true,
  });
};

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登陆失败，" + res.message);
  }
};
</script>
