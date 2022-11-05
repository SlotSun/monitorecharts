<template>
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>代币管理</a-breadcrumb-item>
    <a-breadcrumb-item>代币购买</a-breadcrumb-item>
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
        <template v-if="column.title === '代币类型'">
          {{ coinType[record.vcoinType].text }}
        </template>
        <template v-if="column.title === '优惠类型'">
          {{ discountType[record.discountType].text }}
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
        label="名称"
        name="title"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-model:value="form.title" maxlength="20" />
      </a-form-item>
      <a-form-item
        label="代币类型"
        name="vcoinType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.vcoinType">
          <a-select-option
            :value="el.id"
            v-for="el in coinType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="充值金额"
        name="amount"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number :min="0" v-model:value="form.amount" :precision="2" />
      </a-form-item>
      <a-form-item
        label="优惠类型"
        name="discountType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select v-model:value="form.discountType">
          <a-select-option
            :value="el.id"
            v-for="el in discountType.list"
            :key="el.id"
            >{{ el.text }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="购买代币"
        name="vcoinCount"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number
          :min="0"
          v-model:value="form.vcoinCount"
          :precision="0"
        />
      </a-form-item>
      <a-form-item
        label="赠送代币"
        name="vcoinReward"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input-number
          :min="0"
          v-model:value="form.vcoinReward"
          :precision="0"
        />
      </a-form-item>
      <a-form-item label="人群设定" name="personConf"> 全部用户 </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
// @ is an alias to /src
import { post, put } from "@/utils/axios";
import { coinType, discountType, personConf } from "@/utils/const";
import { message } from "ant-design-vue";

export default {
  name: "coinBuyList",
  components: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 20,
      },
      columns: [
        { title: "代币类型", dataIndex: "vcoinType" },
        { title: "充值金额", dataIndex: "amount" },
        { title: "优惠类型", dataIndex: "discountType" },
        { title: "实际金额", dataIndex: "amount" },
        { title: "代币金额", dataIndex: "vcoinCount" },
        { title: "赠送代币", dataIndex: "vcoinReward" },
        { title: "创建时间", dataIndex: "createDate" },
        { title: "人群设定", dataIndex: "personConf" },
        { title: "编辑", dataIndex: "" },
        { title: "操作", dataIndex: "" },
      ],
      data: [],
      total: 0,
      visible: false,
      form: {
        amount: 0,
        delFlag: 0,
        discountType: 2,
        iconUrl: "",
        operatingSys: 1,
        personConf: 0,
        productType: 1,
        status: 1,
        title: "",
        vcoinCount: 0,
        vcoinReward: 0,
        vcoinType: 1,
      },
    };
  },
  computed: {
    coinType() {
      return coinType;
    },
    discountType() {
      return discountType;
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
      let { data } = await post("/vcoin/page", this.query);
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
          //编辑
          let { code, msg } = await put("/vcoin", this.form).catch((e) => {
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
          let { code, msg } = await post("/vcoin/save", this.form).catch(
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
      }
    },
    async switchChange(record) {
      console.log(record);
      let { code, msg } = await put("/vcoin", record);
    },
    resetForm() {
      this.form = {
        amount: 0,
        delFlag: 0,
        discountType: 2,
        iconUrl: "",
        operatingSys: 1,
        personConf: 0,
        productType: 1,
        status: 1,
        title: "",
        vcoinCount: 0,
        vcoinReward: 0,
        vcoinType: 1,
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
