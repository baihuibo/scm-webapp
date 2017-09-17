  function getUrlParams(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 	var onFirst = 0;
 	var contractId=getUrlParams("contractId");
	var companyId=getUrlParams("companyId");
	var businessType=getUrlParams("businessType");
 //合同详情123
 jsonGetAjax(basePath + '/perf/contract/getContractByContractId',
		 {"contractId":contractId,"companyId":companyId,"businessType":businessType},
		 function(result) {
			 console.log(result);
			 if(result.data!=undefined){
				 var num=result.data.contractCode|| "";
				 var collectionAmount=result.data.collectionAmount || 0;
				 var paymentAmount=result.data.paymentAmount|| 0;
				 var mustmoney=result.data.receivableAmount|| 0;
				 var shengy=mustmoney-collectionAmount|| 0;
				 var companyCompenstateAmount=result.data.companyCompenstateAmount|| 0;
				 var tomoney=mustmoney+companyCompenstateAmount|| 0;
				
				 $(".J_num").text(num);//合同编号			
				 $(".J_collectionAmount").text(collectionAmount);//计业绩收款总额
				 $(".J_mustmoney").text(mustmoney);//应收收入总额
				 $(".J_companyCompenstateAmount").text(companyCompenstateAmount);//公司平台补业绩总额
				 $(".J_tomoney").text(tomoney);//业绩总金额
				 $(".J_paymentAmount").text(paymentAmount);//计业绩付款总额
				 $(".J_shengy").text(shengy);//剩余未收款业绩
			 }
 })

$(function() {
	$("select").chosen({
		width : "100%",
		no_results_text : "未找到此选项!"
	});

})
/*
 * 模糊查询之大区查询*/
function searchArea($container, isShowBtn, listAlign) {
	var itemArr = new Array();		
	jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
		$.each(result.data,function(n,value){
			if(value.level == '1'){
				var data = value.id + ' / ' + value.name;			 
				 var dataArr = new Object();
				 dataArr.id = value.id;
				 dataArr.name = value.name;
				 dataArr.data = data;				 
				 itemArr.push(dataArr);
			}			
		})		
		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
	})
}

/*
 * 模糊查询之组团查询*/
function searchGroup($container, isShowBtn, listAlign) {
	var itemArr = new Array();		
	jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
		$.each(result.data,function(n,value){
			if(value.level == '2'){
				var data = value.id + ' / ' + value.name;			 
				 var dataArr = new Object();
				 dataArr.id = value.id;
				 dataArr.name = value.name;
				 dataArr.data = data;				 
				 itemArr.push(dataArr);
			}		
		})		
		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
	})
}


  /*模糊查询之门店查询*/
function searchShop($container, isShowBtn, listAlign) {
	var itemArr = new Array();		
	jsonGetAjax(basePath + '/custom/common/getBasOrganization', {}, function(result) {		
		$.each(result.data,function(n,value){
			if(value.level == '3'){
				var data = value.id + ' / ' + value.name;			 
				 var dataArr = new Object();
				 dataArr.id = value.id;
				 dataArr.name = value.name;
				 dataArr.data = data;				 
				 itemArr.push(dataArr);
			}			
		})	
		searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
	})
}

//公司平台补业绩（表一）
performance();
$("#for_dataTable").on("hidden.bs.model",function(e){$(this).removeData();});  
function performance() {
	$('#for_dataTable').bootstrapTable({
						url : basePath + '/perf/applyTask/getPerfApplyAll',
						sidePagination: 'server',
						cache: false,
						dataType: 'json',
						method:'post',
						pagination: false,
						striped: true,
						// cache: false,
						queryParams : function(params) {
							var o = {}
//							o.timestamp = new Date().getTime();
							o.contractPerformanceId = getUrlParams("contractId");
							return o;
						},
						responseHandler: function(result){
						//	console.log(result.data);
							if(result.code == 0 && result.data && result.data.totalcount > 0) {
								return { "rows": result.data.rows, "total": result.data.totalcount }
							}
							return { "rows": [], "total": 0 } 
						},
						columns : [
								{
									field : 'applyId',
									title : '申请编号',
									align : 'center',
									formatter : function(value, row, index) {
										var html = '';
					      				var url = '';
					      				/*url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo;*/
					      				url = basePath+'/perf/applyTask/toDetails.htm?applyNo='+row.applyNo+'&businessType='+row.businessType+'&contractId='+row.contractId+'&companyId='+row.companyId;
					      				html = '<a href="'+url+'&contractNo='+row.contractNo+'&isdetail=true"  id="order-btn" target="_blank">'+ value+'</a>';
					      				return html;
										//return '<a href="/sales/perf/applyTask/toDetails.htm?applyNo='+row.applyNo+'&contractNo='+row.contractNo+'&isdetail=true" >'+value+'</a>';
									}
								},
								{
									field : 'compensateAmount',
									title : '公司平台补业绩金额',
									align : 'center',
									formatter : function(value, row, index) {
										var html="";
										html+='<div style="text-align:right;">'+value+'</div>';
										return html;
									}
									
								},
								{
									field : 'approveState',
									title : '审批状态',
									align : 'center',
									formatter : function(value, row, index) {
										if(row.approveState==1){
											return '<div approveState="'+row.approveState+'">待审批</div>'
										}else if(row.approveState==2){
											return '<div approveState="'+row.approveState+'">审批中</div>'
										}else if(row.approveState==3){
											return '<div approveState="'+row.approveState+'">已通过</div>'
										}else if(row.approveState==4){
											return '<div approveState="'+row.approveState+'">待调整</div>'
										}else if(row.approveState==5){
											return '<div approveState="'+row.approveState+'">已驳回</div>'
										}else if(row.approveState==6){
											return '<div approveState="'+row.approveState+'">已撤销</div>'
										}else if(row.approveState==7){
											return '<div approveState="'+row.approveState+'">已提交</div>'
										}if(row.approveState==8){
											return '<div approveState="'+row.approveState+'">已审批</div>'
										}
									}
								},
								{
									field : 'userName',
									title : '申请人',
									align : 'center',
									
								},
								{
									field : 'createTime',
									title : '申请时间',
									align : 'center',						
								},
								{
									field : 'approveTime',
									title : '审批时间',
									align : 'center',									
								},
								{
									field : 'mome',
									title : '申请备注',
									align : 'center',	
									formatter : function(value) {
										return '<div class="remark_all percent" style="white-space:normal; word-break:break-all;">'
												+ value + '</div>';
									}
								}								
						]
					})
}


/*
 * 
 * 收益分单明细（表二）
 */

