$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		$('#J_audituserid').attr('data-id','');
		$('#J_build').attr('data-id','');
		$("#J_deptName").attr("data-id",'');
		$('#J_user').attr('data-id','');
        $("#J_deptLevel").val("");
		endtime.min='';
		endtime.start='';
		starttime.max='';
	})
	
	//初始化业务类型数据
	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType", "");
	//规划用途复选
	dimContainer.buildDimCheckBoxHasAll($('#J_plannedUses'), 'plannedUses', 'plannedUses', 'all','全部');
	//待审批人自动补全查询
	searchContainer.searchUserListByComp($("#J_audituserid"), true, 'left');
	//楼盘名称自动补全查询
	searchBuild($("#J_build"), true, 'right');
	//初始化待审类型数据
	dimContainer.buildDimChosenSelector($("#J_auditstep"), "houseAuditType", "")
	
	//所属人自动补全查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'left');
	// 显示部门树状结构
    $('#J_deptSelect').on('click', function() {
        showDeptTree($('#J_deptName'), $('#J_deptLevel'), '');
    });
	
	// 初始化录入日期
	var starttime = {
		elem: '#J_starttime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	endtime.min = datas;
	    	endtime.start = datas
	    }
	}
	
	var endtime = {
		elem: '#J_endtime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	starttime.max = datas
	    }
	}
	
	laydate(starttime);
	laydate(endtime);
	
	$('#J_endtime').on('change', function() {
		starttime.max = '';
	})
})	

/**
 * 关闭弹出层
 */
function closeLayer() {
	layer.closeAll();
	jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/audit/uncheckedlist'});
}

// 点击弹出分配审批人操作
$("#J_distribution").on("click",function(){
	// 校验是否选择了审核信息
	if($("#J_dataTable :checkbox:checked").length==0){  
		layer.alert("请选择需要分配审批人的房源");
		return false;
	}	
	var veriifyIdArr = [];
	var stepFlag = false;
	var secondSteflag = false;
	var invalidCount = 0;
	var normalAuditStep = '';
	$("input[name='btSelectItem']:checked").each(function(index,element){
		var auditStep = $(this).parent().find('#J_auditId').attr('data-auditstep');
		
		if(index==0) normalAuditStep = auditStep;
		if(auditStep == normalAuditStep){
			veriifyIdArr.push($(this).parent().find('#J_auditId').attr('data-id'));
		}else{
			stepFlag = true;
		}
		
		if(auditStep == '二审'){
			secondSteflag = true;
		}
	})
	
	if(stepFlag) {
		layer.alert("所选项必须是相同审核类型，请重新选择");	
		return false;
	}
	
	if(secondSteflag) {
		layer.alert("不能分配审批人，请重新选择");
		return false;
	}
		
	auditlayer(veriifyIdArr, false);
});


//按条件查询跟进列表
$('#J_search').on('click', function(event) {
	searchTableDatas();
	jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/audit/uncheckedlist'});
});
	
