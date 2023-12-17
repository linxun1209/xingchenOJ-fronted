<template>
  <div>学习</div>
</template>
<script setup lang="ts">
import { ref } from "vue/dist/vue";
import { UserControllerService, UserVO } from "../../../generated";
import { useStore } from "vuex";
const store = useStore();
const userInfo = ref<UserVO>();
const userId = store.state.user.loginUser.id;
/**
 * 打开弹窗,获取到用户信息
 */
const res = await UserControllerService.getUserByIdUsingGet(userId);
userInfo.value = res.data;
</script>

<style scoped></style>
