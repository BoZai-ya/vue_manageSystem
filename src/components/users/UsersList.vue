<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div>
        <el-input placeholder="请输入搜索的用户名" v-model="queryInfo.query">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUsersList"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </div>
      <!-- 用户列表 -->
      <el-table :data="usersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
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
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户 -->
    <el-dialog
      title="用户添加"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input> </el-form-item
        ><el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          {
            min: 5,
            max: 10,
            message: "用户名的长度在5~10之间",
          },
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            min: 5,
            max: 10,
            message: "密码的长度在5~10之间",
          },
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      this.usersList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    // 每页数据的个数
    handleSizeChange(usersNum) {
      (this.queryInfo.pagesize = usersNum), this.getUsersList();
    },
    handleCurrentChange(currentNum) {
      (this.queryInfo.pagenum = currentNum), this.getUsersList();
    },
    // 关闭dialog
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUsersList();
      });
    },
    // 修改用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("用户查询失败");
      }
      this.editForm = res.data;
      // console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogclosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑用户
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("修改用户失败!");
        }
        this.$message.success("修改用户成功");
        this.editDialogVisible = false;
        this.getUsersList();
      });
    },
    // // 移除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$axios.delete("users/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getUsersList();
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-input {
  width: 75%;
  margin-right: 20px;
}
.el-table {
  margin: 20px 0;
  font-size: 14px;
}
</style>
