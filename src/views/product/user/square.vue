<template>
  <!-- 广场页配置 -->
  <a-breadcrumb>
    <a-breadcrumb-item>产品中心</a-breadcrumb-item>
    <a-breadcrumb-item>产品数据</a-breadcrumb-item>
    <a-breadcrumb-item>广场配置</a-breadcrumb-item>
  </a-breadcrumb>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Banner配置">
      <bannercpm></bannercpm>
    </a-tab-pane>
    <a-tab-pane key="2" tab="网格模块配置">
      <gridmodule></gridmodule>
    </a-tab-pane>
    <a-tab-pane key="3" tab="瀑布流模块配置">
      <waterfall></waterfall>
    </a-tab-pane>
  </a-tabs>

  
</template>

<script setup lang="ts" name="userList">
import { defineComponent, ref,reactive,toRef , createVNode,computed,onMounted,getCurrentInstance } from "vue";
import bannercpm from "./components/banner.vue"
import gridmodule from "./components/gridmodule.vue"
import waterfall from "./components/waterfall.vue"
import * as $const from "@/utils/const";
import { message } from "ant-design-vue";
const { proxy }  = getCurrentInstance();
  // name: "userList"
  const activeKey = ref('1');
  
  onMounted(() => {
    
  })

</script>
<style lang="scss" scoped>
  
</style>
