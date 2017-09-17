 function getUrlParams(name){
     	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 
 
 contractrevenperfor();
 function contractrevenperfor() {
 	$('#J_dataTable_detail').bootstrapTable({
 						url : basePath + '/performanceIncome/getExpectIncomeDetail',
 						dataType : 'json',
 						method : 'get',
 						// cache: false,
 						queryParams : function(params) {
 							var o = {}
 							o.instanceId = getUrlParams("applyId");
 							return o;
 						},
 						columns : [
 								{
 									field : '',
 									title : '序号',
 									align : 'center',
 									formatter : function(value, row, index) {
 										return index+1;
 									}	
 								},
 								{
 									field : 'perfType',
 									title : '业绩类型',
 									align : 'center',
 									
 								},
 								{
 									field : 'sourceType',
 									title : '生成来源',
 									align : 'center',
 								},
 								{
 									field : 'sourceNo',
 									title : '来源编号',
 									align : 'center',
 								},
 								{
 									field : 'fundAmount',
 									title : '收款金额',
 									align : 'center',
 									formatter : function(value, row, index) {
 										return '<div style="text-align:right;">'+value+'</div>';
 									}
 								},
 								{
 									field : 'percent',
 									title : '分单比例',
 									align : 'center',
 									formatter : function(value, row, index) {
 										return '<div">'+value+'%</div>';
 									}
 								},
 								{
 									field : 'incomeAmount',
 									title : '收益业绩金额',
 									align : 'center',
 									formatter : function(value, row, index) {
 										return '<div style="text-align:right;">'+value+'</div>';
 									}
 								},
 								{
 									field : 'belongerName',
 									title : '业绩归属人',
 									align : 'center',								
 								},
 								{
 									field : 'belongShopName',
 									title : '所属店长',
 									align : 'center',									
 								},
 								{
 									field : 'belongShopgroupName',
 									title : '所属区经理',
 									align : 'center',									
 								},

 								{
 									field : 'belongShopareaName',
 									title : '所属区总监',
 									align : 'center',									
 								},

 								{
 									field : 'belongMonth',
 									title : '业绩归属月',
 									align : 'center',
 									formatter : function(value, row, index) {
 										return '<div>'+value.substring(0,7)+'</div>';
 									}
 								}

 								
 						]
 					})
 }
 
 $("#J_dataTable_detail").on('load-success.bs.table',function(data){
	 $("#J_dataTable_detail").each(function (){
	    var dataTable_length=$('#J_dataTable_detail tbody tr').length;
	    for(var i=0;i<dataTable_length;i++){
	    	var sourceType=$("#J_dataTable_detail tbody").find("tr").eq(i).find("td").eq(2).text();
	    	var sourceType_td=$("#J_dataTable_detail tbody").find("tr").eq(i).find("td").eq(2);
	    	if(sourceType=="收款生成"){
	    		 sourceType_td.parent().css("color","#999");
	        }else if(sourceType=="退款生成"){
	        	sourceType_td.parent().css("color","red");
			}else if(sourceType=="公司平台补业绩"){
				sourceType_td.parent().css("color","#999");
			}else if(sourceType=="收益分单调整"){
				sourceType_td.parent().css("color","#999");
			}else if(sourceType=="退单生成"){
				sourceType_td.parent().css("color","#999");
			}else if(sourceType=="付款生成"){
				sourceType_td.parent().css("color","#999999");
			}else if(sourceType=="收益调整生成"){
				sourceType_td.parent().css("color","#999");
			}
	    }
	})
	})