initListLoad();
function initListLoad() {
	$('.J_dataTable_1').bootstrapTable(
					{
						url : basePath + '/performance/prorateDetail',
						dataType : 'json',
						method : 'get',
						striped : true,
						sortable : true, // 是否启用排序
						sortOrder : "desc", // 排序方式
						// cache: false,
						queryParams : function(params) {
							var o = {}
							o.timestamp = new Date().getTime();
							o.contractId = getUrlParams("contractId");
							return o;
						},
						columns : [
								{
									field : 'id',
									title : '序号',
									align : 'center',
									formatter : function(value, row, index) {
										return index + 1;
									}

								},
								{
									field : 'perfTypeName',
									title : '业绩类型',
									align : 'center',
									formatter : function(value, row, index) {
											return '<div class="remark_all" data-id="'+row.perfType+'">'+value+'</div>';
									
									}
								},
								{
									field : 'percent',
									title : '分单比例',
									align : 'center',
									formatter : function(value) {
										return '<div class="remark_all percent">'
												+ value + '%</div>';
									}
								},
								
								{
									field : 'estimateAmount',
									title : '分单金额',
									align : 'center',
									formatter : function(value) {
										return '<div style="text-align:right;max-width:500px;" class="remark_all">'
												+ value + '</div>';
									}
								},
								{
									field : 'belongerName',
									title : '业绩所属人',
									align : 'center',
									formatter : function(value,row) {
										return '<div belonger="'+row.belonger+'">'+ row.belongerName + '</div>';
									}
								},
								{
									field : 'fullDeptName',
									title : '业绩所属部门',
									align : 'center',
								},
								{
									field : 'createTime',
									title : '生成时间',
									align : 'center',
								},
								{
									field : 'generateWay',
									title : '生成类型',
									align : 'center',
									formatter : function(value, row) {
										if (row.generateWay == 1) {
											return '<div class="remark_all">系统生成</div>';
										} else if (row.generateWay == 2) {
											return '<div class="remark_all">分单调整</div>';
										}else{
											return '<div class="remark_all">业绩调整申请</div>';
										}

									}
								},
								{
									field : 'affirmState',
									title : '确认状态',
									align : 'center',
									formatter : function(value, row) {
										if (row.affirmState == 1) {
											return '<div class="remark_all">已确认</div>';
										}else {
											return '<div class="remark_all">未确认</div>';
										}

									}
								}

						]
					})
}



//收益业绩明细（表三）
contractrevenperfor();
function contractrevenperfor() {
	$('#J_dataTable_detail').bootstrapTable({
						url : basePath + '/performanceIncome/getIncomeDetail',
						dataType : 'json',
						method : 'get',
						// cache: false,
						queryParams : function(params) {
							var o = {}
							o.contractId = getUrlParams("contractId");
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
									title : '业绩所属人',
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
									field : 'createTime',
									title : '生成时间',
									align : 'center',
									formatter : function(value, row, index) {
										if(value!=undefined){
											var val=value;
											return '<div>'+val.substring(0,19)+'</div>';
										}		
									}
								},

								{
									field : 'belongMonth',
									title : '业绩归属月',
									align : 'center',
									formatter : function(value, row, index) {
										if(value!=undefined){
											var val=value;
											return '<div>'+val.substring(0,7)+'</div>';
										}									
									}
								},
								/*{
									field : 'opt',
									title : '操作',
									align : 'center',
									formatter : function(value, row, index) {
										var html="";
										html='<a type="details" class="J_shreinfo_modify btn btn-success btn-xs" id="xiang_q">详情</a>';
										return html;
									}
								},*/	
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
    		 sourceType_td.parent().css("color","#4074e1");
        }else if(sourceType=="退款生成"){
			 sourceType_td.parent().css("color","#000");
		}else if(sourceType=="公司平台补业绩"){
			 sourceType_td.parent().css("color","#FFCC00");
		}else if(sourceType=="收益分单调整"){
			 sourceType_td.parent().css("color","#1d3872");
		}else if(sourceType=="退单生成"){
			 sourceType_td.parent().css("color","#676a6c");
		}else if(sourceType=="付款生成"){
			 sourceType_td.parent().css("color","#999999");
		}else if(sourceType=="收益调整生成"){
			 sourceType_td.parent().css("color","#1d3872");
		}
    }
})
})

//
/*
 * 修改及确认收益分单 1、确认收益分单模态框（第一层）（表二操作）
 */
function confirSlip() {
	layer.open({
		title : '修改收益分单',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,
		content : $('#demo_layer_confirSlip'),
		area : [ '82vw', '520px' ],
	});
};
$(document).delegate('#amend', 'click', function(event) {
	confirSlip();
	var state1 = $("#J_dataTable_1 tbody tr:first").find("td").eq(8).text();
	searchContainer.searchUserListByComp($(".J_user"), true, 'left');	
	searchGroup($("#groupadr"), true, 'left');
	searchShop($("#shopadr"), true, 'left');
	searchArea($("#areaadr"), true, 'left');
	$('#J_perfType1').find("option:not(:first-child)").remove();
	dimContainer1.buildDimChosenSelector3($("#J_perfType1"),contractId,"",false);//业绩类型函数调用
	amendListLoad();
	$('#J_dataTable_amend').bootstrapTable('refresh', {url : basePath + '/performance/prorateDetail'});
});
/*
 * 修改及确认收益分单 2、新建收益分单模态框（第二层）（表二操作）
 */

