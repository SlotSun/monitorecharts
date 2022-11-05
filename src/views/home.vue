<template>
  <div class="home">

    <div class="pagedata">风机数据监控表</div>
    <div class="content">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main1" style="width: 600px;height:400px;" @click="router.push('/chart?id=1')">
        风机1
      </div>
      <div id="main1" style="width: 600px;height:400px;" @click="router.push('/chart?id=2')">风机2</div>
    </div>
  </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
import { post, get,put } from "@/utils/axios";
import { onMounted } from "vue";
console.log('1111')
    
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;

  .pagedata {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin: 20px auto 60px;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .content div {
    width: 30%;
    margin-bottom: 60px;
    background-color: bisque;
    font-weight: bold;
    font-size: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
