<template>
  <div id="app" class="app-container">
  	<el-form :inline="true" :model="formInline" class="demo-form-inline">
	  <el-form-item label="公众号">
	    <el-input v-model="formInline.name" placeholder="公众号" size="small" clearable></el-input>
	  </el-form-item>
	  <el-form-item label="域名">
	    <el-input v-model="formInline.url" placeholder="域名" size="small" clearable></el-input>
	  </el-form-item>
	  <!--<el-form-item label="活动区域">
	    <el-select v-model="formInline.region" placeholder="活动区域">
	      <el-option label="区域一" value="shanghai"></el-option>
	      <el-option label="区域二" value="beijing"></el-option>
	    </el-select>
	  </el-form-item>-->
	  <el-form-item>
	    <el-button type="primary" @click="searchSubmit" size="small">查询</el-button>
	  </el-form-item>
	  <el-form-item>
	    <el-button @click="openAddDialog" size="small">添加</el-button>
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
	    type="index"
	    width="50">
	  </el-table-column>
	  <el-table-column
	    prop="name"
	    label="公众号"
	    width="130">
	  </el-table-column>
	  <el-table-column
	    prop="url"
	    label="域名"
	    width="250">
	  </el-table-column>
	  <el-table-column
	    prop="admin_url"
	    label="api接口域名"
	    width="250">
	  </el-table-column>
	  <el-table-column
	    prop="created_time"
	    label="创建时间">
	  </el-table-column>
	  <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
	</el-table>
	
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="20"
      layout="total, prev, pager, next"
      :total="totalCount">
    </el-pagination>

    <el-dialog
	  :title="dialogTitle"
	  :visible.sync="addDialogVisible"
	  width="30%">
	  <el-form :model="dialogForm" :rules="dialogRules" ref="addWechatPublicForm" label-width="100px">
	    <el-form-item label="公众号名称" prop="name">
	      <el-input v-model="dialogForm.name" placeholder="请输入公众号名称"></el-input>
	    </el-form-item>
	    <el-form-item label="域名" prop="url">
	      <el-input v-model="dialogForm.url" placeholder="请输入域名"></el-input>
	    </el-form-item>
	    <el-form-item label="api接口域名" prop="adminUrl">
	      <el-input v-model="dialogForm.adminUrl" placeholder="请输入api接口域名"></el-input>
	    </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="addDialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="addSubmit('addWechatPublicForm')">确定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>
 
<script>
  export default({
    data() {
      return {
        tableData: [],
        totalCount: 0,
        currentPage1: 1,
        formInline: {
          name: '',
          url: ''
        },
        searchFormData: {
          name: '',
          url: ''
        },
        addDialogVisible: false,
        dialogTitle: '',
        isEdit: false,
        curRowId: 0,
        dialogForm: {
          name: '',
          url: '',
          adminUrl: ''
        },
        dialogRules: {
          name: [
            { required: true, message: '请输入公众号名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请输入域名', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created: function(){
      this.searchData();
	},
	methods: {
	  searchData: function(){
	  	let url = "/admin/wechat_public/list?page=" + this.currentPage1;
	  	for (let i in this.searchFormData) {
	  	  url += '&' + i + '=' + this.searchFormData[i];
	  	}

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableData = res.data.data;
	      this.totalCount = res.data.total_count;
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
      openAddDialog: function() {
      	this.dialogTitle = '添加公众号';
      	this.isEdit = false;
      	this.addDialogVisible = true;
      },
      edit: function(row) {
      	this.dialogTitle = '编辑公众号';
      	this.isEdit = true;
      	this.curRowId = row.id;
      	this.dialogForm = {
          name: row.name,
          url: row.url,
          adminUrl: row.adminUrl
        };
      	this.addDialogVisible = true;
      },
      addSubmit: function(formName) {
      	let self = this;
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let url = this.isEdit ? '/admin/wechat_public/update/' + this.curRowId : '/admin/wechat_public/create'; 
          	let qs = require('qs'); 
            this.$axios.post(url, qs.stringify(this.dialogForm))
		    .then(function(response) {
		      if (response.data.success) {
		      	self.$message({
		          message: response.data.msg,
		          type: 'success'
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
	}
  })
</script>
 
<style scoped>
</style>