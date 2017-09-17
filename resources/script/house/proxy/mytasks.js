//委托时间
var begindate_01 = {
	elem: '#J_createTimeStart_01',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate_01.min = datas;
    	enddate_01.start = datas
    },
}
var enddate_01 = {
	elem: '#J_createTimeEnd_01',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	begindate_01.max = datas
    }
}
laydate(begindate_01);
laydate(enddate_01);


var begindate_02 = {
	elem: '#J_createTimeStart_02',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate_02.min = datas;
    	enddate_02.start = datas
    },
}
var enddate_02 = {
	elem: '#J_createTimeEnd_02',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	begindate_02.max = datas
    }
}
laydate(begindate_02);
laydate(enddate_02);

var begindate_03 = {
	elem: '#J_createTimeStart_03',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate_03.min = datas;
    	enddate_03.start = datas
    },
}
var enddate_03 = {
	elem: '#J_createTimeEnd_03',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	begindate_03.max = datas
    }
}
laydate(begindate_03);
laydate(enddate_03);
$("select").chosen({
	width : "100%" , no_results_text: "未找到此选项!" 
});

var insbegindate_01 = {
	elem: '#J_firstInstanceTimeStart_01',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insenddate_01.min = datas;
    	insenddate_01.start = datas
    },
}
var insenddate_01 = {
	elem: '#J_firstInstanceTimeEnd_01',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insbegindate_01.max = datas
    }
}
laydate(insbegindate_01);
laydate(insenddate_01);

var insbegindate_02 = {
	elem: '#J_firstInstanceTimeStart_02',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insenddate_02.min = datas;
    	insenddate_02.start = datas
    },
}
var insenddate_02 = {
	elem: '#J_firstInstanceTimeEnd_02',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insbegindate_02.max = datas
    }
}
laydate(insbegindate_02);
laydate(insenddate_02);

var insbegindate_03 = {
	elem: '#J_firstInstanceTimeStart_03',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insenddate_03.min = datas;
    	insenddate_03.start = datas
    },
}
var insenddate_03 = {
	elem: '#J_firstInstanceTimeEnd_03',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insbegindate_03.max = datas
    }
}
laydate(insbegindate_03);
laydate(insenddate_03);
//业务类型 discountbusinesstype
dimContainer.buildDimChosenSelector($("#J_businessType_01"), "discountbusinesstype","");
//委托状态 proxyStatus
dimContainer.buildDimChosenSelector($("#J_proxyStatus_01"), "proxyStatus","");
//一审结果 proxyAuditResult
dimContainer.buildDimChosenSelector($("#J_firstInstanceRestult_01"), "proxyAuditResult","");
//二审结果
dimContainer.buildDimChosenSelector($("#J_secondInstanceRestult_01"), "proxyAuditResult","");
//是否作废 
dimContainer.buildDimChosenSelector($("#J_isReject_01"), "isvalid","");
dimContainer.buildDimChosenSelector($("#J_firstInstanceEff"), "oneTime","");
//规划用途
dimContainer.buildDimCheckBoxHasAll($("#J_plannedUses_01"),"plannedUses","plannedUses","all","全部");
dimContainer.buildDimCheckBoxHasAll($("#J_plannedUses_02"),"plannedUses","plannedUses","all","全部");
dimContainer.buildDimCheckBoxHasAll($("#J_plannedUses_03"),"plannedUses","plannedUses","all","全部");
//显示部门树状结构
$('#J_groupSelect_01').on('click', function() {
	showDeptTree($('#J_deptName_01'), $('#J_grouplevel_01'),'');
});
$('#J_groupSelect_02').on('click', function() {
	showDeptTree($('#J_deptName_02'), $('#J_grouplevel_02'),'');
});
$('#J_groupSelect_03').on('click', function() {
	showDeptTree($('#J_deptName_03'), $('#J_grouplevel_03'),'');
});
window.onload=function(){
	$("#J_editproxy_code").hide();
}

 //ui-sortable
$(document).delegate('.collapse-link', 'click', function(event){
	$("#J_editproxy_code").hide();
});
$(function(){
    /*initListLoad("1");
    $('#J_dataTable_task_01').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});*/
})

$('#J_reset_lease_01').on('click', function(event) {
	reset("1");
})
$('#J_reset_lease_02').on('click', function(event) {
	reset("2");
})
$('#J_reset_lease_03').on('click', function(event) {
	reset("3");
})
//重置
function reset(obj){
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	$("#J_deptName_0"+obj).val("");
	$('#J_deptName_0'+obj).attr("data-id","");
	$("#J_grouplevel_0"+obj).val("");
	/*$("input[name='plannedUses']").attr("checked",true);*/
}
var isflag_02=true;
var isflag_03=true;
/*
 * 待抽查 初始数据加载
 * */
