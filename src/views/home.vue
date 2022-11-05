<template>
  <div class="home">

    <div class="pagedata">风机数据监控表</div>
    <div class="content">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main1" style="width: 600px;height:400px;"></div>
      <div id="main2" style="width: 600px;height:400px;"></div>
      <div id="main3" style="width: 600px;height:400px;"></div>
      <div id="main4" style="width: 600px;height:400px;"></div>
      <div id="main5" style="width: 600px;height:400px;"></div>
      <div id="main6" style="width: 600px;height:400px;"></div>
    </div>
  </div>
</template>

<script setup>

import { post, get,put } from "@/utils/axios";
import { onMounted } from "vue";
import * as echarts from 'echarts'
import dayjs from 'dayjs';
console.log('1111')
console.log(echarts)
let myChart1 = {}
let myChart2 = {}
let myChart3 = {}
let myChart4 = {}
let myChart5 = {}
let myChart6 = {}

// 指定图表的配置项和数据
let option = {
  title: {
    text: '设备号'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['风机1', '风机2'],
    selectedMode: 'single'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['19:00:01', '19:00:01', '19:00:01', '19:00:01', '19:00:01', '19:00:01', '19:00:01']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '风机1',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '风机2',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
};
    let initecharts = ()=>{
        myChart1 = echarts.init(document.getElementById('main1'));
        myChart2 = echarts.init(document.getElementById('main2'));
        myChart3 = echarts.init(document.getElementById('main3'));
        myChart4 = echarts.init(document.getElementById('main4'));
        myChart5 = echarts.init(document.getElementById('main5'));
        myChart6 = echarts.init(document.getElementById('main6'));

    }
    const setdata = (datalist,data2list) =>{

      let devicedatalist = []
        for(let i=0;i<6;i++){
          devicedatalist.push({
            name:"a1",
            xdata:[],
            ydata2:[],
            ydata:[]
          })
        }
        datalist.map((list)=>{
          let time = dayjs(list.datetime).format('hh:mm:ss')
          devicedatalist[0].name = 'T1'
          devicedatalist[0].xdata.push(time)
          devicedatalist[0].ydata.push(list.T1)
          devicedatalist[1].name = 'T2'
          devicedatalist[1].xdata.push(time)
          devicedatalist[1].ydata.push(list.T2)
          devicedatalist[2].name = 'Z1'
          devicedatalist[2].xdata.push(time)
          devicedatalist[2].ydata.push(list.Z1)
          devicedatalist[3].name = 'Z2'
          devicedatalist[3].xdata.push(time)
          devicedatalist[3].ydata.push(list.Z2)
          devicedatalist[4].name = 'Z3'
          devicedatalist[4].xdata.push(time)
          devicedatalist[4].ydata.push(list.Z3)
          devicedatalist[5].name = 'Z4'
          devicedatalist[5].xdata.push(time)
          devicedatalist[5].ydata.push(list.Z4)
        })
        data2list.map((list)=>{
          devicedatalist[0].ydata2.push(list.T1)
          devicedatalist[1].ydata2.push(list.T2)
          devicedatalist[2].ydata2.push(list.Z1)
          devicedatalist[3].ydata2.push(list.Z2)
          devicedatalist[4].ydata2.push(list.Z3)
          devicedatalist[5].ydata2.push(list.Z4)
        })
        for(let i=0;i<6;i++){
          option.title.text = devicedatalist[i].name;
          option.xAxis.data = devicedatalist[i].xdata;
          option.series[0].data = devicedatalist[i].ydata;
          option.series[1].data = devicedatalist[i].ydata2;
          eval('myChart'+(i+1)).setOption(option);

        }
    }
    const getdata = () =>{
      get('/api/equipment/getEquipment?ID=1').then((info)=>{
        if(info.code==200){
          get('/api/equipment/getEquipment?ID=2').then((info2)=>{
            if(info.code==200){
              setdata(info.data, info2.data)
            }
          })
        }
      })
    }
    onMounted(()=>{
      initecharts()
      getdata()
      setInterval(()=>{
        getdata()
      },5000)
    })
    
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
  }
}
</style>
