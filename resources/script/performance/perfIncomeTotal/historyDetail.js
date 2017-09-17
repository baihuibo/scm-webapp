function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
var createBy=getQueryString("createBy");
var createTime=getQueryString("createTime");
searchTableDatas();

function searchTableDatas(){
	$('#J_dataTable_list').bootstrapTable({
		url: basePath + '/performanceIncome/getImportDetailList',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o ={};
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.createBy=createBy;
			o.createTime=createTime;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data);
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'incomeId',title :'调整编号',align: 'center'},
		          	{field: 'contractNo', title: '合同编号', align: 'center',
		          		formatter : function(value,row) {
		          			if(row.contractNo==undefined){
		          				return "-" 
		          			}else if(row.businessType==1){
								var html = '';
								//html = '<a target="_blank" href="/sales/sign/detail/detail.html?conid='+ value+ '&formal=true">'+ value+ '</a>';
								html = '<a target="_blank" href="/sales/sign/detail/detail.html?conid='+ row.contractId+'&formal=true">'+ value+ '</a>';
								return html;
							}else{
								/*return '<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+ value+ '">'+ value+ '</a>';*/
								return '<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+ row.contractId+'">'+ value+ '</a>';
							}		
						}
		          	},
		            {field: 'adjustDate', title: '调整时间', align: 'center',
		          		formatter : function(value,row) {
							return '<div>'+value.substring(0, 19) + '</div>';
						}
		            },
		            {field: 'perfTypeName', title: '业绩类型', align: 'center', },
				    {field: 'businessType', title: '业务类型', align: 'center',
		            	formatter : function(value, row) {
							if (row.businessType == 1) {
								return '<div businessType=1>普租</div>';
							} else if(row.businessType == 2) {
								return '<div businessType=2>二手买卖</div>';
							}else{
								return '<div businessType=3>一手买卖</div>';
							}
		            	}
				    },
				    {field: 'adjustAmount', title: '调整金额', align: 'center',
				    	formatter : function(value, row) {
				    		return '<div style="text-align:right"; class="remark_all">'+ value + '</div>';
				    	}
				    },				    
				    {field: 'belongerName', title: '被调整人', align: 'center'},
				    {field: 'belongMonth', title: '业绩归属月',align: 'center',
				    	formatter : function(value,row) {
				    		var val = value
							if (val != undefined) {
								return '<div>' + val.substring(0, 7) + '</div>';
							} else {
								return '-';
							}
				    	}
				    },
				    {field: 'fullDeptName', title: '被调整人所属部门',align: 'center'},
				    {field: 'operatorName', title: '操作人',align: 'center'},
				    {field: 'memo', title: '调整原因',align: 'center'}
				]
	});
}