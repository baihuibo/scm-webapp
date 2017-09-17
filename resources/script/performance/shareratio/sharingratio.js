$(function(){	
      $('#J_dataTable').bootstrapTable({ 
			url:basePath + '/perf/setRuleDetail/getPerformanceVersion',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = {};
				o.timestamp = new Date().getTime(),
				o.pageindex = params.offset/ params.limit + 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler : function(result) {
				if (result.code == 0 && result.data&& result.data.totalcount > 0) {
					return {"rows" : result.data.rows,"total" : result.data.totalcount
					}
				}
				return {"rows" : [],"total" : 0}
			},
	
			columns:[			         
			      	    {field: 'ruleVersionId', title: '序号', align: 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = '';
			      				var url = '';
			      				url = basePath+'/perf/setRuleDetail/toCityDetails.htm?ruleVersionId='+row.ruleVersionId;
			      				html = "<a href="+url+" id='order-btn'>"+ row.ruleVersionId +"</a>";
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'beginDate', title: '启用日期', align: 'center',
			      	    	 formatter:function(value, row, index){
				        			var html = '';
				      				html = "<div>"+ row.beginDate.substring(0,10) +"</div>";
				      				return html;
				        	 }
			      	    },
			      	    {field: 'compName', title : '适用城市公司', align : 'center',
			      	    },
			      	    {field: 'version', title: '版本号', align: 'center'},
				      	{field: 'createTime', title: '创建时间', align: 'center',
			      	    	 formatter:function(value, row, index){
				        			var html = '';
				      				html = "<div>"+ row.createTime+"</div>";
				      				return html;
				        	 }	
				      	},
				    	{field: 'endDate', title: '截止时间', align: 'center',
				      		 formatter:function(value, row, index){
				        		 var html = '';
				        		 if(row.endDate==null){
				        			 html = "-";
				        		 }else{
				        			 html = "<div>"+ row.endDate.substring(0,10) +"</div>"; 
				        		 }	
				      				return html;
				        	 }
				    	},
				    	{field: 'ruleVersionId', title: '部门特殊规则', align: 'center',
				    		formatter:function(value, row, index){
				    			var html ='详情';
								var url='';
								url = basePath+'/perf/setRuleDetail/toDetail.htm?companyId='+row.companyId;
								return value?'<a href='+url+'>'+html+'</a>':'-';
							}
				    	},
				        {field: 'userName', title: '创建人', align: 'center',
				    	  	
				        },
			      	],
		})	
   $('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/setRuleDetail/getPerformanceVersion'});
		   $('#J_dataTable1').bootstrapTable({ 
			url:basePath + '/perf/setRuleDetail/getPerformanceVersionP',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = {};
				o.timestamp = new Date().getTime(),
				o.pageindex = params.offset/ params.limit + 1,
				o.pagesize = params.limit;
				return o;
			},
			responseHandler : function(result) {
				if (result.code == 0 && result.data&& result.data.totalcount > 0) {
					return {"rows" : result.data.rows,"total" : result.data.totalcount
					}
				}
				return {"rows" : [],"total" : 0}
			},
		
			columns:[			         
			      	    {field: 'ruleVersionId', title: '序号', align: 'center',
			      	    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var url = '';
			      				url = basePath+'/perf/setRuleDetail/toCityDetailsPu.htm?ruleVersionId='+row.ruleVersionId;
			      				html = "<a href="+url+">"+ row.ruleVersionId +"</a>";
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'beginDate', title: '启用日期', align: 'center',
			      	    	 formatter:function(value, row, index){
				        			var html = '';
				      				html = "<div>"+ row.beginDate.substring(0,10) +"</div>";
				      				return html;
				        	 }	
			      	    },
			      	    {field: 'compName', title : '适用城市公司', align : 'center',
			      	    },
			      	    {field: 'version', title: '版本号', align: 'center'},
				      	{field: 'createTime', title: '创建时间', align: 'center',
			      	    	 formatter:function(value, row, index){
				        			var html = '';
				      				html = "<div>"+ row.createTime+"</div>";
				      				return html;
				        	 }
				      	},
				    	{field: 'endDate', title: '截止时间', align: 'center',
				      		 formatter:function(value, row, index){
				        		 var html = '';
				        		 if(row.endDate==null){
				        			 html = "-";
				        		 }else{
				        			 html = "<div>"+ row.endDate.substring(0,10) +"</div>"; 
				        		 }	
				      				return html;
				        	 }
				    	},
				    	{field: 'ruleVersionId', title: '部门特殊规则', align: 'center'	,
				    		formatter:function(value, row, index){
				    			var html ='详情';
								var url='';
								url = basePath+'/perf/setRuleDetail/toPuzu.htm?companyId='+row.companyId;
								return value?'<a href='+url+'>'+html+'</a>':'-';
							}
				      	},
				        {field: 'userName', title: '创建人', align: 'center'},
			      	],
		})
  $('#J_dataTable1').bootstrapTable('refresh',{ url: basePath + '/perf/setRuleDetail/getPerformanceVersionP'});
/*新增城市规则*/
$(document).delegate("#add-rules","click",function(event){	
	window.location.href=basePath + '/perf/setRuleDetail/city_add.htm'; 
})
/*新增城市规则--普租*/
$(document).delegate("#add-rules1","click",function(event){	
	window.location.href=basePath + '/perf/setRuleDetail/toPRend.htm'; 
})
});