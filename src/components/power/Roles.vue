<template>
  <div class="roles-wrapper">
    <!-- 头部面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="addUserInfo">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据展示区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 存放角色列表 -->
            <el-row
              :class="['borderbtm', i1 === 0 ? 'bordertop' : '']"
              v-for="(onelevel, i1) in scope.row.children"
              :key="onelevel.id"
            >
              <!-- 存放一级角色列表信息 -->
              <el-col :span="5">
                <el-tag
                  @close="removeTagById(scope.row, onelevel.id)"
                  closable
                  >{{ onelevel.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 存放二级和三级角色列表信息 -->
              <el-col :span="19">
                <!-- 循环二级和三级列表信息 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bordertop']"
                  v-for="(twolevel, i2) in onelevel.children"
                  :key="twolevel.id"
                >
                  <!-- 存放二级角色列表信息 -->
                  <el-col :span="6">
                    <el-tag
                      @close="removeTagById(scope.row, twolevel.id)"
                      type="success"
                      closable
                      >{{ twolevel.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="threelevel in twolevel.children"
                      :key="threelevel.id"
                      closable
                      @close="removeTagById(scope.row, threelevel.id)"
                    >
                      {{ threelevel.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- slot-scope 作用域插槽，将该做用于下的数据通过此方法获取并显示 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditForm(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteForm(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              :enterable="false"
              @click="showAssignedPermissions(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色隐藏部分 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isAddUserInfo"
      width="50%"
      @close="clearEditForm"
    >
      <el-form
        :model="addRolesList"
        ref="addRolesRef"
        label-width="100px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isAddUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="addCreateRules()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色隐藏部分 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="isEditRoles"
      width="50%"
      @close="clearEditForm"
    >
      <el-form
        :model="editRolesList"
        ref="editRolesRef"
        label-width="100px"
        :rules="editRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isEditRoles = false">取 消</el-button>
        <el-button type="primary" @click="addEditRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限隐藏部分 -->
    <el-dialog
      title="分配权限"
      :visible.sync="isShowAssignedPermissions"
      width="50%"
      @close="clearDefPowerArr"
    >
      <el-tree
        :data="powerlist"
        :props="assignedpower"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defPowerArr"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAssignedPermissions = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 卡片区域的所有数据
      rolelist: [],
      // 控制显示分配权限的开关
      isShowAssignedPermissions: false,
      // 分配权限的所有数据
      powerlist: [],
      // 分配权限的配置对象
      assignedpower: {
        children: 'children',
        label: 'authName'
      },
      // 接收分配权限界面默认勾选数据的数组
      defPowerArr: [],
      // 获取打开分配角色弹框给的id
      roleId: '',
      // 获取编辑角色弹框信息
      editRolesList: {},
      // 编辑角色开关
      isEditRoles: false,
      // 编辑角色验证信息
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 添加用户显示开关
      isAddUserInfo: false,
      // 添加角色验证信息
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 存放添加角色的录入信息
      addRolesList: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created() {
    // 获取角色列表数据
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolelist = res.data
    },
    // 监听用户角色删除事件
    removeTagById(val, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${val.id}/rights/${id}`
          )
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除成功')
          val.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听编辑用户信息事件
    async showEditForm(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取编辑角色信息失败！')
      this.editRolesList = res.data
      this.isEditRoles = true
    },
    // 监听删除用户信息事件
    deleteForm(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRoleList()
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
    // 监听分配权限事件
    async showAssignedPermissions(node) {
      this.roleId = node.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.powerlist = res.data
      this.showRights(node, this.defPowerArr)
      this.isShowAssignedPermissions = true
    },
    // 递归函数将所有第三级的权限ID都保存到一个数组中，供页面展示勾选项
    showRights(node, arr) {
      // 如果当前 node.children 不是非，表示不是最后一级
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(v => {
        this.showRights(v, arr)
      })
    },
    // 监听分配权限弹框消失事件
    clearDefPowerArr() {
      this.defPowerArr = []
    },
    // 监听分配权限确认事件
    async allotRights() {
      // 通过element-ui提供的方法获取勾选以及半勾选的id
      const arr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 由于发送请求时，需要提供请求体，必须以逗号分隔的字符串，所以需要转化
      const rightsStr = arr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: rightsStr }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 分配权限成功重新刷新列表
      this.getRoleList()
      // 关闭权限分配弹框
      this.isShowAssignedPermissions = false
    },
    // 监听确认修改角色信息事件
    addEditRoles() {
      this.$refs.editRolesRef.validate(async v => {
        if (!v) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesList.roleId,
          {
            roleName: this.editRolesList.roleName,
            roleDesc: this.editRolesList.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改信息失败！')
        this.getRoleList()
        this.isEditRoles = false
      })
    },
    // 监听编辑角色弹框事件
    clearEditForm() {
      this.$refs.editRolesRef.resetFields()
      this.addRolesList = {}
    },
    // 监听添加用户弹框显示事件
    addUserInfo() {
      this.isAddUserInfo = true
    },
    // 监听添加用户确认事件
    addCreateRules() {
      this.$refs.addRolesRef.validate(async v => {
        if (!v) return
        const { data: res } = await this.$http.post('roles', this.addRolesList)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.getRoleList()
        this.isAddUserInfo = false
      })
    }
  }
}
</script>

<style lang="less" scope>
.el-col {
  i {
    margin-left: 5px;
  }
}

.bordertop {
  border-top: 1px solid #eee;
}
.borderbtm {
  border-bottom: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}

.el-row {
  display: flex;
  align-items: center;
}
</style>
