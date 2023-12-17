<template>
  <div id="ViewQuestionsView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs
          default-active-key="question"
          @tab-click="queryMySubmitRecording"
        >
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="题目限制"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  <a-tag>{{ question.judgeConfig.timeLimit ?? 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  <a-tag>{{ question.judgeConfig.memoryLimit ?? 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  <a-tag>{{ question.judgeConfig.stackLimit ?? 0 }}</a-tag>
                </a-descriptions-item>
              </a-descriptions>
              <template #extra>
                <a-link>
                  <a-space wrap style="margin-left: 0">
                    <a-tag
                      v-for="(tag, index) of question.tags"
                      :key="index"
                      color="green"
                      >{{ tag }}
                    </a-tag>
                  </a-space>
                </a-link>
              </template>
              <MdView :value="question.content || ''" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="recording" title="提交记录">
            <a-table
              :columns="columns"
              :data="dataList"
              :stripe="true"
              :table-layout-fixed="true"
              :loading="isLoading"
              :pagination="{
                total: total,
                showTotal: true,
                pageSize: searchParams.pageSize,
                current: searchParams.current,
              }"
              @page-change="onPageChange"
            >
              <template #createTime="{ record }">
                {{ moment(record.createTime).format("yyyy-MM-DD HH:mm:ss") }}
              </template>
              <template #status="{ record }">
                <a-space wrap>
                  <a-tag v-if="record.status === 0" color="grey">待判题</a-tag>
                  <a-tag v-if="record.status === 1" color="blue">判题中</a-tag>
                  <a-tag v-if="record.status === 2" color="green">已完成</a-tag>
                  <a-tag v-if="record.status === 3" color="red">失败</a-tag>
                </a-space>
              </template>
              <template #judgeInfo="{ record }">
                <div>
                  <a-tag color="#11264f"
                    >{{ "结果: " + record.judgeInfo.message }}
                  </a-tag>
                  <a-tag color="#145b7d"
                    >{{ "耗时: " + record.judgeInfo.time + " ms" }}
                  </a-tag>
                  <a-tag color="#009ad6"
                    >{{ "内存: " + record.judgeInfo.memory + " kb" }}
                  </a-tag>
                </div>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="answer" title="答案">
            <a-tabs
              default-active-key="go"
              type="rounded"
              size="small"
              position="left"
            >
              <a-tab-pane key="go" title="go">
                <div style="height: 58.5vh; min-height: 380px; overflow: auto">
                  <Viewer
                    :value="question?.answer ?? '此题暂未提供答案'"
                    :plugins="plugins"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane key="java" title="java">
                <div style="height: 58.5vh; min-height: 380px; overflow: auto">
                  <Viewer
                    :value="question?.answer ?? '此题暂未提供答案'"
                    :plugins="plugins"
                  />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
          <a-tab-pane key="comments" title="评论"> 暂未开放评论</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="12">
        <a-form :model="form" :layout="'inline'">
          <a-form-item field="language" label="语言">
            <a-select
              :style="{ width: '150px' }"
              placeholder="选择语言"
              v-model="form.language"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language as string"
          :handle-change="changeCode"
        />
        <a-button
          :loading="isLoading"
          type="primary"
          style="margin-top: 20px; min-width: 200px"
          @click="doSubmit"
          >提 交
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, ref, withDefaults, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitQueryRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdView from "@/components/MdViewer.vue";
import moment from "moment/moment";
import { Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";

interface Props {
  id: string;
}

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

//todo 根据选择的编程语言，设置代码的模版内容
// const GetAnswerTemplate = () => {
//   if (question.value?.answerTemplate == "") {
//     return;
//   }
//   const answerTemplate = JSON.parse(question.value?.answerTemplate ?? "{}");
//   console.log("answerTemplate", answerTemplate);
//   if (
//     form.value.language &&
//     answerTemplate[form.value.language] &&
//     answerTemplate[form.value.language] != null
//   ) {
//     form.value.code = answerTemplate[form.value.language];
//   }
//   // console.log("更换语言的答案模版", form.value.code);
// };

const searchParams = ref<QuestionSubmitQueryRequest>({
  pageSize: 5,
  current: 1,
  questionId: 0,
});
const dataList = ref([]);
const total = ref(0);
let isLoading = ref(false);
const columns = [
  {
    title: "语言",
    align: "center",
    dataIndex: "language",
  },
  {
    title: "代码",
    ellipsis: true,
    tooltip: true,
    dataIndex: "code",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    align: "center",
    slotName: "status",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code:
    "public class Main {\n" +
    "        public static void main(String[] args) {\n" +
    "            int a = Integer.parseInt(args[0]);\n" +
    "            int b = Integer.parseInt(args[1]);\n" +
    "            System.out.println(a + b);\n" +
    "        }\n" +
    "    }",
});
const queryMySubmitRecording = async () => {
  isLoading.value = !isLoading.value;
  const res =
    await QuestionControllerService.listMyQuestionSubmitByPageUsingPost({
      ...searchParams.value,
      id: props.id as any,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("查询失败,", res.message);
    isLoading.value = false;
  }
  isLoading.value = false;
};
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const question = ref<QuestionVO>();
const loadData = async () => {
  isLoading.value = true;
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
    console.log(question.value);
    isLoading.value = false;
  } else {
    message.error("加载失败" + res.message);
    isLoading.value = false;
  }
  isLoading.value = false;
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  form.value.questionId = props.id as any;
  searchParams.value.questionId = props.id as any;
  loadData();
});
watchEffect(() => {
  loadData();
});
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  queryMySubmitRecording();
};
/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  isLoading.value = !isLoading.value;
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
    isLoading.value = false;
  } else {
    message.error("提交失败," + res.message);
    isLoading.value = false;
  }
  isLoading.value = false;
};

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>
<style scoped>
#ViewQuestionsView {
  max-width: 1400px;
  margin: 0 auto;
}

#ViewQuestionsView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
