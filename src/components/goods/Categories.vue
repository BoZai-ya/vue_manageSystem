<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <el-table :data="cateList" border stripe>
        <el-table-column type="expand">
          <template>
            <el-tree
              :data="cateList"
              :props="treeProps"
              node-key="id"
              ref="treeRef"
            ></el-tree>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 5, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="showCate"
            @change="handleChange"
            clearable
            size="small"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
      treeProps: {
        children: "children",
        label: "cat_name",
      },
      addCateDialogVisible: false,
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addFormRules: {
        cat_name: [
          {
            min: 2,
            max: 10,
            message: "分类的名称长度在2~10之间",
          },
          {
            required: true,
            message: "请输入分类的名称",
            trigger: "blur",
          },
        ],
        cat_pid: [
          {
            required: true,
            message: "请选择父级分类",
            trigger: "blur",
          },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
       expandTrigger:"hover"
      },
      // 级联选择器显示的内容
      showCate: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      // console.log(res.data);
      this.cateList = res.data.result;
      // console.log(this.cateList);
      this.total = res.data.total;
    },
    handleSizeChange(num) {
      this.queryInfo.pagesize = num;
      this.getCateList();
    },
    handleCurrentChange(currentNum) {
      this.queryInfo.pagenum = currentNum;
      this.getCateList();
    },
    showAddCateDialog() {
      // this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级列表
    // async getParentCateList() {
    //   const { data: res } = await this.$axios.get("categories", {
    //     params: { type: 2 },
    //   });
    //   if (res.meta.status !== 200) {
    //     return this.$message.error("获取父级列表失败");
    //   }
    //   this.parentCateList = res.data;
    // },
    // 级联选择器中选择项发生变化时触发
    handleChange() {
      if (this.showCate.length > 0) {
        this.addForm.cat_pid = this.showCate[this.showCate.length - 1];
        this.addForm.cat_level = this.showCate.length;
        return;
      } else {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    // 当添加分类的对话框关闭时，将里面的内容清空
    closeAddDialog() {
      this.$refs.addFormRef.resetFields();
      this.showCate = [];
    },
    // 添加分类
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          "categories",
          this.addForm
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
  },
};
</script>

<style>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
.el-icon-success {
  color: rgb(100, 148, 100);
}
.el-icon-error {
  color: red;
}
.el-pagination {
  margin-top: 15px;
}
</style>
