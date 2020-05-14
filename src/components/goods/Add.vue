<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="stepsActive - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 纵向数据信息列表 -->
      <el-form :model="mainInfo" :rules="mainInfoRules" ref="mainInfoRef" label-position="top">
        <el-tabs
          tab-position="left"
          v-model="stepsActive"
          :before-leave="beforeTabLeave"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="mainInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="mainInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="mainInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="mainInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                style="width: 300px;"
                :options="catelist"
                v-model="mainInfo.goods_cat"
                @change="handleChange"
                :props="cascader_rules"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in goods_params_list"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="val"
                  :key="i"
                  v-for="(val, i) in item.attr_vals"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in goods_attrs_list"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传组件 action上传的后台链接地址  -->
            <!-- on-preview点击查看图片事件 -->
            <!-- on-remove点击移除图片事件 -->
            <!-- list-type上传的图片在系统中呈现的样式 -->
            <el-upload
              :action="actionUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="herderObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="mainInfo.goods_introduce"></quill-editor>
            <el-button class="add_btn" type="primary" @click="addNewForm">确认添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片弹框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="showPreviewKey"
      width="50%"
      center
      @close="clearPreviewDialog"
    >
      <img :src="previewPath" alt="" class="preview_path" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
// import Bus from '../../tools/bus'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条进度值
      stepsActive: 0,
      // 基本信息
      mainInfo: {
        goods_name: '1',
        goods_price: '1',
        goods_weight: '1',
        goods_number: '1',
        // 商品所属的分类数组
        goods_cat: [1, 3, 6],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 基本信息验证
      mainInfoRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '重量不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 获取到的商品分类数据
      catelist: [],
      // 级联选择框规则
      cascader_rules: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品参数数组
      goods_params_list: [],
      // 商品属性数组
      goods_attrs_list: [],
      // 上传时需要的后台链接地址
      actionUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 发送请求的请求头参数
      herderObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      // 图片预览开关
      showPreviewKey: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类所有数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.catelist = res.data
    },
    // 监听级联选择框改变事件
    handleChange() {
      if (this.mainInfo.goods_cat.length !== 3) {
        this.mainInfo.goods_cat = []
      }
    },
    // 监听标签之间切换的钩子函数事件
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.mainInfo.goods_name === '') {
        this.$message.error('请输入商品名称！')
        return false
      }
      if (oldActiveName === '0' && this.mainInfo.goods_price === '') {
        this.$message.error('请输入商品价格！')
        return false
      }
      if (oldActiveName === '0' && this.mainInfo.goods_weight === '') {
        this.$message.error('请输入商品重量！')
        return false
      }
      if (oldActiveName === '0' && this.mainInfo.goods_number === '') {
        this.$message.error('请输入商品数量！')
        return false
      }
      if (oldActiveName === '0' && this.mainInfo.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // 监听 tab 标签被选中时事件
    handleTabClick(e) {
      if (e.index === '1' && this.mainInfo.goods_cat.length === 3) {
        this.getGoodsParams()
      }
      if (e.index === '2' && this.mainInfo.goods_cat.length === 3) {
        this.getGoodsAttrs()
      }
    },
    // 获取商品参数数据
    async getGoodsParams() {
      const {
        data: res
      } = await this.$http.get(`categories/${this.mainInfo.goods_cat[2]}/attributes`, {
        params: { sel: 'many' }
      })
      res.data.forEach(v => {
        v.attr_vals = v.attr_vals.length === 0 ? [] : v.attr_vals.split(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数信息失败！')
      }
      this.goods_params_list = res.data
    },
    // 获取商品属性数据
    async getGoodsAttrs() {
      const {
        data: res
      } = await this.$http.get(`categories/${this.mainInfo.goods_cat[2]}/attributes`, {
        params: { sel: 'only' }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数信息失败！')
      }
      this.goods_attrs_list = res.data
    },
    // 监听上传图片的查看图片事件
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.showPreviewKey = true
    },
    // 监听上传图片的移除图片事件
    handleRemove(file) {
      const removePath = file.response.data.tmp_path
      const i = this.mainInfo.pics.findIndex(v => v.pic === removePath)
      this.mainInfo.pics.splice(i, 1)
    },
    // 监听上传图片成功的事件
    handleSuccess(res) {
      const picsObj = {
        pic: res.data.tmp_path
      }
      this.mainInfo.pics.push(picsObj)
    },
    // 监听关闭弹框事件
    clearPreviewDialog() {
      this.previewPath = ''
    },
    // 监听确认添加事件
    addNewForm() {
      this.$refs.mainInfoRef.validate(async v => {
        if (!v) {
          return this.$message.error('请完善需要添加的数据信息！')
        }
        // 处理mainInfo中的goods_cat数据
        const newInfo = _.cloneDeep(this.mainInfo)
        newInfo.goods_cat = newInfo.goods_cat.join(',')
        // 给newInfo中添加attrs属性
        this.goods_params_list.forEach(v => {
          const form = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals.join(' ')
          }
          this.mainInfo.attrs.push(form)
        })
        // 给newInfo中添加attrs属性
        this.goods_attrs_list.forEach(v => {
          const form = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals
          }
          this.mainInfo.attrs.push(form)
        })
        newInfo.attrs = this.mainInfo.attrs
        // Bus.$emit('goodsInfo', newInfo)
        // 发送数据请求
        const { data: res } = await this.$http.post('goods', newInfo)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  width: 100%;
}

.el-form-item {
  margin-bottom: 30px;
}

.el-checkbox {
  margin-right: 10px;
  margin-left: 10px;
}

.preview_path {
  width: 100%;
}

.add_btn {
  margin-top: 15px;
}
</style>
