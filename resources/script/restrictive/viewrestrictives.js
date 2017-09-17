 function getUrlParams(name){
     	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }

$(function(){
	
	//获取基本信息
	window.onload=function(){
		$.ajax({
			url : basePath + '/restrictive/editviewrestrictive',
			data : {"restrictiveId":getUrlParams('id')},
			type : 'post',
			dataType : 'json',
			cache : false,
			success : function(result) {
                if (result.code == '0') {
					for(var key in result.data){
						if($("#App_"+key)){
							$("#App_"+key).text (decodeHTML(result.data[key]));
//							console.log(result.data[key])
						}			
					}
				} else {
					layer.alert(result.msg);
				}
			}
		});
	}	
})
//日志
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/restrictive/findpageoperatehistories ',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o ={};
				o.restrictiveId = getUrlParams('id');
//				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[      
			        {field: 'operateUserName', title: '操作人', align: 'center'},		      	  
		      	    {field: 'jobName', title: '职务', align: 'center'},
		      	    {field: 'departmentName', title: '所在组店', align: 'center'},
		      	    {field: 'operateTime', title: '操作时间',  align: 'center' },
		      	    {field: 'operateDesc', title: '操作内容',  align: 'center',
		      	    	formatter:function(value){
							return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
						}
		      	    },		      
			      	]
		})