<template>
  <div class="home">

    <div class="pagedata">风机数据监控</div>
    <div class="content">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div style="width: 400px;height:200px;">
        <div id="1main1" style="width: 200px;height:200px;background-color: cadetblue"
             @click="router.push('/chart?id=1')">
          风机1
        </div>
        <div id="2main1" style="width: 200px;height:200px;background-color: coral"
             @click="router.push('/PredictChart?id=1')">
          风机1预测
        </div>

      </div>
      <div style="width: 400px;height:200px;">
        <div id="1main2" style="width:200px;height:200px;background-color:cadetblue" @click="router.push('/chart?id=2')">
          风机2
        </div>
        <div id="2main2" style="width:200px;height:200px;background-color: coral"
             @click="router.push('/PredictChart?id=2')">风机2预测
        </div>

      </div>


    </div>
    <div class="logo">
      <img src="public/logo.jpg" alt="logo">
    </div>
    <div class="logotel">联系方式：05613296886</div>
  </div>

</template>

<script setup>

import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
import {post, get, put} from "@/utils/axios";
import {onMounted} from "vue";

console.log('1111')

</script>

<style lang="less" scoped>
img{
  width: 220px;
  height: 170px;
}
.home {
  width: 100%;
  height: 100%;

  .pagedata {
    text-align: center;
    font-size: 48px;
    font-weight: 600;
    color: #333;
    margin: 20px auto 60px;
  }

  .content {
    position: absolute;
    left: 20%;
    right: 20%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .content div {
    cursor: pointer;
    width: 30%;
    //margin-bottom: 60px;
    background-color: bisque;
    font-weight: bold;
    font-size: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    width: 150px;
    height: 150px;
    display: flow;
    background-color: red;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .logotel {
    width: 220px;
    height: 150px;
    justify-content: center;
    align-items: center;
    text-align: center;
    display: flow;
    font-size: 18px;
    position: absolute;
    top: 150px;
    left: 0px;
  }
}
</style>
