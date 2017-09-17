var houseId=getQueryString("houseid");
$("select").chosen({
	width : "100%"
});

// 跟进记录查询（选择类型）
$('#J_houseFollowType').on('input change',function(){	
	var followType=$(this).val();
	followUp(followType,houseId);
	$('#J_recording_dataTable').bootstrapTable('refresh',{ url: basePath + '/house/follow/houselist' });
});

// 初始化跟进方式数据
dimContainer.buildDimChosenSelector($("#J_houseFollowType"), "houseFollowType", "");
function followUp(followType,houseId){
	$('#J_recording_dataTable').bootstrapTable('destroy'); //清除之前数据
	$('#J_recording_dataTable').bootstrapTable({ 
		url:basePath + '/house/follow/houselist',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = jQuery('#J_query_detail').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			o.type = followType;
			o.houseid = houseId;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
	
		columns:[		
					{field: 'deptname', title: '跟进部门', align: 'center',
						formatter: function(value, row, index) {
					    	var html = '';
		      				var deptname = row.deptname ? row.deptname : '-'
		      				html ='<div class="text-left">'+deptname+'</div>';
				    		return html;
					    }
					},
					{field: 'createbyname', title: '跟进人', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '<a href="javascript:void(0);" onclick="getUserStaffInfo('+row.createby+')">'+row.createbyname+'</a>';
		      				return html;
		      	    	}
		      	    },
		      	    {field: 'strtype', title: '跟进类型', align: 'center'},
		      	    {field: 'createtime', title : '跟进时间', align : 'center',
		      	    	formatter: function(value, row, index) {
		      	    		createtime = value ? value : '-';
							if(value != undefined){
								var html='';
								html= createtime.substring(0,19);
								return html;
							}
					    }
		      	    },
		      	  	{field: 'content', title: '跟进内容', align: 'center',
		      	    	formatter: function(value, row, index) {
			      			var content = value ? value : '-';
			      			var strevaluate = row.strevaluate ? row.strevaluate : '-';
			      			var strnotcontactreason = row.strnotcontactreason ? row.strnotcontactreason : '-';
			      			
			      			
			      			var html = '';	
			      			if(row.type == '1') {
			      				if(strevaluate =='无法联系到业主'){
			      					html = '<div class="text-left">'+row.strevaluate+ '-'+ row.strnotcontactreason+',' + row.content+'</div>';
				      			}else{
				      				html = '<div class="text-left">'+row.strevaluate+ ',' + row.content+'</div>';
				      			}
			      				
			      			} else if (row.type == '2') {
			      				html = '<div class="text-left"><a href="javascript:void(0);" onclick="feedbackdesc('+houseId+','+row.sourceid+')">'+row.content+'</a></div>';
			      			} else if (row.type == '3') {
			      				html = '<div class="text-left"><a href="javascript:void(0);" onclick="singleback('+row.sourceid+',\'feedback\')">'+row.content+'</a></div>';
			      			}
			      			
			      			return html;
		      	    	}
		      	  	}
		      	],
	})
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 