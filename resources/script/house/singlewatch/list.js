searchContainer.searchUserListByComp($("#J_sendee"), true);
// searchDept($('#J_deptName'), false, 'left');

dimContainer.buildDimChosenSelector($("#J_isvalid"), "isvalid", "");
dimContainer.buildDimChosenSelector($("#J_sstatus"), "sstatus", "");
// 显示部门树状结构
$('#J_deptSelect').on('click', function() {
	showDeptTree($('#J_deptName'), $('#J_deptLevel'), '');
});

// 初始化录入日期
var begindate = {
	elem : '#J_singlestarttime',
	format : 'YYYY-MM-DD',
	istime : false,
	choose : function(datas) {
		enddate.min = datas;
		enddate.start = datas
	},
}

var enddate = {
	elem : '#J_singleendtime',
	format : 'YYYY-MM-DD',
	istime : false,
	choose : function(datas) {
		begindate.max = datas
	}
}
laydate(begindate);
laydate(enddate);
// 初始化表格
// 详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
jQuery('#J_search').on('click', function(event) {
	initListLoad();
	// $('#J_lease_form').bootstrapTable('destroy');
	$('#J_dataTable').bootstrapTable('refresh', {
		url : basePath + '/house/singlewatch/listview'
	});
});
// 加载列表数据项

/*
 * $('#J_reset_lease').on('click', function(event) { $('#J_lease_form').reset(); })
 */
$('#J_reset_lease').on('click', function(event) {
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	enddate.min = '';
	enddate.start = '';
	begindate.max = '';
	$('#J_sendee').val('');
	$('#J_sendee').attr("data-id", "");
	$('#J_deptName').val('');
    $('#J_deptLevel	').val('');
	$('#J_deptName').attr("data-id", "");

	$('#J_singlestarttime').val('');
	$('#J_singleendtime').val('');
	$('#J_singlehouseid').val('');
})
/* 空看列表 start */
function initListLoad() {

	$('#J_dataTable')
			.bootstrapTable(
					{
						// url: basePath + '/house/singlewatch/listview',
						sidePagination : 'server',
						dataType : 'json',
						method : 'post',
						pagination : true,
						striped : true,
						pageSize : 10,
						pageList : [ 10, 20, 50 ],
						queryParams : function(params) {
							var o = jQuery('#J_lease_form').serializeObject();
							o.timestamp = new Date().getTime();
							o.userid = currUserId;
							o.pageindex = params.offset / params.limit + 1,
									o.pagesize = params.limit;
							if (o.deptid) {
								o.deptid = $("#J_deptName").attr('data-id');
							}
							if(o.createby){
                                o.createby = $("#J_sendee").attr('data-id');
							}
							if (o.createstarttime) {
								o.createstarttime = encodeURI(o.createstarttime);
							}
							if (o.createendtime) {
								o.createendtime = encodeURI(o.createendtime);
							}
							return o;
						},
						responseHandler : function(result) {
							// console.log(result);
							if (result.code == 0 && result.data
									&& result.data.totalcount > 0) {
								return {
									"rows" : result.data.list,
									"total" : result.data.totalcount
								}
							}
							return {
								"rows" : [],
								"total" : 0
							}
						},

						columns : [
								{
									field : 'emptyid',
									title : '空看编号',
									align : 'center',
									formatter : function(value, row, index) {
										var html = "";
										if ($("#temp_view").val() != undefined) {
											html = "<a type=\'show\' onclick=\'singleback("
													+ row.emptyid
													+ ",\"feedback\")\'>"
													+ value + "</a>&nbsp;";
										} else {
											html = "<a>" + value + "</a>&nbsp;";
										}

										return html;
									}
								},
								{
									field : 'houseid',
									title : '房源编号',
									align : 'center',
									formatter : function(value, row, index) {
										var strhouseids = "";
										var leaseurl = "/sales/house/main/leasedetail.htm?houseid=";
										var buyurl = "/sales/house/main/buydetail.htm?houseid=";
										if (row.houseid != undefined) {
											var houseids = row.houseid
													.split(' ');
											for (i = 0; i < houseids.length; i++) {
												if (row.housekind == 1) {// 租赁
													strhouseids += '<a target="_blank" href="'
															+ leaseurl
															+ houseids[i]
															+ '" data-houseid="'
															+ houseids[i]
															+ '">'
															+ houseids[i]
															+ '</a><br />';
												} else {// 买卖
													strhouseids += '<a target="_blank" href="'
															+ buyurl
															+ houseids[i]
															+ '" data-houseid="'
															+ houseids[i]
															+ '">'
															+ houseids[i]
															+ '</a><br />';
												}

											}
										}
										var html = strhouseids;
										return html;
									}

								},
								{
									field : 'strstatus',
									title : '状态',
									align : 'center'
								},
								{// feedbacknum/emptylooknum
									field : 'feedbacknum',
									title : '反馈套数/空看套数',
									align : 'center',
									formatter : function(value, row, index) {
										var html = row.feedbacknum + "/"
												+ row.emptylooknum;
										return html;
									}
								},
								{
									field : 'createbyname',
									title : '空看人',
									align : 'center',
									formatter : function(value, row, index) {
										var html = "<a onclick='getUserStaffInfo("
												+ row.createby
												+ ")'>"
												+ value
												+ "</a>";
										return html;
									}
								},
								{
									field : 'shopgroupname',
									title : '空看部门',
									align : 'center',
									formatter : function(value, row, index) {
										var html = '';
										html = '<div class="text-left">'
												+ value + '</div>';
										return html;
									}
								},
								{
									field : 'goouttime',
									title : '外出时间',
									align : 'center'
								},
								{
									field : 'backtime',
									title : '返回时间',
									align : 'center'
								},
								{
									field : 'opt',
									title : '操作',
									align : 'center',
									formatter : function(value, row, index) {
										var html = "";

										if (!row.isowner) {
											return '-';
										}

										if (row.status == 2&&row.isowner==true) {
											if ($("#temp_feedback").val() != undefined) {
												html = '<div class="text-left">';
												html += "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_single_detail\'  onclick=\'singleback("
														+ row.emptyid
														+ ",\"feedback\")\'>反馈</a>&nbsp;";
												html += '</div>';
											}
										} else if (row.status == 3&&row.isowner==true) {
											html = '<div class="text-left">';
											html += "<a type=\'cancel\' class=\'btn btn-outline btn-success btn-xs mt-3 J_singleback\' onclick=\'singleback("
													+ row.emptyid
													+ ",\"back\")\'>返回</a>&nbsp;";
											html += '</div>';
										} else if (row.status == 1
												|| row.status == 4) {
											html += "-";
										}

										return html;
									}
								} ]
					});
}

