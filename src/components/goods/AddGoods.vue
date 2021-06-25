<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="Number(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          style="height: 650px;"
          v-model="activeIndex"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="cateList"
                :props="cascaderProps"
                v-model="showCate"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabDate"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片 -->
          <!-- on-success 上传成功触发的函数 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="requestHeader"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="60%">
      <img :src="picUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_number: 0,
        goods_weight: 0,
        goods_price: 0,
        goods_cat: [],
        goods_introduce: "",
        // 图片数组
        pics: [],
        attrs: [],
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 20,
      },
      addFormRules: {
        goods_name: [
          {
            min: 1,
            max: 100,
            message: "商品名称字数控制在1~100以内",
          },
          {
            required: true,
            message: "请输入商品名称",
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
        goods_weight: [
          {
            required: true,
            message: "请输入重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
      },
      cateList: [],
      cascaderProps: {
        value: "cat_id",
        // label看到的内容
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      showCate: [],
      manyTabDate: [],
      onlyTabDate: [],
      // 为了为每次图片请求提供token
      requestHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片的地址
      picUrl: "",
      // 图片预览对话框
      dialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品列表
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
    handleChange() {
      console.log(this.showCate);
    },
    async tabClick() {
      // 访问动态参数
      if (this.activeIndex === "1") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取参数列表失败");
        }
        this.manyTabDate = res.data;
        res.data.forEach((item) => {
          // 需要判断一下item.attr_vals 是否为空  否则在你新生成的属性或者参数  都会默认有一个空的tag标签  原因是 ''.split(' ') --->['']
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });
      }
      if (this.activeIndex === "2") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取属性列表失败");
        }
        this.onlyTabDate = res.data;
      }
    },
    // 移除图片操作
    handleRemove(file) {
      // 获取路径
      const filePath = file.response.data.tem_path;
      // 获取对应的索引
      const index = this.addForm.pics.findIndex(
        (item) => item.pic === filePath
      );
      this.addForm.pics.splice(index, 1);
    },
    // 图片的预览事件
    handlePreview(file) {
      this.picUrl = file.response.data.url;
      this.dialogVisible = true;
    },
    // 上传图片成功之后触发的函数
    uploadSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(picInfo);
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请检查填写是否有误");
        }
        this.addForm.goods_cat = this.showCate.join(",");
        const { data: res } = await this.$axios.post("goods", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.showCate.length === 3) {
        return this.showCate[2];
      }
      return null;
    },
  },
};
</script>

<style scope>
.el-steps {
  margin: 20px 0;
}
.el-card {
  height: 100%;
}
.el-cascader {
  width: 500px;
}
.quill-editor {
  height: 200px;
  margin-bottom: 80px;
}
</style>
