<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <div style="margin-bottom: 8px">
          <a
            href="https://github.com/linxun1209/xingchenOJ-backend"
            target="_blank"
            >GitHub</a
          >
          <a href="https://github.com/linxun1209" target="_blank"
            ><icon-github :size="14"
          /></a>
          <a
            href="https://blog.csdn.net/weixin_60257072?spm=1000.2115.3001.5343"
            target="_blank"
            ><icon-book :size="14"
          /></a>
        </div>
        <div>
          <a style="olor: rgba(0, 0, 0, 0.88); margin-right: 4px"
            ><icon-copyright :size="16"
          /></a>
          <a style="color: rgba(0, 0, 0, 0.88)">2023 程序员-林寻出品</a>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  background: linear-gradient(to right, #bbb, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
