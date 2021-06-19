<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div>
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 订单列表表格 -->
      <!-- stripe 是否为斑马纹 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="is_pay">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status === '0'"
              >未付款
            </el-tag>
            <el-tag v-else type="success">已付款 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="showEditDialog"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-location"
              circle
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%">
      <el-form label-width="80px">
        <el-form-item label="省市区/县">
          <el-input v-model="addressInfo.province"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressInfo.adress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
    <span>这是物流进度展示</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      ordersList: [],
      total: 0,
      editDialogVisible: false,
      addressInfo: {
        province: "",
        address: "",
      },
      progressDialogVisible: false,
      progressInfo:[]
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$axios.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.ordersList = res.data.goods;
      this.total = res.data.total;
      // console.log(this.ordersList);
      // console.log(this.total);
    },
    // 每页数据的个数
    handleSizeChange(num) {
      this.queryInfo.pagesize = num;
      this.getOrdersList();
    },
    handleCurrentChange(currentNum) {
      this.queryInfo.pagenum = currentNum;
      this.getOrdersList();
    },
    // 修改地址对话框
    showEditDialog() {
      this.editDialogVisible = true;
    },
    // 展示物流进度
    showProgress() {
      this.$axios.get('/kuaidi/1106975712662').then(res => {
        console.log(res)
      })
      
    },
  },
};
</script>

<style>
.el-card {
  margin-top: 15px;
}
</style>
