$(function(){
	var houseId = getQueryString("houseId");
	//详情
	 jsonGetAjax(basePath + '/performance/getHouseExpectPerformance',
			 {"houseId":houseId},
			 function(result) {	
				 var entrustPrice=result.data.entrustPrice|| "";
				 var fixingAmount=result.data.fixingAmount || 0;
				 var expectPerfTotalAmount=result.data.expectPerfTotalAmount|| 0;
				 $(".J_num").text(entrustPrice);
				 $(".receivableAmount").text(fixingAmount+'%');
				 $(".J_realIncomeAmount").text(expectPerfTotalAmount);
	 })
	 
      $('#J_dataTable').bootstrapTable({ 
			url:basePath + '/performance/getHouseExpectPerformance',
			sidePagination: 'server',
			dataType: 'json',
			method:'get',
			pagination: false,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = {};
				o.timestamp = new Date().getTime(),
				//o.pageindex = params.offset/ params.limit + 1,
				//o.pagesize = params.limit;
				o.houseId = houseId;
				return o;
			},
			responseHandler : function(result) {
				if (result.code == 0 && result.data) {
					return {"rows" : result.data.perfProrateDetailList
					}
				}
				return {"rows" : [],"total" : 0}
			},
	
			columns:[			         
			      	    {field: 'id', title: '序号', align: 'center',
			      	    	formatter : function(value, row, index) {
								return index + 1;
							}
			      	    },
			      	    {field: 'perfTypeName', title: '业绩类型', align: 'center',
			      	    	formatter : function(value, row, index) {
								return '<div class="remark_all" data-id="'+row.perfType+'">'+value+'</div>';
						
						}
			      	    },
			      	    {field: 'percent', title : '分单比例', align : 'center',
			      	    	formatter: function(value, row, index) {
			      				var html = ''; 		
			      				if(row.percent==null){
			      					html ="-"
			      				}else{
			      					html = "<div>"+ row.percent+"%</div>";
				      				return html;
			      				}
			      				
			      	    	}
			      	    },
			      	    {field: 'estimateAmount', title: '预计分单金额（元）', align: 'center',
			      	    	formatter : function(value, row, index) {
			      	    		if(row.estimateAmount==null){
			      	    			html='<div style="text-align:right">"-"</div>'
			      	    		}else{
			      	    			return '<div style="text-align:right;max-width:500px;" class="remark_all">'
									+ value + '</div>';
			      	    		}
							}	
			      	    },
				      	{field: 'belongerName', title: '预计业绩所属人', align: 'center', 
			      	    	formatter : function(value,row) {
			      	    		if(row.belongerName==null){
			      	    			html="-"
			      	    		}else{
			      	    			return '<div belonger="'+row.belonger+'">'+ row.belongerName + '</div>';
			      	    		}
								
							}
				      	},
				    	{field: 'fullDeptName', title: '预计所属部门', align: 'center',
				    	},
			      	],
		})	
   $('#J_dataTable').bootstrapTable('refresh');
	 function getQueryString(name) { // js获取url地址以及 取得后面的参数
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg);  
			if (r != null) return unescape(r[2]); return null;  
		} 
})    
   