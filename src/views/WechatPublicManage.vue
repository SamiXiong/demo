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
	    <el-button @click="exportTable" size="small">导出报表</el-button>
	  </el-form-item>
	</el-form>

    <el-table
	  :data="tableData"
	  stripe
	  style="width: 100%">
	  <el-table-column
	    type="index"
			>
	  </el-table-column>
	  <el-table-column
	    prop="name"
	    label="公众号"
	    >
	  </el-table-column>
	  <el-table-column
	    prop="url"
	    label="域名"
	    >
	  </el-table-column>
	  <el-table-column
	    prop="admin_url"
	    label="api接口域名"
	    >
	  </el-table-column>
		<el-table-column
	    prop="telephone"
	    label="电话"
	    >
	  </el-table-column>
		<el-table-column
	    prop="work_time"
	    label="工作时间"
	    >
	  </el-table-column>
		<el-table-column
	    prop="qq"
	    label="QQ"
	    >
	  </el-table-column>
		<el-table-column
	    prop="app_id"
	    label="appID"
	    >
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
					<el-button @click="show(scope.row)" type="text" size="small">查看更多</el-button>
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
	  title="用户信息"
	  :visible.sync="dialogVisible"
	  width="70%">
	      <div>
					<div class="userinfo">公众号:{{row.name}}</div>
					<div class="userinfo">域名:{{row.url}}</div>
					<div class="userinfo">api域名:{{ row.admin_url}}</div>
					<div class="userinfo">电话:{{ row.telephone}}</div>
					<div class="userinfo">工作时间:{{row.work_time}}</div>
					<div class="userinfo">QQ:{{ row.qq }}</div>
					<div class="userinfo">appID:{{row.app_id}}</div>
					<div class="userinfo">创建时间:{{row.created_time}}</div>
					<div class="userinfo">app_secret:{{ row.app_secret}}</div>
					<div class="qrcode-text">
						<span>
							qrcode:
						</span>
						<img :src=row.qrcode alt="" class="qrcode">
					</div>
					<div class="userinfo">access_token:{{row.access_token}}</div>
					<div class="userinfo">token_update_time:{{row.token_update_time}}</div>
	      </div>
	</el-dialog>
    <el-dialog
	  :title="dialogTitle"
	  :visible.sync="addDialogVisible"
	  width="34%">
	  <el-form :model="dialogForm" status-icon :rules="rules" ref="dialogForm" label-width="100px">
	    <el-form-item label="公众号名称" prop="name">
	      <el-input v-model="dialogForm.name" placeholder="请输入公众号名称"></el-input>
	    </el-form-item>
	    <el-form-item label="域名" prop="url">
	      <el-input v-model="dialogForm.url" placeholder="请输入域名"></el-input>
	    </el-form-item>
	    <el-form-item label="api接口域名" prop="adminUrl">
	      <el-input v-model="dialogForm.adminUrl" placeholder="请输入api接口域名"></el-input>
	    </el-form-item>
			<el-form-item label="电话" prop="telephone">
				<el-input v-model.number="dialogForm.telephone" placeholder="请输入电话"></el-input>
			</el-form-item>
			<el-form-item label="工作时间">
				<el-time-select
					placeholder="起始时间"
					v-model="startTime"
					:picker-options="{
						start: '05:30',
						step: '00:15',
						end: '23:30'
					}">
				</el-time-select>
				<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					:picker-options="{
						start: '05:30',
						step: '00:15',
						end: '23:30',
						minTime: startTime
					}">
				</el-time-select>
			</el-form-item>
			<el-form-item label="QQ" prop="qq">
				<el-input v-model="dialogForm.qq" placeholder="请输入QQ"></el-input>
			</el-form-item>
			<el-form-item label="appId" prop="appId">
				<el-input v-model="dialogForm.appId" placeholder="请输入app_id"></el-input>
			</el-form-item>
			<el-form-item label="appSecret" prop="appSecret">
				<el-input v-model="dialogForm.appSecret" placeholder="请输入app_secret"></el-input>
			</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="addDialogVisible = false">取消</el-button>
	    <el-button type="primary" @click="addSubmit('dialogForm')">确定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>
 
<script>

