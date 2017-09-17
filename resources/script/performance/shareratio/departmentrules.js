$(function(){	
	//var ruleVersionId= getQueryString("ruleVersionId");
	var companyId= getQueryString("companyId");
$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/perf/setRuleDetail/getPerformanceVersionToDetail',
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
				o.companyId=companyId
				//o.ruleVersionId=ruleVersionId
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
			      				url = basePath+'/perf/setRuleDetail/toDdepartment?ruleVersionId='+row.ruleVersionId+'&companyId='+companyId;
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
			      	    {field: 'deptName', title : '适用部门', align : 'center'	
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
				        {field: 'userName', title: '创建人', align: 'center'},
			      	],
		})	
 $('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/setRuleDetail/getPerformanceVersionToDetail'});
/*新增部门规则*/
$(document).delegate("#add-departrules","click",function(event){	
	/*window.location.href=basePath + '/perf/setRuleDetail/toDepartmentrulesAdd.htm'; */
	window.location.href=basePath + '/perf/setRuleDetail/toDetailBuy.htm?companyId='+companyId;
})

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg);  
	if (r != null) return unescape(r[2]); return null;  
} 


})







