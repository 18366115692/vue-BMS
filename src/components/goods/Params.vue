<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 头部提示部分 -->
      <el-tag style="width: 100%; font-size: 16px; font-weight: 400" type="warning">
        <i class="el-icon-warning"></i>
        注意：只允许为第三级分类设置相关参数
      </el-tag>
      <!-- 下拉框选择部分 -->
      <el-form label-width="120px">
        <el-form-item label="选择商品分类：">
          <el-cascader
            v-model="selectGoodsCateVal"
            :options="userGoodsCate"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 导航菜单 -->
      <el-tabs v-model="menuActiveName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button :disabled="isBtnDisable" type="primary" @click="isActive = true"
            >添加参数</el-button
          >
          <!-- 中部列表区域 -->
          <el-table :data="tableData" border stripe>
            <!-- 表单列表展开行区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  type="primary"
                  closable
                  @close="deleteParamsItem(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="show-input"
                  v-if="scope.row.showInputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  label=""
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editFormItem(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteFormItem(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加按钮 -->
          <el-button :disabled="isBtnDisable" type="primary" @click="isActive = true"
            >添加属性</el-button
          >
          <!-- 中部列表区域 -->
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag小标签循环显示 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  type="primary"
                  closable
                  >{{ item }}</el-tag
                >
                <!-- 最后添加新的属性的标签 -->
                <el-input
                  class="show-input"
                  v-if="scope.row.showInputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                  label=""
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editFormItem(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteFormItem(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加弹框 -->
    <el-dialog :title="'添加' + tableText" :visible.sync="isActive" width="50%">
      <el-form
        :model="addDialogForm"
        ref="addDialogFormRef"
        :rules="addDialogFormRules"
        label-width="90px"
        @close="clearAddDialogForm"
      >
        <el-form-item :label="tableText + ':'" prop="attr_name">
          <el-input v-model="addDialogForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isActive = false">取 消</el-button>
        <el-button type="primary" @click="addNewParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog :title="'修改' + tableText" :visible.sync="showEditDialog" width="50%">
      <el-form
        :model="editDialogForm"
        ref="editDialogFormRef"
        :rules="addDialogFormRules"
        label-width="90px"
        @close="clearEditDialogForm"
      >
        <el-form-item :label="tableText + ':'" prop="attr_name">
          <el-input v-model="editDialogForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParamsData(editDialogForm.attr_id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 选择商品分类数据
      userGoodsCate: [],
      // 导航栏默认激活的名称
      menuActiveName: 'many',
      // 级联选择器列表配置
      cascaderProps: {
        // 触发显示联级列表的方式
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器双向绑定的值
      selectGoodsCateVal: [],
      // 中间table显示区域的数据
      tableData: [],
      // 添加弹框开关
      isActive: false,
      // 添加弹框显示表单信息
      addDialogForm: {},
      // 添加弹框的验证信息
      addDialogFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 编辑弹框显示表单信息
      editDialogForm: {},
      // 编辑弹框开关
      showEditDialog: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类数据获取失败！')
      }
      this.userGoodsCate = res.data
    },
    // 监听导航菜单事件
    handleClick() {
      if (this.selectGoodsCateVal.length === 0) return
      this.getCateAttrData()
    },
    // 监听级联选择器选择事件
    handleChange() {
      // 判断选择的分类是否是三级分类
      if (this.selectGoodsCateVal.length !== 3) {
        this.selectGoodsCateVal = []
        this.tableData = []
        return null
      }
      this.getCateAttrData()
    },
    // 抽离的公用获取数据事件
    async getCateAttrData() {
      this.tableData = []
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.menuActiveName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败！')
      }
      res.data.forEach(v => {
        // 此处操作是为了方便渲染attr_vals标签时，容易循环展示
        v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        // 以下两步操作，是为了让每层的tag标签之间相互独立，不共享数据
        v.inputValue = ''
        v.showInputVisible = false
      })
      this.tableData = res.data
    },
    // 监听添加新属性或者新参数事件
    addNewParams() {
      this.$refs.addDialogFormRef.validate(async v => {
        if (!v) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addDialogForm.attr_name,
          attr_sel: this.menuActiveName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.getCateAttrData()
        this.isActive = false
      })
    },
    // 监听编辑表单子选项事件
    editFormItem(val) {
      this.editDialogForm = val
      this.showEditDialog = true
    },
    // 监听删除表单子选项事件
    deleteFormItem(id) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCateAttrData()
          this.showEditDialog = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听修改参数或属性事件
    editParamsData(id) {
      this.$refs.editDialogFormRef.validate(async v => {
        if (!v) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${id}`, {
          attr_name: this.editDialogForm.attr_name,
          attr_sel: this.menuActiveName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改信息失败！')
        }
        this.$message.success('修改信息成功！')
        this.getCateAttrData()
        this.showEditDialog = false
      })
    },
    // 监听添加弹框关闭清空表单事件
    clearAddDialogForm() {
      this.$refs.editDialogFormRef.resetFields()
    },
    // 监听编辑弹框关闭清空表单事件
    clearEditDialogForm() {
      this.$refs.editDialogFormRef.resetFields()
    },
    // 监听点击切换输入框事件
    showInput(val) {
      val.showInputVisible = true
      // 让文本框自动获取焦点
      // $nextTick 方法是当页面重新渲染之后，才会执行回调函数中的内容
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听输入框失去焦点和enter事件
    handleInputConfirm(val) {
      // 判断输入的值是否合法,如果合法进入下一步操作
      if (val.inputValue.trim().length !== 0) {
        val.attr_vals.push(val.inputValue)
        this.saveAttrVals(val)
      }
      val.inputValue = ''
      val.showInputVisible = false
    },
    // 监听删除参数项事件
    deleteParamsItem(val, index) {
      val.attr_vals.splice(index, 1)
      this.saveAttrVals(val)
    },
    // 抽离的添加和删除tag标签的数据请求事件
    async saveAttrVals(val) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${val.attr_id}`,
        {
          attr_name: val.attr_name,
          attr_vals: val.attr_vals.join(' '),
          attr_sel: val.attr_sel
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数失败！')
      }
      this.$message.success('添加参数成功！')
    }
  },
  computed: {
    // 计算控制按钮的禁用关系
    isBtnDisable() {
      if (this.selectGoodsCateVal.length === 0) return true
      return false
    },
    // 计算当前页面中所需要的id值
    cateId() {
      if (this.selectGoodsCateVal.length === 3) {
        return this.selectGoodsCateVal[2]
      }
      return null
    },
    // 计算添加弹框对应的返回值
    tableText() {
      if (this.menuActiveName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 7px;
}

.el-cascader {
  width: 30%;
}

.show-input {
  width: 90px;
}
</style>
