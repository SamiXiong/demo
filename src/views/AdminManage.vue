<template>
  <div id="app" class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="账号">
        <el-input v-model="formInline.username" placeholder="账号" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formInline.truename" placeholder="姓名" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="formInline.roleId" filterable placeholder="角色" size="small">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="状态" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="enable"></el-option>
          <el-option label="禁用" value="disable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit" size="small">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="add" size="small">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchSubmit" size="small">导出报表</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="账号"
        >
      </el-table-column>
      <el-table-column
        prop="truename"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="联系方式"
        >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        >
        <template slot-scope="scope">
          {{ scope.row.status == 'enable' ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="setEnable(scope.row)" type="text" size="small" v-if="scope.row.status == 'disable'">启用</el-button>
          <el-button @click="setDisable(scope.row)" type="text" size="small" v-if="scope.row.status == 'enable'">禁用</el-button>
          <el-button @click="resetPassword(scope.row)" type="text" size="small">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination  layout="total, prev, pager, next"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage1"
                    :page-size="20"
                    background
                    :total="totalCount"
                    style="text-align:center;">
    </el-pagination>

    <el-dialog
      title="添加管理员账号"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="repassword">
          <el-input type="password" v-model="addForm.repassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.roleId" filterable placeholder="角色" size="small">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="truename">
          <el-input v-model="addForm.truename" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="addForm.telephone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改管理员信息"
      :visible.sync="edtDialogVisible"
      width="30%">
      <el-form :model="edtForm" :rules="edtRules" ref="edtForm" label-width="100px">
        <el-form-item label="姓名" prop="truename">
          <el-input v-model="edtForm.truename" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="edtForm.telephone" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edtDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="edtSubmit('edtForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialogVisible"
      width="30%">
      <el-form :model="resetPasswordForm" :rules="resetPasswordRules" ref="resetPasswordForm" label-width="100px">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="resetPasswordForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="repassword">
          <el-input type="password" v-model="resetPasswordForm.repassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="resetPasswordSubmit('resetPasswordForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage1: 1,
      curRowId: "",
      formInline: {
        username: "",
        truename: "",
        roleId: "",
        status: ""
      },
      searchFormData: {
        username: "",
        truename: "",
        roleId: "",
        status: ""
      },
      roleOptions: [{ label: "全部", value: "" }],
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        repassword: "",
        truename: "",
        telephone: "",
        roleId: ""
      },
      addRules: {},
      edtDialogVisible: false,
      edtForm: {
        truename: "",
        telephone: ""
      },
      edtRules: {},
      resetPasswordDialogVisible: false,
      resetPasswordForm: {
        password: "",
        repassword: ""
      },
      resetPasswordRules: {}
    };
  },
  created: function() {
    this.searchData();
    this.getRoleOptions();
  },
  methods: {
    searchData: function() {
      let url = "/admin/admin_user/list?page=" + this.currentPage1;
      for (let i in this.searchFormData) {
        url += "&" + i + "=" + this.searchFormData[i];
      }

      this.$axios.get(url).then(res => {
        console.log(res.data);
        this.tableData = res.data.data;
        this.totalCount = res.data.total_count;
      });
    },
    getRoleOptions: function() {
      this.$axios.get("admin/role/find/all").then(res => {
        if (res.data.length > 0) {
          for (let i in res.data) {
            this.roleOptions.push({
              label: res.data[i].name,
              value: res.data[i].id
            });
          }
        }
      });
    },
    handleCurrentChange: function(val) {
      this.currentPage1 = val;
      this.searchData();
    },
    searchSubmit: function() {
      for (let i in this.formInline) {
        this.searchFormData[i] = this.formInline[i];
      }
      this.searchData();
    },
    setEnable: function(row) {
      this.$confirm("确定启用" + row.username + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.setStatus(row.id, "enable");
      });
    },
    setDisable: function(row) {
      this.$confirm("确定禁用" + row.username + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.setStatus(row.id, "disable");
      });
    },
    setStatus: function(id, status) {
      let self = this;
      let qs = require("qs");
      this.$axios
        .post(
          "/admin/admin_user/set_status/" + id,
          qs.stringify({ status: status })
        )
        .then(function(response) {
          if (response.data.success) {
            self.$message({
              message: response.data.msg,
              type: "success"
            });
            self.searchData();
          } else {
            self.$message.error(response.data.msg);
          }
        })
        .catch(function(error) {
          self.$message.error(error.response.data.msg);
        });
    },
    add: function() {
      this.addForm = {
        username: "",
        password: "",
        repassword: "",
        truename: "",
        telephone: "",
        roleId: ""
      };
      this.addDialogVisible = true;
    },
    addSubmit: function(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let qs = require("qs");
          this.$axios
            .post("/admin/admin_user/create", qs.stringify(this.addForm))
            .then(function(response) {
              if (response.data.success) {
                self.$message({
                  message: response.data.msg,
                  type: "success"
                });
                self.addDialogVisible = false;
                self.searchData();
              } else {
                self.$message.error(response.data.msg);
              }
            })
            .catch(function(error) {
              self.$message.error(error.response.data.msg);
            });
        } else {
          return false;
        }
      });
    },
    edit: function(row) {
      this.curRowId = row.id;
      this.edtForm = {
        truename: row.truename,
        telephone: row.telephone
      };
      this.edtDialogVisible = true;
    },
    edtSubmit: function(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let qs = require("qs");
          this.$axios
            .post(
              "/admin/admin_user/update/" + this.curRowId,
              qs.stringify(this.edtForm)
            )
            .then(function(response) {
              if (response.data.success) {
                self.$message({
                  message: response.data.msg,
                  type: "success"
                });
                self.edtDialogVisible = false;
                self.searchData();
              } else {
                self.$message.error(response.data.msg);
              }
            })
            .catch(function(error) {
              self.$message.error(error.response.data.msg);
            });
        } else {
          return false;
        }
      });
    },
    resetPassword: function(row) {
      this.curRowId = row.id;
      this.resetPasswordForm = {
        password: "",
        repassword: ""
      };
      this.resetPasswordDialogVisible = true;
    },
    resetPasswordSubmit: function(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let qs = require("qs");
          this.$axios
            .post(
              "/admin/admin_user/reset_password/" + this.curRowId,
              qs.stringify(this.resetPasswordForm)
            )
            .then(function(response) {
              if (response.data.success) {
                self.$message({
                  message: response.data.msg,
                  type: "success"
                });
                self.resetPasswordDialogVisible = false;
                self.searchData();
              } else {
                self.$message.error(response.data.msg);
              }
            })
            .catch(function(error) {
              self.$message.error(error.response.data.msg);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
 
<style scoped>
</style>