function addBill() {
	layer.open({
				title : '新建业绩分单',
				type : 1,
				shift : 1,
				skin : 'layui-layer-lan layui-layer-no-overflow',
				zIndex : 10,
				content : $('#demo_layer_addBill'),
				area : [ '85vw', '400px' ],
				btn : [ '保存', '取消' ],
				yes : function(index, layero) {					
					var tr;
					var len = $("#J_dataTable_amend tbody tr").length;
					var sharetype = $("#J_perfType1").find("option:selected").text();
					var sharetypeval = $("#J_perfType1").find("option:selected").val() ||"";
					var DefaultCalculate = $(".J_user").val();
					var calculate=$("#areaadr").val()+"-"+$("#groupadr").val()+"-"+$("#shopadr").val();
					var lowerLimit = $("#J_lowerLimit").val();
					var percent;
					var estimateAmount=$("#estimateAmount").val();
					var reason1 = $("#J_Reason1").find("option:selected").text();
					var reason2 = $("#J_Reason2").find("option:selected").text();
					var reasonval1 = $("#J_Reason1").find("option:selected").val();
					var reasonval2 = $("#J_Reason2").find("option:selected").val();
					var remark = $("#J_revamp_remark").val();
					var state = $("#J_dataTable_amend tbody tr:first").find("td").eq(4).text();
					var createtime =null;
					//如果为空不能提交
					if(lowerLimit==""||sharetypeval==""||$("#areaadr").val()==""||$("#groupadr").val()==""||$("#shopadr").val()==""||DefaultCalculate==""||remark==""||reasonval1==""||reasonval2==""){						
						layer.alert("表单数据不全")
						return false;
					}else if($("#areaadr").attr("data-id")==""||$("#groupadr").attr("data-id")==""||$("#shopadr").attr("data-id")==""){
						layer.alert("所属区店信息不合法！")
						return false;
					}else if($(".J_user").attr("data-id")==""){
						layer.alert("所属人信息不合法！")
						return false;
					}
					
					/*
		    		 * 获取列表中的业绩类型
		    		 * */
		    		/*
		    		 * 设置一个全局变量，用于存储业绩类型
		    		 * */
		    		var performance_ath=[];
		    		var billpre = 0 
		    		function performance(){
		    		        var dataTable_length=$('#J_dataTable_amend tbody tr').length;
		    		        for(var i=1;i<=dataTable_length;i++){
		    		        	var performance=$("#J_dataTable_amend").find("tr").eq(i).find("td").eq(0).text();		    		        	
		    		        	performance_ath.push(performance)
		    		        }
		    		}	    		
		    		performance();
		    		var performance_s;
		    		var sel_value=$("#J_perfType1").find("option:selected").text();
		    		/*var wstring = sel_value.substring(sel_value.length-4);*/
		    		var wstring = sel_value.substring(sel_value);
		    		var typepre = "合作业绩"
		    			for(var i=0;i<performance_ath.length;i++){
		    				if(performance_ath[i]==sel_value){
		    					if(wstring!=typepre){
		    						commonContainer.alert('已有相同业绩类型');
		    						return false;
		    					}		    					
		    						
		    				}
		    			}
		    			/*
			    		 * 获取列表中的分担比例
			    		 * */
			    		/*
			    		 * 设置一个全局变量，用于存储分担比例和
			    		 * */					
					 /*tr='\
						   <tr data-index="'+len+'" class="add_item"><td style="text-align: center;"><div class="remark_all" data-id="'+sharetypeval+'">'+sharetype+'</div></td>\
						    <td style="text-align: center;"><div class="remark_all" data-id="1"  belonger="'+$(".J_user").attr("data-id")+'">'+DefaultCalculate+'</div>'+'</td>\
						    <td style="text-align: center;"><div class="remark_all" belongshoparea='+$("#areaadr").attr("data-id")+' belongshopgroup='+$("#groupadr").attr("data-id")+' belongshop='+$("#shopadr").attr("data-id")+'>'+calculate+'</div></td>\
						    <td style="text-align: center;"><div class="remark_all" generateway="2">分单调整</div></td>\
						    <td style="text-align: center;"><div class="remark_all">'+state+'</div></td>\
						    <td class="percents" style="text-align: center;"><div class="remark_all percents">'+lowerLimit+'%</div></td>\
						    <td style="text-align: right;"><div style="text-align:right;" class="remark_all">'+estimateAmount+'</div></td>\
						    <td style="text-align: center;">'+reason1+'</td>\
						    <td style="text-align: center;">'+reason2+'</td>\
						   <td style="text-align: center;">'+remark+'</td>\
						    <td style="text-align: center;"><a class="btn btn-success btn-xs mt-3 m-r-xs J_shreinfo_modify">修改</a><a class="btn btn-outline btn-danger btn-xs mt-3 m-r-xs J_shareinfo_del">删除</a></td>\
					       </tr>';*/
		    		if(state!=""){
		    			tr='\
							   <tr data-index="'+len+'" class="add_item"><td style="text-align: center;"><div class="remark_all" data-id="'+sharetypeval+'" >'+sharetype+'</div></td>\
							    <td style="text-align: center;"><div class="remark_all" data-id="1"  belonger="'+$(".J_user").attr("data-id")+'" createtime=null affirmstate=0>'+DefaultCalculate+'</div>'+'</td>\
							    <td style="text-align: center;"><div class="remark_all" belongshop='+$("#shopadr").attr("data-id")+' belongshopgroup='+$("#groupadr").attr("data-id")+' belongshoparea='+$("#areaadr").attr("data-id")+' >'+calculate+'</div></td>\
							    <td style="text-align: center;"><div class="remark_all" generateway="2">分单调整</div></td>\
							    <td style="text-align: center;"><div class="remark_all">'+state+'</div></td>\
							    <td class="percents" style="text-align: center;"><div class="remark_all percents">'+lowerLimit+'%</div></td>\
							    <td style="text-align: right;"><div style="text-align:right;" class="remark_all">'+estimateAmount+'</div></td>\
							    <td style="text-align: center;">'+reason1+'</td>\
							    <td style="text-align: center;">'+reason2+'</td>\
							   <td style="text-align: center;">'+remark+'</td>\
							    <td style="text-align: center;"><a class="btn btn-success btn-xs mt-3 m-r-xs J_shreinfo_modify">修改</a><a class="btn btn-outline btn-danger btn-xs mt-3 m-r-xs J_shareinfo_del">删除</a></td>\
						       </tr>';
		    		}else{
		    			tr='\
							   <tr data-index="'+len+'" class="add_item"><td style="text-align: center;"><div class="remark_all" data-id="'+sharetypeval+'">'+sharetype+'</div></td>\
							    <td style="text-align: center;"><div class="remark_all" data-id="1"  belonger="'+$(".J_user").attr("data-id")+'" createtime=null affirmstate=1>'+DefaultCalculate+'</div>'+'</td>\
							    <td style="text-align: center;"><div class="remark_all" belongshop='+$("#shopadr").attr("data-id")+' belongshopgroup='+$("#groupadr").attr("data-id")+' belongshoparea='+$("#areaadr").attr("data-id")+' >'+calculate+'</div></td>\
							    <td style="text-align: center;"><div class="remark_all" generateway="2">分单调整</div></td>\
							    <td style="text-align: center;"><div class="remark_all">'+state1+'</div></td>\
							    <td class="percents" style="text-align: center;"><div class="remark_all percents">'+lowerLimit+'%</div></td>\
							    <td style="text-align: right;"><div style="text-align:right;" class="remark_all">'+estimateAmount+'</div></td>\
							    <td style="text-align: center;">'+reason1+'</td>\
							    <td style="text-align: center;">'+reason2+'</td>\
							   <td style="text-align: center;">'+remark+'</td>\
							    <td style="text-align: center;"><a class="btn btn-success btn-xs mt-3 m-r-xs J_shreinfo_modify">修改</a><a class="btn btn-outline btn-danger btn-xs mt-3 m-r-xs J_shareinfo_del">删除</a></td>\
						       </tr>';
		    		}
					/* 添加判断是否存在多余元素*/
					 if($("#J_dataTable_amend .no-records-found")){
						 $("#J_dataTable_amend .no-records-found").remove();
						 $('#J_dataTable_amend tbody').append(tr);
					 }							

						layer.close(index);		
				}
			});
};
$(document).delegate('#add_bill', 'click', function(event) {
	addBill();
	//console.log(state)
//添加表单，清空数据
	$("#J_perfType1").val("");
	$(".J_user").val("");
	$("#areaadr").val("");
	$("#groupadr").val("");
	$("#shopadr").val("");
	$("#J_lowerLimit").val("");
	$("#J_revamp_remark").val("");	
	$("#estimateAmount").val("");
	$("#J_Reason1").val("");
	$("#J_Reason2").val("");
	$('#J_perfType1').trigger('chosen:updated');
	$('#J_user').trigger('chosen:updated');
	$('#J_Reason1').trigger('chosen:updated');
	$('#J_Reason2').trigger('chosen:updated');
	$('#areaadr').trigger('chosen:updated');
	$('#groupadr').trigger('chosen:updated');
	$('#shopadr').trigger('chosen:updated');
	$("#J_lowerLimit").prop("readonly",true);
//	$('#J_perfType1').find("option:not(:first-child)").remove();
	$('#J_Reason1').find("option:not(:first-child)").remove();
	$('#J_Reason2').find("option:not(:first-child)").remove();
	$("#checklen").html("还可输入 <strong>"+120+"</strong> 个字").css('color', '');
//	pretypelist(contractId)
//	dimContainer1.buildDimChosenSelector3($("#J_perfType1"),contractId,"",false);//业绩类型函数调用
});

