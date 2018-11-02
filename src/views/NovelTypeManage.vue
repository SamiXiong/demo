<template>
  <div id="app" class="app-container">
  	<el-form :inline="true" class="demo-form-inline">
	  <el-form-item>
	    <el-button @click="openAddFirstDialog" size="small">添加一级分类</el-button>
	  </el-form-item>
	  <el-form-item>
	    <el-button @click="openAddSecondDialog" size="small">添加二级分类</el-button>
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
	    prop="type"
	    label="分类名称"
	    width="130">
	  </el-table-column>
	  <el-table-column
	    prop="parentType"
	    label="父分类名称"
	    width="130">
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
        <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
	</el-table>

  <el-dialog
	  :title="dialogTitle"
	  :visible.sync="dialogVisible"
	  width="30%">
	  <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
	    <el-form-item label="分类名称" prop="type">
	      <el-input v-model="dialogForm.type" placeholder="请输入分类名称"></el-input>
	    </el-form-item>
	    <el-form-item label="一级分类" prop="parentId" v-if="!isFirstType">
	      <el-select v-model="dialogForm.parentId" filterable placeholder="一级分类">
	        <el-option
	          v-for="item in novelTypeOptions"
	          :key="item.value"
	          :label="item.label"
	          :value="item.value">
	        </el-option>
	      </el-select>
	    </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="dialogSubmit('dialogForm')">确定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>
 
<script>
  export default({
    data() {
      return {
        tableData: [],
        novelTypeOptions: [],
        dialogVisible: false,
        dialogTitle: '',
        isEdit: false,
        isFirstType: false,
        defaultFirstType: 0,
        curRowId: 0,
        dialogForm: {
          type: '',
          parentId: '0'
        },
        dialogRules: {
          type: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created: function(){
      this.searchData();
  	},
  	methods: {
  	  searchData: function(){
  	    this.$axios.get("/admin/novel_type/find/all").then(res=>{
  	      console.log(res.data);
  	      this.tableData = res.data;

  	      //填充一级分类下拉框内容
  	      let is_first = true;
  	      this.novelTypeOptions = [];
  	      for (let i in this.tableData) {
  	        if (this.tableData[i].parent_id == 0) {
  	          this.novelTypeOptions.push({
  	            value: this.tableData[i].id,
  	            label: this.tableData[i].type 
  	          });

  	          if (is_first) {
  	          	this.defaultFirstType = this.tableData[i].id;
  	          	is_first = false;
  	          }
  	        }
  	      }
  	    });
  	  },
      openAddFirstDialog: function() {
      	this.dialogTitle = '添加一级分类';
      	this.isEdit = false;
      	this.isFirstType = true;
      	this.dialogForm = {
          type: '',
          parentId: 0
        };
      	this.dialogVisible = true;
      },
      openAddSecondDialog: function() {
      	this.dialogTitle = '添加二级分类';
      	this.isEdit = false;
      	this.isFirstType = false;
      	this.dialogForm = {
          type: '',
          parentId: this.defaultFirstType
        };
      	this.dialogVisible = true;
      },
      edit: function(row) {
      	if (row.parent_id == 0) {
      	  this.dialogTitle =  '编辑一级分类';
      	  this.isFirstType = true;
      	} else {
      	  this.dialogTitle =  '编辑二级分类';
      	  this.isFirstType = false;
      	}
      	this.isEdit = true;
      	this.curRowId = row.id;
      	this.dialogForm = {
          type: row.type,
          parentId: row.parent_id,
        };
      	this.dialogVisible = true;
      },
      dialogSubmit: function(formName) {
      	let self = this;
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let url = this.isEdit ? '/admin/novel_type/update/' + this.curRowId : '/admin/novel_type/create'; 
          	let qs = require('qs'); 
            this.$axios.post(url, qs.stringify(this.dialogForm))
    		    .then(function(response) {
    		      if (response.data.success) {
    		      	self.$message({
    		          message: response.data.msg,
    		          type: 'success'
    		        });
    		        self.dialogVisible = false;
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
      del: function(row) {
        let self = this;
        this.$confirm('确定删除' + row.type + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/admin/novel_type/delete/' + row.id)
          .then(function(response) {
            if (response.data.success) {
              self.$message({
                message: response.data.msg,
                type: 'success'
              });
              self.dialogVisible = false;
              self.searchData();
            } else {
              self.$message.error(response.data.msg);
            }
          })
          .catch(function(error) {
            self.$message.error(error.response.data.msg);
          });
        });
      },
	  }
  })
</script>
 
<style scoped>
</style>