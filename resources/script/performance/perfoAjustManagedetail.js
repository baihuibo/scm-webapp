function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}


	//创建业务参数
	var contractNo;
	var applyId;
	var businessType;
	//获取业务参数
	var docbizkey = getQueryString("docbizkey");
	var formId = getQueryString("formId") || docbizkey.split("-")[1];
/*	var timeStamp = (getQueryString("bizKey")).split("-")[1];
	if(!timeStamp){
		timeStamp= getQueryString("formId");
	}*/
	jsonGetAjax(basePath + '/perf/authorize/timeStamp', {
		"timeStamp" : formId
	}, function(result) {
		contractNo = result.data.contractNo;
		applyId = result.data.applyId;
		businessType = result.data.businessType;
		
		initListLoad();
		initListLoadTable();
		
		reasons();
		histroyLoadTable();
	});
	
	if (getQueryString("templateId")) {
		// 审批流程创建审批按钮
		var templateId = getQueryString('templateId');
		jsonGetAjax(basePath + '/workflow/selectShowLabelBytemplateId', {
			"templateId" : templateId
		}, function(result) {
			if (result.data && result.data.length > 0) {
				var htmlbutton = '';
				$.each(result.data, function(i, n) {
					htmlbutton += '<button type="button" class="btn btn-success btn-altogether btn_size" data-val="' + n.labelId + '">' + n.labelName + '</button>';
				});
				$('#J_btn_button').prepend(htmlbutton);
			}
		});
	}
	

/*--------------------------------------------------------------------------------------------------------------------*/

$("#J_dataTable").on('load-success.bs.table',function(data){
   $("#J_dataTable tbody tr").each(function(){
	   if($(this).children("td:last-child").text()=="是"){
		   $(this).css("background","#D4E4FF")
	   }
   })
 });


/*--------------------------------------------------------------------------------------------------------------------*/

// 调整单详情
function initListLoadTable() {
	$('#J_dataTable').bootstrapTable({
		url : basePath + '/perf/authorize/perfApplyDetail',
		sidePagination : 'server',
		dataType : 'json',
		method : 'get',
		pagination : false,
		striped : true,
		queryParams : function(params) {
			var o = new Object();
			o.contractNo = contractNo, o.applyNo = applyId, o.businessType = businessType
			return o;
		},
		responseHandler : function(result) {
			console.log(result.data)
			if (result.code == 0 && result.data) {
				return {
					"rows" : result.data.applyDetail
				}
			}
			return {
				"rows" : []
			}
		},
		columns : [ {
			field : 'perfTypeName',
			title : '业绩类型',
			align : 'center',
			formatter : function(value, row, index) {
					return '<div class="remark_all" data-id="' + row.perfType + '">'+value+'</div>';
			}
		}, {
			field : 'belongerName',
			title : '业绩所有人',
			align : 'center',

		}, {
			field : 'fullDeptName',
			title : '所属部门',
			align : 'center',
		}, {
			field : 'generateWay',
			title : '状态',
			align : 'center',
			formatter : function(value, row) {
				if (row.generateWay == 1) {
					return '<div generateWay=1>系统生成</div>';
				} else if (row.generateWay == 3) {
					return '<div generateWay=3>业绩调整申请</div>';
				} else {
					return '<div generateWay=2>分单调整</div>';
				}
			}
		}, {
			field : 'percent',
			title : '分配比例',
			align : 'center',
			formatter : function(value, row, index) {
				var html = '';
				html = '<div>' + value + '%</div>';
				return html;
			}
		}, {
			field : 'isAuthorize',
			title : '业绩是否调整',
			align : 'center',
		} ]
	})
}


/*--------------------------------------------------------------------------------------------------------------------*/