//添加 修改 原因三级联动
$(document).on("change",'#J_perfType1',function(){
	$('#J_Reason1').find("option:not(:first-child)").remove();
	$('#J_Reason2').find("option:not(:first-child)").remove();
	$("#J_Reason1").val("");
	$("#J_Reason2").val("");
	$('#J_Reason1').trigger('chosen:updated');
	$('#J_Reason2').trigger('chosen:updated');	
	onFirst= parseInt($("#J_lowerLimit").attr("min")) || 0;//获取当前最小的值
	//变更数据类型
	var thisTyp=$("#J_perfType1 option:selected").val();
	percent(contractId,thisTyp)
	dimContainer1.buildDimChosenSelector1($("#J_Reason1"), $(this).val(),"",false);//一级原因	

})
$(document).on("change",'#J_Reason1',function(){		
var options=$("#J_Reason1 option:selected");  //获取选中的项
var chosele =options.text();//拿到选中项的文本
$('#J_Reason2').find("option:not(:first-child)").remove();
$("#J_Reason2").val("");
$('#J_Reason2').trigger('chosen:updated');
dimContainer1.buildDimChosenSelector2($("#J_Reason2"), $("#J_perfType1").val(),chosele,"",false);//二级原因原因						
})


/*
 * 查看调整历史 1、分单模态框
 */
function hisBill() {
	commonContainer.modal('预计业绩调整历史',$('#demo_layer_hisBill'),function(i){
	},{
		area:['85vw', '520px'],
        type : 1,
        shift : 1,
        skin : 'layui-layer-lan layui-layer-no-overflow',
        zIndex : 10,
		btns:[],
		//overflow :true,
		success:function(){
			historydill();
		}
	});
	
	/*layer.open({
		title : '预计业绩调整历史',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,
		content : $('#demo_layer_hisBill'),
		area : [ '85vw', '520px' ],

	});*/
};
$(document).delegate('#check', 'click', function(event) {
	hisBill();
	/*historydill();*/
});
/*
 * 查看调整历史 2、分单列表
 */
function historydill() {
	$('#his_dataTable').bootstrapTable(
					{
						url : basePath + '/performance/getPerfProrateHisTrace',
						dataType : 'json',
						method : 'GET',
						striped : true,
						sortable : true, // 是否启用排序
						sortOrder : "desc", // 排序方式
						// cache: false,
						queryParams : function(params) {
							var o = {}
							o.timestamp = new Date().getTime();
							o.contractId = getUrlParams("contractId");
							return o;
						},
						columns : [
								{
									field : 'id',
									title : '序号',
									align : 'center',
									formatter : function(value, row, index) {
										return index+1;
									}									
								},
								{
									field : 'adjustTypeName',
									title : '调整类型',
									align : 'center',
									
								},
								{
									field : 'perfTypeName',
									title : '业绩类型',
									align : 'center',
									formatter : function(value, row, index) {
											return '<div class="remark_all" data-id="'+row.perfType+'">'+value+'</div>';								
									}
								},
								{
									field : 'belongerName',
									title : '业绩所属人',
									align : 'center',
								},					
								{
									field : 'belongShopgroup',
									title : '业绩所属部门',
									align : 'center',
									formatter: function(value, row, index){	
					        			var html='';
					        			if(row.belongShopareaName==undefined || row.belongShopgroupName==undefined || row.belongShopName==undefined){
					        				html="-"
					        			}else{
					        				html='<div style="min-width:200px;"><span id="userid">'+row.belongShopareaName+'</span>-<span id="userid">'+row.belongShopgroupName+'</span>-<span id="userid">'+row.belongShopName+'</span></div>';
					        			}
					        			return html;
					        		}

								},	
								{
									field : 'receovableTotalAmount',
									title : '业绩总金额',
									align : 'center',
								},
								{
									field : 'receadjustTotalAmount',
									title : '业绩调整总额',
									align : 'center',
								},
								{
									field : 'adjustPercent',
									title : '调整比例',
									align : 'center',
									formatter : function(value) {
										return '<div>'+ value + '%</div>';
									}
								},
								{
									field : 'adjustAmount',
									title : '调整金额',
									align : 'center',
								},
								{
									field : 'proratePercent',
									title : '分单比例',
									align : 'center',
									formatter : function(value) {
										return '<div>'+ value + '%</div>';
									}
								},
								{
									field : 'prorateAmount',
									title : '分单金额',
									align : 'center',
								},
								{
									field : 'createTime',
									title : '调整时间',
									align : 'center',
									formatter : function(value) {
										return '<div style="min-width:150px;">'
												+ value + '</div>';
									}
								},
								{
									field : 'adjustWay',
									title : '生成类型',
									align : 'center',
									formatter : function(value, row) {
										if (row.adjustWay == 1) {
											return '<div class="remark_all">系统生成</div>';
										} else if (row.adjustWay == 2) {
											return '<div class="remark_all">分单调整</div>';
										}else{
											return '<div class="remark_all">业绩调整申请</div>';
										}

									}
								},
								{
									field : 'affirmState',
									title : '确认状态',
									align : 'center',
									formatter : function(value, row) {
										if (row.affirmState == 1) {
											return '<div class="remark_all">已确认</div>';
										} else {
											return '<div class="remark_all">未确认</div>';
										}

									}
								},
								{
									field : 'adjustReason',
									title : '调整一级原因',
									align : 'center',
								},
								{
									field : 'adjustDetail',
									title : '调整二级原因',
									align : 'center',
								},
								{
									field : 'memo',
									title : '备注',
									align : 'center',
								},{
									field : 'createByName',
									title : '调整人',
									align : 'center',

									formatter : function(value, row) {
										if (row.adjustWay == 1) {
											return '<div class="remark_all">系统默认</div>';
										} else{
											return '<div class="remark_all">' + value + '</div>';
										}

									}
								},								
						]
					})
}


/*
 * 确认收益份单
 */
/*
 * $(document).delegate( '#amend', 'click', function(event) {
 * 
 * });
 */

function amendListLoad() {
	$('#J_dataTable_amend')
			.bootstrapTable(
					{
						url : basePath + '/performance/prorateDetail',
						dataType : 'json',
						method : 'get',
						striped : true,
						queryParams : function(params) {
							var o = {}
							o.timestamp = new Date().getTime();
							o.contractId = getUrlParams("contractId");
							return o;
						},
						columns : [
								{
									field : 'perfTypeName',
									title : '业绩类型',
									align : 'center',
									formatter : function(value, row, index) {
											return '<div class="remark_all" data-id="'+row.perfType+'">'+value+'</div>';

									}
								},
								{
									field : 'belongerName',
									title : '业绩所属人',
									align : 'center',
									formatter : function(value,row) {
											return '<div belonger="'+row.belonger+'" affirmBy="'+row.affirmBy+'" affirmState="'+row.affirmState+'" affirmTime="'+row.affirmTime+'" proraterDetailId="'+row.proraterDetailId+'" createBy="'+row.createBy+'" createTime="'+row.createTime+'" contractId="'+row.contractId+'">'+ row.belongerName + '</div>';
										
									}
								},
								{
									field : 'fullDeptName',
									title : '业绩所属部门',
									align : 'center',
									formatter : function(value,row) {
										return '<div belongShoparea="'+row.belongShoparea+'" belongShopgroup="'+row.belongShopgroup+'" belongShop="'+row.belongShop+' ">'+ row.fullDeptName + '</div>';
									}
									
								},
								{
									field : 'generateWay',
									title : '生成类型',
									align : 'center',
									formatter : function(value, row) {
										if (row.generateWay == 1) {
											return '<div generateWay=1>系统生成</div>';
										} else if(row.generateWay == 3) {
											return '<div generateWay=3>业绩调整申请</div>';
										}else{
											return '<div generateWay=2>分单调整</div>';
										}

									}
								},
								{
									field : 'affirmState',
									title : '确认状态',
									align : 'center',
									formatter : function(value,row) {
										if (row.affirmState == 1) {
											return '<div class="remark_all">已确认</div>';
										} else {
											return '<div class="remark_all">未确认</div>';
										}
									}
								},
								{
									field : 'percent',
									title : '分单比例',
									align : 'center',
									formatter : function(value,row) {
										return '<div class="remark_all percents" max="'+row.upperLimit+'" min="'+row.lowerLimit+'" step="5">'+ value + '%</div>';
									}
								},
								{
									field : 'estimateAmount',
									title : '分单金额',
									align : 'center',
									formatter : function(value, row) {
							    		return '<div style="text-align:right"; class="remark_all">'+ value + '</div>';
							    	}
								},
								{
									field : 'levelOneReason',
									title : '原因分类1',
									align : 'center',
								},
								{
									field : 'levelTwoReason',
									title : '原因分类2',
									align : 'center',
								},
								{
									field : 'memo',
									title : '备注',
									align : 'center',
								},
								{
									field : 'handle',
									title : '操作',
									align : 'center',
									formatter : function(value,row) {
										if(row.isAllowAdjust == 1){
											return '<button class="btn btn-success btn-xs mt-3 m-r-xs J_shreinfo_modify">修改</button>'
											+ '<button class="btn btn-outline btn-danger btn-xs mt-3 m-r-xs J_shareinfo_del">删除</button>';
										}else{
											return ""
										}
										
									}
								}

						]
					})
}