import { isvalidPhone, isvalidQQ} from '../utils/validate.js'
  export default({
    data() {
      return {
				tableData: [],
				jsonData:[],
				value:"",
				row:{

				},
        totalCount: 0,
        currentPage1: 1,
        formInline: {
          name: '',
					url: '',
					tel:''
        },
        searchFormData: {
          name: '',
          url: ''
				},
				dialogVisible:false,
        addDialogVisible: false,
        dialogTitle: '',
        isEdit: false,
				curRowId: 0,
				startTime:'',
				endTime:'',
        dialogForm: {
          name: '',
					url: '',
					adminUrl: '',
					appId:'',
					appSecret:'',
					telephone:'',
					qq:'',
					workTime:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入公众号名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请输入域名', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
					],
					adminUrl: [
            { required: true, message: '请输入api域名', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
					],
					appId:[
						 { required: true, message: '请输入appID', trigger: 'blur' },
					],
					appSecret:[
						 { required: true, message: '请输入appSecret', trigger: 'blur' },
					],
					qq:[
						 { trigger: 'blur', validator: this.validQQ }
					],
					telephone:[
						// { required: true, message: '电话', trigger: 'blur' },
						{ trigger: 'blur', validator: this.validPhone }
					]
        }
      }
    },
    created: function(){
      this.searchData();
	},
	methods: {
		validPhone:(rule, value,callback)=>{
					if (!value){
							callback(new Error('请输入电话号码'))
					}
					// else  if (!isvalidPhone(value)){
					// 	callback(new Error('请输入正确的11位手机号码'))
					// }
					else {
							callback()
					}
			},
		validQQ:(rule, value,callback)=>{
					if (!value){
							callback(new Error('请输入QQ号'))
					}else  if (!isvalidQQ(value)){
						callback(new Error('请输入正确的QQ号'))
					}else {
							callback()
					}
			},
	  searchData: function(){
	  	let url = "/admin/wechat_public/list?page=" + this.currentPage1;
	  	for (let i in this.searchFormData) {
	  	  url += '&' + i + '=' + this.searchFormData[i];
	  	}

	    this.$axios.get(url).then(res=>{
				this.tableData = res.data.data;
				for (let i in this.tableData){
					let created_time = this.tableData[i].created_time
					this.tableData[i].created_time = new Date(parseInt(created_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
					if(this.tableData[i].token_update_time){
						let token_update_time = this.tableData[i].token_update_time
						this.tableData[i].token_update_time = new Date(parseInt(token_update_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
					}
        }
				this.totalCount = res.data.total_count;
	    });
		},
		exportTable(){
      let self = this
      self.jsonData = []
      let str = `公众号,域名,api接口域名,电话,工作时间,QQ,appID,创建时间\n`;
      for (let i in this.tableData){
        let status = ""
        switch(this.tableData[i].status){
          case  'enable':
          status = '启用'
          break;
          case  'disable':
          status = '禁用'
          break;
        }
        self.jsonData.push({
          name:this.tableData[i]['name'],
          url:this.tableData[i]['url'],
          admin_url:this.tableData[i]['admin_url'],
          tel:this.tableData[i]['telephone'],
					work_time:this.tableData[i]['work_time'],
					qq:this.tableData[i]['qq'],
					app_id:this.tableData[i]['app_id'],
          created_time:this.tableData[i]['created_time']
        })
      }
      let jsonData = self.jsonData
       for(let i = 0 ; i < jsonData.length ; i++ ){
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;     
        }
        str+='\n';
			}
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      var link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download =  "公众号管理.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
		 show: function(row) {
      	this.row = row;
      	this.dialogVisible = true;
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
			 this.dialogForm = {
          name: '',
					url: '',
					adminUrl: '',
					appId:'',
					appSecret:'',
					telephone:'',
					qq:'',
					workTime:'',
        },
      	this.dialogTitle = '添加公众号';
      	this.isEdit = false;
      	this.addDialogVisible = true;
      },
      edit: function(row) {
      	this.dialogTitle = '编辑公众号';
      	this.isEdit = true;
				this.curRowId = row.id;
				this.dialogForm = row
				this.dialogForm.adminUrl = row.admin_url
				this.dialogForm.appId = row.app_id
				this.dialogForm.appSecret = row.app_secret
				this.startTime = row.work_time.split('-',2)[0]
				this.endTime = row.work_time.split('-',2)[1]
      	this.addDialogVisible = true;
      },
      addSubmit: function(formName) {
      	let self = this;
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let url = this.isEdit ? '/admin/wechat_public/update/' + this.curRowId : '/admin/wechat_public/create'; 
						let qs = require('qs'); 
						if(this.startTime||this.endTime){
							this.dialogForm.workTime = this.startTime+"-"+this.endTime
						}
						let data = {
							name:self.dialogForm.name,
							url:self.dialogForm.url,
							admin_url:self.dialogForm.admin_url,
							app_id:self.dialogForm.app_id,
							app_secret:self.dialogForm.app_secret,
							telephone:self.dialogForm.telephone,
							qq:self.dialogForm.qq,
							work_time:self.dialogForm.work_time
						}
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