<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- echarts表格 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  LineChart
]);
export default {
  async mounted() {
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$axios.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取图表失败");
    }
    // console.log(res);
    myChart.setOption(res.data);
  },
};
</script>

<style>
.el-card {
  margin-top: 15px;
}
</style>