//分单比例变化，分担金额变化(获取不到全部的分担上下限)
function blurIt(input) {
	var sourceVal = input.val();
	if( !sourceVal ){
		return false;
	}
	var J_percent = parseInt( sourceVal) || 0;//获取当前分单比值
	var step =  parseInt(input.attr('step'));//获取当前进阶百分比
	var max = parseInt( input.attr("max"));//获取当前最大百分比
	var min =  parseInt(input.attr("min"));//获取当前最小百分比
	var residue =(onFirst- J_percent)% step;//当前百分比求进阶百分比余数
	if(J_percent<min||J_percent>max){
		layer.alert("分单比例不能超出分单配置范围");
		input.val("");
		return false;
	}
/*	if(residue!=0){
		$("#J_lowerLimit").val("");
		layer.alert("此分单:<br>分单上限为"+max+"%；<br>分单下线为"+min+"%；<br>分单进阶比为"+step+"%；<br>请输入正确的分单比例")
		//layer.tips("此分单:<br>分单上限为"+max+"%；<br>分单下线为"+min+"%；<br>分单进阶比为"+step+"%；<br>请输入正确的分单比例",'#J_lowerLimit',{tips:3})
		var ans = Math.floor(J_percent / step);//当前百分比求进阶百分比结果
		var half = parseFloat(step/2);
		var res = onFirst % step;  //默认值区域进阶比
		var  onStart=res-step;  //取余数减进阶比得到初始值，不写默认值为0
		if(residue<=half){
			input.val(ans*step+onStart);
			return true;
		}else if(residue>half){
			input.val((ans+1)*step+onStart);
			return true;
		}
	}else{
		return true;
	}*/
	return true;
}



//分单比例控制分单比例增比
$('#J_lowerLimit').on('blur', function() {
	var step =  parseInt($("#J_lowerLimit").attr('step'));//获取当前进阶百分比
	var max = parseInt($("#J_lowerLimit").attr("max"));//获取当前最大百分比
	var min =  parseInt($("#J_lowerLimit").attr("min"));//获取当前最小百分比
		if( blurIt( $(this) ) ){
			var tomoney_num = parseInt($(".J_tomoney").text());
			var limitprecent = parseInt(this.value || 0) / 100;
		    
			if(!this.value){
				pernum=0;
			}else if((max%step)==onFirst){
				if(this.value>max){
					this.value=max;
					limitprecent=max/100;
				}else if(this.value<min){
					this.value=min;
					limitprecent=min/100;
				}
				
			}else if((max%step)!=onFirst){
				if(this.value>max){
					this.value=this.value-step;
					limitprecent=(this.value)/100;
				}else if(this.value<min){
					this.value=parseInt(this.value)+step;
					limitprecent=this.value/100;
				}
				
			}
			var pernum=tomoney_num * limitprecent;
			$("#estimateAmount").val(pernum.toFixed(2));
		}else{
			$("#estimateAmount").val('');
		}
});  

 

// 删除
$(document).delegate('.J_shareinfo_del', 'click', function(event) {
	var deleteTr = $(this).parent().parent();
	layer.alert("确定删除吗?", {
		btn : [ '确定', '取消' ],
		yes : function(index) {
			if($("#J_dataTable_amend tr").length==2){
				$("#J_dataTable_amend tbody").append('<tr class="no-records-found"><td colspan="10">没有找到匹配的记录</td></tr>')
			}
			deleteTr.remove();
			layer.close(index);
		},
		cancle : function(index) {
			layer.close(index);
		}
	});

});

// 计算方式是否下拉框选中
function selectDefaultCalculateValue(selectedValue, pId) {
	var index = 0;
	$(pId + " option").each(function() {
		if ($(this).text() == selectedValue) {
			$(this).parent().val(index);
			$(this).parent().trigger('chosen:updated');
		}
		index += 1;
	});
}

