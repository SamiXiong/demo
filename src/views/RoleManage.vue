<template>
  <div id="app" class="app-container">
  	 <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="角色名称">
        <el-input v-model="formInline.role_name" placeholder="角色名称" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="formInline.role_level" placeholder="等级" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.role_status" placeholder="状态" size="small">
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
    </el-form>

    <el-table
	  :data="tableData"
	  stripe
	  style="width: 100%">
	  <el-table-column
	    type="index"
	    width="50">
	  </el-table-column>
	  <el-table-column
	    prop="name"
	    label="角色名称"
	    >
	  </el-table-column>
	  <el-table-column
	    prop="type"
	    label="等级"
	    >
	    <template slot-scope="scope">
	      {{scope.row.type == 'super_admin' ? '超级管理员' : '普通管理员'}}
	    </template>
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
          <el-button @click="assign(scope.row)" type="text" size="small">分配权限</el-button>
        </template>
      </el-table-column>
	</el-table>
	
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="20"
      background
      layout="total, prev, pager, next"
      :total="totalCount"
      style="text-align:center;"
      >
    </el-pagination>

    <el-dialog
	  :title="dialogTitle"
	  :visible.sync="addDialogVisible"
	  width="30%">
	  <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
	    <el-form-item label="角色名称" prop="name">
	      <el-input v-model="addForm.name" placeholder="请输入角色名称"></el-input>
	    </el-form-item>
	    <el-form-item label="等级" prop="type">
	      <el-select v-model="addForm.type" placeholder="等级" size="small">
	      <el-option label="超级管理员" value="super_admin"></el-option>
	      <el-option label="普通管理员" value="admin"></el-option>
	    </el-select>
	    </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="addDialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="addSubmit('addForm')">确定</el-button>
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
      addDialogVisible: false,
      curRowId: 0,
      isEdit: false,
      dialogTitle: "",
      addForm: {
        name: "",
        type: ""
      },
      formInline:{
        role_name:"",
        role_level:"",
        role_status:""
      },
      addRules: {}
    };
  },
  created: function() {
    this.searchData();
  },
  methods: {
    searchSubmit(){

    },
    searchData: function() {
      let url = "/admin/role/list?page=" + this.currentPage1;

      this.$axios.get(url).then(res => {
        console.log(res.data);
        this.tableData = res.data.data;
        this.totalCount = res.data.total_count;
      });
    },
    handleCurrentChange: function(val) {
      this.currentPage1 = val;
      this.searchData();
    },
    setEnable: function(row) {
      this.$confirm("确定启用" + row.name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.setStatus(row.id, "enable");
      });
    },
    setDisable: function(row) {
      this.$confirm("确定禁用" + row.name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setStatus(row.id, "disable");
        })
        .catch(err => {});
    },
    assign(row) {
      console.log(row);
    },
    setStatus: function(id, status) {
      let self = this;
      let qs = require("qs");
      this.$axios
        .post("/admin/role/set_status/" + id, qs.stringify({ status: status }))
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
      this.dialogTitle = "添加角色";
      this.isEdit = false;
      this.addForm = {
        name: "",
        type: ""
      };
      this.addDialogVisible = true;
    },
    edit: function(row) {
      this.dialogTitle = "编辑角色";
      this.isEdit = true;
      this.curRowId = row.id;
      this.addForm = {
        name: row.name,
        type: row.type
      };
      this.addDialogVisible = true;
    },
    addSubmit: function(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let qs = require("qs");
          let url = this.isEdit
            ? "/admin/role/update/" + this.curRowId
            : "/admin/role/create";

          this.$axios
            .post(url, qs.stringify(this.addForm))
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
    }
  }
};
</script>
 
<style scoped>
</style>