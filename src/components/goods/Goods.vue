<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsListData"
          >
            <el-button
              slot="append"
              @click="getGoodsListData"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoodsItem">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表展示区域 -->
      <el-table :data="goodslist.goods" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="660px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px">
        </el-table-column>
        <el-table-column prop="goods_weight" width="80px" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" width="140px" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time * 1000 | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editItemData(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteItem(scope.row.goods_id)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodslist.pagenum"
        :page-sizes="[10, 20, 40, 100]"
        :page-size="goodslist.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodslist.total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品弹框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="showAddGoodsDialog"
      width="50%"
      @close="clearAddGoodsForm"
    >
      <el-form
        :model="editItemForm"
        ref="editItemFormRef"
        :rules="editItemFormRules"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editItemForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editItemForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            v-model="editItemForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            v-model="editItemForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showAddGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="subEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Bus from '../../tools/bus'
export default {
  name: 'Goods',
  data() {
    return {
      // 列表展示区域的数据
      goodslist: {},
      // 配置请求商品列表区域的数据格式
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 添加商品弹框开关
      showAddGoodsDialog: false,
      // 编辑弹框的信息
      editItemForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_id: ''
      },
      // 添加验证规则
      editItemFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '重量不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ]
      },
      newInfo: {}
    }
  },
  created() {
    this.getGoodsListData()
  },
  // mounted() {
  //   Bus.$on('goodsInfo', this.newInfo)
  //   console.log(this.newInfo)
  // },
  methods: {
    // 获取初始化界面列表所有数据
    async getGoodsListData() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表信息失败！')
      }
      res.data.pagenum = +res.data.pagenum
      this.goodslist = res.data
    },
    // 监听添加商品事件
    addGoodsItem() {
      this.$router.push('/goods/add')
    },
    // 监听弹框关闭事件
    clearAddGoodsForm() {
      this.$refs.editItemFormRef.resetFields()
    },
    // 监听页码区域的大小变化事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsListData()
    },
    // 监听页码区域的索引变化事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsListData()
    },
    // 监听编辑数据列表事件
    editItemData(val) {
      console.log(val)
      this.editItemForm.goods_id = val.goods_id
      this.editItemForm.goods_name = val.goods_name
      this.editItemForm.goods_price = val.goods_price
      this.editItemForm.goods_weight = val.goods_weight
      this.editItemForm.goods_number = val.goods_number
      this.showAddGoodsDialog = true
    },
    // 监听删除数据列表事件
    deleteItem(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('goods/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败！')
          }
          this.getGoodsListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听确认修改事件
    subEditForm() {
      console.log(this.editItemForm)
      this.$refs.editItemFormRef.validate(async v => {
        if (!v) {
          return this.$message.error('请完善商品信息！')
        }
        this.$message.success('修改商品信息成功！')
        const { data: res } = await this.$http.put('goods/' + this.editItemForm.goods_id, this.editItemForm)
        console.log(res)
        // this.showAddGoodsDialog = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table-column {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
}
</style>
