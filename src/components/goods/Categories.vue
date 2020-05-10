<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="addCateItem">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 数据展示区域 -->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        show-index
        index-text="#"
        stripe
        empty-text
        border
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效的渲染模板 -->
        <template slot="isValid" slot-scope="scope">
          <i
            style="color: #67C23A"
            v-if="!scope.row.cat_deleted"
            type="success"
            class="el-icon-success"
          ></i>
          <i
            style="color: #F56C6C"
            v-else
            type="danger"
            class="el-icon-error"
          ></i>
        </template>
        <!-- 排序的渲染模板 -->
        <template slot="line_up" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作的渲染模板 -->
        <template slot="handle" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCateItem(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCateItem(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="cateinfo.pagenum"
        :page-sizes="[5, 10, 15, 20, 25, 30]"
        :page-size="cateinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑信息弹框区域 -->
    <el-dialog title="修改分类" :visible.sync="isEditKey" width="50%">
      <el-form
        :model="editCateInfo"
        ref="editCateRef"
        label-width="100px"
        :rules="editCateInfoRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditKey = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCateInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类弹框区域 -->
    <el-dialog
      title="添加分类"
      :visible.sync="idAddCateItem"
      width="50%"
      @close="clearCateForm"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateInfo"
        ref="addCateItemRef"
        label-width="100px"
        :rules="addCateInfoRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectCateValue"
            :options="parentCateList"
            :props="cateListProps"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="idAddCateItem = false">取 消</el-button>
        <el-button type="primary" @click="saveCateList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      // 分类数据
      catelist: [],
      // 请求分类数据的配置对象
      cateinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 获取当前界面总条数
      total: 0,
      // tree-table 数据展示配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 自定义模板
          type: 'template',
          // 自定义模板名称
          template: 'isValid'
        },
        {
          label: '排序',
          // 自定义模板
          type: 'template',
          // 自定义模板名称
          template: 'line_up'
        },
        {
          label: '操作',
          // 自定义模板
          type: 'template',
          // 自定义模板名称
          template: 'handle'
        }
      ],
      // 编辑开关
      isEditKey: false,
      // 添加分类开关
      idAddCateItem: false,
      // 添加分类数据对象
      addCateInfo: {
        // 将要添加分类的名称
        cat_name: '',
        // 将要添加父级分类的id
        cat_pid: 0,
        // 将要添加当前分类的等级，默认添加一级分类
        cat_level: 0
      },
      // 添加分类名称规则
      addCateInfoRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表的数据
      parentCateList: [],
      // 父级分类绑定的数据
      selectCateValue: [],
      // 定义 cascader 要显示的数据
      cateListProps: {
        // 触发显示联级列表的方式
        expandTrigger: 'hover',
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 存储编辑界面初始信息
      editCateInfo: {},
      // 编辑分类名称规则
      editCateInfoRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.cateinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听编辑事件
    editCateItem(val) {
      // 将传递过来的信息保存到 editCateInfo 对象中，方便后续发送请求
      this.editCateInfo = val
      this.isEditKey = true
    },
    // 监听编辑名称提交事件
    saveEditCateInfo() {
      console.log(this.editCateInfo)
      this.$refs.editCateRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateInfo.cat_id,
          { cat_name: this.editCateInfo.cat_name }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
      })
      this.isEditKey = false
    },
    // 监听删除事件
    deleteCateItem(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听页面数据大小变化事件
    handleSizeChange(newSize) {
      this.cateinfo.pagesize = newSize
      this.getCateList()
    },
    // 监听切换页面变化事件
    handleCurrentChange(newPage) {
      this.cateinfo.pagenum = newPage
      this.getCateList()
    },
    // 监听点击添加分类事件
    addCateItem() {
      // 先获取父级分类列表的数据
      this.getParentCateList()
      this.idAddCateItem = true
    },
    // 获取父级分类列表的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    // 监听父级分类选择的改变事件
    handleChange() {
      // 通过级联选择器的change事件，修改addCateInfo 中的信息，方便后续发送请求调用
      // 在这里判断 selectCateValue 数组中的长度，如果为0，表示没有选择父级分类，如果大于0，表示选择了父级分类
      if (this.selectCateValue.length > 0) {
        // cat_pid 和 selectCateValue 数组的最后一项相同
        this.addCateInfo.cat_pid = this.selectCateValue[
          this.selectCateValue.length - 1
        ]
        // cat_pid 和 selectCateValue 数组的长度相同
        this.addCateInfo.cat_level = this.selectCateValue.length
      } else {
        // 当没有选择的时候，默认都是0
        this.addCateInfo.cat_pid = 0
        this.addCateInfo.cat_level = 0
      }
    },
    // 确认保存添加的分类列表事件
    saveCateList() {
      // 预校验填写信息是否正确
      this.$refs.addCateItemRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateInfo
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.idAddCateItem = false
      })
    },
    // 监听分类弹框关闭事件
    clearCateForm() {
      // 重置表单
      this.$refs.addCateItemRef.resetFields()
      // 重置 addCateInfo 信息
      this.addCateInfo.cat_pid = 0
      this.addCateInfo.cat_level = 0
      // 重置 selectCateValue 数组的值
      this.selectCateValue = []
    }
  }
}
</script>
