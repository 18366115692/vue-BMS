<template>
  <div class="user-wrapper">
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="paramsInfo.query"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="isUserInfo = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据展示区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px">
          <!-- slot-scope 作用域插槽，将该做用于下的数据通过此方法获取并显示 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditForm(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteForm(scope.row.id)"
            ></el-button>
            <!-- el-tooltip 鼠标移入弹出提示 -->
            <el-tooltip content="分配角色" placement="top" effect="dark">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                :enterable="false"
                @click="showAssignRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="paramsInfo.pagenum"
        :page-sizes="[1, 2, 4]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户区域 -->
    <el-dialog
      title="用户信息"
      :visible.sync="isUserInfo"
      width="50%"
      @close="clearAddFormData"
    >
      <!-- 添加用户表单区域 -->
      <el-form
        ref="addFormData"
        :rules="userInfoRules"
        :model="addUserInfo"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户区域 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isEditUserInfo"
      width="50%"
      @close="clearEditFormData"
    >
      <!-- 修改用户表单区域 -->
      <el-form
        ref="editFormData"
        :rules="userInfoRules"
        :model="editUserInfo"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editUserInfo.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="isShowAssignRoles"
      width="50%"
      @close="clearRolesData"
    >
      <div>
        <p>角色名称：{{ userinfo.username }}</p>
        <p>角色描述：{{ userinfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectId" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAssignRoles = false">取 消</el-button>
        <el-button type="primary" @click="saveChangeRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义邮箱校验规则
    var checkEmail = (r, v, fn) => {
      if (!v) return fn(new Error('邮箱地址不能为空'))
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      setTimeout(() => {
        if (regEmail.test(v)) return fn()
        fn(new Error('请输入合法的邮箱地址'))
      }, 1000)
    }
    // 自定义手机校验规则
    var checkMobile = (r, v, fn) => {
      if (!v) return fn(new Error('手机号不能为空'))
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      setTimeout(() => {
        if (regMobile.test(v)) return fn()
        fn(new Error('请输入正确的手机号'))
      }, 1000)
    }
    return {
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      isUserInfo: false,
      isEditUserInfo: false,
      // 添加用户信息对象
      addUserInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息对象
      editUserInfo: {},
      // 添加用户信息验证对象
      userInfoRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: ['blur', 'change'] },
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' },
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      // 分配角色弹框开关
      isShowAssignRoles: false,
      // 需要分配权限的用户信息
      userinfo: {},
      // 绑定下拉框同步数据
      selectId: '',
      // 请求的下拉框数组
      roleslist: []
    }
  },
  created() {
    // 获取用户列表数据
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.paramsInfo
      })
      // 将用户列表数据保存到 data 中
      this.userlist = res.data.users
      // 将总数量保存到 data 中
      this.total = res.data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值的改变
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage
      this.getUserList()
    },
    async changeUserStatus(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 此处操作是因为数据库中修改失败，所以需要保持本地数据和数据库一致
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听添加用户弹框关闭事件
    clearAddFormData() {
      this.$refs.addFormData.resetFields()
    },
    // 监听修改用户弹框关闭事件
    clearEditFormData() {
      this.$refs.editFormData.resetFields()
    },
    // 监听添加用户确认按钮事件
    addUser() {
      this.$refs.addFormData.validate(async v => {
        if (!v) return this.$message.error('请完善信息')
        // 发送添加的网络请求
        const { data: res } = await this.$http.post('users', this.addUserInfo)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.isUserInfo = false
        // 重新刷新列表
        this.getUserList()
      })
    },
    // 监听修改用户信息事件
    async showEditForm(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserInfo = res.data
      this.isEditUserInfo = true
    },
    // 监听修改用户确认按钮事件
    editUser(id) {
      this.$refs.editFormData.validate(async v => {
        if (!v) return this.$message.error('请确认信息是否正确')
        // 发送修改的网络请求
        const { data: res } = await this.$http.put('users/' + id, {
          email: this.editUserInfo.email,
          mobile: this.editUserInfo.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.isEditUserInfo = false
        // 重新刷新列表
        this.getUserList()
      })
    },
    // 监听删除用户操作事件
    deleteForm(id) {
      // 弹框询问用户是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          // 重新刷新列表
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听分配角色事件
    async showAssignRoles(userinfo) {
      // 通过传递将需要分配权限的用户信息保存下来
      this.userinfo = userinfo
      // 在展开对话框之前，获取下拉列表的数据信息
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleslist = res.data
      this.isShowAssignRoles = true
    },
    // 监听分配角色弹框关闭事件
    clearRolesData() {
      this.selectId = ''
      this.userinfo = {}
    },
    // 监听分配角色弹框中的确认事件
    async saveChangeRoles() {
      // 首先判断用户是否选择了角色，没有选定角色需要弹框提示
      if (!this.selectId) return this.$message.error('请选择需要修改的角色权限！')
      const { data: res } = await this.$http.put(
        `users/${this.userinfo.id}/role`,
        { rid: this.selectId }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.isShowAssignRoles = false
    }
  }
}
</script>

<style lang="less" scoped></style>
