<template>
  <div id="app" class="app-container">
  	<el-form :inline="true" :model="formInline" class="demo-form-inline">
	  <el-form-item label="名称">
	    <el-input v-model="formInline.title" placeholder="名称" size="small" clearable></el-input>
	  </el-form-item>
	  <el-form-item label="编号">
	    <el-input v-model="formInline.novelNo" placeholder="编号" size="small" clearable></el-input>
	  </el-form-item>
	  <el-form-item label="性别频度">
	    <el-select v-model="formInline.firstType" placeholder="性别频度" size="small">
	      <el-option
	        v-for="item in firstTypeOptions"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value">
	      </el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="分类">
	    <el-select v-model="formInline.secondType" placeholder="分类" size="small">
	      <el-option
	        v-for="item in secondTypeOptions"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value">
	      </el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="连载状态">
	    <el-select v-model="formInline.novelStatus" placeholder="连载状态" size="small">
	      <el-option label="全部" value=""></el-option>
	      <el-option label="连载中" value="loading"></el-option>
	      <el-option label="完结" value="finish"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="小说状态">
	    <el-select v-model="formInline.status" placeholder="小说状态" size="small">
	      <el-option label="全部" value=""></el-option>
	      <el-option label="未上架" value="draft"></el-option>
	      <el-option label="上架" value="shelf"></el-option>
	      <el-option label="下架" value="obtained"></el-option>
	      <el-option label="删除" value="delete"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item>
	    <el-button type="primary" @click="searchSubmit" size="small">查询</el-button>
	  </el-form-item>
	  <!--<el-form-item>
	    <el-button @click="openAddDialog" size="small">添加</el-button>
	  </el-form-item>
	  <el-form-item>
	    <el-button @click="searchSubmit" size="small">导出报表</el-button>
	  </el-form-item>-->
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
	    prop="img"
	    label="封面"
	    width="130">
	  </el-table-column>
	  <el-table-column
	    prop="title"
	    label="名称">
	    <template slot-scope="scope">
          <div>
            <span>{{scope.row.title}}</span>
            <span>(书号:{{scope.row.novel_no}})</span>
            <span>[{{scope.row.novel_status == 'loading' ? '连载中' : '完结'}}]</span>
          </div>
        </template>
	  </el-table-column>
	  <el-table-column
	    prop="status"
	    label="状态"
	    width="100">
	    <template slot-scope="scope">
          <span v-if="scope.row.status == 'draft'">未上架</span>
          <span v-if="scope.row.status == 'shelf'">上架</span>
          <span v-if="scope.row.status == 'obtained'">下架</span>
          <span v-if="scope.row.status == 'delete'">删除</span>
        </template>
	  </el-table-column>
	  <el-table-column
	    prop="firstTypeName"
	    label="性别频度"
	    width="100">
	  </el-table-column>
	  <el-table-column
	    prop="secondTypeName"
	    label="分类"
	    width="100">
	  </el-table-column>
	  <el-table-column
	    prop="created_time"
	    label="创建时间"
	    width="200">
	  </el-table-column>
	  <el-table-column
        fixed="right"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <!--<el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>-->
          <el-button @click="setType(scope.row)" type="text" size="small">设置分类</el-button>
          <el-button @click="setStatus(scope.row)" type="text" size="small">设置状态</el-button>
          <el-button @click="setWechatPublic(scope.row)" type="text" size="small">分配到公众号</el-button>
          <el-button @click="showJoinWechatPublic(scope.row)" type="text" size="small">查看已关联公众号</el-button>
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
	  title="设置分类"
	  :visible.sync="setTypeDialogVisible"
	  width="30%">
	  <el-form :model="setTypeForm" :rules="setTypeRules" ref="setTypeForm" label-width="100px">
	    <el-form-item label="性别频度" prop="firstType">
	      <el-select v-model="setTypeForm.firstType" placeholder="性别频度" size="small">
	        <el-option
	          v-for="item in firstTypeOptions"
	          :key="item.value"
	          :label="item.label"
	          :value="item.value">
	        </el-option>
	      </el-select>
	    </el-form-item>
	    <el-form-item label="分类" prop="secondType">
	      <el-select v-model="setTypeForm.secondType" placeholder="分类" size="small">
	        <el-option
	          v-for="item in secondTypeOptions"
	          :key="item.value"
	          :label="item.label"
	          :value="item.value">
	        </el-option>
	      </el-select>
	    </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="setTypeDialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="setTypeSubmit('setTypeForm')">确定</el-button>
	  </span>
	</el-dialog>

	<el-dialog
	  title="设置状态"
	  :visible.sync="setStatusDialogVisible"
	  width="30%">
	  <el-form :model="setStatusForm" :rules="setStatusRules" ref="setStatusForm" label-width="100px">
	    <el-form-item label="性别频度" prop="firstType">
	      <el-select v-model="setStatusForm.status" placeholder="小说状态" size="small">
	        <el-option label="上架" value="shelf"></el-option>
	        <el-option label="下架" value="obtained"></el-option>
	        <el-option label="删除" value="delete"></el-option>
	      </el-select>
	    </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="setStatusDialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="setStatusSubmit('setStatusForm')">确定</el-button>
	  </span>
	</el-dialog>

	<el-dialog
	  title="分配到公众号"
	  :visible.sync="setWechatPublicDialogVisible"
	  width="30%">
	  <el-table
		:data="setWechatPublicTableData"
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
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="join(scope.row)" type="text" size="small" v-if="!scope.row.is_join">关联</el-button>
            <el-button @click="cancelJoin(scope.row)" type="text" size="small" v-if="scope.row.is_join">取消关联</el-button>
          </template>
        </el-table-column>
	  </el-table>
	</el-dialog>

	<el-dialog
	  title="查看已关联公众号"
	  :visible.sync="joinWechatPublicDialogVisible"
	  width="30%">
	  <el-table
		:data="joinWechatPublicTableData"
		stripe
		style="width: 100%">
		<el-table-column
		  type="index"
		  width="50">
		</el-table-column>
		<el-table-column
		  prop="wechatPublicName"
		  label="公众号"
		  width="130">
		</el-table-column>
	  </el-table>
	</el-dialog>
  </div>
