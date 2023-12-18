<template>
  <a-card title="个人信息">
    头像<a-space direction="vertical" :style="{ width: '100%' }">
      <a-upload
        action="/"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        @progress="onProgress"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
              file && file.status === 'error'
                ? ' arco-upload-list-item-error'
                : ''
            }`"
          >
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="file && file.url"
            >
              <img :src="file.url" />
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
              <a-progress
                v-if="file.status === 'uploading' && file.percent < 100"
                :percent="file.percent"
                type="circle"
                size="mini"
                :style="{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                }"
              />
            </div>
            <div class="arco-upload-picture-card" v-else>
              <div class="arco-upload-picture-card-text">
                <IconPlus />
                <div style="margin-top: 10px; font-weight: 600">Upload</div>
              </div>
            </div>
          </div>
        </template>
      </a-upload>
    </a-space>
    <a-card :style="{ marginBottom: '10px' }" title="姓名">
      <template #extra>
        <a-link>More</a-link>
      </template>
      Inner Card Content
    </a-card>
    <a-card title="性别">
      <template #extra>
        <a-link>More</a-link>
      </template>
      Inner Card Content
    </a-card>
  </a-card>
</template>

<script>
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";

export default {
  components: { IconPlus, IconEdit },
  setup() {
    const file = ref();

    const onChange = (_, currentFile) => {
      file.value = {
        ...currentFile,
        // url: URL.createObjectURL(currentFile.file),
      };
    };
    const onProgress = (currentFile) => {
      file.value = currentFile;
    };
    return {
      file,
      onChange,
      onProgress,
    };
  },
};
</script>

<!--<template>-->
<!--  <a-card title="个人信息">-->
<!--    <a-card :style="{ marginBottom: '10px' }" title="姓名">-->
<!--      <template #extra>-->
<!--        <a-link>More</a-link>-->
<!--      </template>-->
<!--      Inner Card Content-->
<!--    </a-card>-->
<!--    <a-card title="性别">-->
<!--      <template #extra>-->
<!--        <a-link>More</a-link>-->
<!--      </template>-->
<!--      Inner Card Content-->
<!--    </a-card>-->
<!--  </a-card>-->
<!--</template>-->
<!--<template>-->
<!--  <a-space size="large">-->
<!--    <a-avatar-->
<!--      :trigger-icon-style="{ color: '#3491FA' }"-->
<!--      :auto-fix-font-size="false"-->
<!--      @click="toast"-->
<!--      :style="{ backgroundColor: '#168CFF' }"-->
<!--    >-->
<!--      A-->
<!--      <template #trigger-icon>-->
<!--        <IconCamera />-->
<!--      </template>-->
<!--    </a-avatar>-->
<!--    <a-avatar @click="toast" :style="{ backgroundColor: '#14C9C9' }">-->
<!--      <IconUser />-->
<!--      <template #trigger-icon>-->
<!--        <IconEdit />-->
<!--      </template>-->
<!--    </a-avatar>-->
<!--    <a-avatar-->
<!--      @click="toast"-->
<!--      shape="square"-->
<!--      :style="{ backgroundColor: '#FFC72E' }"-->
<!--    >-->
<!--      <IconUser />-->
<!--      <template #trigger-icon>-->
<!--        <IconEdit />-->
<!--      </template>-->
<!--    </a-avatar>-->
<!--    <a-avatar trigger-type="mask">-->
<!--      <img-->
<!--        alt="avatar"-->
<!--        src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"-->
<!--      />-->
<!--      <template #trigger-icon>-->
<!--        <IconEdit />-->
<!--      </template>-->
<!--    </a-avatar>-->
<!--  </a-space>-->
<!--</template>-->

<!--<script>-->
<!--import { IconCamera, IconEdit, IconUser } from "@arco-design/web-vue/es/icon";-->

<!--export default {-->
<!--  components: { IconCamera, IconEdit },-->
<!--  methods: {-->
<!--    toast() {-->
<!--      this.$message.info("Uploading...");-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped></style>-->
