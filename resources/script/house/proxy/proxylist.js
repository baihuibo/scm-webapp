// 初始化录入日期
var begindate = {
	elem: '#J_createTimeStart',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate.min = datas;
    	enddate.start = datas
    },
}

var enddate = {
	elem: '#J_createTimeEnd',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	begindate.max = datas
    }
}
laydate(begindate);
laydate(enddate);

var insbegindate = {
	elem: '#J_firstInstanceTimeStart',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insenddate.min = datas;
    	insenddate.start = datas
    },
}

var insenddate = {
	elem: '#J_firstInstanceTimeEnd',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	insbegindate.max = datas
    }
}
laydate(insbegindate);
laydate(insenddate);
$("select").chosen({
	width : "100%" , no_results_text: "未找到此选项!" 
});
//业务类型 discountbusinesstype
dimContainer.buildDimChosenSelector($("#J_businessType"), "discountbusinesstype","");
//委托状态 proxyStatus
dimContainer.buildDimChosenSelector($("#J_proxyStatus"), "proxyStatus","");
//一审结果 proxyAuditResult
dimContainer.buildDimChosenSelector($("#J_firstInstanceRestult"), "proxyAuditResult","");
//二审结果
dimContainer.buildDimChosenSelector($("#J_secondInstanceRestult"), "proxyAuditResult","");
//是否作废 
dimContainer.buildDimChosenSelector($("#J_isReject"), "isvalid","");
dimContainer.buildDimChosenSelector($("#J_firstInstanceEff"), "oneTime","");
//规划用途
dimContainer.buildDimCheckBoxHasAll($("#J_plannedUses"),"plannedUses","plannedUses","all","全部");
//显示部门树状结构
$('#J_groupSelect').on('click', function() {
	showDeptTree($('#J_deptName'), $('#J_grouplevel'),'');
});

$('#J_reset_lease').on('click', function(event) {
	reset();
})
//重置
function reset(){
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	$("#J_deptName").val("");
	$('#J_deptName').attr("data-id","");
	/*$("input[name='plannedUses']").attr("checked",true);*/
}
//初始化表格
$(document).delegate('#J_search', 'click', function(event){
  initListLoad();
  $('#J_dataTable_entrust').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy'});  
});

//加载列表数据项
function initListLoad() {
	$('#J_dataTable_entrust').bootstrapTable({
		//url: basePath + '/contract/discount/getList',
		sidePagination: 'server',
		dataType: 'json',
		method: 'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_contract_form').serializeObject();
			/*o.timestamp = new Date().getTime();
			o.userid = currUserId;*/
			
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
			if(o.groupid){
				o.groupid = $("#J_deptName").attr("data-id");
			}
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
		        		  var type;
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
		        		  var audithtml=basePath+"/house/proxy/houseProxyDetail?proxyId="+row.proxyId+"&proxyStatus="+row.proxyStatusCode+"&type="+type;
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
		        		  if(row.isReject =='0' && row.finalassessmentId!='5'){
		        		  if($("#temp_cansel").val()!=undefined){
		        			  html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\' onclick=\'setCancel("+row.proxyId+")\'>作废</a>&nbsp;";
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
function updateproxyCode(id,code){
	commonContainer.modal('修改委托书编号', $('#J_editproxy_code'), function(index, layero) {
	    var newcode=$('#J_proxycode_new').val();

	    if(newcode==""){
	    	return commonContainer.alert("请输入委托书编号");
	    }else if(!/^[a-zA-Z0-9]+$/.test(newcode)){
	    	return commonContainer.alert("委托书编号只能包括英文字母和数字");
	    }else{
	    	var str_content="委托信息编号由"+code+"，修改为"+newcode;
	    	$.ajax({
				url : basePath + '/house/proxy/updateProxyCode',
				data : {
					proxyId: id,
	    			proxyCode: newcode,
	    			content: str_content
				},
				type : 'post',
				dataType : 'json',
				cache : false,
				//contentType : "application/json ; charset=utf-8",
				success : function(result) {
						if(result.code==1){
							layer.alert(result.msg);
	    	    		} else if (result.code == '0') {
	    	    			commonContainer.alert("修改成功");
	    	    			layer.close(index);
	    	    			//location.reload();
	    	    			$('#J_dataTable_entrust').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy'});
	    	    	} 
				}
			})
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
function setCancel(id){
	commonContainer.confirm("确认作废该条信息？",function(){
		jsonGetAjax(
			basePath + '/house/proxy/deleteProxyInfo',
			{
				proxyId: id
			},
			function (result) { 
				layer.msg('作废成功！');
				$('#J_dataTable_entrust').bootstrapTable('refresh', {url: basePath + '/house/proxy/searchHouseProxy'});
			},{});
	},function(){});
}
/*
 * 委托信息报表下载
 * */
$('#J_report_download').on('click', function(event) {
	
	//var o = jQuery('#J_contract_form').serializeObject();
	var o = jQuery('#J_contract_form').serialize();
	//alert(event.offset);
	/*
	o.pageindex = params.offset / params.limit + 1,
	o.pagesize = params.limit;*/
	
	var plannedarr=o.plannedUses;
	var newarr=[];
	if(plannedarr!=undefined){
		for(var i=0;i<plannedarr.length;i++){
			newarr.push(plannedarr[i]);
		}
		o.plannedUses=String(newarr);
	}
	var del_obj=$(".J_selectAll").attr("name");
	
	if(o[del_obj]=="on"){
		//删除多余的全选的obj
		delete o[del_obj];
	}
	//console.log(o);
	console.log(basePath + '/house/proxy/houseProxyExport?'+o);
	                         
	window.open(basePath + '/house/proxy/houseProxyExport?'+o);


	/*jsonGetAjax(
		basePath + '/house/proxy/houseProxyExport',o, function() {
			commonContainer.alert("下载成功");
			//location.reload();
		},{});*/
	//alert(plannedarr);
	//console.log(o);
	//return o;
});