$(function() {
	$("select").chosen({
		width : "100%"
	});
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		enddate.min = '';
		enddate.start = '';
		begindate.max = '';
	})

	/*
	 * var tableBtn = "<a type=\'feedback\' class=\'btn btn-outline btn-danger
	 * btn-xs\'>反馈</a>"; // TODO 添加dataid var tableBtn1 = "<a type=\'return\'
	 * class=\'btn btn-outline btn-success btn-xs mt-3 J_singleback\'>返回</a>";
	 * 
	 * var tablehref = "<a href=\'#\' target=\'_blank\'>KK170320</a>"; // TODO
	 * 添加dataid var tablehref1 = "<a href=\'#\' target=\'_blank\'>AJDBZ00224</a>";
	 * var tableData = [{ "singleid" : tablehref, "houseid" : tablehref1,
	 * "status" : "可反馈", "singlenum" : "2/3", "singlecustomer" : "张三",
	 * "singledepartment" : "淮河店A组", "outtime" : "2016-05-01 12:29", "backtime" :
	 * "2016-05-01 16:29", "opt" : tableBtn }];
	 */
	/* 空看列表 end */
	/* 返回时间列表 start */
	/*
	 * var tableBackhref_id = "<a href=\'#\' target=\'_blank\'>AJDBZ00224</a>";
	 * var tableBackhref_address = "<a href=\'#\' class=\'J_detail_address\'>查看</a>"; //
	 * TODO 添加dataid var tableBackhref_opt = "<a href=\'#\'
	 * class=\'J_showback\'>查看</a>"; var tableDatasingleback = [{ "id" :
	 * tableBackhref_id, "name" : "华宇名都", "address" : tableBackhref_address,
	 * "time" : "2016-05-03 23:59", "opt" : tableBackhref_opt }];
	 */
	/* 返回时间列表 end */

	/* 带看添加房源列表 start */

	/*
	 * var tableBackhref_id = "<img
	 * src='http://pic6.huitu.com/res/20130116/84481_20130116142820494200_1.jpg'
	 * alt='房源图片' />"; // TODO 添加 房源详情 var tablebuilding_detail ='<label
	 * data-houseid>123456</label>&nbsp;<label>世纪华庭</label><br/>'+ '<label>详细地址:<a
	 * href="">查看</a></label><br/>'+ '<label><font color="#ff0000">120万元</font></label>';
	 * var tabledel_opt = "<a href=\'#\' class=\'J_houseinfo_del\'>删除</a>";
	 * 
	 * var tableDatasinglewatch = [{ "image" : tableBackhref_id, "building" :
	 * tablebuilding_detail, "layout" : "2室1厅1卫", "area" : "123 ㎡", "opt" :
	 * tabledel_opt }];
	 */
	/* 带看添加房源列表 end */

	/*
	 * 添加空看-系统房源列表 start
	 */
	/*
	 * var tablehouse_id = "<a href=\'\' class=\'J_houseid\'>FY49304(可售)</a>";
	 * var tablechosen="<input type=\'checkbox\'/>"; // TODO 添加 房源详情
	 * 
	 * var tableDatahouse = [{ "h_hid" : tablechosen, "h_houseid" :
	 * tablehouse_id, "h_buildname" : "北辰福第小区", "h_housenum" : "301", "h_price" :
	 * "225万", "h_builtarea" : "90㎡", "h_layout" : "2-1-2-2-1", "h_floor" :
	 * "6层", "h_orientation" : "南北" }];
	 */

	// 初始化表格
	// 详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
	/*
	 * $('#J_dataTable').bootstrapTable({ data : tableData, pagination: true
	 * 
	 * });
	 */

	/*
	 * ('#J_dataTable').delegate('a','click',function(event){
	 * if(this.type=='del'){ var followid = $(this).attr('data-followid');
	 * commonContainer.confirm( '是否确认删除此条数据？', function(index, layero){
	 * jsonAjax( basePath + '/custom/black/delinfo.htm', {"followid" :
	 * followid}, function(){ layer.msg("删除成功");
	 * jQuery('#J_dataTable').bootstrapTable('refresh'); } ) } ); } })
	 */
});

