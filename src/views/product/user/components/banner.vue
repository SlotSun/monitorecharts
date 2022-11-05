<template>
  <div class="mt20">
        <a-button
          type="primary"
          @click="resetForm();tab1visible = true;">新建</a-button>
      </div>

      <div class="mt20">
        <a-table
          class="ant-table-striped"
          size="middle"
          :columns="columns"
          :data-source="data"
          @resizeColumn="handleResizeColumn"
          :pagination="{
            total: total,
            current: querytab1.pageNum,
            pageSize: 20,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }"
          @change="onChange">
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'sort'">
              <!-- {{activityType[record.activityType > 2 ? "1" : record.activityType].text}} -->
              {{record.sort}}
            </template>
            <template v-if="column.dataIndex === 'dramaId'">
              {{ record.dramaId }}
            </template>
            <template v-if="column.dataIndex === 'imageUrl'">
              <a-image
              :width="100"
              :height="100"
              :src="record.imageUrl"
              fallback="data:image/png;base64,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"/>
            </template>
            
            <template v-if="column.title === '编辑'">
              <a @click="edit(record)">编辑</a>
            </template>
            <template v-if="column.title === '操作'">
              <a-switch
                v-model:checked="record.status"
                :checkedValue="1"
                :unCheckedValue="0"
                @change="switchChange(record)"/>
            </template>
          </template>
        </a-table>
      </div>
      <a-modal
      v-model:visible="tab1visible"
      title="新建banner"
      @ok="handleOk">
      <a-form
        ref="form"
        layout="horizontal"
        :model="formdata"
        name="basic"
        autocomplete="off">
        <a-form-item
          label="标题"
          name="title"
          :rules="[{ required: true, message: '' }]">
          <a-input v-model:value="formdata.title" />
        </a-form-item>
        <a-form-item
          label="整剧ID"
          name="dramaId"
          :rules="[{ required: true, message: '' }]">
          <a-input-number v-model:value="formdata.dramaId" :precision="0" />
        </a-form-item>
        <a-form-item
          label="序号"
          name="sort"
          :rules="[{ required: true, message: '' }]">
          <a-input-number v-model:value="formdata.sort" :precision="0" />
        </a-form-item>
      <a-upload
        name="file"
        action="/api/upload/uploadfile"
        :accept="acceptext()"
        :before-upload="uploadBeforeUpload"
        @change="uploadHandleChange"
        :showUploadList="false"
        :multiple="true"
        v-model:file-list="fileList"
      >
        <a-button type="primary"> 上传</a-button>
      </a-upload>
      
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
  import { Modal } from "ant-design-vue";
  import { defineComponent, ref,reactive,toRef , createVNode,computed,onMounted,getCurrentInstance } from "vue";
  import { post, put } from "@/utils/axios";
  import * as $const from "@/utils/const";
  import { message } from "ant-design-vue";
  const { proxy }  = getCurrentInstance();
  interface Ref<T> {
    value: T
  }
  const data = ref([]);
  const total = ref(0);
  const columns = ref([
    { title: "序号", dataIndex: "sort", key: "sort",resizable:true,width: 150 },
    { title: "标题", dataIndex: "title",resizable:true,width: 150 },
    { title: "整剧id", dataIndex: "dramaId",resizable:true,width: 150 },
    { title: "素材图", dataIndex: "imageUrl",resizable:true,width: 150 },
    { title: "创建时间", dataIndex: "createDate",resizable:true,width: 150 },
    { title: "编辑", dataIndex: "",resizable:true,width: 150 },
    { title: "操作", dataIndex: "" },
  ]);
  const resetForm = () => {
    formdata.value = {
      operatingSys: 1,
      productType: 1,
      status: 1,
    };
  }
  const bannerurl = ref('')
  
  const fileList = ref([]);
  const tab1visible = ref(false);
  const formdata = ref({
    operatingSys: 1,
    productType: 1,
    status: 1
  })
  onMounted(() => {
    load();
  })
  const querytab1 = reactive({
    pageNum: 1,
    pageSize: 20,
    moduleType:1
  })
  const uploadHandleChange = ({ file, fileList }) => {
    console.log(file, fileList);
    if(file.status ==  "done"){
      bannerurl.value = file.response.data
    }
  }
  const load = async () => {
    let req = await post("/homeConfig/page", querytab1);
    console.log('data222' ,req)
    data.value = req.data.records;
    total.value = req.data.total;
  }
  const acceptext = () => {
    return "image/*,.jpg,.png,";
  }
  const edit = (record) => {
    console.log('编辑', record)
    formdata.value = record;
    tab1visible.value = true;
    console.log('编辑11', formdata)
  }
  const handleOk = async () => {
    let res = await proxy.$refs.form?.validate();
    console.log('handleOk',res , formdata);
    // return;
    if (res.errorFields) {
      //
    } else {
      // let form = JSON.parse(JSON.stringify(form));
      
    // console.log('handleOk',res , formdata);
    return;
      if (formdata.id) {
        //编辑
        let { code, msg } = await put("/activity", formdata).catch((e) => {
          console.log("eee:", e);
          message.info("出错啦");
        });

        if (code == 0) {
          load();
        } else {
          message.info(msg);
        }
      } else { // 新建
        res.productType = 1;
        res.operatingSys = 1
        res.moduleType = querytab1.moduleType
        res.imageUrl = bannerurl.value
        
        let { code, msg } = await post("/homeConfig/save", res).catch(
          (e) => {
            console.log("eee:", e);
            message.info("出错啦");
          }
        );

        if (code == 0) {
          bannerurl.value = "";
          load();
        } else {
          message.info(msg);
        }
      }
      tab1visible.value = false;
    }
  }
</script>