// 修改
$(document).delegate(
		'.J_shreinfo_modify',
		'click',
		function(event) {	
			//修改表单，清空数据
			$("#J_perfType1").val("");
			$(".J_user").val("");
			$("#J_lowerLimit").val("");
			$("#J_revamp_remark").val("");	
			$("#estimateAmount").val("");
			$("#J_Reason1").val("");
			$("#J_Reason2").val("");
			$('#J_perfType1').trigger('chosen:updated');
			$('#J_user').trigger('chosen:updated');
			$('#J_Reason1').trigger('chosen:updated');
			$('#J_Reason2').trigger('chosen:updated');
			$("#J_lowerLimit").prop("readonly",false);
			$('#J_Reason1').find("option:not(:first-child)").remove();
			$('#J_Reason2').find("option:not(:first-child)").remove();
			//读取数据到修改模态框
			
			var typeid=$(this).parent().parent().find("td").eq(0).text()
			var currentEditTr = $(this).parent().parent();
			var currentIndex = $('#J_dataTable_amend tr').index(currentEditTr);
			var div = $('#demo_layer_addBill');
			var tr = $("#J_dataTable_amend1").find("tr").eq(currentIndex).find("td");
			var address = currentEditTr.find("td").eq(2).text();
			var group,shop;			
			//console.log(address.split("-"))
			area = address.split("-")[0];
			group = address.split("-")[1];
			shop = address.split("-")[2];			
			$("#areaadr").val(area);
			$("#groupadr").val(group);
			$("#shopadr").val(shop);
			$("#areaadr").attr("data-id",currentEditTr.find("td").eq(2).find("div").attr("belongshoparea"));
			$("#groupadr").attr("data-id",currentEditTr.find("td").eq(2).find("div").attr("belongshopgroup"));
			$("#shopadr").attr("data-id",currentEditTr.find("td").eq(2).find("div").attr("belongshop"));
//			selectDefaultCalculateValue(currentEditTr.find("td").eq(0).text(),"#J_perfType1");
			$("#J_perfType1").val(currentEditTr.find("td").eq(0).children().attr("data-id"));
			$('#J_perfType1').trigger('chosen:updated');
			$("#J_lowerLimit").attr("max",currentEditTr.find("td").eq(5).find("div").attr("max"));
			$("#J_lowerLimit").attr("min",currentEditTr.find("td").eq(5).find("div").attr("min"));
			$("#J_lowerLimit").attr("step",currentEditTr.find("td").eq(5).find("div").attr("step"))
			//以下为读取用不到的数据
			$(".J_user").attr("affirmBy",currentEditTr.find("td").eq(1).find("div").attr("affirmBy"));
			$(".J_user").attr("affirmState",currentEditTr.find("td").eq(1).find("div").attr("affirmState"));
			$(".J_user").attr("affirmtime",currentEditTr.find("td").eq(1).find("div").attr("affirmtime"));
			$(".J_user").attr("proraterdetailid",currentEditTr.find("td").eq(1).find("div").attr("proraterdetailid"));
			$(".J_user").attr("createby",currentEditTr.find("td").eq(1).find("div").attr("createby"));
			$(".J_user").attr("createtime",currentEditTr.find("td").eq(1).find("div").attr("createtime"));
			$(".J_user").attr("contractid",currentEditTr.find("td").eq(1).find("div").attr("contractid"));
			//结束
				
			
			$(".J_user").val(currentEditTr.find("td").eq(1).find("div").text());
			$(".J_user").attr("belonger",currentEditTr.find("td").eq(1).find("div").attr("belonger"));
			$("#J_lowerLimit").val(parseInt(currentEditTr.find("td").eq(5).text()));
			$("#estimateAmount").val(currentEditTr.find("td").eq(6).text());

			
			if (currentEditTr.find("td").eq(9).text() == "-") {
				$("#J_revamp_remark").val("");
			} else {
				$("#J_revamp_remark").val(currentEditTr.find("td").eq(9).text());
			}
			//字数
			var textsare=$("#J_revamp_remark").val().length;
			$("strong").text(120-textsare);
			//点击修改按钮获取分单上下限
			
			var type=$("#J_perfType1 option:selected").val();
			percent(contractId,type);

			var flag=1;
			layer.open({
				type : 1,
				shift : 5,
				title : '修改业绩分单',
				area : [ '85vw', '400px' ],
				skin : 'layui-layer-lan',
				content : div,
				btn : [ '保存', '取消' ],
				success:function(){	
							var type=$("#J_perfType1 option:selected").val();			
					    	var chosele=currentEditTr.find("td").eq(7).text();  //获取选中的项
					    	var choseletwo=currentEditTr.find("td").eq(8).text();
					    	dimContainer1.buildDimChosenSelector1($("#J_Reason1"),type ,chosele,false);//一级原因		
							dimContainer1.buildDimChosenSelector2($("#J_Reason2"), type,chosele,choseletwo,false);//二级原因原因	
					    	selectDefaultCalculateValue(currentEditTr.find("td").eq(7).text(),"#J_Reason1");
							selectDefaultCalculateValue(currentEditTr.find("td").eq(8).text(),"#J_Reason2");
							//全局变量存类型
							onFirst= parseInt($("#J_lowerLimit").val()) || 0;//获取当前默认的值
					
					
				},
				yes : function(index, layero) {
					var sharetype = $("#J_perfType1").find("option:selected").text();
					var sharetypeval = $("#J_perfType1").find("option:selected").val() ||"";
					var DefaultCalculate = $(".J_user").val();
					var calculate;
					var lowerLimit = $("#J_lowerLimit").val();
					var percent;
					var estimateAmount=$("#estimateAmount").val();
					var reason1 = $("#J_Reason1").find("option:selected").text();
					var reason2 = $("#J_Reason2").find("option:selected").text();
					var reasonval1 = $("#J_Reason1").find("option:selected").val();
					var reasonval2 = $("#J_Reason2").find("option:selected").val();
					/*if($("#J_Reason1").find("option:selected").val()==""){
						reason1="-"
					}
					
					if($("#J_Reason2").find("option:selected").val()==""){
						reason2="-"
					}*/
					var remark = $("#J_revamp_remark").val();
					//如果为空不能提交
					if(lowerLimit==""||sharetypeval==""||$("#areaadr").val()==""||$("#groupadr").val()==""||$("#shopadr").val()==""||DefaultCalculate==""||remark==""||reasonval1==""||reasonval2==""){
						layer.alert("表单数据不全")
						return false;
					}else if($("#areaadr").attr("data-id")==""||$("#groupadr").attr("data-id")==""||$("#shopadr").attr("data-id")==""){
						layer.alert("所属区店信息不合法！")
						return false;
					}else if($(".J_user").attr("data-id")==""){
						layer.alert("所属人信息不合法！")
						return false;
					}
					if(typeof(reasonval1)=="undefined"){
						layer.alert("表单数据不全")
						return false;
					}
					if(typeof(reasonval2)=="undefined"){
						layer.alert("表单数据不全")
						return false;
					}
					if($("#J_perfType1 option:selected").text()!=typeid){
						/*
			    		 * 获取列表中的业绩类型
			    		 * */
			    		/*
			    		 * 设置一个全局变量，用于存储业绩类型
			    		 * */
			    		var performance_ath=[];
//			    		var billpre = 0 
			    		function performance(){
//			    			$("#J_dataTable_amend").each(function (){
			    		        var dataTable_length=$('#J_dataTable_amend tbody tr').length;
			    		        for(var i=1;i<=dataTable_length;i++){
			    		        	var performance=$("#J_dataTable_amend").find("tr").eq(i).find("td").eq(0).text();		    		        	
//			    		        	billpre = parseInt($("#J_dataTable_amend").find("tr").eq(i).find("td").eq(4).text())+billpre;
			    		        	performance_ath.push(performance)
			    		        }
			    		      //  return billpre;
//			    			});
			    		}
			    		
			    		performance();
			    	/*	if(billpre+parseInt($("#J_lowerLimit").val())>100){
			    			commonContainer.alert('分单比例总和不得超过100%');
			    			return false;
			    		}*/
			    		var performance_s;
			    		var sel_value=$("#J_perfType1").find("option:selected").text();
			    		/*var wstring = sel_value.substring(sel_value.length-4);*/
			    		var wstring = sel_value.substring(sel_value);
			    		var typepre = "合作业绩"
			    			for(var i=0;i<performance_ath.length;i++){
			    				if(performance_ath[i]==sel_value){
			    					if(wstring!=typepre){
			    						commonContainer.alert('已有相同业绩类型');
			    						return false;
			    					}		    					
			    						
			    				}
			    			}
						
					}
					
	
					
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(0).html('<div class="remark_all" data-id="'+$("#J_perfType1").find("option:selected").val()+'">'+$("#J_perfType1").find("option:selected").text()+'</div>');
					//修改完成数据填入表格中
					var maxs = $("#estimateAmount").attr("max");
					var mins = $("#estimateAmount").attr("min");
					var steps = $("#estimateAmount").attr("step");
					//$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(1).html('<div class="remark_all" belonger="'+$(".J_user").attr("belonger")+'" affirmby="'+$(".J_user").attr("affirmby")+'" affirmstate="'+$(".J_user").attr("affirmstate")+'" affirmtime="'+$(".J_user").attr("affirmtime")+'" proraterdetailid="'+$(".J_user").attr("proraterdetailid")+'" createby="'+$(".J_user").attr("createby")+'" createtime="'+$(".J_user").attr("createtime")+'" contractid="'+$(".J_user").attr("contractid")+'">'+$(".J_user").val()+'</div>');
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(1).html('<div class="remark_all" belonger="'+$(".J_user").attr("data-id")+'" affirmby="'+$(".J_user").attr("affirmby")+'" affirmstate="'+$(".J_user").attr("affirmstate")+'" affirmtime="'+$(".J_user").attr("affirmtime")+'" proraterdetailid="'+$(".J_user").attr("proraterdetailid")+'" createby="'+$(".J_user").attr("createby")+'" createtime="'+$(".J_user").attr("createtime")+'" contractid="'+$(".J_user").attr("contractid")+'">'+$(".J_user").val()+'</div>');
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(2).html('<div class="remark_all" belongshop="'+$("#shopadr").attr("data-id")+'" belongshopgroup="'+$("#groupadr").attr("data-id")+'" belongshoparea="'+$("#areaadr").attr("data-id")+'" >'+$("#areaadr").val()+"-"+$("#groupadr").val()+"-"+$("#shopadr").val()+'</div>');
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(3).html('<div generateway="2">分单调整</div>');
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(5).text($("#J_lowerLimit").val()+"%");
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(6).html('<div style="text-align:right"; class="remark_all" max="'+maxs+'" min="'+mins+'" step="'+steps+'">'+$("#estimateAmount").val()+'</div>');
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(7).text(reason1);
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(8).text(reason2);
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(8).attr("perfReasonId",$("#J_Reason2").find("option:selected").attr("perfReasonId"));
					$("#J_dataTable_amend").find("tr").eq(currentIndex).find("td").eq(9).text($("#J_revamp_remark").val());
					layer.close(index);
				}

			})
		});

