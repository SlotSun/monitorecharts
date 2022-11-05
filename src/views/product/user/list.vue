<template>
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>用户管理</a-breadcrumb-item>
    <a-breadcrumb-item>用户列表</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="mt20">
    <a-form layout="inline" :model="form" name="basic" autocomplete="off">
      <a-form-item label="用户ID" name="username">
        <a-input v-model:value="form.id"></a-input>
      </a-form-item>
      <a-form-item label="手机号" name="username">
        <a-input v-model:value="form.mobile"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="load">查询</a-button>
        <a-button type="primary" class="ml20" htmlType="reset">重置</a-button>
      </a-form-item>
    </a-form>
  </div>

  <div class="mt20">
    <a-table
      class="ant-table-striped"
      size="middle"
      :columns="columns"
      :data-source="data"
      :pagination="{
        total: total,
        current: form.pageNum,
        pageSize: form.pageSize,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '80'],
        onChange:(page,pageSize)=>onPageChange(page,pageSize),
      }"
      @change="onChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.title === '头像'">
          <a-popover placement="rightTop">
            <template #content>
              <img :src="record.avatar" width="100" />
            </template>
            <img :src="record.avatar" width="20" />
          </a-popover>
        </template>
        <template v-if="column.title === '付费状态'">
          {{ payFlag[record.payFlag].text }}
        </template>
        <template v-if="column.title === '创建时间'">
          {{  dayjs(record.createDate).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        
        <template v-if="column.title === '上次登陆时间'">
          {{  dayjs(record.updateDate).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.title === '操作'">
          <a @click="del(record.id)">封禁</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, createVNode } from "vue";
import dayjs  from "dayjs"
import { post, put } from "@/utils/axios";
import * as $const from "@/utils/const";

export default {
  name: "userList",
  components: {},
  data() {
    return {
      form: {
        id: "",
        mobile: "",
        pageNum: 1,
        pageSize: 20,
      },
      dayjs:dayjs,
      columns: [
        { title: "用户id", dataIndex: "id" },
        { title: "用户名", dataIndex: "username" },
        { title: "头像", dataIndex: "avatar" },
        { title: "手机号", dataIndex: "mobile" },
        { title: "wx_openid", dataIndex: "openid" },
        { title: "wx_unionid", dataIndex: "uniId" },
        { title: "会员状态", dataIndex: "vip" },
        { title: "付费状态", dataIndex: "payFlag" },
        { title: "创建时间", dataIndex: "createDate" },
        { title: "上次登陆时间", dataIndex: "updateDate" },
        // { title: "操作", dataIndex: "id" },
      ],
      data: [],
      total: 0,
    };
  },
  computed: {
    payFlag() {
      return $const.payFlag;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      let { data } = await post("/svuser/page", this.form);
      this.data = data.records;
      this.total = data.total;
    },
    onChange({ current }) {
      this.form.pageNum = current;
      this.load();
    },
    del(id) {
      let t = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "确定此操作？",
        async onOk() {
          await put("/svuser", {
            id: id,
            status: $const.status[0].id,
          });
          t.load();
        },
      });
    },
    onPageChange(page,pageSize){
      console.log(page,pageSize)
      this.form.pageSize = pageSize
    }
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
