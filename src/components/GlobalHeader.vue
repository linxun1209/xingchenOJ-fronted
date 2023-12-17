<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">鱼 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-dropdown trigger="hover">
        <a-avatar shape="circle">
          <template
            v-if="store.state.user.loginUser && store.state.user.loginUser.userRole as String !== ACCESS_ENUM.NOT_LOGIN"
          >
            <template v-if="store.state.user.loginUser.userAvatar">
              <img
                alt="avatar"
                :src="store.state.user.loginUser.userAvatar"
                class="userAvatar"
              />
            </template>
            <template v-else>
              <a-avatar>
                <IconUser />
              </a-avatar>
            </template>
          </template>
          <template v-else>
            <a-avatar>未登录</a-avatar>
          </template>
        </a-avatar>
        <template #content>
          <template
            v-if="store.state.user.loginUser && store.state.user.loginUser.userRole as
            string !== ACCESS_ENUM.NOT_LOGIN"
          >
            <a-doption>
              <template #icon>
                <icon-idcard />
              </template>
              <template #default>
                <a-anchor-link @click="() => openModalForm(userId)">
                  个人信息
                </a-anchor-link>
              </template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-poweroff />
              </template>
              <template #default>
                <a-anchor-link @click="logout">退出登录</a-anchor-link>
              </template>
            </a-doption>
          </template>
          <template v-else>
            <a-doption>
              <template #icon>
                <icon-idcard />
              </template>
              <template #default>
                <a-anchor-link href="/user/register">注册 </a-anchor-link>
              </template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-poweroff />
              </template>
              <template #default>
                <a-anchor-link href="/user/login">登录 </a-anchor-link>
              </template>
            </a-doption>
          </template>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
  <a-modal
    width="30%"
    :visible="visible"
    placement="right"
    @ok="handleOk"
    @cancel="closeModel"
    unmountOnClose
  >
    <div style="text-align: center">
      <a-upload
        action="/"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
      >
        <!-- :custom-request="uploadAvatar"-->

        <template #upload-button>
          <a-avatar :size="70" shape="circle">
            <img alt="头像" :src="userInfo?.userAvatar" />
          </a-avatar>
        </template>
      </a-upload>
    </div>
    <a-form
      label-align="right"
      title="个人信息"
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="账号" label="账号 :">
        <a-input
          disabled
          v-model="userInfo.userAccount"
          placeholder="请输入账号"
        />
      </a-form-item>
      <a-form-item field="昵称" label="昵称 :">
        <a-input v-model="userInfo.userName" placeholder="请输入用户昵称" />
      </a-form-item>
      <!-- <a-form-item field="邮箱" label="邮箱 :">
        <a-input v-model="userInfo.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item field="电话" label="电话 :">
        <a-input v-model="userInfo.phone" placeholder="请输入电话号码" />
      </a-form-item>
      <a-form-item field="用户状态" label="状态 :">
        <a-select v-model="userInfo.userState" placeholder="请输入用户状态">
          <a-option value="正常">正常</a-option>
          <a-option value="注销">注销</a-option>
          <a-option value="封号">封号</a-option>
        </a-select>
      </a-form-item> -->
      <a-form-item field="用户角色" label="角色 :">
        <a-select v-model="userInfo.userRole" placeholder="请输入用户角色">
          <a-option value="admin">管理员</a-option>
          <a-option value="user">普通用户</a-option>
          <a-option value="ban">已封禁</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="性别" label="性别 :">
        <a-select v-model="userInfo.gender" placeholder="请输入性别">
          <a-option :value="1">男</a-option>
          <a-option :value="0">女</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="userAvatar" label="头像 :">
        <a-textarea
          v-model="userInfo.userAvatar"
          placeholder="请输入头像地址"
        />
      </a-form-item>
      <a-form-item field="userProfile" label="简介 :">
        <a-textarea v-model="userInfo.userProfile" placeholder="请输入简介" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService, UserVO } from "../../generated";
import { FileItem, Message } from "@arco-design/web-vue";

const router = useRouter();
const store = useStore();
const file = ref();

const handleOk = async () => {
  userInfo.value?.gender
    ? (userInfo.value.gender = Number(userInfo.value?.gender))
    : "";
  const res = await UserControllerService.updateUserUsingPost(userInfo.value);
  // const res = await UserControllerService.postUserUpdate({
  //   ...userInfo.value,
  //   userAvatar: userAvatarImg,
  // });
  if (res.code === 0) {
    Message.success("更新成功！");
    visible.value = false;
  } else {
    Message.error("更新失败！", res.msg);
  }
};
const closeModel = () => {
  visible.value = false;
};

const onChange = async (_: never, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
  };
};

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "鱼皮管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
const logout = () => {
  UserControllerService.userLogoutUsingPost();
  location.reload();
};

const userInfo = ref<UserVO>();
const visible = ref(false);
const userId = store.state.user.loginUser.id;
/**
 * 打开弹窗,获取到用户信息
 */
const openModalForm = async (userId: any) => {
  console.log(store.state.user.loginUser);
  console.log(store.state.user.loginUser.id);
  const res = await UserControllerService.getUserByIdUsingGet(userId);
  userInfo.value = res.data;
  visible.value = true;
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
