<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addRoleDialogVisible = true"
          >
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table
        :data="roleList"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right" />
              </el-col>

              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级 -->
                  <el-col
                    :span="6"
                  >
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>

                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
               {{ scope.row }}
           </pre
            > -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" />
        <el-table-column
          label="角色名称"
          prop="roleName"
        />
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        />
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showRole(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="deleta"
              @click="removeRoleById(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="warning"
              icon="setting"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addRoleDialogClosed"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        label-width="80px"
        :rules="addRoleFormRules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="30%"
      @close="editRoleDialogClosed"
    >
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        label-width="80px"
        :rules="editRoleFormRules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRole"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除角色对话框 -->
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      //   添加角色列表
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      addRoleDialogVisible: false,
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      editRoleDialogVisible: false,

      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 查询到的角色信息
      editRoleForm: {},
      //   分配权限对话框显示隐藏
      setRightDialogVisible: false,
      //   所有权限信息
      rightslist: {},
      //   树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //   默认选中节点的数组
      defkeys: [],
      // 即将分配权限的角色Id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发送添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) this.$message.error('创建角色失败！')
        this.$message.success('创建角色成功！')
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },
    addRoleDialogClosed() {
      // console.log(this.$refs.addRoleFormRef)
      this.$refs.addRoleFormRef.resetFields()
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 根据用户id查询角色
    async showRole(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询角色信息失败')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败')
        }
        this.editRoleDialogVisible = false
        this.getRolesList(role, this.defkeys)
        this.$message.success('更新角色成功')
      })
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 用户确认删除。返回字符串confirm
      // 用户取消删除，返回字符串cancel
      // console.log( confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      } else {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.err('删除角色失败！')
        }
        this.$message.success('删除角色成功')
        this.getRolesList()
      }
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      //   console.log('确认了删除')
      else {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        role.children = res.data
      }
    },
    // 展示分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限信息失败')
      } else {
        this.rightslist = res.data
        this.getLeafKeys(role, this.defkeys)
        this.setRightDialogVisible = true
      }
    },
    // 通过递归的形式，获取角色所有三级权限的ID，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node不包含children属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 清空分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      } else {
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>