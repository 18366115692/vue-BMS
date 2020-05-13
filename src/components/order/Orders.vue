<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @close="clearInpVal"
          >
            <el-button
              @click="searchList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderslist" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="92px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px">
        </el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{ (scope.row.create_time * 1000) | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editTableItem"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleChangeSize"
        @current-change="handleChangePage"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑弹框区域 -->
    <el-dialog
      title="修改地址"
      :visible.sync="showAddressDialog"
      width="50%"
      @close="clearAddressDialog"
    >
      <el-form
        :model="addressForm"
        ref="addressFormRef"
        :rules="addressFormRules"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityList"
            v-model="addressForm.address1"
            @change="handleChange"
            :props="addressProps"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input
            v-model="addressForm.address2"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="showAddressDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 获取物流信息弹框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="showLogisticsProgress"
      width="50%"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityList from '../../assets/js/citydata'
export default {
  name: 'Order',
  data() {
    return {
      // 请求数据的参数项配置
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 页面请求的数据列表
      orderslist: [],
      // 页面请求数据的总条数
      total: 0,
      // 显示编辑弹框开关
      showAddressDialog: false,
      // 地址数据信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 地址表单规则
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择对应的省市区/县',
            trigger: 'blur'
          }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 5, message: '详细地址长度要超过5个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器规则
      addressProps: {
        expandTrigger: 'hover',
        value: 'value',
        lebal: 'lebal',
        children: 'children'
      },
      // 城市列表数据
      cityList,
      // 物流进度弹框开关
      showLogisticsProgress: false,
      // 物流进度数据
      activities: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表数据
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.orderslist = res.data.goods
      this.total = res.data.total
    },
    // 底部分页改变事件
    handleChangePage(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    handleChangeSize(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听搜索事件
    searchList() {
      console.log(this.queryInfo.query)
      this.getOrdersList()
    },
    // 监听输入框被清空事件
    clearInpVal() {
      this.getOrdersList()
    },
    // 监听编辑按钮事件
    editTableItem() {
      this.showAddressDialog = true
    },
    // 监听关闭编辑弹框事件
    clearAddressDialog() {
      this.$refs.addressFormRef.resetFields()
    },
    // 监听级联选择器事件
    handleChange() {},
    // 监听物流进度弹框事件
    async showProgress() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度信息失败！')
      }
      this.activities = res.data
      console.log(this.activities)
      this.showLogisticsProgress = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-table-column {
  padding: 0 !important;
}

.el-cascader {
  width: 100%;
}
</style>
