<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoodsList"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </div>

      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          width="500px"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatDateFromNow }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改商品信息 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        goods_name: [
          {
            required: true,
            message: "请修改商品名称",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入重量",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      // console.log(this.goodsList);
      this.queryInfo.query = "";
    },
    // 每页数据的个数
    handleSizeChange(goodsNum) {
      this.queryInfo.pagesize = goodsNum;
      this.getGoodsList();
    },
    handleCurrentChange(currentNum) {
      this.queryInfo.pagenum = currentNum;
      this.getGoodsList();
    },
    // 修改商品信息
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("商品信息查询失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogclosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑商品信息
    editGoodsInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "goods/" + this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_weight: this.editForm.goods_weight,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改信息失败!");
        }
        this.$message.success("修改信息成功");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
    },

    // 删除商品操作
    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除操作");
      }
      const { data: res } = await this.$axios.delete("goods/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getGoodsList();
    },
    // 点击添加商品跳转到添加商品页
    addGoods() {
      this.$router.push("/addgood");
    },
  },
};
</script>

<style scope>
.el-card {
  margin: 15px 0;
}
.el-card .el-input {
  width: 60%;
  margin-right: 20px;
}
</style>
