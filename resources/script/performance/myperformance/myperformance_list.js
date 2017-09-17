$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	//产生时间	
	var createMonthstart = {
		elem: '#J_begindate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    isclear: false,
	    choose: function(datas){ //选择日期完毕的回调
			 $("#J_begindate").val(datas);
			 createMonthend.min = datas;
			 createMonthend.start = datas
		  }
	}
	laydate(createMonthstart);
	var createMonthend = {
			elem: '#J_enddate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){ //选择日期完毕的回调
				 $("#J_enddate").val(datas);
				 createMonthstart.max = datas
			  }
		}
		laydate(createMonthend);
	var createMonthstart1 = {
			elem: '#J_begindate1',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    isclear: false,
		    choose: function(datas){ //选择日期完毕的回调
				 $("#J_begindate1").val(datas);
				 createMonthend1.min = datas;
				 createMonthend1.start = datas
			  }
		}
		laydate(createMonthstart1);
		var createMonthend1 = {
				elem: '#J_enddate1',  
			    format: 'YYYY-MM-DD',
			    istime: false,
			    isclear: false,
			    choose: function(datas){ //选择日期完毕的回调
					 $("#J_enddate1").val(datas);
					 createMonthstart1.max = datas
				  }
			}
			laydate(createMonthend1);
	/*收益月*/	
	var belongMonth = {
		elem: '#belongMonth',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    isclear: false,
	    choose: function(datas){ //选择日期完毕的回调
			 $("#belongMonth").val(datas.substring(0,7));
		  }
	}
	laydate(belongMonth);
	$("#belongMonth").on("click",function(){
		$("#laydate_table").hide();
	})
	$("#J_begindate").on("click",function(){
		$("#laydate_table").show();
	})
	$("#J_enddate").on("click",function(){
		$("#laydate_table").show();
	})
	$("#J_begindate1").on("click",function(){
		$("#laydate_table").show();
	})
	$("#J_enddate1").on("click",function(){
		$("#laydate_table").show();
	})
	$('#J_reset_buy').on('click', function(event) {
		$('.J_chosen').val('');		
		$('.J_chosen').trigger('chosen:updated'); 
		$('#J_contractNo').val('');
		$('#J_businessType').val('');
		$("#J_perfType").val('');
		$("#J_perfType").trigger('chosen:updated');
		$('#J_incomeType').val('');
		$("#fundAmountStart").val("");
		$("#fundAmountEnd").val("");
		createMonthend.min='';
		createMonthend.start='';
		createMonthstart.max='';
	})	
	$('#J_reset_buy1').on('click', function(event) {
		$('.J_chosen').val('');		
		$('.J_chosen').trigger('chosen:updated'); 
		$('#J_contractNo').val('');
		$('#J_businessType').val('');
		$("#J_perfType1").val('');
		$('#J_incomeType').val('');
		$("#fundAmountStart").val("");
		$("#fundAmountEnd").val("");
		createMonthend1.min='';
		createMonthend1.start='';
		createMonthstart1.max='';
	})	
	function detail(){
		var str_month=$("#belongMonth").val();
		var businessType=$("#J_businessType").val();
		/*var createMonth=$("#createMonth11").text() || $("#createMonth1").text();*/
		var createMonthStart=$("#J_begindate").val();
		var createMonthEnd=$("#J_enddate").val();
		var perfType=$("#J_perfType").val();
		var incomeType=$("#J_incomeType").val();
		var contractNo=$("#J_contractNo").val();
		var fundAmountStart=$("#fundAmountStart").val();
		var fundAmountEnd=$("#fundAmountEnd").val();
		jsonPostAjax(basePath + '/perf/applyMyRelated/perfMyRelatedPersonDetail',{
			"belongMonth":str_month,
			"businessType":businessType,
			"createMonthStart":createMonthStart,
			"createMonthEnd":createMonthEnd,
			"perfType":perfType,
			"incomeType":incomeType,
			"contractNo":contractNo,
			"fundAmountStart":fundAmountStart,
			"fundAmountEnd":fundAmountEnd,
			//belongMonth
		}, 
		function(result) {
			//console.log(result.data);
			//commonContainer.alert("操作成功");
			 $("#J_firstpro").text(result.data.yExchangeIncome || 0+'元');
			 $("#J_twopro").text(result.data.eExchangeIncome|| 0+'元');
			 $("#J_puzu").text(result.data.rentIncome|| 0+'元');
			 $("#J_firstproj").text(result.data.yExchangePay|| 0+'元');
			 $("#J_twoproj").text(result.data.eExchangePay|| 0+'元');
		     $("#J_puzuj").text(result.data.rentPay|| 0+'元');
		 
		},{});		 
	}
	
	initListLoad();
	piechart();
	jQuery('#J_search').on('click', function(event){
		if(parseInt($("#fundAmountStart").val())>parseInt($("#fundAmountEnd").val())){
			commonContainer.alert("最小金额不能大于最大金额 ！");
			 return false;
		 }
		initListLoad();
		detail();//实际业绩两行数据
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/applyMyRelated/perfMyRelatedPersonDetail' });	
	});
	//var concealType;
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url:basePath + '/perf/applyMyRelated/perfMyRelatedPersonDetail',
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
				//o.currentPageIndex = params.offset / params.limit+ 1,
				//o.pageSize = params.limit;
				o.currPage = params.offset / params.limit+ 1;
				o.pagesize = params.limit;
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
			        {field: 'contractNo', title: '合同编号', align: 'center', 	
		      	    },
		      	    {field: 'belongMonth', title: '收益月', align: 'center',
			        	 formatter:function(value, row, index){
			        		 var html = '';
			        		 if(row.belongMonth==null){
			        			 html = "<div>"+ row.belongMonth +"</div>";
			        		 }else{
			        			 html = "<div>"+ row.belongMonth.substring(0,7) +"</div>"; 
			        		 }	
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
		      	  {field: 'perfTypeName', title: '业绩类型', align: 'center', },
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
		      	    	formatter : function(value, row) {
				    		return '<div style="text-align:right"; class="remark_all">'+ value + '</div>';
				    	}  	
		      	  },
		      	],    	
		})

	}
	
	/*我的预计业绩*/
	function detail1(){
		//var str_month=$("#belongMonth").val();
		var businessType=$("#J_businessType").val();
		/*var createMonth=$("#createMonth11").text() || $("#createMonth1").text();*/
		var createMonthStart=$("#J_begindate1").val();
		var createMonthEnd=$("#J_enddate1").val();
		var perfType=$("#J_perfType").val();
		var incomeType=$("#J_incomeType").val();
		var contractNo=$("#J_contractNo").val();
		var fundAmountStart=$("#fundAmountStart1").val();
		var fundAmountEnd=$("#fundAmountEnd1").val();
		jsonPostAjax(basePath + '/perf/applyMyRelated/perfExpectPersonDetail',{
			"businessType":businessType,
			"createMonthStart":createMonthStart,
			"createMonthEnd":createMonthEnd,
			"perfType":perfType,
			"incomeType":incomeType,
			"contractNo":contractNo,
			"fundAmountStart":fundAmountStart,
			"fundAmountEnd":fundAmountEnd,
		}, 
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
	
	$('#myTab').one('click', piechart1);
	initListLoad1();	
	jQuery('#J_search1').on('click', function(event){
		if(parseInt($("#fundAmountStart1").val())>parseInt($("#fundAmountEnd1").val())){
			commonContainer.alert("最小金额不能大于最大金额 ！");
			 return false;
		 }
		initListLoad1();
		detail1();//预计业绩
		$('#J_dataTable_1').bootstrapTable('refresh',{ url: basePath + '/perf/applyMyRelated/perfExpectPersonDetail'});	
	});
	//var concealType;
	function initListLoad1(){
		$('#J_dataTable_1').bootstrapTable({
			url:basePath + '/perf/applyMyRelated/perfExpectPersonDetail',
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
				o.currPage = params.offset / params.limit+ 1,
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
			        {field: 'contractNo', title: '合同编号', align: 'center', 	
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
		      	  {field: 'perfTypeName', title: '业绩类型', align: 'center', },
		      	  {field: 'incomeType', title: '收支类型', align: 'center',
		      		 formatter:function(value, row, index){
		      	    		if(row.incomeAmount>=0){
		      	    			return '<div>预计收入</div>'
		      	    		}else{
		      	    			return '<div>预计扣减</div>'
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
		jsonPostAjax(basePath+'/perf/applyMyRelated/perfMyRelatedPersonDetail',{			
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
		        	         data:arrName
		        	    },
		        	    series : [
		        	        {
		        	            name: '访问来源',
		        	            type: 'pie',
		        	            radius : '50%',
		        	            center: ['50%', '40%'],
		        	            data:arrValue,
		        	            itemStyle: {
		        	                emphasis: {
		        	                    shadowBlur: 10,
		        	                    shadowOffsetX: 0,
		        	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		        	                }
		        	            }
		        	        }
		        	    ]
		        	};
	           
	           var myChart = echarts.init(document.getElementById('main-echarts'));
	            myChart.setOption(option); 
//	            myChart.resize();
	          //commonContainer.alert("操作成功");
				 $("#J_firstpro").text(result.data.yExchangeIncome || 0+'元');
				 $("#J_twopro").text(result.data.eExchangeIncome|| 0+'元');
				 $("#J_puzu").text(result.data.rentIncome|| 0+'元');
				 $("#J_firstproj").text(result.data.yExchangePay|| 0+'元');
				 $("#J_twoproj").text(result.data.eExchangePay|| 0+'元');
				 $("#J_puzuj").text(result.data.rentPay|| 0+'元');
	       });

	}
		
	function piechart1(){
		jsonPostAjax(basePath+'/perf/applyMyRelated/perfExpectPersonDetail',{
	       },function(result){
	    	   //console.log(result.data);
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
	           var option1 = {
		        	    tooltip : {
		        	        trigger: 'item',
		        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
		        	    },
		        	    legend: {
		        	    	 x : 'center',
		        	         y : 'bottom',
		        	         data:arrName
		        	    },
		        	    series : [
		        	        {
		        	            name: '访问来源',
		        	            type: 'pie',
		        	            radius : '50%',
		        	            center: ['50%', '40%'],
		        	            data:arrValue
		        	        }
		        	    ]
		        	};
	           
	           var myChart1 = echarts.init(document.getElementById('main-echarts1'));
	            myChart1.setOption(option1);
	        	window.onresize = myChart1.resize;
	           // console.log('myChart1' , myChart1 , option1);
	            //commonContainer.alert("操作成功");
				 $("#J_firstpro2").text(result.data.yExchangeIncome || 0+'元');
				 $("#J_twopro2").text(result.data.eExchangeIncome|| 0+'元');
				 $("#J_puzu2").text(result.data.rentIncome|| 0+'元');
				 $("#J_firstproj2").text(result.data.yExchangePay|| 0+'元');
				 $("#J_twoproj2").text(result.data.eExchangePay|| 0+'元');
				 $("#J_puzuj2").text(result.data.rentPay|| 0+'元');
	       });

	}
 $("#J_businessType").bind("change",function(){
		if(this.value){
			var companyId;
			var keyid=this.value;
			$.ajax({
				url : basePath + '/perf/authorize/getUserInfo',
				type : 'get',
				dataType : 'json',
				cache : true,
				success : function(result) {	
					companyId = result.data;
					$("#J_perfType").find("option:not(:first-child)").remove();
					dimContainer1.buildDimChosenSelector1($("#J_perfType"), companyId,keyid,"");
				}
			});			
		}else{
			$("#J_perfType").find("option:not(:first-child)").remove();
			$("#J_perfType").trigger("chosen:updated");
		}
		
	})
	
	 $("#J_businessType1").bind("change",function(){
		if(this.value){
			var companyId;
			var keyid=this.value;
			$.ajax({
				url : basePath + '/perf/authorize/getUserInfo',
				type : 'get',
				dataType : 'json',
				cache : true,
				success : function(result) {	
					companyId = result.data;
					$("#J_perfType1").find("option:not(:first-child)").remove();
					dimContainer1.buildDimChosenSelector1($("#J_perfType1"), companyId,keyid,"");
				}
			});			
		}else{
			$("#J_perfType1").find("option:not(:first-child)").remove();
			$("#J_perfType1").trigger("chosen:updated");
		}
		
	})
	
	window.dimContainer1 = {
		getDimReqUrl: function() {
			return basePath + '/perf/setRuleDetail/findPerfType';
		},
		buildDimChosenSelector1: function($container, compId,keyId, selectedValues) {//selectedValues默认选中值
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    jsonPostAjax(that.getDimReqUrl(), {'compId':compId,'keyId':keyId}, function(result) {
	    		$.each(result.data, function(n, value) {
	    			if(value!=null){
	    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
	    			}    	    	
	    	    })
	    	    $container.append(options);

	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
			})
		},
	}

	
	
})