$(document).delegate('#tab_02', 'click', function(event){
	if(isflag_02){
		dimContainer.buildDimChosenSelector($("#J_businessType_02"), "discountbusinesstype","");
		dimContainer.buildDimChosenSelector($("#J_proxyStatus_02"), "proxyStatus","");
		dimContainer.buildDimChosenSelector($("#J_firstInstanceRestult_02"), "proxyAuditResult","");
		dimContainer.buildDimChosenSelector($("#J_secondInstanceRestult_02"), "proxyAuditResult","");
		dimContainer.buildDimChosenSelector($("#J_isReject_02"), "isvalid","");
		/*initListLoad("2");
		$('#J_dataTable_task_02').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});*/
		isflag_02=false;
	}
});
/*
 * 已完成 初始数据加载
 * */
$(document).delegate('#tab_03', 'click', function(event){
	if(isflag_03){
		dimContainer.buildDimChosenSelector($("#J_businessType_03"), "discountbusinesstype","");
		dimContainer.buildDimChosenSelector($("#J_proxyStatus_03"), "proxyStatus","");
		dimContainer.buildDimChosenSelector($("#J_firstInstanceRestult_03"), "proxyAuditResult","");
		dimContainer.buildDimChosenSelector($("#J_secondInstanceRestult_03"), "proxyAuditResult","");
		dimContainer.buildDimChosenSelector($("#J_isReject_03"), "isvalid","");
		/*initListLoad("3");
		$('#J_dataTable_task_03').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});*/
		isflag_03=false;
	}
});
$(document).delegate('#J_search_01', 'click', function(event){
	initListLoad("1");
    $('#J_dataTable_task_01').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});
});
$(document).delegate('#J_search_02', 'click', function(event){
	initListLoad("2");
    $('#J_dataTable_task_02').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});
});
$(document).delegate('#J_search_03', 'click', function(event){
	initListLoad("3");
    $('#J_dataTable_task_03').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});
});