function searchTableDatas() {
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/house/audit/uncheckedlist',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			if($('#J_user').attr('data-id')){
				o.belonguserid = $('#J_user').attr('data-id');
			}
			o.audituserid = $('#J_audituserid').attr('data-id');
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			if(o.buildingid){
				o.buildingid = $('#J_build').attr('data-id');
			}
			if(o.deptid){
				o.deptid = $("#J_deptName").attr("data-id");
			}
			if(o.level){
				o.level = $("#J_deptLevel").val();
			}
			return o;
		},
		responseHandler: function(result){
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'flyid',title :'序号',checkbox:true, align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			html='<input type="hidden" id="J_auditId" name="auditId" data-id="'+row.id+'" data-auditstep="'+row.auditstep+'" />';
		           			return html;
		           		}
		           	},
		            {field: 'houseid', title: '房源编号', align: 'center',
		           		formatter: function(value, row, index) {	
		      				var html = '';
		      				var url = '';
		      				if (row.businesstype == '1') {// 跳转到租赁详情
		      					url = basePath+"/house/main/leasedetail.htm?houseid="+row.houseid;
		      				} else if (row.businesstype == '2') {// 跳转到买卖详情
		      					url = basePath+"/house/main/buydetail.htm?houseid="+row.houseid;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ row.houseid +'</a>';
		      				return html;
		      	    	}
		           	},
				    {field: 'strauditstep', title: '待审类型', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			html='<input type="hidden" class="J_auditstep" name="auditId" data-auditstep="'+row.auditstep+'" />'+row.strauditstep;
		           			return html;
		           		}
				    },
				    {field: 'strbusinesstype', title: '业务类型', align: 'center'},
				    {field: 'planneduses', title: '规划用途', align: 'center'},
				    {field: 'buildingname', title: '楼盘名', align: 'center'},
				    {field: 'deptname', title: '所属部门', align: 'center',
				    	formatter: function(value, row, index) {
					    	var html = '';
		      				var deptname = row.deptname ? row.deptname : '-'
		      				html ='<div class="text-left">'+deptname+'</div>';
				    		return html;
					    }
				    },
				    {field: 'belongusername', title: '所属人', align: 'center',
				    	formatter: function(value, row, index) {
				    		var userId = row.belonguserid;
							var html='';
							if(value=='' || value==undefined)
								html = '-';
							else
								html= '<a onclick="getUserStaffInfo('+userId+')" target="_blank">'+ value +'</a>';
							return html;
					    }
				    },
				    {field: 'auditusername', title: '待审批人', align: 'center',
				    	formatter: function(value, row, index) {
				    		var userId = row.audituserid;
							var html='';
							if(value=='' || value==undefined)
								html = '-';
							else
								html= '<a onclick="getUserStaffInfo('+userId+')" target="_blank">'+ value +'</a>';
							return html;
					    }
				    },
				    {field: 'starttime', title: '流程开始时间', align: 'center',
				    	formatter: function(value, row, index) {
				    		flowstarttime = value ? value : '-';
							if(value != undefined){
								var html='';
								html= row.starttime.substring(0,19);
								return html;
							}
					    }
				    	
				    },
				    {field: 'opt', title: '操作', align: 'center',
				    	formatter: function(value, row, index) {	
		      				var html = '';
		      					html = '<div class="text-left"><a id="J_businesstype" type="review" class="btn btn-outline btn-success btn-xs" data-businesstype ="'+row.businesstype+'" data-belonguserid = "'+row.belonguserid+'" data-id = "'+row.id+'" data-houseid = "'+row.houseid+'">审核</a>&nbsp;&nbsp;'
		      						  +'<a type="address" class="btn btn-outline btn-success btn-xs" data-houseid="'+row.houseid+'">查看地址</a>&nbsp;&nbsp;'
		      						  +'<a type="phone" class="btn btn-outline btn-success btn-xs" data-houseid="'+row.houseid+'">查看电话</a></div>'
		      				return html;
		      	    	}
				    	
				    }
				]
	});
}
var uncheckreviewUrl = basePath + '/house/audit/detail';

$('#J_dataTable').delegate(
	'a',
	'click',
	function(event) {
		var _this=this;
		if (this.type == 'review') {// 根据type 判断 审核
			var houseId = $(this).attr('data-houseid');
			var housedataId = $(this).attr('data-id');
			var datauserId = $(this).attr('data-belonguserid');
			var businessType = $(this).attr('data-businesstype');
			jsonGetAjax(
					uncheckreviewUrl,
					{	
						"houseid": houseId
					},
					function(){
						
					}
			).then(function(result){
				if(result.data.finalStatusId!=undefined){
					if(result.data.finalStatusId==1){
						return layer.msg("该房源已报成交，不能审核！");
					}
				}
			
			// 加载 审核 数据
			commonContainer.modal(
					'房源审核',
					$('#auditrecord_layer'),
					function(index, layero) {
						layer.close(index);
					}, 
					{
						overflow :true,
						area : ['800px', '80%'],
						btns : [],
						success: function() {
							$('#J_approverschange').data('id',housedataId);
							$('#J_btnpass').data('id',housedataId);
							$('#J_btnfail').data('id',housedataId);
							$('#J_btndetermined').data('id',housedataId);
							$('#J_userid').val(datauserId);
							$('#J_houseidrecord').data('businesstype',businessType);
							
									$('#J_houseidrecord').text(result.data.houseid);
									$('#J_deptname').text(result.data.deptname);
									$('#J_username').text(result.data.username);
									$('#J_buildingname').text(result.data.buildingname);
									$('#J_curauditstep').text(result.data.strcurauditstep);
									$('#J_curauditusername').text(result.data.curauditusername);
									$('#J_seeaddress').data('seehouseid',result.data.houseid);
									$('#J_seephone').data('seehouseid',result.data.houseid);

									if(result.data.curauditstep == '1'){
										$('#J_btndetermined').show();
										$('#J_approverschange').show();
									}else if(result.data.curauditstep == '2'){
										$('#J_btndetermined').hide();
										$('#J_approverschange').hide();
									}else if(result.data.curauditstep == '3' && result.data.isclickupperlimit == '1'){
										$('#J_btndetermined').hide();
										$('#J_approverschange').show();
									}else{
										$('#J_btndetermined').show();
									}

									// 变更审批人数据加载
									loadUserTraceTableData(result);
									
									// 审核记录数据加载
									loadTraceTableData(result);
							
						}
					}
				);
			});
			
		}else if(this.type == 'address'){// 根据type 判断查看地址
			var houseId = $(this).attr('data-houseid');

			// 加载查看地址数据
			checkAddress(houseId);
			
		}else if(this.type == 'phone'){// 根据type 判断查看电话
			var houseId = $(this).attr('data-houseid');
			// 加载查看电话数据
			checkPhone(houseId);
		}
	}
)

