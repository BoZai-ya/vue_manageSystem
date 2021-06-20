<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        show-icon=""
        title="注意：只允许为第三级目录设置属性"
        type="warning"
      >
      </el-alert>
      <el-form label-width="120px">
        <el-form-item label="选择商品的分类:">
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

      <el-tabs v-model="selectedTab" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="this.showCate.length !== 3"
            @click="showAddDialogVisible"
            >添加参数</el-button
          >
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeTag(props.row, index)"
                >
                  {{ item }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  @click="showEditDialog(props.row.attr_id)"
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click="deleteParams(props.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="this.showCate.length !== 3"
            type="primary"
            size="small"
            @click="showAddDialogVisible"
            >添加属性</el-button
          >
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
               <template slot-scope="props">
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeTag(props.row, index)"
                >
                  {{ item }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(props.row.attr_id)"
                  circle
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParams(props.row.attr_id)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数属性对话框 -->
    <el-dialog
      :title="this.selectedTab === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item
          :label="this.selectedTab === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框-->
    <el-dialog
      :title="'修改' + (this.selectedTab === 'many' ? '动态参数' : '静态属性')"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item
          :label="this.selectedTab === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      // 父级分类列表
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择器显示的内容
      showCate: [],
      selectedTab: "many",
      manyData: [],
      onlyData: [],
      addDialogVisible: false,
      // 添加属性对话框中的属性
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请添写参数或属性",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: { attr_name: "" },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "修改参数或属性",
            trigger: "blur",
          },
        ],
      },
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
      this.cateList = res.data.result;
    },

    // 级联选择器中选择项发生变化时触发
    async handleChange() {
      this.getParamsList();
    },

    // tab标签点击事件
    handleTabClick() {
      this.getParamsList();
    },
    // 获取参数列表
    async getParamsList() {
      if (this.showCate.length !== 3) {
        this.showCate = [];
        this.onlyData = [];
        this.manyData = [];
        return;
      }
      const { data: res } = await this.$axios.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.selectedTab },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      res.data.forEach((item) => {
        // 需要判断一下item.attr_vals 是否为空  否则在你新生成的属性或者参数  都会默认有一个空的tag标签  原因是 ''.split(' ') --->['']
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      if (this.selectedTab === "many") {
        this.manyData = res.data;
      }
      this.onlyData = res.data;
    },
    // 显示添加属性，参数对话框
    showAddDialogVisible() {
      this.addDialogVisible = true;
    },
    closeAddDialog() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.selectedTab,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        // console.log(res);
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsList();
      });
    },
    // 修改参数对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(
        `categories/${this.getCateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.selectedTab,
          },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      this.editForm = res.data;
      // console.log(this.editForm);
      this.editDialogVisible = true;
    },
    closeEditDialog() {
      this.$refs.editFormRef.resetFields();
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.selectedTab,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsList();
        this.editDialogVisible = false;
      });
    },
    // 删除参数操作
    async deleteParams(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除操作");
      }
      const { data: res } = await this.$axios.delete(
        `categories/${this.getCateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除操作失败");
      }
      // console.log(res);
      this.$message.success("删除成功");
      this.getParamsList();
    },
    // 删除参数里面的标签
    removeTag(data, index) {
      data.attr_vals.splice(index, 1);
    },
  },
  computed: {
    getCateId() {
      if (this.showCate.length === 3) {
        return this.showCate[2];
      }
      return "";
    },
  },
};
</script>

<style>
.el-card {
  margin: 20px 0;
}
.el-tag {
  margin: 5px;
}
</style>
