$(function(){
	PowerAttorney.init();
});
var PowerAttorney={
	init:function(){
		var _this=this;
		_this.proxyDate();
		$('#J_search').off().on('click',function(){
			_this.queryList();
		});
		$('select').chosen({
			width:'100%'
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		//所属人自动补全查询
		searchContainer.searchUserListByComp($("#J_user"), true, 'left');
		// 显示部门树状结构
		$('#J_deptSelect').on('click', function() {
			showDeptTree($('#J_deptName'), $('#J_deptLevel'));
		});
		//清空委托部门，委托书人
		$('#J_reset').on('click',function(){
			 $('#J_user').attr('data-id',''); 				//签委托人id
			 $('#J_deptName').attr('data-id','');			//签委托部门id
		})
	},
	//委托时间
	proxyDate:function(){
		//预计带看时间
		var seeBeginDate={
			elem:'#createstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#createendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//列表查询
	queryList:function(){
		$('#proxyQueryResult').bootstrapTable('destroy');	//清除之前的数据
		$('#proxyQueryResult').bootstrapTable({
			url: basePath+'/customer/proxy/list.htm',
			method:'post',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_seeQuery').serializeObject();
				data.userid = $('#J_user').attr('data-id'); 			//签委托人id
				data.shopid = $('#J_deptName').attr('data-id');			//签委托部门id
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
					field : 'proxynum',
					title : '委托书编号',
					align : 'center',
					formatter:function(value,row){
						return value?'<a herf="javascript:;"  onclick="proxyNewlyObj.proxyShowInfor('+row.id+','+row.customerId+')">'+value+'</a>':'-';
					}
				},
				{
					field : 'clientid',
					title : '客源编号',
					align : 'center',
					formatter:function(value,row){
                        value = value || row.customerId;
						var url=basePath+'/customer/main/'+(row.businesstype=='租赁'?'findleaseclientbycustomerid':'findbuyerclientbycustomerid')+'.htm?customerId='+row.customerId;
						return '<a href='+url+' target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'businesstype',
					title : '业务类型',
					align : 'center'
				},
				{
					field : 'username',
					title : '签委托人',
					align : 'center',
					formatter:function(value,row){
						return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.userid+')">'+value+'</a>':'-';
					}
				},
				{
					field : 'deptname',
					title : '签委托部门',
					align : 'center',
					formatter:function(value){
						return '<div style="text-align:left;padding-left:10px;">'+value+'</div>';
					}
				},
				{
					field : 'state',
					title : '是否有效',
					align : 'center'
				},
				{
					field : 'createtime',
					title : '委托时间',
					align : 'center'
				}
			]
		});
	}
}