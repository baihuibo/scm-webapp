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
		$("select").chosen({
			width : "100%" , no_results_text: "未找到此选项!" 
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		//规划用途复选
		dimContainer.buildDimCheckBoxHasAll($('#propertytype'), 'plannedUses', 'plannedUses','all','全部');
		//dimContainer.buildDimChosenSelector($('#propertytype'),'plannedUses','');
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
			url: basePath+'/house/proxy/list.htm',
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
						return value?'<a herf="javascript:;" onclick="proxyNewlyObj.proxyShowInfor(0,0,0,1,this)" data-businesstype="'+(row.businesstype=='租赁'?'1':'2')+'" data-houseid="'+row.houseid+'" data-id="'+row.id+'">'+value+'</a>':'-';
					}
				},
				{
					field : 'houseid',
					title : '房源编号',
					align : 'center',
					formatter:function(value,row){
						var url='';
						if (row.businesstype=='租赁') {
	      					url = basePath+'/house/main/leasedetail.htm?houseid='+value;		//房源id
	      				} else if (row.businesstype=='买卖') {
	      					url = basePath+'/house/main/buydetail.htm?houseid='+value;
	      				}
						return value?'<a href='+url+' target="_blank">'+value+'</a>':'-';
					}
				},
				{
					field : 'businesstype',
					title : '业务类型',
					align : 'center'
				},
				{
					field : 'planneduses',
					title : '规划用途',
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