// 基本信息
function initListLoad() {
	$.ajax({
		url : basePath + '/perf/authorize/perfApplyDetail',
		dataType : 'json',
		method : 'get',
		data : {
			"contractNo" : contractNo,
			"applyNo" : applyId,
			"businessType" : businessType
		},
		success : function(result) {
			$("#none").show();
			if(result.data.contractCode){
				if(businessType==2){
					$("#App_contractNo").html('<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+ result.data.conId+'">'+result.data.contractCode+'</a>');
				}else if(businessType==1){
					$("#App_contractNo").html('<a  target="_blank" href="/sales/sign/detail/detail.html?conid='+ result.data.conId+ '&formal=true">'+result.data.contractCode+'</a>');
				}
				
			}else{
				$("#App_contractNo").text("");
			}			
			if(result.data.inputDate){
				$("#App_contractDate").text(result.data.inputDate);
			}else{
				$("#App_contractDate").text("");
			}
			if(result.data.firstSubmitDate){
				$("#App_Time").text(result.data.firstSubmitDate);
			}else{
				$("#App_Time").text("");
			}
			if(result.data.examineDate){
				$("#App_mondate").text(result.data.examineDate);
			}else{
				$("#App_mondate").text("");
			}
			
			if(result.data.revoke){
				$("#J_cancel").show();
			}else{
				$("#J_cancel").hide();
			}
		}
	})
}

/*--------------------------------------------------------------------------------------------------------------------*/


function reasons() {
	jsonGetAjax(basePath + '/perf/authorize/perfApplyDetail', {
		"contractNo" : contractNo,
		"applyNo" : applyId,
		"businessType" : businessType
	}, function(result) {
		$("#detail").text(result.data.perfApplyReason);
		$("#J_reason").text(result.data.perfApplyReason);
		if (result.data.applyApprove.approveState == "1") {
			$("#cancel").show()
		}
		var hei=$(".dereson").height();
		$(".dereson").css("line-height",hei+"px")

	})
}

/*--------------------------------------------------------------------------------------------------------------------*/

// 申请进度表格

function histroyLoadTable() {
	$('#J_table').bootstrapTable({
		url : basePath + '/perf/authorize/perfApplyDetail',
		sidePagination : 'server',
		dataType : 'json',
		method : 'get',
		pagination : false,
		striped : true,
		queryParams : function(params) {
			var o = new Object();
			o.contractNo = contractNo, 
			o.applyNo = applyId, 
			o.businessType = businessType
			return o;
		},
		responseHandler : function(result) {
			console.log(result.data)
			if (result.code == 0 && result.data) {
				return {
					"rows" : result.data.applyApprove
				}
			}
			return {
				"rows" : []
			}
		},
		columns : [ {
			field : 'userName',
			title : '操作人',
			align : 'center'

		}, {
			field : 'createTime',
			title : '提交日期',
			align : 'center',
			formatter : function(value, row, index) {
				var val = value
				if (val != undefined) {
					return '<div>' + val.substring(0, 19) + '</div>';
				} else {
					return '-';
				}
			}
		}, {
			field : 'approveState',
			title : '当前状态',
			align : 'center',
			formatter : function(value, row) {
				if (row.approveState == 1) {
					return '<div>待审批</div>';
				} else if (row.approveState == 2) {
					return '<div>审批中</div>';
				} else if (row.approveState == 3) {
					return '<div>已通过</div>';
				} else if (row.approveState == 4) {
					return '<div>待调整</div>';
				} else if (row.approveState == 5) {
					return '<div>已驳回</div>';
				} else if (row.approveState == 6) {
					return '<div>已撤销</div>';
				}else if (row.approveState == 7) {
					return '<div>已提交</div>';
				}else if (row.approveState == 8) {
					return '<div>已审批</div>';
				}
			}
		}, {
			field : 'completeTime',
			title : '完成日期',
			align : 'center',
			formatter : function(value, row, index) {
				var val = value
				if (val != undefined) {
					return '<div>' + val.substring(0, 19) + '</div>';
				} else {
					return '-';
				}
			}
		}, {
			field : 'comment',
			title : '审批意见',
			align : 'center',
				formatter : function(value, row, index) {
					var html='';
					if(row.comment==undefined){
						html="-";
						return html;
					}else{
						return html='<div class="remark_all" style="white-space:normal; word-break:break-all;">'+value+'</div>';
					}
					
				}
		} ]
	})
}

// 工作流

/*
 * $('#J_submit').show().off().bind('click',function(){ //查询流程创建的审批人
 * jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=findUserOnStart',{
 * //conId:result.data.contractid },function(redata){
 * commonContainer.modal('店长审批','<table id="approver" class="table table-hover
 * table-striped table-bordered"></table>',function(i){ var
 * getSelections=$('#approver').bootstrapTable('getSelections'); //选中的审批人 //审批通过
 * if(getSelections.length>0){ layer.close(i);
 * jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=toPass',{
 * contractPerFormanceId:$("#App_contractNo").text(),
 * nextUser:getSelections[0].userId, applyType:"3",
 * mome:$("#J_revamp_remark").val() },function(){ layer.alert('提交成功', { skin:
 * 'layui-layer-lan', closeBtn:0, // 是否显示关闭按钮 yes:function(){ location.reload(); }
 * }); }); }else{ commonContainer.alert('请选择审批人'); } },{ btns:['确定','取消'],
 * area:'600px', overflow :true, success:function(){
 * $('#approver').bootstrapTable({ singleSelect:true, //设置单选 clickToSelect:true,
 * //点击选中行 columns: [{ field: '', title: '选择', checkbox:true, align:'center' }, {
 * field: 'userName', title: '用户姓名', align:'center' }, { field: 'userDept',
 * title: '用户部门', align:'center' }], data:redata.data }); } }); },{
 * completeCallBack:function(){ } }); });
 */

var isbtn = true;

if(isbtn){
	$('#J_btn_button').off().delegate('button','click', function(event) {
		isbtn = false;
		var bustypes = [];
		$("#J_dataTable tbody tr").each(function(){
			if($(this).children().eq(5).text()=="是"){
				bustypes.push($(this).children().eq(0).text())
			}
		})
		var bustypeStr  = bustypes.join(",")
		var typetaskId = getQueryString("taskId");
		var datavalbutton = $(this).attr('data-val');
		var isEnd = getQueryString("isEnd");
		if (datavalbutton == 'toPass') {
			if (!isEnd) {
				// 查询流程创建的审批人
				jsonPostAjax(basePath + '/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=findUserOnTask', {
					taskId : typetaskId
				}, function(redata) {
					commonContainer.modal(redata.data[0].currentApprovalProcess+'', '<table id="approver" class="table table-hover table-striped table-bordered"></table>', function(i) {
						var getSelections = $('#approver').bootstrapTable('getSelections'); // 选中的审批人
						// 审批通过
						if (getSelections.length > 0) {
							layer.close(i);
							$(".title_contractNo").text('确定通过合同编号为：' + contractNo + '的'+bustypeStr+'调整申请？如确认通过，请说明原因')
							layer.open({
								title : ' ',
								type : 1,
								shift : 1,
								skin : 'layui-layer-lan layui-layer-no-overflow',
								zIndex : 10,
								content : $('#demo_layer_stantard'),
								area : [ '360px', '300px' ],
								btn : [ '确认', '取消' ],
								yes : function(index, layero) {
									var mem = $("#mem").val();
									if (mem == '') {
										layer.alert('审批意见必填项不能为空');
										return false;
									}
									jsonPostAjax(basePath + '/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=toPass', {
										comment : $('#mem').val(),
										taskId : typetaskId,
										nextUser : getSelections[0].userId,
										formId : formId,
										applyId : applyId,
										isEnd : isEnd
									}, function() {
										layer.closeAll();
										layer.alert('提交成功');												
										window.location.reload();
										$('#J_btn_button button').hide();
										//iframe刷新
										// var name= $("iframe").attr("src");
										 //$("iframe").attr("src",name).ready();
										 jQuery('#J_table').bootstrapTable('refresh', {url: basePath + '/perf/authorize/perfApplyDetail'});
										//window.opener.location.href = window.opener.location.href;//刷新父页面
									},{
										errorCallBack:function(){
											isbtn= true;
										}
									});

								}
							})
						} else {
							commonContainer.alert('请选择审批人');
						}
					}, {
						btns : [ '确定', '取消' ],
						area : '600px',
						overflow : true,
						success : function() {
							$('#approver').bootstrapTable({
								singleSelect : true, // 设置单选
								clickToSelect : true, // 点击选中行
								columns : [ {
									field : '',
									title : '选择',
									checkbox : true,
									align : 'center'
								}, {
									field : 'userName',
									title : '用户姓名',
									align : 'center'
								}, {
									field : 'userDept',
									title : '用户部门',
									align : 'center'
								} ],
								data : redata.data
							});
						}
					});
				}, {
					errorCallBack:function(){
						isbtn= true;
					}
				});
			} else {
				$(".title_contractNo").text('确定通过合同编号为：' + contractNo + '的'+bustypeStr+'调整申请？如确认通过，请说明原因')
				layer.open({
					title : ' ',
					type : 1,
					shift : 1,
					skin : 'layui-layer-lan layui-layer-no-overflow',
					zIndex : 10,
					content : $('#demo_layer_stantard'),
					area : [ '360px', '300px' ],
					btn : [ '确认', '取消' ],
					yes : function(index, layero) {
						var mem = $("#mem").val();
						if (mem == '') {
							layer.alert('审批意见必填项不能为空');
							return false;
						}
						jsonPostAjax(basePath + '/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=toPass', {
							comment : $('#mem').val(),
							taskId : typetaskId,
							formId : formId,
							applyId : applyId,
							isEnd : isEnd
						}, function() {
							layer.closeAll();
							layer.alert('提交成功');	
							window.location.reload();
							$('#J_btn_button button').hide();
							// var name= $("iframe").attr("src");
							// $("iframe").attr("src",name).ready();
							 jQuery('#J_table').bootstrapTable('refresh', {url: basePath + '/perf/authorize/perfApplyDetail'});
							//window.opener.location.href = window.opener.location.href;//刷新父页面
						});

					}
				})
			}

		} else if (datavalbutton == 'toReject') {
			$(".title_contractNo").text('确认驳回合同编号为' + contractNo + '的'+bustypeStr+'调整申请？如确认驳回，请说明原因'); 
			layer.open({
				title : ' ',
				type : 1,
				shift : 1,
				skin : 'layui-layer-lan layui-layer-no-overflow',
				zIndex : 10,
				content : $('#demo_layer_stantard'),
				area : [ '360px', '300px' ],
				btn : [ '确认', '取消' ],
				yes : function(index, layero) {
					var mem = $("#mem").val();
					if (mem == '') {
						layer.alert('驳回意见必填项不能为空');
						return false;
					}
					jsonPostAjax(basePath + '/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=toReject', {
						taskId : typetaskId,
						comment : $('#mem').val(),
						formId : formId,
						applyId : applyId
					}, function() {
						layer.closeAll();
						layer.alert('驳回成功');
						window.location.reload();
						$('#J_btn_button button').hide();
						// var name= $("iframe").attr("src");
						// $("iframe").attr("src",name).ready();
						 jQuery('#J_table').bootstrapTable('refresh', {url: basePath + '/perf/authorize/perfApplyDetail'});
						//window.opener.location.href = window.opener.location.href;//刷新父页面
					});
				}
			})
		}
	})
}



$(document).delegate('#J_cancel', 'click', function(event) {	
	var applyId = getQueryString(applyId);
	$(".title_contractNo").text('确定撤销合同编号为：' + contractNo + '的'+bustypeStr+'调整申请？如确认撤销，请说明原因')
	layer.open({
		title : ' ',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,
		content : $('#demo_layer_stantard'),
		area : [ '360px', '300px' ],
		btn : [ '确认', '取消' ],
		yes : function(index, layero) {
			var mem = $("#mem").val();
			$.ajax({
				url : basePath + "/perf/authorize/updatePerfApply",
				type : 'post',
				async : true,
				cache : false,
				dataType : 'json',
				contentType : 'application/json;charset=UTF-8',
				data : JSON.stringify({
					"applyId" : applyId,
					"memo" : mem,
					"approveState" : "6",
					"delFlag" : "1"
				}),
				success : function(result) {
					layer.closeAll()
					/*$('#dataTable').bootstrapTable('refresh', {
						url : basePath + '/perf/applyManage/perfoApplyDetail'
					});*/
				}
			})
		}
	});
})

// 流程图
jsonPostAjax(basePath + '/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=getFlowChartUrlByBusiness', {
	formId : formId
}, function(result) {
	$('#J_srcimg').attr('src', result.data.PERF_AUTHORIZE_STATE);
});



//textarae字数限制
mem.oninput = function strLenCalc(obj, checklen, maxlen) {
	var v = $("#mem").val(), charlen = 0, maxlen = !maxlen ? 240 : maxlen, curlen = maxlen, len = v.length;
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