/*
 * 空看返回 空看返回弹出层中的反馈/查看操作
 */
/*
 * $(document).delegate('.J_singleback', 'click', function(event){
 * commonContainer.modal('返回时间', $('#J_editsingleback_layer'), function(index,
 * layero) { var follow_content=$("#J_followup_content").val(); var
 * remind_content=$("#J_reminder_content").val(); var
 * remind_time=$("#J_reminder_time").val(); if(follow_content==""){
 * commonContainer.alert("跟进内容不能为空"); }else{ jsonPostAjax( basePath +
 * '/customer/follow/insertfollow',{ "clientid": clientId, //客户编号 "content":
 * follow_content, //跟进内容 "customersid": customerId, //需求ID "remindmsg":
 * remind_content,//提醒内容 "remindtime": remind_time, //提醒时间 "sourceid": "",
 * //源ID(非必须，可不传值) "type": "1" //跟进类型 }, function() {
 * commonContainer.alert("操作成功"); layer.close(index); location.reload();
 * //jQuery('#J_dataTable').bootstrapTable('refresh'); },{}); jsonAjax(basePath +
 * '/house/keyadmin/lendkey.htm', { "id" : id, "keycode" :
 * $("#borrow_keycode").text(), }, function() { commonContainer.alert("操作成功");
 * layer.close(index); //jQuery('#J_dataTable').bootstrapTable('refresh');
 * },{}); } }, { overflow :false, area : ['680px', '450px'], btns : ['确定','关闭'],
 * cancel : function(index, layerno) { alert("确定要关闭么"); layer.close(index);
 * $('input:checkbox').each(function() { $(this).attr('checked', false); }); }
 * });
 * 
 * });
 */
/*
 * 空看返回弹出层中的查看详细地址
 */
$(document).delegate('.J_detail_address', 'click', function(event) {
	// var oldname=$("#oper_followup").html();//接口text的id
	// alert(oldname);
	layer.open({
		title : '地址详细信息',
		type : 1,
		shift : 1,
		// zIndex: 9,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#J_detail_address_layer'),
		area : [ '500px', '300px' ],
		btn : [ '关闭' ],
		yes : function(index, layero) {
			// layer.msg("操作成功");
			layer.open({
				title : '强制跟进',
				type : 1,
				shift : 1,
				// zIndex: 9,
				skin : 'layui-layer-lan layui-layer-no-overflow',
				content : $('#J_followup_layer'),
				area : [ '680px', '380px' ],
				btn : [ '提交' ],
				yes : function(index, layero) {
					layer.msg("操作成功");
					layer.close(index);
				},
				cancel : function(index, layerno) {
					layer.close(index);
				},
				success : function(layero, index) {

				}

			});
			layer.close(index);
		},
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success : function(layero, index) {
			// console.log(layero, index);
		}

	});
});

