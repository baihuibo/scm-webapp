
/**
 * 编辑信息
 * @param obj
 * @returns
 */
//初始化数据
$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	

	dimContainer.buildDimChosenSelector($("#businessType"), "businessType","");//业务类型

	dimContainer.buildDimChosenSelector($("#reportStatus"), "DisposeStatus","");//举报状态
	//DisposeResult 
	dimContainer.buildDimChosenSelector($("#reportResult"), "DisposeResult","");//处理结果
	
	//dimContainer.buildDimChosenSelector($("#businessType"), "businesstype","");//审核状态 
	//dimContainer.buildDimChosenSelector($("#inquState"), "inquisitionType","");//实勘状态 
	//dimContainer.buildDimChosenSelector($("#checkState"), "DisposeStatus","");//审核状态 
	//dimContainer.buildDimChosenSelector($("#checkResult"), "PassResult","");//审核结果
	// 初始化录入日期
	var begindate = {
			elem: '#J_begindate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var enddate = {
			elem: '#J_enddate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	$('#J_enddate').on('change', function() {
		starttime.max = '';
	})
	
	// 初始化举报人
	searchContainer.searchUserListByComp($("#J_repor"), true);
	// 初始化被举报人
	searchContainer.searchUserListByComp($("#J_coverReport"), true);


});

//按条件查询客源调配列表
var searchParam = null;
$('#J_search').on('click', function(event) {
	searchTableDatas();
	jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/house/inquisitionCtf/inqAntifraudNews'});
	
	// 拼接查询条件
	//searchParam.belonguserid=$('#J_user').attr('data-id');
	
	searchParam = $('#J_query').serializeObject();
	
	//console.log(searchParam);
});
function housestates(){
	commonContainer.alert("该房源已报成交，无法操作！");	
}
function searchTableDatas() {
	$('#J_dataTable_list').bootstrapTable({
		url: basePath + '/house/inquisitionCtf/inqAntifraudNews',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			/*o.belonguserid=$('#J_user').attr('data-id');*/
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				//html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           				html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			return html;
		           			}
		           	},
		          	{field: 'coverInquId', title: '被举报的<br>实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var coverInquId=row.coverInquId;
		           			//var inquId=row.inquId;
		           			//html = '<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			html='<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+coverInquId+'">'+coverInquId+'</a>'
		           			return html;
		           			}
		           	},
		            {field: 'coverReportNo', title: '举报编号', align: 'center',
		      	    	/*formatter: function(value, row, index) {	
		      				
		      				return html;
		      	    	}*/
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var coverReportNo=row.coverReportNo;
		           			html='<a target="_blank" href="/sales/house/inquisitionCtf/inqDetailPage.html?id='+coverReportNo+'">'+coverReportNo+'</a>'
		           			return html;
		           			}
		           	},
				    {field: 'businessType', title: '业务类型', align: 'center'},
				    {field: 'reportName', title: '举报人', align: 'center',
				    	formatter: function(value, row, index){	
	           			return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.reportNameId+')">'+value+'</a>':'-';
	           			}
				    },	    
				    {field: 'coverReportName', title: '被举报人', align: 'center',
				    	formatter: function(value, row, index){	
		           			return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.coverReportNameId+')">'+value+'</a>':'-';
		           			}
					    },	    
				    {field: 'reportTime', title: '举报时间', align: 'center'},
				    {field: 'handleName', title: '处理人', align: 'center',
				    	formatter: function(value, row, index){	
		           			return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.handleNameId+')">'+value+'</a>':'-';
		           			}
					    },	    
				    {field: 'handleTime', title: '处理时间', align: 'center'},
				    {field: 'reportStatus', title: '举报状态', align: 'center'},
				    {field: 'reportResult', title: '处理结果', align: 'center'},
		            {field: 'operation', title: '操作', align: 'center',
				    	formatter: function(value, row, index){	
		           			var html='';
		           			var operation=row.operation;
		           			var coverReportNo=row.coverReportNo;
		           			
			           			if(operation==1){
			           				operation='处理举报'
			           					if($("#temp_handle").val()!=undefined){//权限的判定
			           						if(row.finalStatusId==0){
			           							html='<a class="btn btn-outline btn-success btn-xs mt-3" target="_blank" href="/sales/house/inquisitionCtf/inqDealReportPage.html?id='+coverReportNo+'">'+operation+'</a>'
			           						}else{
			           							html='<a class="btn btn-outline btn-success btn-xs mt-3" onclick="housestates()">'+operation+'</a>'
			           						}	
			           					}
			           			}else if(operation==2){
			           				operation='撤销举报';
			           				if($("#temp_cancel").val()!=undefined){//权限的判定
			           					if(row.finalStatusId==0){
			           						html='<a class="btn btn-outline btn-success btn-xs mt-3" target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+operation+'</a>'
			           					}else{
		           							html='<a class="btn btn-outline btn-success btn-xs mt-3" onclick="housestates()">'+coverReportNo+'</a>'
		           						}
			           				}
			           			}else if(operation==3){
			           				operation='处理举报,撤销举报'
			           				var arrayObj = operation.split(",",4);
			           				if($("#temp_handle").val()!=undefined){//权限的判定
			           					if(row.finalStatusId==0){
				           						html+='<a class="btn btn-outline btn-success btn-xs mt-3" target="_blank" href="/sales/house/inquisitionCtf/inqDealReportPage.html?id='+coverReportNo+'">'+arrayObj[0]+'</a>&nbsp;&nbsp;'
				           					}else{
			           							html='<a class="btn btn-outline btn-success btn-xs mt-3" onclick="housestates()">'+arrayObj[0]+'</a>'
			           						}
				           				}	
			           				if($("#temp_cancel").val()!=undefined){//权限的判定
			           					if(row.finalStatusId==0){
			           						html+='<a class="btn btn-outline btn-success btn-xs mt-3" target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+arrayObj[1]+'</a>'
			           					}else{
		           							html='<a class="btn btn-outline btn-success btn-xs mt-3" onclick="housestates()">'+arrayObj[1]+'</a>'
		           						}
			           				}
			           			}
/*		           			if(operation!=null && operation!='' && operation !=undefined){
		           				
		           				var arrayObj = operation.split(",",4);
		           				console.log(arrayObj);
		           				
		           				if(arrayObj[0]=='处理举报'&& arrayObj[1]=='撤销举报'){
		           					html='<a target="_blank" href="/sales/house/inquisitionCtf/inqDealReportPage.html?id='+coverReportNo+'">'+arrayObj[0]+',</a>'+
		           					'<a target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+arrayObj[1]+'</a>'
		           					
		           				}else if(arrayObj[0]=='撤销举报'){
		           					html='<a target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+arrayObj[0]+'</a>'
		           				}else if(arrayObj[1]=='撤销举报'){
		           					html='<a target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+arrayObj[1]+'</a>'
		           				}
		           				
		           			}*/
		           			return html;
		           			}
		           	}
				    
				   
				]
	});
}






