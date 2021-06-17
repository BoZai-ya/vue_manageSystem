<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" border stripe>
        <!-- expand 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- el-row 是栅格布局  一共24列 -->
            <el-row v-for="first in props.row.children" :key="first.id">
              <el-col :span="5">
                <el-tag closable @close="removeRight(props.row, first.id)">{{
                  first.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="16">
                <el-row v-for="second in first.children" :key="second.id">
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(props.row, second.id)"
                      >{{ second.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <!-- closable 标签可移除属性 -->
                    <el-tag
                      v-for="third in second.children"
                      :key="third.id"
                      type="warning"
                      closable
                      @close="removeRight(props.row, third.id)"
                      >{{ third.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="removeRoleById(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              circle
              @click="showRightDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="角色添加"
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="defaultCheck"
          ref="treeRef"
        ></el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          {
            min: 2,
            max: 10,
            message: "角色的名称长度在2~10之间",
          },
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            min: 2,
            max: 10,
            message: "描述的长度在2~10之间",
          },
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur",
          },
        ],
      },
      rightDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      defaultCheck: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      // console.log(res.data);
    },
    // 关闭dialog
    addDialogClose() {
      this.addDialogVisible = false;
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("roles", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败!");
        }
        this.$message.success("添加角色成功");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 修改角色信息
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("角色查询失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogclosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑用户
    editRoleInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改角色失败!");
        }
        this.$message.success("修改角色成功");
        this.editDialogVisible = false;
        this.getRolesList();
      });
    },
    // 移除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$axios.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getRolesList();
    },
    // 删除权限
    async removeRight(role, right) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除权限操作");
      }
      console.log(this.rolesList);
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${right}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除权限失败");
      }
      this.children = res.data;
    },
    async showRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      // console.log(res.data);
      this.getDefaultCheck(role, this.defaultCheck);
      this.rightDialogVisible = true;
    },
    // 获取默认权限选项
    getDefaultCheck(checknode, arr) {
      if (!checknode.children) {
        return arr.push(checknode.id);
      }
      checknode.children.forEach((item) => this.getDefaultCheck(item, arr));
    },
    // 为角色添加权限
    async checkRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.rightDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
.el-row {
  border-bottom: 1px solid #ccc;
}
.el-col {
  margin: 5px;
}

.border-bottom {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin-right: 15px;
  margin-top: 3px;
}
</style>
