var conid=getQueryString("conId");
function operationLogs(){
	$('#J_logdataTable').bootstrapTable({ 
		url:basePath + '/sales/catchlogs/operationLogs',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = {};
			o.timestamp = new Date().getTime();
			o.conId = conid;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.logslist, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[			         
		      	    {field: 'rnm', title: '序号', align: 'center'},
		      	    {field: 'deptname', title: '操作部门', align: 'center'},
		      	    {field: 'uname', title: '操作人', align: 'center',
		      	    	formatter: function(value ,row, index){
		      	    		var html='';
		      	    		html='<a onclick="getUserStaffInfo('+row.userId+')">'+row.uname+'</a>'
		      	    		return html;
		      	    	}
		      	    },
		      	    {field: 'crtDttm', title: '操作时间', align: 'center'},
		      	    {field: 'type', title: '操作类型', align: 'center'},
		      	    {field: 'operationContent', title: '操作内容', align: 'center'},
		      	],
	})
}