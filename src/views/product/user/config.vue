<template>
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>用户管理</a-breadcrumb-item>
    <a-breadcrumb-item>会员配置</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="mt20">
    <a-button
      type="primary"
      @click="
        resetForm();
        visible = true;
      "
      >新增</a-button
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
      }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.title === '会员类型'">
          {{ vipType[record.vipType] && vipType[record.vipType].text }}
        </template>
        <template v-if="column.title === '会员周期'">
          {{ dateValue[record.dateValue].text }}
        </template>
        <template v-if="column.title === '会员折扣'">
          {{ discountValue[record.discount].text }}
        </template>
        <template v-if="column.title === '折扣价格'">
          {{ (record.count * record.discount).toFixed(2) }}
        </template>
        <template v-if="column.dataIndex === 'personConf'">
          {{ personConf[record.personConf || 0].text }}
        </template>
        <template v-if="column.title === '操作'">
          <a-switch
            v-model:checked="record.status"
            :checkedValue="1"
            :unCheckedValue="0"
            @change="switchChange(record)"
          />
        </template>
        <template v-if="column.title === '编辑'">
          <a @click="edit(record)">编辑</a>
        </template>
      </template>
    </a-table>
  </div>

  <a-modal v-model:visible="visible" title="新建/编辑会员配置" @ok="handleOk">
    <a-form
      ref="form"
      layout="horizontal"
      :model="form"
      name="basic"
      autocomplete="off"
    >
      <a-form-item
        label="名称"
        name="name"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-model:value="form.name" maxlength="20" />
      </a-form-item>
      <a-form-item
        label="会员类型"
        name="vipType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.vipType">
          <a-select-option
            :value="el.id"
            v-for="el in vipType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="会员周期"
        name="dateValue"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.dateValue">
          <a-select-option
            :value="el.id"
            v-for="el in dateValue.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="会员价格"
        name="count"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number v-model:value="form.count" :precision="0" />
      </a-form-item>
      <a-form-item
        label="会员折扣"
        name="discount"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.discount">
          <a-select-option
            :value="el.id"
            v-for="el in discountValue.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="会员折扣价格" name="">
        {{
          form.count && form.discount
            ? (form.count * form.discount).toFixed(2)
            : ""
        }}元
      </a-form-item>
      <!-- <a-form-item
        label="会员权益"
        name="c"
        :rules="[{ required: true, message: '请输入电话' }]"
      >
        <a-select />
      </a-form-item> -->
      <a-form-item label="人群设定" name=""> 全部用户 </a-form-item>
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
  name: "userConfigList",
  components: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 20,
      },
      columns: [
        { title: "会员类型", dataIndex: "vipType" },
        { title: "名称", dataIndex: "name" },
        { title: "会员周期", dataIndex: "dateValue" },
        { title: "会员价格", dataIndex: "count" },
        { title: "会员折扣", dataIndex: "discount" },
        { title: "折扣价格", dataIndex: "" },
        // { title: "会员权益", dataIndex: "" },
        { title: "人群设定", dataIndex: "personConf" },
        { title: "操作", dataIndex: "" },
        { title: "编辑", dataIndex: "" },
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
    vipType() {
      return $const.vipType;
    },
    dateValue() {
      return $const.dateValue;
    },
    discountValue() {
      return $const.discountValue;
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
      let { data } = await post("/svRoleConfig/page", this.form);
      this.data = data.records;
      this.total = data.total;
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
          //编辑
          let { code, msg } = await put("/svRoleConfig", this.form).catch(
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
        } else {
          let { code, msg } = await post("/svRoleConfig/save",
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

          this.visible = false;
        }

        this.visible = false;
      }
    },
    async switchChange(record) {
      console.log(record);
      let { code, msg } = await put("/svRoleConfig", record);
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