//确认收益份单（按钮）

$(document).delegate('#ensure', 'click', function(event) {	
/*	var billpre = 0 
    var dataTable_length=$('#J_dataTable_amend tbody tr').length;
    for(var i=1;i<=dataTable_length;i++){	    		        	
    	billpre = parseInt($("#J_dataTable_amend").find("tr").eq(i).find("td").eq(5).text())+billpre;
    }*/

/*    if(billpre>100){
		commonContainer.alert('分单比例总和不得超过100%');
		return false;
	}else if(billpre<100){
		commonContainer.alert('分单比例总和未到100%');
		return false;
	}
		save();*/
		var contractId=getUrlParams("contractId");
		$.ajax({
			url:basePath +"/performance/updatePerfProrateState",
			type : 'GET',
			async : true,
			cache : false,
			data : {
				"contractId":contractId
			},
			dataType : 'json',
			success : function(result) {
				layer.closeAll()
				layer.msg('确认成功');
				//$('#his_dataTable').bootstrapTable('refresh');
				$('#J_dataTable_1').bootstrapTable('refresh',{ url: basePath + '/performance/prorateDetail' });
			}
		})
})

//保存修改

function save(){	
	
	var billpre = 0 
        var dataTable_length=$('#J_dataTable_amend tbody tr').length;
        for(var i=1;i<=dataTable_length;i++){	    		        	
        	billpre = parseInt($("#J_dataTable_amend").find("tr").eq(i).find("td").eq(5).text())+billpre;
        }

	if(billpre>100){
		commonContainer.alert('分单比例总和不得超过100%');
		return false;
	}else if(billpre<100){
		commonContainer.alert('分单比例总和未到100%');
		return false;
	}
	
	
	
var num=0;
	var contractId=parseInt(getUrlParams("contractId")); 
	var arr=[];
	for(var i=0;i<$("#J_dataTable_amend tbody tr").length;i++){
		var o={};
		o.perfType = $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(0).children("div").attr("data-id");
		o.belonger = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("belonger"));
		//传出无用值
		o.affirmby = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmby"));
		if(typeof(o.affirmby)=="undefined" || o.affirmby==undefined || o.affirmby=="undefined"){
			o.affirmby=null
		}/*else{
			o.affirmby = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmby"));
		}*/
		o.affirmstate = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmstate"));
		if(typeof(o.affirmstate)=="undefined" || o.affirmstate==undefined || o.affirmstate=="undefined"){
			o.affirmstate=0
		}/*else{
			o.affirmstate = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmstate"));
		}*/
		o.affirmtime =$("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmtime");
		if(typeof(o.affirmtime)=="undefined" || o.affirmtime==undefined || o.affirmtime=="undefined"){
			o.affirmtime=null
		}/*else{
			o.affirmtime =$("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("affirmtime");
		}*/
		o.proraterdetailid = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("proraterdetailid"));
		if(typeof(o.proraterdetailid)=="undefined"|| o.proraterdetailid==undefined || o.proraterdetailid=="undefined"){
			o.proraterdetailid=null
		}/*else{
			o.proraterdetailid = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("proraterdetailid"));
		}*/
		o.createby = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("createby"));
		if(typeof(o.createby)=="undefined" || o.createby==undefined || o.createby=="undefined"){
			o.createby=null
		}/*else{
			o.createby = parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("createby"));
		}*/
		o.createtime =$("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("createtime");
		if(typeof(o.createtime)=="undefined"|| o.createtime==undefined || o.createtime=="undefined" ||o.createtime=="null"){
			o.createtime=null
		}/*else{
			o.createtime =  $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").attr("createtime");
		}*/
		o.contractid = parseInt(getUrlParams("contractId"));
		//传出无用值
		o.belongerName =  $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(1).children("div").text();
		o.belongShoparea = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").attr("belongshoparea"));
		o.belongShopgroup =parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").attr("belongshopgroup"));
		o.belongShop = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").attr("belongshop"));
		//o.belongShopareaName = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").text());
		//o.belongShopgroupName =parseInt( $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").text());
		//o.belongShopName = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").text().Substring(0,2));
		var strtext=$("#J_dataTable_amend tbody tr").eq(i).children("td").eq(2).children("div").text();
		var ss=strtext.indexOf("-");
		console.log(ss);
		console.log(find(strtext,"-",ss));
		function find(str2,cha2,num2){
			var x=str2.indexOf(cha2);
			for(var i=0;i<num2;i++){
				x=str2.indexOf(cha2,x+1);
			}
			return x;
		}
		//从开始到第一个"-"所在的位置 截取中间的字符串
		 o.belongShopareaName=strtext.substring(0,ss);
		//从第一个"-"+1的位置开始，到第二个"-"，截取中间的字符串
		 o.belongShopgroupName=strtext.substring(ss+1,find(strtext,"-",ss));
		//截取从第二个"-"+1的位置开始，之后的字符串
		 o.belongShopName=strtext.substring(find(strtext,"-",ss)+1);		
	/*	console.log(strtext.substring(0,ss));
		console.log(strtext.substring(ss+1,find(strtext,"-",ss)));
		console.log(strtext.substring(find(strtext,"-",ss)+1));*/
		o.generateWay = $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(3).children("div").attr("generateway");
		o.percent = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(5).text().split("%").join(""));
		o.estimateAmount = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(6).text());
		o.adjustReason = $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(7).text()
		o.adjustDetail =$("#J_dataTable_amend tbody tr").eq(i).children("td").eq(8).text()
		o.perfReasonId = parseInt($("#J_dataTable_amend tbody tr").eq(i).children("td").eq(8).attr("perfreasonid"));
		o.memo = $("#J_dataTable_amend tbody tr").eq(i).children("td").eq(9).text()
		arr.push(o);
	}
	var ere={};
	   ere.prorateDetailList = arr;
	   ere.contractId =parseInt(contractId) ;
	   ere.receivableAmount = parseInt($(".J_mustmoney").text());
	//   console.log(JSON.stringify(ere))
	$(".percents").each(function(){
		num = parseInt($(this).text())+num;
		return num;
	})
	if(!num==100){
		layer.alert("分单比例不完整")
	}else{		
		$.ajax({
			url:basePath +"/performance/updatePerfProrate",
			type : 'POST',
			async : true,
			cache : false,
			dataType : 'json',
			contentType : "application/json",
			data : JSON.stringify(ere),
			success : function(result) {
				layer.msg(result.msg);
				layer.closeAll()
				layer.msg('保存成功');
				//$('#J_dataTable_amend').bootstrapTable('refresh',{ url: basePath + '/performance/prorateDetail' });
				$('#J_dataTable_1').bootstrapTable('refresh',{ url: basePath + '/performance/prorateDetail'});
			}
		})
	}
}




