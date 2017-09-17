$(function(){
	chargebackListView.init();
});
var chargebackListView={
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//审核状态基础数据
		dimContainer.buildDimChosenSelector($('#auditStatus'),'auditstatus','');
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		//录入日期
		this.entryDate();
		//所属部门
		this.SuboDepartment();
		//查询
		$('#J_search').off().on('click',this.queryList);
		//重置查询条件
		$('#J_reset').on('click',function(){
			chargebackListView.seeEndDate.min='';
			chargebackListView.seeEndDate.start='';
			chargebackListView.seeBeginDate.max='';
			$('#J_deptName').attr('data-id','');			//重置所属部门id
		});
	},
	//录入日期
	entryDate:function(){
		var _this=this;
		_this.seeBeginDate={
			elem:'#createstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	_this.seeEndDate.min=datas;
		    	_this.seeEndDate.start=datas;
		    }
		};
		_this.seeEndDate={
			elem:'#createendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	_this.seeBeginDate.max=datas;
		    }
	    }
		laydate(_this.seeBeginDate);
		laydate(_this.seeEndDate);
	},
	//所属部门
	SuboDepartment:function(){
		$('#J_deptSelect').off().on('click', function() {
			showDeptTree($('#J_deptName'), $('#J_deptLevel'));
		});
	},
	//查询列表
	queryList:function(){
		$('#retreatList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/sign/chargeback/listview.htm',
			method:'post',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_seeQuery').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				if(deptId!==''){
					data.deptid=deptId;		//所属部门id
				}
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},
			columns:[
				{
					field : 'strbusinesstype',
					title : '业务类型',
					align : 'center'
				},
				{
					field : 'signnumber',
					title : '单据编号',
					align : 'center',
					formatter:function(value){
						return '<a href="'+basePath+'/sign/chargeback/detail.html?signnumber='+value+'" target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'contractcode',
					title : '合同编号',
					align : 'center',
					formatter:function(value,row){
						var xiangqurl='signthecontract/contractdetail';
						var formal='';
						if(row.strbusinesstype=='租赁'){
							xiangqurl='detail/detail';
							formal='&formal=true'
						}
						return '<a href="'+basePath+'/sign/'+xiangqurl+'.html?conid='+row.conId+formal+'&other=true" target="_blank">'+value+'</a>';
					}
				},
				{field : 'houseid',title : '房源编号',align : 'center',
					formatter:function(value,row){
						var html = '';
	      				html ='<a target="_blank" href="'+basePath+'/house/main/buydetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>';
	      				return html;
					}
				},
				{
					field : 'customerid',title : '客源编号',align : 'center',
					formatter:function(value,row){
						var html='';
						html ='<a target="_blank" href="'+basePath+'/customer/main/findbuyerclientbycustomerid.html?customerId='+row.customerid+'">'+row.customerid+'</a>'
						return html;
					}
				},
				{
					field : 'ownname',
					title : '业主姓名<br />客户姓名',
					align : 'center',
					formatter:function(value,row){
						return value+'<br />'+row.customername;
					}
				},
				{
					field : 'shopgroupname',
					title : '所属部门',
					align : 'center'
				},
				{
					field : 'createname',
					title : '录入人',
					align : 'center'
				},
				{
					field : 'createtime',
					title : '录入日期',
					align : 'center'
				},
				{
					field : 'strauditstatus',
					title : '审核状态',
					align : 'center'
				}
			]
		});
	}
}