$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	// 初始化所属人
	searchContainer.searchUserListByComp($("#J_user"), true);
	// 初始化所属人
	searchContainer.searchUserListByComp($("#J_user1"), true);
	//部门
	$('#J_deptSelect').on('click', function() {
			showDeptTree($('#deptId'), $('#J_deptLevel'));
		});
	//部门
	$('#J_deptSelect1').on('click', function() {
			showDeptTree($('#deptId1'), $('#J_deptLevel1'));
		});
	/*收益月*/	
	var belongMonth = {
		elem: '#belongMonth',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){ //选择日期完毕的回调
			 $("#belongMonth").val(datas.substring(0,7));
		  }
	}
	laydate(belongMonth);

	/*window.onload=function(){
		detail();//实际业绩两行数据
		detail1();//预计业绩
	}*/
	function detail(){
		jsonPostAjax(basePath + '/perf/applyMyRelated/perfMyRelatedAdminDetail',{}, 
				function(result) {
					//commonContainer.alert("操作成功");
					 $("#J_firstpro").text(result.data.yExchangeIncome || 0+'元');
					 $("#J_twopro").text(result.data.eExchangeIncome|| 0+'元');
					 $("#J_puzu").text(result.data.rentIncome|| 0+'元');
					 $("#J_firstproj").text(result.data.yExchangePay|| 0+'元');
					 $("#J_twoproj").text(result.data.eExchangePay|| 0+'元');
  				     $("#J_puzuj").text(result.data.rentPay|| 0+'元');
  				     /*if(!result.data.yExchangeIncome){
  				    	 $("#J_firstpro").text(0+'元');
  				     }
  				    if(!yExchangeIncome){
				    	 $("#J_twopro").text(0+'元');
				     }*/
  				 
				},{});		 
	}	
	
	initListLoad();
	piechart();
	piechart1();
	jQuery('#J_search').on('click', function(event){
		detail();//实际业绩两行数据
		initListLoad();

		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/applyMyRelated/perfMyRelatedAdminDetail' });	
	});
	
	//var concealType;
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url:basePath + '/perf/applyMyRelated/perfMyRelatedAdminDetail',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_black_form').serializeObject();
				o.timestamp = new Date().getTime(); 
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.rows, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
			        {field:'createTime',title:'产生时间',align:'center',},
		      	    {field: 'belongMonth', title: '收益月', align: 'center',
			        	 formatter:function(value, row, index){
			        			var html = '';
			      				html = "<div>"+ row.belongMonth.substring(0,7) +"</div>";
			      				return html;
			        	 }
		      	    },
		      	    {field: 'belongeName', title: '所属人', align: 'center', 	
		      	    },
		      	    {field: 'fullName', title: '所属大区/区/店', align: 'center', 	
		      	    },
		      	   {field: 'businessType', title: '业务类型', align: 'center',
		      	    	formatter:function(value, row, index){
		      	    		if(row.businessType==1){
			    				return '<div>普租</div>'
			    			}else if(row.businessType==3){
			    				return '<div>一手买卖</div>'
			    			}else if(row.businessType==2){
			    				return '<div>二手买卖</div>'
			    			}
		      	    	}
		      	    },
		      	  {field: 'perfType', title: '业绩类型', align: 'center',
		      	    	formatter:function(value, row, index){
			    			if(row.perfType==1){
			    				return '<div>房源录入人业绩</div>'
			    			}
						}	
		      	   },
		      	  {field: 'incomeType', title: '收支类型', align: 'center',
		      		 formatter:function(value, row, index){
		      	    		if(row.incomeAmount>=0){
		      	    			return '<div>实际收入</div>'
		      	    		}else{
		      	    			return '<div>实际扣减</div>'
		      	    		}
		      	    		
						}
		      	    },
		      	  {field: 'incomeAmount', title: '业绩数额', align: 'center'},
		      	],
		})

	}
	
	/*我的预计业绩*/
	function detail1(){
		jsonPostAjax(basePath + '/perf/applyMyRelated/perfExpectAdminDetail',{}, 
				function(result) {
					//commonContainer.alert("操作成功");
			       $("#J_firstpro2").text(result.data.yExchangeIncome|| 0+'元');
			       $("#J_twopro2").text(result.data.eExchangeIncome|| 0+'元');
			       $("#J_puzu2").text(result.data.rentIncome|| 0+'元');
			       $("#J_firstproj2").text(result.data.yExchangePay|| 0+'元');
			       $("#J_twoproj2").text(result.data.eExchangePay|| 0+'元');
			       $("#J_puzuj2").text(result.data.rentPay|| 0+'元');
				},{});		 
	}	
	initListLoad1();
	jQuery('#J_search1').on('click', function(event){
		detail1();//预计业绩
		initListLoad1();
		$('#J_dataTable_1').bootstrapTable('refresh',{ url: basePath + '/perf/applyMyRelated/perfExpectAdminDetail'});	
	});
	//var concealType;
	function initListLoad1(){
		$('#J_dataTable_1').bootstrapTable({
			url:basePath + '/perf/applyMyRelated/perfExpectAdminDetail',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_black_form1').serializeObject();
				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.rows, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
			        {field:'createTime',title:'产生时间',align:'center'},
		      	    {field: 'belongMonth', title: '收益月', align: 'center',
			        	 formatter:function(value, row, index){
			        			var html = '';
			      				html = "<div>"+ row.belongMonth.substring(0,7) +"</div>";
			      				return html;
			        	 }
		      	    },
		      	    {field: 'belongeName', title: '所属人', align: 'center', 	
		      	    },
		      	    {field: 'fullName', title: '所属大区/区/店', align: 'center', 	
		      	    },
		      	   {field: 'businessType', title: '业务类型', align: 'center',
		      	    	formatter:function(value, row, index){
		      	    		if(row.businessType==1){
			    				return '<div>普租</div>'
			    			}else if(row.businessType==3){
			    				return '<div>一手买卖</div>'
			    			}else if(row.businessType==2){
			    				return '<div>二手买卖</div>'
			    			}
		      	    	}
		      	    },
		      	  {field: 'perfType', title: '业绩类型', align: 'center',
		      	    	formatter:function(value, row, index){
			    			if(row.perfType==1){
			    				return '<div>房源录入人业绩</div>'
			    			}
						}	
		      	   },
		      	  {field: 'incomeType', title: '收支类型', align: 'center',
		      		 formatter:function(value, row, index){
		      	    		if(row.incomeAmount>=0){
		      	    			return '<div>实际收入</div>'
		      	    		}else{
		      	    			return '<div>实际扣减</div>'
		      	    		}
		      	    		
						}
		      	    },
		      	  {field: 'incomeAmount', title: '业绩数额', align: 'center',
		      	    	
		      	    },
		      	],
		})

	}
	
	/*我相关业绩饼图加载*/
	function piechart(){
		jsonPostAjax(basePath+'/perf/applyMyRelated/perfMyRelatedAdminDetail',{
	       },function(result){
	    	// 填入数据
	        var eExchangeIncome=result.data.eExchangeIncome || 0;
	    	var eExchangePay=result.data.eExchangePay || 0;
	    	var yExchangeIncome=result.data.yExchangeIncome || 0;
	    	var yExchangePay=result.data.yExchangePay || 0;
	    	var rentIncome=result.data.rentIncome || 0;
	    	var rentPay=result.data.rentPay || 0;
	            var arrName =[];//名字
	            var arrValue =[];//值
	            if(eExchangeIncome ||eExchangePay){
	            	arrName.push("二手买卖");
	            	arrValue.push({
	            		name : '二手买卖',
	            		value : eExchangeIncome + eExchangePay
	            	});
	            }
	            
	            if(yExchangeIncome ||yExchangePay ){
	            	arrName.push("一手买卖");
	            	arrValue.push({
	            		name : '一手买卖',
	            		value : yExchangeIncome+yExchangePay
	            	})
	            }
	            
	            if(rentIncome || rentPay){
	            	arrName.push("普租");
	                arrValue.push({
	                	name : '普租',
	                	value : rentIncome+rentPay
	                })
	            } 
	           var option = {
		        	    tooltip : {
		        	        trigger: 'item',
		        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
		        	    },
		        	    legend: {
		        	    	 x : 'center',
		        	         y : 'bottom',
		        	         data:arrValue
		        	    },
		        	    series : [
		        	        {
		        	            name: '访问来源',
		        	            type: 'pie',
		        	            data:arrValue
		        	        }
		        	    ]
		        	};
	           
	           var myChart = echarts.init(document.getElementById('main-echarts'));
	            myChart.setOption(option); 
	       });

	}
	
	
	function piechart1(){
		jsonPostAjax(basePath+'/perf/applyMyRelated/perfExpectAdminDetail',{
	       },function(result){
	    	// 填入数据
	        var eExchangeIncome=result.data.eExchangeIncome || 0;
	    	var eExchangePay=result.data.eExchangePay || 0;
	    	var yExchangeIncome=result.data.yExchangeIncome || 0;
	    	var yExchangePay=result.data.yExchangePay || 0;
	    	var rentIncome=result.data.rentIncome || 0;
	    	var rentPay=result.data.rentPay || 0;
	            var arrName =[];//名字
	            var arrValue =[];//值
	            if(eExchangeIncome ||eExchangePay){
	            	arrName.push("二手买卖");
	            	arrValue.push({
	            		name : '二手买卖',
	            		value : eExchangeIncome + eExchangePay
	            	});
	            }
	            
	            if(yExchangeIncome ||yExchangePay ){
	            	arrName.push("一手买卖");
	            	arrValue.push({
	            		name : '一手买卖',
	            		value : yExchangeIncome+yExchangePay
	            	})
	            }
	            
	            if(rentIncome || rentPay){
	            	arrName.push("普租");
	                arrValue.push({
	                	name : '普租',
	                	value : rentIncome+rentPay
	                })
	            } 
	           var option = {
		        	    tooltip : {
		        	        trigger: 'item',
		        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
		        	    },
		        	    legend: {
		        	    	 x : 'center',
		        	         y : 'bottom',
		        	         data:arrValue
		        	    },
		        	    series : [
		        	        {
		        	            name: '访问来源',
		        	            type: 'pie',
		        	            data:arrValue
		        	        }
		        	    ]
		        	};
	           
	           var myChart = echarts.init(document.getElementById('main-echarts1'));
	            myChart.setOption(option); 
	       });

	}
	
	
	
	
})