$(document).delegate('#save', 'click', function(event) {
	save();
})

//重新生成分单

$(document).delegate('#creat_again', 'click', function(event) {
	again()
	
})
	function again(){
		var num=0;		
		$(".percents").each(function(){
			num = parseInt($(this).text())+num;
			return num;
		})
		if(!num==100){
			layer.alert("分单比例不完整")
		}else{
			$.ajax({
				url:basePath +"/performance/anewCreatePerfProrate",
				type : 'GET',
				async : true,
				cache : false,
				data : {
					"contractId" :contractId,
					"companyId":companyId,
					"businessType":businessType
				},
				dataType : 'json',
				success : function(result) { 
					layer.msg(result.msg);
					$('#J_dataTable_amend').bootstrapTable('refresh',{ url: basePath + '/performance/anewCreatePerfProrate' });
					 //amendListLoad();
					
				}
			})
		}
	}


// 收益业绩说明的模态框；
function view1() {
	layer.open({
		title : '普租、买卖业绩生成规则',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_performance'),
		area :   ['700px','400px'],
		btn : [ '关闭' ],
		yes : function(index, layero) {
				
				layer.close(index);
			}
			
		
	});	
};
$(document).delegate(
		'#norm',
		'click',
		function(event) {
			view1();
		});


//原因联动
window.dimContainer1 = {
		getDimReqUrl: function() {
			return basePath + '/perf/reason/getPerfReason';
		},
		getDimReqUrl1: function() {
			return basePath + '/perf/reason/getPerfOne';
		},
		getDimReqUrl2: function() {
			return basePath + '/perf/setRuleDetail/findRuleDetailByConId';
		},
		
		//原因类型一
		buildDimChosenSelector1: function($container, keyCode, selectedValues,isload) {
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    if(isload){
		    	return false;
		    }else{
		    	 jsonPostAjax(that.getDimReqUrl1(), {'perfType':keyCode}, function(result) {
			    		$.each(result.data, function(n, value) {
			    			if(value!=null){
			    				options.push('<option value="' +value.levelOneReason + '" >' + value.levelOneReason + '</option>');    	    	
			    			}
			    		})
			    	    $container.append(options);

			    		var selectedValueArr = selectedValues.split(',');
			    		$container.val(selectedValueArr);
			    		$container.trigger("chosen:updated");
//			    		isload=true;
					})
		    }
		   
		},
		//原因类型二
		buildDimChosenSelector2: function($container, keyCode,reasons, selectedValues,isload) {
			// 初始化chosen控件
			
			commonContainer.initChosen($container);
			var that = this;
		    var options = [];
		    if(isload){
		    	return false;
		    }else{
		    	isload=true;
		    }
		    jsonPostAjax(that.getDimReqUrl(), {'perfType':keyCode,'levelOneReason':reasons}, function(result) {
	    		$.each(result.data.rows, function(n, value) {
	    			if(value!=null && value.levelTwoReason !=undefined){
	    				options.push('<option value="' +value.levelTwoReason + '" perfReasonId="'+value.perfReasonId+'">' + value.levelTwoReason + '</option>');
	    			}else if(value.levelTwoReason==undefined){
	    				options.push('<option value="无" perfReasonId="'+value.perfReasonId+'">无</option>');
	    			}
	    	    })
	    	    $container.append(options);
	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
	    		isload=true;
			})
		},
		
		//业绩类型下拉框
		buildDimChosenSelector3: function($container,contractIds,selectedValues,isload) {
			// 初始化chosen控件
			
			commonContainer.initChosen($container);
			var that = this;
		    var options = [];
		    if(isload){
		    	return false;
		    }else{
		    	isload=true;
		    }
		    jsonGetAjax(that.getDimReqUrl2(), {'controntId':contractIds}, function(result) {
	    		$.each(result.data, function(n, value) {
	    	    	if(value.valueName!=undefined){
	    	    		options.push('<option value="' +value.perfType + '">' + value.valueName + '</option>');
	    	    	}
	    	    })
	    	    $container.append(options);
	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
	    		isload=true;
			})
		}
	}



//读取分单比例接口

function percent(contractIds,types){
	jsonGetAjax(basePath+'/perf/setRuleDetail/findRuleDetail',{
		controntId:contractIds,type:types//types
	},function(redata){
//		console.log(redata)
		$("#J_lowerLimit").attr("max",redata.data[0].upperLimit);
		$("#J_lowerLimit").attr("min",redata.data[0].lowerLimit);
		$("#J_lowerLimit").attr("step",redata.data[0].movePercent);
		if($("#J_perfType1 option:selected").val()==""){
			$("#J_lowerLimit").prop("readonly",true);
			$("#J_lowerLimit").val("");
			$("#estimateAmount").val("")
		}else{
			$("#J_lowerLimit").prop("readonly",false);
			
		}
	})
}

//textarae字数限制
/*J_revamp_remark.oninput = */function strLenCalc(obj, checklen, maxlen) {	
	var v = $("#J_revamp_remark").val(), charlen = 0, maxlen = !maxlen ? 240 : maxlen, curlen = maxlen, len = v.length;
	for(var i = 0; i < v.length; i++) {
	//if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
	curlen -= 1;
	//}
	}
  if(curlen >= len) {
	$("#checklen").html("还可输入 <strong>"+Math.floor((curlen-len)/2)+"</strong> 个字").css('color', '');
//	$("#J_submit").removeAttr("disabled");
	} else {
	$("#checklen").html("已经超过 <strong>"+Math.ceil((len-curlen)/2)+"</strong> 个字").css('color', '#FF0000');
//	$("#J_submit").attr("disabled", "disabled");
	}
 }
/*J_apply_remark.oninput = */function strLenCalc1(obj, checklen1, maxlen) {	
	var v = $("#J_apply_remark").val(), charlen = 0, maxlen = !maxlen ? 1000 : maxlen, curlen = maxlen, len = v.length;
	for(var i = 0; i < v.length; i++) {
	//if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
	curlen -= 1;
	//}
	}
  if(curlen >= len) {
	$("#checklen1").html("还可输入 <strong>"+Math.floor((curlen-len)/2)+"</strong> 个字").css('color', '');
//	$("#J_submit").removeAttr("disabled");
	} else {
	$("#checklen1").html("已经超过 <strong>"+Math.ceil((len-curlen)/2)+"</strong> 个字").css('color', '#FF0000');
//	$("#J_submit").attr("disabled", "disabled");
	}
 }





