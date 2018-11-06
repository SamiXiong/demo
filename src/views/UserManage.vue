<template>
  <div id="app" class="app-container">
  	<el-form :inline="true" :model="formInline" class="demo-form-inline">
  	  <el-form-item label="公众号">
  	    <el-select v-model="formInline.wechatPublicId" filterable placeholder="公众号">
	      <el-option
	        v-for="item in wechatPublicOptions"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value">
	      </el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="编号">
	    <el-input v-model="formInline.userno" placeholder="编号" size="small" clearable></el-input>
	  </el-form-item>
	  <el-form-item label="昵称">
	    <el-input v-model="formInline.nickname" placeholder="昵称" size="small" clearable></el-input>
	  </el-form-item>
		<el-form-item label="性别">
	     <el-select v-model="formInline.vipType" placeholder="类型" size="small">
	      <el-option label="全部" value=""></el-option>
	      <el-option label="普通会员" value="0"></el-option>
	      <el-option label="VIP会员" value="1"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="类型">
	    <el-select v-model="formInline.vipType" placeholder="类型" size="small">
	      <el-option label="全部" value=""></el-option>
	      <el-option label="普通会员" value="normal"></el-option>
	      <el-option label="VIP会员" value="vip"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="性别">
	    <el-select v-model="formInline.sex" placeholder="性别" size="small">
	      <el-option label="全部" value=""></el-option>
	      <el-option label="男" value="0"></el-option>
	      <el-option label="女" value="1"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="注册开始时间">
	    <el-date-picker
	      v-model="formInline.startTime"
	      type="date"
	      format="yyyy-MM-dd"
	      value-format="timestamp"
	      placeholder="选择开始日期"
	      size="small">
	    </el-date-picker>
	  </el-form-item>
	  <el-form-item label="注册结束时间">
	    <el-date-picker
	      v-model="formInline.endTime"
	      type="date"
	      format="yyyy-MM-dd"
	      value-format="timestamp"
	      placeholder="选择结束日期"
	      size="small">
	    </el-date-picker>
	  </el-form-item>
	  <el-form-item>
	    <el-button type="primary" @click="searchSubmit" size="small">查询</el-button>
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
        width="50">
      </el-table-column>
	  <el-table-column
	    prop="wechat_public_name"
	    label="公众号"
	    width="130">
	  </el-table-column>
	  <el-table-column
	    prop="userno"
	    label="编号"
	    width="100">
	  </el-table-column>
	  <el-table-column
	    prop="nickname"
	    label="昵称"
	    width="150">
			<template slot-scope="scope">
				<div class="clearfix">
					<span class="left username">{{scope.row.nickname}}</span>
					<img :src=scope.row.headimageurl alt="" class="user-avatar right">
				</div>
			</template>
	  </el-table-column>
		<el-table-column
	    prop="sex"
	    label="性别"
	    width="150">
			<template slot-scope="scope">
				{{ scope.row.sex == null ? '未知' : (scope.row.sex == 0 ? '男' : '女') }}
			</template>
	  </el-table-column>
	  <el-table-column
	    prop="pay_money"
	    label="充值总金额"
	    width="100">
	    <template slot-scope="scope">
	      ￥{{ scope.row.pay_money / 100 }}
	    </template>
	  </el-table-column>
	  <el-table-column
	    prop="vip_type"
	    label="类型"
	    width="100">
	    <template slot-scope="scope">
	      {{ scope.row.vip_type == 'normal' ? '普通会员' : 'VIP会员' }}
	    </template>
	  </el-table-column>
	  <el-table-column
	    prop="vip_range"
	    label="VIP有效期"
	    width="200">
	    <template slot-scope="scope">
	      {{ '20180111-20180910' }}
	    </template>
	  </el-table-column>
	  <el-table-column
	    prop="is_attention"
	    label="是否关注"
	    width="100">
	    <template slot-scope="scope">
	      {{ scope.row.is_attention == 0 ? '未关注' : '已关注' }}
	    </template>
	  </el-table-column>
		<el-table-column
	    prop="attention_time"
	    label="关注时间"
	    width="250">
	  </el-table-column>
	  <el-table-column
	    prop="created_time"
	    label="注册时间"
	    width="150">
	  </el-table-column>
	  <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="show(scope.row)" type="text" size="small">查看详细</el-button>
					<el-button @click="show(scope.row)" type="text" size="small">查看业务数据</el-button>
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
	  <el-tabs v-model="activeName">
	    <el-tab-pane label="用户信息" name="userInfo">
	      <div>
			<div class="userinfo">公众号:{{curRow.wechat_public_name}}</div>
			<div class="userinfo">编号:{{curRow.userno}}</div>
			<div class="userinfo">昵称:{{ curRow.nickname }}</div>
			<div class="userinfo">性别:{{ curRow.sex == null ? '未知' : (curRow.sex == 0 ? '男' : '女') }}</div>
			<div class="userinfo">充值总金额:￥{{ curRow.pay_money / 100 }}</div>
			<div class="userinfo">会员类型:{{ curRow.vip_type == 'normal' ? '普通会员' : 'VIP会员' }}</div>
			<div class="userinfo">vip有效期:{{curRow.vip_range}}</div>
			<div class="userinfo">是否关注:{{ curRow.is_attention == 0 ? '未关注' : '已关注' }}</div>
			<div class="userinfo">关注时间:{{curRow.attention_time}}</div>
			<div class="userinfo">注册时间:{{ curRow.created_time }}</div>
			<div class="userinfo">书币:{{ curRow.virtual_money }}</div>
			<div class="userinfo">国家:{{curRow.country}}</div>
			<div class="userinfo">地址:{{ (curRow.province == null ? '' : curRow.province) + ' ' + (curRow.city ==  null ? '' : curRow.city) }}</div>
			<div class="userinfo">openid:{{curRow.agent_id}}</div>
			<div class="userinfo">最近登录时间:{{ curRow.updated_time }}</div>
	      </div>
	    </el-tab-pane>

	    <el-tab-pane label="阅读记录" name="readLog">
	      <el-table
		    :data="tableDataReadLog"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="novel_name"
		      label="小说"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="chapter_name"
		      label="章节">
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="阅读时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangeReadLog"
	        :current-page.sync="currentPageReadLog"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountReadLog">
	      </el-pagination>
	    </el-tab-pane>
	    
	    <el-tab-pane label="充值记录" name="payLog">
	      <el-table
		    :data="tableDataPayLog"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="bill_no"
		      label="订单号"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="total_money"
		      label="充值金额"
		      width="200">
		    </el-table-column>
		    <el-table-column
		      prop="status"
		      label="订单状态">
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="创建时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangePayLog"
	        :current-page.sync="currentPagePayLog"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountPayLog">
	      </el-pagination>
	    </el-tab-pane>

	    <el-tab-pane label="章节消费" name="chapterBuy">
	      <el-table
		    :data="tableDataChapterBuy"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="novel_name"
		      label="小说"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="chapter_name"
		      label="章节">
		    </el-table-column>
		  	<el-table-column
		      prop="virtual_money"
		      label="消费书币"
		      width="200">
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="消费时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangeChapterBuy"
	        :current-page.sync="currentPageChapterBuy"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountChapterBuy">
	      </el-pagination>
	    </el-tab-pane>

	    <el-tab-pane label="整书消费" name="bookBuy">
	      <el-table
		    :data="tableDataBookBuy"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="novel_name"
		      label="小说"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="virtual_money"
		      label="消费书币"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="消费时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangeBookBuy"
	        :current-page.sync="currentPageBookBuy"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountBookBuy">
	      </el-pagination>
	    </el-tab-pane>

	    <el-tab-pane label="打赏记录" name="awardLog">
	      <el-table
		    :data="tableDataAwardLog"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="novel_name"
		      label="小说"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="virtual_money"
		      label="打赏书币"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="打赏时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangeAwardLog"
	        :current-page.sync="currentPageAwardLog"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountAwardLog">
	      </el-pagination>
	    </el-tab-pane>

	    <el-tab-pane label="书币收入记录" name="receiveLog">
	      <el-table
		    :data="tableDataReceiveLog"
		    stripe
		    style="width: 100%">
		    <el-table-column
	          type="index"
	          width="50">
	        </el-table-column>
		    <el-table-column
		      prop="name"
		      label="摘要"
		      width="200">
		    </el-table-column>
		  	<el-table-column
		      prop="virtual_money"
		      label="书币"
		      width="200">
		    </el-table-column>
		    <el-table-column
		      prop="created_time"
		      label="产生时间"
		      width="200">
		    </el-table-column>
		  </el-table>
	      <el-pagination
	        @current-change="handleCurrentChangeReceiveLog"
	        :current-page.sync="currentPageReceiveLog"
	        :page-size="20"
	        layout="total, prev, pager, next"
	        :total="totalCountReceiveLog">
	      </el-pagination>
	    </el-tab-pane>
	  </el-tabs>
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
        tableDataReadLog: [],
        totalCountReadLog: 0,
        currentPageReadLog: 1,
        tableDataPayLog: [],
        totalCountPayLog: 0,
        currentPagePayLog: 1,
        tableDataChapterBuy: [],
        totalCountChapterBuy: 0,
        currentPageChapterBuy: 1,
        tableDataBookBuy: [],
        totalCountBookBuy: 0,
        currentPageBookBuy: 1,
        tableDataAwardLog: [],
        totalCountAwardLog: 0,
        currentPageAwardLog: 1,
        tableDataReceiveLog: [],
        totalCountReceiveLog: 0,
        currentPageReceiveLog: 1,
        formInline: {
          userno: '',
          vipType: '',
          isAttention: '',
          sex: '',
          startTime: '',
          endTime: '',
          nickname: '',
          wechatPublicId: ''
        },
        searchFormData: {
          userno: '',
          vipType: '',
          isAttention: '',
          sex: '',
          startTime: '',
          endTime: '',
          nickname: '',
          wechatPublicId: ''
        },
        wechatPublicOptions: [],
        dialogVisible: false,
        activeName: 'userInfo',
        curRow: {},
      }
    },
    created: function(){
      this.getWechatPublicOptions();
      this.searchData();
	},
	methods: {
	  searchData: function(){
	  	let url = "/admin/user/list?page=" + this.currentPage1;
	  	for (let i in this.searchFormData) {
	  	  url += '&' + i + '=' + this.searchFormData[i];
	  	}

	    this.$axios.get(url).then(res=>{
				this.tableData = res.data.data;
					for (let i in this.tableData){
					let created_time = this.tableData[i].created_time
					let attention_time = this.tableData[i].attention_time
					let updated_time = this.tableData[i].updated_time
					this.tableData[i].created_time = new Date(parseInt(created_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
					this.tableData[i].updated_time = new Date(parseInt(updated_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
					if(attention_time>0){
						this.tableData[i].attention_time = new Date(parseInt(attention_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
					}
				}
				console.log(this.tableData)
	      this.totalCount = res.data.total_count;
	    });
		},
		exportTable(){
      let self = this
      self.jsonData = []
      let str = `公众号,编号,昵称,性别,充值总金额,会员类型,vip有效期,是否关注,关注时间,创建时间\n`;
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
          wechat_public_name:this.tableData[i]['wechat_public_name'],
          wechat_public_id:this.tableData[i]['wechat_public_id'],
          nickname:this.tableData[i]['nickname'],
          sex:this.tableData[i].sex == null ? '未知' : (this.tableData[i].sex == 0 ? '男' : '女') ,
					pay_money:(this.tableData[i]['pay_money']/100),
					vip_type:this.tableData[i].vip_type == 'normal' ? '普通会员' : 'VIP会员',
					vip_range:this.tableData[i]['vip_range'],
					is_attention:this.tableData[i].is_attention == 0 ? '未关注' : '已关注',
					attention_time:this.tableData[i].attention_time,
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
      link.download =  "粉丝明细.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
	  searchDataReadLog: function(){
	  	let url = "/admin/read_log/list?wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPageReadLog;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataReadLog = res.data.data;
	      this.totalCountReadLog = res.data.total_count;
	    });
	  },
	  searchDataPayLog: function(){
	  	/*
	  	let url = "/admin/read_log/list?wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPagePayLog;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataPayLog = res.data.data;
	      this.totalCountPayLog = res.data.total_count;
	    });
	    */
	  },
	  searchDataChapterBuy: function(){
	  	let url = "/admin/flowing_list/list?type=buy_chapter&wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPageChapterBuy;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataChapterBuy = res.data.data;
	      this.totalCountChapterBuy = res.data.total_count;
	    });
	  },
	  searchDataBookBuy: function(){
	  	let url = "/admin/flowing_list/list?type=buy_book&wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPageBookBuy;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataBookBuy = res.data.data;
	      this.totalCountBookBuy = res.data.total_count;
	    });
	  },
	  searchDataAwardLog: function(){
	  	let url = "/admin/flowing_list/list?type=award&wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPageAwardLog;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataAwardLog = res.data.data;
	      this.totalCountAwardLog = res.data.total_count;
	    });
	  },
	  searchDataReceiveLog: function(){
	  	let url = "/admin/flowing_list/list?type=receive&wechatPublicId=" + this.curRow.wechat_public_id 
	  		+ "&userId=" + this.curRow.id + "&page=" + this.currentPageReceiveLog;

	    this.$axios.get(url).then(res=>{
	      console.log(res.data);
	      this.tableDataReceiveLog = res.data.data;
	      this.totalCountReceiveLog = res.data.total_count;
	    });
	  },
	  getWechatPublicOptions: function() {
	  	this.$axios.get('admin/wechat_public/get_options').then(res=>{
	      console.log(res.data);
	      this.wechatPublicOptions = res.data;
	      if (this.wechatPublicOptions.length > 0) {
	        this.formInline.wechatPublicId = this.wechatPublicOptions[0].value;
	        this.searchFormData.wechatPublicId = this.wechatPublicOptions[0].value;
	      }
	    });
	  },
	  handleCurrentChange: function(val) {
        this.currentPage1 = val;
        this.searchData();
      },
      handleCurrentChangeReadLog: function(val) {
        this.currentPageReadLog = val;
        this.searchDataReadLog();
      },
      handleCurrentChangePayLog: function(val) {
        this.currentPagePayLog = val;
        this.searchDataPayLog();
      },
      handleCurrentChangeChapterBuy: function(val) {
        this.currentPageChapterBuy = val;
        this.searchDataChapterBuy();
      },
      handleCurrentChangeBookBuy: function(val) {
        this.currentPageBookBuy = val;
        this.searchDataBookBuy();
      },
      handleCurrentChangeAwardLog: function(val) {
        this.currentPageAwardLog = val;
        this.searchDataAwardLog();
      },
      handleCurrentChangeReceiveLog: function(val) {
        this.currentPageReceiveLog = val;
        this.searchDataReceiveLog();
      },
      searchSubmit: function() {
      	for (let i in this.formInline) {
      	  if ((i == 'startTime' || i == 'endTime') && this.formInline[i] != '') {
            this.searchFormData[i] = this.formInline[i] / 1000;
      	  } else {
      	    this.searchFormData[i] = this.formInline[i];
      	  }
      	}
      	this.searchData();
      },
      show: function(row) {
      	this.curRow = row;
      	this.dialogVisible = true;

      	this.searchDataReadLog();
      	this.searchDataPayLog();
      	this.searchDataChapterBuy();
      	this.searchDataBookBuy();
      	this.searchDataAwardLog();
      	this.searchDataReceiveLog();
      },
	}
  })
</script>
 
<style scoped>
</style>