/*
 * 空看返回弹出层中的反馈/查看操作
 */
/*
 * $(document).delegate('.J_showback', 'click', function(event){ //var
 * oldname=$("#oper_followup").html();//接口text的id //alert(oldname); layer.open({
 * title : '反馈结果', type : 1, shift : 1, //zIndex: 9, skin : 'layui-layer-lan
 * layui-layer-no-overflow', content : $('#J_feedback_layer'), area :
 * ['500px','300px'], btn : [ '保存' ], yes : function(index, layero) {
 * layer.msg("操作成功"); layer.close(index); }, cancel : function(index, layerno) {
 * layer.close(index); }, success:function (layero, index){ console.log(layero,
 * index); //调用和绑定 $(document).delegate( '#J_upload', 'click', function(){ } ); }
 * 
 * }); commonContainer.modal('地址详细信息', $('#J_detail_address_layer'),
 * function(index, layero) {
 *  }, { overflow :false, area : ['680px', '450px'], btns : ['确定','关闭'], yes :
 * function(indexc, layero) { alert("d");
 *  }, cancel : function(index, layerno) { alert("确定要关闭么"); layer.close(index);
 * $('input:checkbox').each(function() { $(this).attr('checked', false); }); }
 * });
 * 
 * });
 */

/*
 * $(document).delegate('#J_singlewatch', 'click', function(event){
 * commonContainer.modal('添加空看', $('#J_editsinglewatch_layer'), function(index,
 * layero) { }, { overflow :false, area : ['680px', '600px'], btns :
 * ['确定','关闭'], yes : function(indexc, layero) { alert("d");
 *  }, cancel : function(index, layerno) { alert("确定要关闭么"); layer.close(index);
 * $('input:checkbox').each(function() { $(this).attr('checked', false); }); }
 * }); });
 */

/*
 * 添加空看-系统房源
 */
$(document).delegate(
		'#J_singlewatch_add_btn',
		'click',
		function(event) {
			commonContainer.modal('系统房源', $('#J_singlewatch_add_system'),
					function(index, layero) {

					}, {
						overflow : false,
						area : [ '860px', '600px' ],
						btns : [ '确定', '关闭' ],
						cancel : function(index, layerno) {
							alert("确定要关闭么");
							layer.close(index);
							$('input:checkbox').each(function() {
								$(this).attr('checked', false);
							});
						}
					});
		});

/*
 * $(".J_singleback").on("click",function(){ //var
 * oldname=$("#oper_followup").html();//接口text的id //alert(oldname);
 * commonContainer.modal('返回时间', $('#editsingleback_layer'), function(index,
 * layero) { var follow_content=$("#J_followup_content").val(); var
 * remind_content=$("#J_reminder_content").val(); var
 * remind_time=$("#J_reminder_time").val(); if(follow_content==""){
 * commonContainer.alert("跟进内容不能为空"); }else{ jsonPostAjax( basePath +
 * '/customer/follow/insertfollow',{ "clientid": clientId, //客户编号 "content":
 * follow_content, //跟进内容 "customersid": customerId, //需求ID "remindmsg":
 * remind_content,//提醒内容 "remindtime": remind_time, //提醒时间 "sourceid": "",
 * //源ID(非必须，可不传值) "type": "1" //跟进类型 }, function() {
 * commonContainer.alert("操作成功"); layer.close(index); location.reload();
 * //jQuery('#J_dataTable').bootstrapTable('refresh'); },{}); jsonAjax(basePath +
 * '/house/keyadmin/lendkey.htm', { "id" : id, "keycode" :
 * $("#borrow_keycode").text(), }, function() { commonContainer.alert("操作成功");
 * layer.close(index); //jQuery('#J_dataTable').bootstrapTable('refresh');
 * },{}); } }, { overflow :false, area : ['680px', '350px'], btns : [ '保存', '取消' ]
 * });
 * 
 * });
 */