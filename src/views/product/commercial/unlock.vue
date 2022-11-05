<template>
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>产品商业化</a-breadcrumb-item>
    <a-breadcrumb-item>剧集解锁</a-breadcrumb-item>
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
        <template v-if="column.title === '解锁方式'">
          {{ unlockType[record.unlockType].text }}
        </template>
        <template v-if="column.title === '弹窗确认'">
          {{ box[record.box].text }}
        </template>
        <template v-if="column.dataIndex === 'personConf'">
          {{ personConf[record.personConf || 0].text }}
        </template>
        <template v-if="column.title === '剧集目录'"> 全部 </template>
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
        label="名称"
        name="title"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-model:value="form.title" maxlength="20" />
      </a-form-item>
      <a-form-item
        label="解锁方式"
        name="unlockType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.unlockType">
          <a-select-option
            :value="el.id"
            v-for="el in unlockType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="弹窗确认"
        name="box"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.box">
          <a-select-option :value="el.id" v-for="el in box.list" :key="el.id">{{
            el.text
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="代币金额"
        name="virtualCoinCount"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number
          id="inputNumber"
          v-model:value="form.virtualCoinCount"
          :min="1"
          :max="999999999"
          :precision="0"
        />
      </a-form-item>
      <a-form-item label="剧集目录" name="c"> 全部 </a-form-item>
      <a-form-item
        label="解锁开始"
        name="unlockStart"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number
          :min="1"
          :max="999999"
          :precision="0"
          v-model:value="form.unlockStart"
        />
      </a-form-item>
      <!-- <a-form-item
        label="解锁结束"
        name="unlockEnd"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number :min="0" :max="999999" v-model:value="form.unlockEnd" />
      </a-form-item> -->
      <a-form-item label="人群设定" name="personConf"> 全部用户 </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
// @ is an alias to /src
import { post, put } from "@/utils/axios";
import { unlockType, box, personConf } from "@/utils/const";
import { message } from "ant-design-vue";
export default {
  name: "unlockView",
  components: {},
  data() {
    return {
      query: {
        id: "",
        mobile: "",
        pageNum: 1,
        pageSize: 20,
      },
      columns: [
        { title: "解锁方式", dataIndex: "unlockType" },
        { title: "代币金额", dataIndex: "virtualCoinCount" },
        { title: "弹窗确认", dataIndex: "box" },
        { title: "人群设定", dataIndex: "personConf" },
        { title: "剧集目录", dataIndex: "" },
        { title: "解锁开始", dataIndex: "unlockStart" },
        // { title: "解锁结束", dataIndex: "unlockEnd" },
        { title: "创建时间", dataIndex: "createDate" },
        { title: "编辑", dataIndex: "" },
        { title: "操作", dataIndex: "" },
      ],
      data: [],
      total: 0,
      visible: false,
      form: {
        title: "",
        box: 0,
        delFlag: 0,
        personConf: 0,
        status: 1,
        unlockEnd: 0,
        unlockStart: 1,
        unlockType: 1,
        virtualCoinCount: "",
        operatingSys: 1,
        productType: 1,
      },
    };
  },
  computed: {
    unlockType() {
      return unlockType;
    },
    box() {
      return box;
    },
    personConf() {
      return personConf;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      let { data } = await post("/unlockconfig/page", this.query);
      this.data = data.records;
      this.total = data.total;
    },
    onChange({ current }) {
      this.query.pageNum = current;
      this.load();
    },
    edit(record) {
      this.form = JSON.parse(JSON.stringify(record));
      this.visible = true;
    },
    async handleOk() {
      let res = await this.$refs.form.validate();
      console.log(res);
      if (res.errorFields) {
        //
      } else {
        if (this.form.id) {
          let { code, msg } = await put("/unlockconfig", this.form).catch(
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
        } else {
          let { code, msg } = await post("/unlockconfig/save",
            this.form
          ).catch((e) => {
            console.log("eee:", e);
            message.info("出错啦");
          });

          if (code == 0) {
            this.visible = false;
            this.load();
          } else {
            message.info(msg);
          }
        }
      }
    },
    async switchChange(record) {
      console.log(record);
      let { code, msg } = await put("/unlockconfig", record);
    },
    resetForm() {
      this.form = {
        title: "",
        box: 0,
        delFlag: 0,
        personConf: 0,
        status: 1,
        unlockEnd: 0,
        unlockStart: 1,
        unlockType: 1,
        virtualCoinCount: "",
        operatingSys: 1,
        productType: 1,
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
