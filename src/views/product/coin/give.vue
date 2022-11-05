<template>
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>代币管理</a-breadcrumb-item>
    <a-breadcrumb-item>代币赠送</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="mt20">
    <a-button
      type="primary"
      @click="
        resetForm();
        visible = true;
      "
      >新建</a-button
    >
  </div>

  <div class="mt20">
    <a-table
      class="ant-table-striped"
      size="middle"
      :columns="columns"
      :data-source="data"
      :pagination="{
        total: total,
        current: query.pageNum,
        pageSize: 20,
        showSizeChanger: false,
        showTotal: (total) => `共 ${total} 条`,
      }"
      @change="onChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'activityType'">
          {{
            activityType[record.activityType > 2 ? "1" : record.activityType]
              .text
          }}
        </template>
        <template v-if="column.dataIndex === 'activityDo'">
          {{ activityDo[record.activityDo || 1].text }}
        </template>
        <template v-if="column.dataIndex === 'personConf'">
          {{ personConf[record.personConf || 0].text }}
        </template>
        <template v-if="column.title === '编辑'">
          <a @click="edit(record)">编辑</a>
        </template>
        <template v-if="column.title === '操作'">
          <a-switch
            v-model:checked="record.status"
            :checkedValue="1"
            :unCheckedValue="0"
            @change="switchChange(record)"
          />
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="visible"
    title="新建/编辑代币赠送配置"
    @ok="handleOk"
  >
    <a-form
      ref="form"
      layout="horizontal"
      :model="form"
      name="basic"
      autocomplete="off"
    >
      <a-form-item
        label="任务类型"
        name="activityType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.activityType">
          <a-select-option
            :value="el.id"
            v-for="el in activityType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="代币类型"
        name="rewardType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.rewardType">
          <a-select-option
            :value="el.id"
            v-for="el in coinType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="任务名称"
        name="activityDo"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.activityDo">
          <a-select-option
            :value="el.id"
            v-for="el in activityDo.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="赠送代币金额"
        name="rewardCount"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number v-model:value="form.rewardCount" :precision="0" />
      </a-form-item>
      <a-form-item
        label="次数限制（每天）"
        name="dayLimit"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number v-model:value="form.dayLimit" :precision="0" />
      </a-form-item>
      <a-form-item label="人群设定" name="personConf"> 全部用户 </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
// @ is an alias to /src
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, createVNode } from "vue";

import { post, put } from "@/utils/axios";
import * as $const from "@/utils/const";
import { message } from "ant-design-vue";
export default {
  name: "userList",
  components: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 20,
      },
      columns: [
        { title: "任务类型", dataIndex: "activityType" },
        { title: "任务名称", dataIndex: "activityDo" },
        { title: "赠送代币金额", dataIndex: "rewardCount" },
        { title: "次数限制（每天）", dataIndex: "dayLimit" },
        { title: "人群设定", dataIndex: "personConf" },
        { title: "创建时间", dataIndex: "createDate" },
        { title: "编辑", dataIndex: "" },
        { title: "操作", dataIndex: "" },
      ],
      data: [],
      total: 0,
      visible: false,
      form: {
        operatingSys: 1,
        productType: 1,
        status: 1,
        personConf: 0,
      },
    };
  },
  computed: {
    activityType() {
      return $const.activityType;
    },
    activityDo() {
      return $const.activityDo;
    },
    coinType() {
      return $const.coinType;
    },
    personConf() {
      return $const.personConf;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      let { data } = await post("/activity/page", this.query);
      this.data = data.records;
      this.total = data.total;
    },
    onChange({ current }) {
      this.query.pageNum = current;
      this.load();
    },
    edit(record) {
      // let form = JSON.parse(JSON.stringify(record));
      this.form = record;
      this.visible = true;
    },
    async handleOk() {
      let res = await this.$refs.form.validate();
      console.log(res);
      if (res.errorFields) {
        //
      } else {
        let form = JSON.parse(JSON.stringify(this.form));
        if (form.id) {
          //编辑
          let { code, msg } = await put("/activity", form).catch((e) => {
            console.log("eee:", e);
            message.info("出错啦");
          });

          if (code == 0) {
            this.visible = false;
            this.load();
          } else {
            message.info(msg);
          }

          this.visible = false;
        } else {
          let { code, msg } = await post("/activity/save", form).catch(
            (e) => {
              console.log("eee:", e);
              message.info("出错啦");
            }
          );

          if (code == 0) {
            this.visible = false;
            this.load();
          } else {
            message.info(msg);
          }

          this.visible = false;
        }

        this.visible = false;
      }
    },
    async switchChange(record) {
      console.log(record);
      let { code, msg } = await put("/activity", record);
    },
    resetForm() {
      this.form = {
        operatingSys: 1,
        productType: 1,
        status: 1,
        personConf: 0,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .dl {
    width: 500px;
    .dt {
      font-size: 30px;
      text-align: center;
      margin-bottom: 50px;
    }
  }
}
</style>