//加载列表数据项
function initListLoad(obj) {
	$('#J_dataTable_task_0'+obj).bootstrapTable({
		//url: basePath + '/contract/discount/getList',
		sidePagination: 'server',
		dataType: 'json',
		method: 'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_contract_form_0'+obj).serializeObject();
			o.timestamp = new Date().getTime();
			/*o.userid = currUserId;*/
			/*if($("#J_contracttype_lease").is(':checked') && $("#J_contracttype_buy").is(':checked')) {
				o.contracttype = "1,2";
			}*/
			o.pageindex = params.offset / params.limit + 1,
			o.pagesize = params.limit;
			
			var plannedarr=o.plannedUses;
			var newarr=[];
			if(plannedarr!=undefined){
				for(var i=0;i<plannedarr.length;i++){
					newarr.push(plannedarr[i]);
				}
				o.plannedUses=String(newarr);
			}
			/*if(o.deptid){
				o.deptid = $("#J_deptName").attr('data-id');
			}*/
			if($("#J_deptName_0"+obj).attr("data-id")){
				o.groupid = $("#J_deptName_0"+obj).attr("data-id");
			}
			o.taskType=obj;
			return o;
		},
		responseHandler: function (result) {
			if (result.code == 0 && result.data && result.data.totalcount > 0) {
				return {"rows": result.data.resultList, "total": result.data.totalcount}
			}
			return {"rows": [], "total": 0}
		},
		columns: [
		          {field: 'proxyCode', title: '委托书编号', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  if(row.businessTypeCode=="1"){
		        			  type="1";
		        		  }else if(row.businessTypeCode=="2"){
		        			  type="2";
		        		  }
		        		  var detailhtml=basePath+"/house/proxy/houseProxyDetail?proxyId="+row.proxyId+"&type="+type;
		        		  if($("#temp_view").val()!=undefined){ 
		        			  html = "<a type=\'show\' href=\'"+detailhtml+"\' target='_blank'>"+value+"</a>&nbsp;";
		        		  }else{
		        			  html= value;
		        		  }
		        		  return html;
		        	  }
		          },
		          {field: 'housesId', title: '房源编号', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var houseurl ="";
		        		  if(row.businessTypeCode=="1"){//租赁
		        			  houseurl=basePath+'/house/main/leasedetail.htm?houseid='+value;
		        		  }else if(row.businessTypeCode=="2"){//买卖
		        			  houseurl=basePath+'/house/main/buydetail.htm?houseid='+value;
		        		  }		        		  
		        		  var html = "";
		        		  html = '<a target="_blank" href="'+ houseurl +'" data-signnumber="'+ value +'" target="_blank">'+ value+'</a>';		        		  
		        		  return html;
		        	  }
		          },
		          {field: 'businessType', title: '业务类型', align: 'center'},
		          {field: 'plannedUses', title: '规划用途', align: 'center'},
		          {field: 'createByStr', title: '签委托人', align: 'center',
						formatter:function(value,row){
							return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.createBy+')">'+value+'</a>':'-';
						}
		          },
		          {field: 'createTime', title: '委托时间', align: 'center'},
		          {field: 'proxyStatus', title: '委托状态', align: 'center'},
		          {field: 'firstInstanceRestult', title: '一审结果', align: 'center'},
		          {field: 'secondInstanceRestult', title: '二审结果', align: 'center'},
		          {field: 'firstInstanceTimeLong', title: '一审时效', align: 'center'},
		          {field: 'firstInstanceTime', title: '一审时间', align: 'center'},
		          {field: 'rejectByStr', title: '作废人', align: 'center',
						formatter:function(value,row){
							return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.rejectBy+')">'+value+'</a>':'-';
						}
		          },
		          {field: 'options', title: '操作', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "<div style='width:100%;text-align:left;'>";
		        		  var type;
		        		  if(row.businessTypeCode=="1"){
		        			  type="1";
		        		  }else if(row.businessTypeCode=="2"){
		        			  type="2";
		        		  }
		        		  var detailhtml=basePath+"/house/proxy/houseProxyDetail?proxyId="+row.proxyId+"&type="+type;
		        		  var edithtml=basePath+"/house/proxy/houseProxyUpdate?proxyId="+row.proxyId+"&type="+type+"&housesid="+row.housesId;
		        		  var audithtml=basePath+"/house/proxy/houseProxyDetail?proxyId="+row.proxyId+"&proxyStatus="+row.proxyStatusCode;
		        		  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' href=\'"+detailhtml+"\' target='_blank'>查看</a>&nbsp;";
		        		  //if(row.proxyStatus=="待一审" || row.firstInstanceRestult=="不合格" || row.secondInstanceRestult=="不合格"){
		        		  if(row.isUpdate=='1'){
		        			  if($("#temp_view").val()!=undefined){
		        				  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' href=\'"+edithtml+"\' target='_blank'>修改</a>&nbsp;";  
		        			  }			        		 
		        		  }
		        		  if(row.isAudiOne =='1'){
		        			  if($("#temp_first").val()!=undefined){
		        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' href=\'"+audithtml+"&proxyDo=1\' target='_blank'>一审审核</a>&nbsp;";  
		        			  }
		        		  }
		        		  if(row.isAudiTwo =='1'){
		        			  if($("#temp_second").val()!=undefined){
		        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' href=\'"+audithtml+"&proxyDo=2\' target='_blank'>二审审核</a>&nbsp;";  
		        			  }
		        		  }
		        		  if(row.isAudiThree =='1'){
		        			  if($("#temp_third").val()!=undefined){
		        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' href=\'"+audithtml+"&proxyDo=3\' target='_blank'>三审审核</a>&nbsp;";  
		        			  }
		        		  }
		        		  if(row.isUpdateProxyCode =='1'){
			        		  if($("#temp_modify_code").val()!=undefined){
			        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' onclick=\"updateproxyCode(\'"+row.proxyId+"\','"+row.proxyCode+"')\">修改委托书编号</a>&nbsp;";
			        		  }
		        		  }
		        		  if($("#temp_second").val()!=undefined){
			        		  if(row.isReject =='0' && row.finalassessmentId!='5'){
			        			  if($("#temp_cansel").val()!=undefined){
			        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' onclick=\'setCancel("+row.proxyId+")\'>作废</a>&nbsp;";
			        			  }
			        		  }
		        		  }
		        		  html +="</div>";
		        		  return html;
		        	  }
		          }
	        ]
	});
}

/*
 * 修改委托书编号
 * */
function updateproxyCode(id,code,obj){
	commonContainer.modal('修改委托书编号', $('#J_editproxy_code'), function(index, layero) {
	    var newcode=$('#J_proxycode_new').val();

	    if(newcode==""){
	    	commonContainer.alert("请输入委托书编号");
	    }else if(!/^[a-zA-Z0-9]+$/.test(newcode)){
	    	return commonContainer.alert("委托书编号只能包括英文字母和数字");
	    }else{
	    	var str_content="委托信息编号由"+code+"，修改为"+newcode;
	    	jsonPostAjax(
	    		basePath + '/house/proxy/updateProxyCode',
				{
	    			proxyId: id,
	    			proxyCode: newcode,
	    			content: str_content
				}, function() {
	    			commonContainer.alert("修改成功");
	    			layer.close(index);
	    			location.reload();
	    			$('#J_dataTable_task_0'+obj).bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy'});
	    		},{});
	    }
	}, 
	{
		overflow :true,
		area : ['40%', '60%'],
		btns : ['确定','关闭'],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			//加载成功
			$("#J_proxycode_old").html(code);
		}
	});
}
/*
 * 作废
 * */
function setCancel(id,obj){
	commonContainer.confirm("确认作废该条信息？",function(){
		jsonGetAjax(
			basePath + '/house/proxy/deleteProxyInfo',
			{
				proxyId: id
			},
			function (result) { 
				layer.msg('作废成功！');
			    initListLoad(obj);
				$('#J_dataTable_task_0'+obj).bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy_MyTask'});
			},{});
	},function(){});
}