function loadUserTraceTableData(result){
	var userTraceTableData = new Array();
	$.each(result.data.auditusertracelist, function(n, value) {
		var row = new Object();
		row.audittype = value.audittype;
		row.changetime = value.changetime;
		row.beforechangeuserid = value.beforechangeuserid;
		row.beforechangeusername = value.beforechangeusername;
		row.afterchangeuserid = value.afterchangeuserid;
		row.afterchangeusername = value.afterchangeusername;
		row.changeuserid = value.changeuserid;
		row.changeusername = value.changeusername;
		row.changeremark = value.changeremark;
		userTraceTableData.push(row);
    });
	$('#J_auditusertracelist_dataTable').bootstrapTable({
		columns:[
			{
				field: 'audittype',
				title: '变更审批类型'
			},
			{
				field: 'changetime',
				title: '变更时间',
				formatter: function (value, row, index) { 
					var html = row.changetime ? row.changetime.substring(0,19) : '-';
					return html; 
				}
			},
			{
				field: 'beforechangeuserid',
				title: '变更前审批人',
				formatter: function (value, row, index) { 
					var html = row.beforechangeusername ? '<a onclick=getUserStaffInfo('+row.beforechangeuserid+')>'+row.beforechangeusername+'</a>' : '-';
					return html; 
				}
			},
			{
				field: 'afterchangeuserid',
				title: '变更后审批人',
				formatter: function (value, row, index) { 
					var html = row.afterchangeusername ? '<a onclick=getUserStaffInfo('+row.afterchangeuserid+')>'+row.afterchangeusername+'</a>' : '-';
					return html; 
				}
			},
			{
				field: 'changeuserid',
				title: '变更人',
				formatter: function (value, row, index) { 
					var html = row.changeusername ? '<a onclick=getUserStaffInfo('+row.changeuserid+')>'+row.changeusername+'</a>' : '-';
					return html; 
				}
			},
			{
				field: 'changeremark',
				title: '变更备注',
				formatter: function (value, row, index) { 
					var changeremark = row.changeremark ? value: '-';
					var html = '<div class="text-left">'+changeremark+'</div>';
					return html; 
				}
			}
		],
		data : userTraceTableData,
		pagination: false
	});

	jQuery('#J_auditusertracelist_dataTable').bootstrapTable('load', userTraceTableData);
}

function loadTraceTableData(result) {
	var traceTableData = new Array();
	$.each(result.data.audittracelist, function(n, value) {
		var row = new Object();
		row.audituserid = value.audituserid;
		row.auditusername = value.auditusername;
		row.audittime = value.audittime;
		row.strauditstep = value.strauditstep;
		row.strauditresult = value.strauditresult;
		row.remark = value.remark;
		traceTableData.push(row);
    });
	$('#J_audittracelist_dataTable').bootstrapTable({
		columns:[
			{
				field: 'audituserid',
				title: '审批人',
				formatter: function (value, row, index) { 
					var html = row.auditusername ? '<a onclick=getUserStaffInfo('+row.audituserid+')>'+row.auditusername+'</a>' : '-';
					return html; 
				}
			},
			{
				field: 'audittime',
				title: '审批时间',
				formatter: function (value, row, index) { 
					var html = row.audittime ? row.audittime.substring(0,19) : '-';
					return html; 
				}
			},
			{
				field: 'strauditstep',
				title: '审批类型',
				formatter: function (value, row, index) { 
					var html = row.strauditstep ? value : '-';
					return html; 
				}
			},
			{
				field: 'strauditresult',
				title: '审批结果',
				formatter: function (value, row, index) { 
					var strauditresult = row.strauditresult ? value : '-';
					var html = '<div>'+strauditresult+'</div>';
					return html; 
				}
			},
			{
				field: 'remark',
				title: '审批备注',
				formatter: function (value, row, index) { 
					var remark = row.remark ?value : '-';
					var html = '<div class="text-left">'+remark+'</div>';
					return html; 
				}
			}
		],
		data : traceTableData,
		pagination: false
	});
	

	jQuery('#J_audittracelist_dataTable').bootstrapTable('load', traceTableData);
}