</template>
 
<script>
  export default({
    data() {
      return {
        tableData: [],
        joinWechatPublicTableData: [],
        setWechatPublicTableData: [],
        totalCount: 0,
        currentPage1: 1,
        firstTypeOptions: [
          {label: '全部', value: ''}
        ],
        secondTypeOptions: [
          {label: '全部', value: ''}
        ],
        formInline: {
          title: '',
          novelNo: '',
          firstType: '',
          secondType: '',
          novelStatus: '',
          status: ''
        },
        searchFormData: {
          title: '',
          novelNo: '',
          firstType: '',
          secondType: '',
          novelStatus: '',
          status: ''
        },
        addDialogVisible: false,
        setTypeDialogVisible: false,
        setStatusDialogVisible: false,
        setWechatPublicDialogVisible: false,
        joinWechatPublicDialogVisible: false,
        dialogTitle: '',
        isEdit: false,
        curRowId: 0,
        setTypeForm: {
          firstType: '',
          secondType: '',
        },
        setTypeRules: {
          firstType: [
            { required: true, message: '请选择一级分类', trigger: 'blur' },
          ],
          secondType: [
            { required: true, message: '请选择二级分类', trigger: 'blur' },
          ],
        },
        setStatusForm: {
          status: '',
        },
        setStatusRules: {
          status: [
            { required: true, message: '请选择状态', trigger: 'blur' },
          ],
        }
      }
    },
    created: function(){
      this.searchData();
      this.getNovelTypeOptions();
	},
	methods: {
	  searchData: function(){
	  	let url = "/admin/novel/list?page=" + this.currentPage1;
	  	for (let i in this.searchFormData) {
	  	  url += '&' + i + '=' + this.searchFormData[i];
	  	}

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableData = res.data.data;
	      this.totalCount = res.data.total_count;
	    });
	  },
	  getNovelTypeOptions: function() {
	  	this.$axios.get('admin/novel_type/find/all').then(res=>{
	      console.log(res.data);
	      if (res.data.length > 0) {
	      	for (let i in res.data) {
	      	  if (res.data[i].parent_id == 0) {
	      	    this.firstTypeOptions.push({
	      	      'label': res.data[i].type,
	      	      'value': res.data[i].id
	      	    });
	      	  } else {
	      	    this.secondTypeOptions.push({
	      	      'label': res.data[i].type,
	      	      'value': res.data[i].id
	      	    });
	      	  }
	      	}
	      }
	    });
	  },
	  getJoinWechatPublic: function() {
	    this.$axios.get("/admin/wechat_public_novel/list/novel/" + this.curRowId).then(res=>{
	      console.log(res.data);
	      this.joinWechatPublicTableData = res.data;
	    });
	  },
	  getWechatPublicNovel: function() {
	    this.$axios.get("/admin/wechat_public_novel/list/show_set_by_novel/" + this.curRowId).then(res=>{
	      console.log(res.data);
	      this.setWechatPublicTableData = res.data;
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
      showJoinWechatPublic: function(row) {
      	this.curRowId = row.id;
      	this.getJoinWechatPublic();
      	this.joinWechatPublicDialogVisible = true;
      },
      setType: function(row) {
      	this.curRowId = row.id;
      	this.setTypeForm = {
          firstType: row.first_type == 0 ? '' : row.first_type,
          secondType: row.second_type == 0 ? '' : row.second_type,
        };
        this.setTypeDialogVisible = true;
      },
      setTypeSubmit: function(formName) {
      	let self = this;
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let qs = require('qs'); 
            this.$axios.post('/admin/novel/set_type/' + this.curRowId, qs.stringify(this.setTypeForm))
		    .then(function(response) {
		      if (response.data.success) {
		      	self.$message({
		          message: response.data.msg,
		          type: 'success'
		        });
		        self.setTypeDialogVisible = false;
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
      setStatus: function(row) {
      	this.curRowId = row.id;
      	this.setStatusForm = {
          status: row.status == 'draft' ? '' : row.status,
        };
        this.setStatusDialogVisible = true;
      },
      setStatusSubmit: function(formName) {
      	let self = this;
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let qs = require('qs'); 
            this.$axios.post('/admin/novel/set_status/' + this.curRowId, qs.stringify(this.setStatusForm))
		    .then(function(response) {
		      if (response.data.success) {
		      	self.$message({
		          message: response.data.msg,
		          type: 'success'
		        });
		        self.setStatusDialogVisible = false;
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
      setWechatPublic: function(row) {
      	this.curRowId = row.id;
      	this.getWechatPublicNovel();
        this.setWechatPublicDialogVisible = true;
      },
      join: function(row) {
      	let qs = require('qs'); 
      	let params = {
      	  wechatPublicId: row.id,
      	  novelId: this.curRowId
      	};
      	let self = this;
        this.$axios.post('/admin/wechat_public_novel/create', qs.stringify(params))
	    .then(function(response) {
	      if (response.data.success) {
	      	self.$message({
	          message: response.data.msg,
	          type: 'success'
	        });
	      	self.getWechatPublicNovel();
	      } else {
	        self.$message.error(response.data.msg);
	      }
	    })
	    .catch(function(error) {
	      self.$message.error(error.response.data.msg);
	    });
      },
      cancelJoin: function(row) {
        let self = this;
        this.$axios.post('/admin/wechat_public_novel/delete/' + row.wechatPublicNovelId)
	    .then(function(response) {
	      if (response.data.success) {
	      	self.$message({
	          message: response.data.msg,
	          type: 'success'
	        });
	      	self.getWechatPublicNovel();
	      } else {
	        self.$message.error(response.data.msg);
	      }
	    })
	    .catch(function(error) {
	      self.$message.error(error.response.data.msg);
	    });
      }

      /*
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
      */
	}
  })
</script>
 
<style scoped>
</style>