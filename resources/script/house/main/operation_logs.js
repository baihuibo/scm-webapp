var houseId=getQueryString("housesid");
function operationLogs(){
	$('#J_logdataTable').bootstrapTable({ 
		url:basePath + '/houses/catchlogs/operationLogs',
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
			o.housesid = houseId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.logsList, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[			         
		      	    {field: 'rnm', title: '序号', align: 'center', width:'10%'},
		      	    {field: 'type', title: '操作类型', align: 'center',width:'20%'},
		      	    {field: 'uname', title: '操作人', align: 'center',width:'10%',
		      	    	formatter: function(value ,row, index){
		      	    		var html='';
		      	    		html='<a onclick="getUserStaffInfo('+row.usid+')">'+row.uname+'</a>'
		      	    		return html;
		      	    	}
		      	    },
		      	    {field: 'createtime', title: '操作时间', align: 'center',width:'20%'},
		      	    {field: 'content', title: '操作详情', align: 'center',width:'40%'},		      	    
		      	],
	})
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 