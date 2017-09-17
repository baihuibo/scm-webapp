$(function() {
	$("select").chosen({
		width : "100%",
		no_results_text: "未找到此选项!" 
	});
	// 初始化数据
	initEvent();
});

function initEvent(){
	dimContainer.buildDimChosenSelector($("#operationtype"), "operationType", "");
	searchContainer.searchUserListByComp($("#J_retreatkeyuser"), true, 'left');  // 钥匙领取人
	dimContainer.buildDimRadio($("#J_receiveType"), "receiveType", "receiveType", "");
	searchContainer.searchUserListByComp($("#J_takekeyuser"), true, 'left');  // 钥匙领取人
	searchContainer.searchShopListByComp($("#J_shop"), true, 'right');	// 钥匙转存店
	
	$("#planbackdate").click(function(){
		var minDate=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
		datelayer("#planbackdate", {
			istime: true,
			format: 'YYYY-MM-DD hh:mm',
			min : minDate
		});
	})
	
	// 条件查询
	$('#J_search').on('click', function(event) {
		var reg = /^[0-9a-zA-Z]*$/g;
		var numreg = /^[0-9]*$/g;
		if ($("#keycode").val().trim() !== '') {
			if (!reg.test($("#keycode").val())) {
				commonContainer.alert('钥匙编号只能由数字和字母组成');
				return false;
			}
		}
		if($("#houseid").val().trim() !== ''){
			if (!numreg.test($("#houseid").val())) {
				commonContainer.alert('房源编号只能由数字组成');
				return false;
			}
		}
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh', { url: basePath + '/house/keyadmin/keylistview.htm'});
	});
}
//加载列表数据
function initListLoad(){
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/house/keyadmin/keylistview.htm',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.keylist, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [
		  		{
					field : 'stroperationtype',
					title : '业务类型',
					align : 'center'
				},
				{
					field : 'houseid',title : '房源编号</br>钥匙编号',align : 'center',
					formatter : function(value, row, index) {
						var html = '';
						if(row.operationtype==1){
							html ='<a target="_blank" href="../main/leasedetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>'+'</br>' + row.keycode;
						}else{
							html ='<a target="_blank" href="../main/buydetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>'+'</br>' + row.keycode;
						}
						//html = value + '</br>' + row.keycode;
						return html;
					}
				},
				{
					field : 'phshopname',
					title : '钥匙存放店',
					align : 'center'
				},
				{
					field : 'strstatus',
					title : '钥匙状态',
					align : 'center'
				},
				{
					field : 'lendusername',title : '借用人',align : 'center',
					formatter: function(value ,row, index){
	      	    		var html='';
	      	    		if(row.lendusername){
	      	    			html='<a onclick="getUserStaffInfo('+row.lenduserid+')">'+row.lendusername+'</a>'
	      	    		}else{
	      	    			html='-'
	      	    		}
	      	    		return html;
		      	    }
				},
				{
					field : 'lenddate',
					title : '借用时间</br>预计还钥匙时间',
					align : 'center',
					formatter : function(value, row, index) {
						lenddate = value ? value : '-';
						planbackdate = row.planbackdate ? row.planbackdate.substring(0,19) : '-';
						
						var html = '';
						html = lenddate.substring(0,19) + '</br>' + planbackdate;
						return html;
					}
				},
				{
					field : 'stroperationtype',
					title : '操作',
					align : 'center',
					formatter : function(value, row, index) {	
						var html='';
						if(row.status==6){						
							if($("#temp_view").val()!=undefined){
								html+= "<div class='text-left'><a href="+basePath+"/house/keyadmin/detail.htm?id="+row.id+" data-opt=\'Inquire\' class=\'btn btn-outline btn-success btn-xs mt-3\' data-node=\'#node#\' target=\'_blank\'>查看</a>&nbsp;&nbsp;"									
							}
							if($("#temp_modify").val()!=undefined){
							html+='<a type="editkey" id="'+ row.id+ '" keycode="'+ row.keycode + '" phshopid="'+row.phshopid+'" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">钥匙号修改</a>&nbsp;&nbsp;'
							}
							if($("#temp_lend").val()!=undefined){
							html+='<a type="borrowkey" id="'+ row.id+ '" phshopname="'+ row.phshopname + '" keycode="' + row.keycode + '" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">借钥匙</a>&nbsp;&nbsp;'
							}
							if($("#temp_transfer").val()!=undefined){
							html+='<a type="turnkey" id="'+ row.id+ '" houseid="'+ row.houseid +'" keycode="'+ row.keycode + '"operationtype="'+ row.operationtype + '" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">钥匙转店</a>&nbsp;&nbsp;'
							}
							if($("#temp_giveback").val()!=undefined){
							html+='<a type="retreatkey" id="'+ row.id+ '" houseid="'+ row.houseid +'" keycode="'+ row.keycode + '" href="javascript:void(0);" class="btn btn-outline btn-danger btn-xs">退钥匙</a>&nbsp;&nbsp;</div>'
							}
							return html;
						}else if(row.status==3){
							if($("#temp_view").val()!=undefined){
							html+="<div class='text-left'><a href="+basePath+"/house/keyadmin/detail.htm?id="+row.id+" data-opt=\'Inquire\' class=\'btn btn-outline btn-success btn-xs mt-3\' data-node=\'#node#\' target=\'_blank\'>查看</a>&nbsp;&nbsp;"
							}
							if($("#temp_return").val()!=undefined){
							html+='<a type="backkey" id="'+ row.id+ '" keycode="'+ row.keycode + '" houseid="'+ row.houseid +'" lendusername="'+ row.lendusername + '" phshopname="'+ row.phshopname + '" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">还钥匙</a>&nbsp;&nbsp;</div>'
							}
							return html;
						}else if(row.status==5){
							if($("#temp_view").val()!=undefined){
							html+= "<div class='text-left'><a href="+basePath+"/house/keyadmin/detail.htm?id="+row.id+" data-opt=\'Inquire\' class=\'btn btn-outline btn-success btn-xs mt-3\' data-node=\'#node#\' target=\'_blank\'>查看</a>&nbsp;&nbsp;"
							}
							if($("#temp_cancel").val()!=undefined){
							html+='<a type="revokekey" id="'+ row.id+ '" keycode="'+ row.keycode + '" houseid="'+ row.houseid +'" takekeyusername="'+ row.takekeyusername + ' "operationtype="'+ row.operationtype + '" lenduserid="'+row.lenduserid+'" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">撤销</a>&nbsp;&nbsp;</div>'
							}
							return html;
						
						}
					}
				} 
		   	]
	});
}


/**
 * 修改钥匙号
 * 
 * @param obj
 * @returns
 */     
$('#J_dataTable').delegate(
		'a',
		'click',
		function(event) {
			var _this=this;
			var id=$(_this).attr('id');
			var phshopid=$(_this).attr('phshopid');
			if (this.type == 'editkey') {
				$("#up_keycode").val($(this).attr('keycode'));
				commonContainer.modal('钥匙号修改', $('#editkey_layer'), function(
						index, layero) {
					if($("#up_keycode").val()==''){
						commonContainer.alert("请输入新的钥匙编号");
						return;
					}
					if ($("#up_keycode").val() == $(_this).attr('keycode')) {
						commonContainer.alert("请修改新的钥匙编号");
						return;
					} else {
						var reg = /^[0-9a-zA-Z]*$/g;
						if ($("#up_keycode").val() !== '') {
							if (!reg.test($("#up_keycode").val())) {							
								commonContainer.alert('钥匙编号只能由数字和字母组成');
								return false;
							}
						}
						updatekeycode(id,index,phshopid);

					}
				}, {});
			}else if(this.type == 'borrowkey'){
				searchContainer.searchUserListByComp($("#J_lendusername"), true, 'right'); // 钥匙借用人
				$("#borrowkey_form")[0].reset();
				$("#borrow_keycode").text($(this).attr('keycode'));
				$("#borrow_phshopname").text($(this).attr('phshopname'));
				commonContainer.modal('借钥匙录入', $('#borrowkey_layer'), function(
						index, layero) {
					if($("#planbackdate").val()==''){
						commonContainer.alert("预计还钥匙时间不能为空！");
						return;
					}else if($("#J_lendusername").val()==''){
						commonContainer.alert("请选择借用人！");
						return;
					}else{
						jsonAjax(basePath + '/house/keyadmin/lendkey.htm', {
							"id" : id,
							"keycode" : $("#borrow_keycode").text(),
							"planbackdate" : $("#planbackdate").val(),
							"lenduserid" :$("#J_lendusername").attr("data-id"),
							"memo" : encodeURI($("#borrow_memo").val()),
						}, function() {
							commonContainer.alert("操作成功");
							layer.close(index);
							jQuery('#J_dataTable')
							.bootstrapTable(
									'refresh');
						},{});	
					}
				}, 
				{
					overflow :true,
					area : ['680px', '300px'],
					btns : [ '保存', '取消' ]
				});
			}else if(this.type == 'turnkey'){
				$("#turnkey_form")[0].reset();
				$("#turn_keycode").text($(this).attr('keycode'));
				var housesId=$(this).attr('houseid');
				$("#turn_houseid").text(housesId);
				if($(this).attr("operationtype")==1){
       				$("#turn_houseid").attr({"href":"../../house/main/leasedetail.htm?houseid="+housesId})
       			}else if($(this).attr("operationtype")==2){
       				$("#turn_houseid").attr({"href":"../../house/main/buydetail.htm?houseid="+housesId})
       			}
				commonContainer.modal('钥匙转店录入', $('#turnkey_layer'), function(
						index, layero) {
					if($("#J_takekeyuser").val()==''){
						commonContainer.alert("请选择钥匙领取人！");
						return;
					}else if($("#J_shop").val()==''){
						commonContainer.alert("请选择钥匙转存店！");
						return;
					}else{
						jsonAjax(basePath + '/house/keyadmin/changeshop.htm', {
							"id" : id,
							"takekeyuserid" :$("#J_takekeyuser").attr("data-id"),
							"changephshopid" :$("#J_shop").attr("data-id"),
						}, function() {
							commonContainer.alert("操作成功");
							layer.close(index);
							jQuery('#J_dataTable')
							.bootstrapTable(
									'refresh');
						},{});	
					}
				}, 
				{
					overflow :false,
					area : ['680px', '380px'],
					btns : [ '确定', '取消' ]
				});
			}else if(this.type == 'retreatkey'){
				$("#J_auto").hide();
				$("#J_auto_none").hide();
				$("#J_retreatuser_lable").css({"display":"none"});
				/*$("#J_retreatkeyuser").css({"display":"none"});
				$("#retreatkey_layer .input-group-btn").css({"display":"none"});*/
				$("#retreatkey_form")[0].reset();
				$("#retreat_keycode").text($(this).attr('keycode'));
				$("#retreat_houseid").text($(this).attr('houseid'));
				commonContainer.modal('退钥匙录入', $('#retreatkey_layer'), function(
						index, layero) {
					var radiovalue=$('input:radio[name=receiveType]:checked').val();
					if(radiovalue==null){
						commonContainer.alert("请选择领取人类型！");
						return;
					}else if(radiovalue==2&&$("#J_retreatkeyuserc").val()==''){
						commonContainer.alert("请填写领取人！");
						return;
					}else if(radiovalue==3&&$("#J_retreatkeyuser").val()==''){
						commonContainer.alert("请填写领取人！");
						return;	
					}else{
						var receiveuserid='';
						var receiveother='';
						if(radiovalue==2){
							receiveother=$("#J_retreatkeyuserc").val();
						}else if(radiovalue==3){
							receiveuserid=$("#J_retreatkeyuser").attr("data-id");
						}
						jsonAjax(basePath + '/house/keyadmin/backkey.htm', {
							"id" : id,
							"receivetype" : radiovalue,
							"receiveuserid" : receiveuserid,
							"receiveother":receiveother
						}, function() {
							commonContainer.alert("操作成功");
							layer.close(index);
							jQuery('#J_dataTable')
							.bootstrapTable(
									'refresh');
						},{});	
					}
				}, 
				{
					overflow :false,
					area : ['680px', '300px'],
					btns : [ '确定', '取消' ]
				});
			}else if(this.type == 'backkey'){
				$("#back_keycode").text($(this).attr('keycode'));
				$("#back_houseid").text($(this).attr('houseid'));
				$("#back_lendusername").text($(this).attr('lendusername'));
				$("#back_shop").text($(this).attr('phshopname'));
				commonContainer.modal('还钥匙', $('#backkey_layer'), function(
						index, layero) {
					jsonGetAjax(basePath + '/house/keyadmin/returnkey.htm', {
						"id" : id
					}, function() {
						commonContainer.alert("操作成功");
						layer.close(index);
						jQuery('#J_dataTable')
						.bootstrapTable(
								'refresh');
					},{});
				}, 
				{
					area : '600px',
					btns : [ '确定', '取消' ]
				});
			}else if(this.type == 'revokekey'){	
				$("#revoke_keycode").text($(this).attr('keycode'));
				$("#revoke_lendusername").text($(this).attr('takekeyusername'));
				var lenduserid=$(this).attr('lenduserid');
				$('#revoke_lendusername').on('click',function(event){
					getUserStaffInfo(lenduserid);
				})
				
				var housesId=$(this).attr('houseid');
				$("#revoke_houseid").text(housesId);
				if($(this).attr("operationtype")==1){
       				$("#revoke_houseid").attr({"href":"../../house/main/leasedetail.htm?houseid="+housesId})
       			}else if($(this).attr("operationtype")==2){
       				$("#revoke_houseid").attr({"href":"../../house/main/buydetail.htm?houseid="+housesId})
       			}
				commonContainer.modal('撤销钥匙转店', $('#revokekey_layer'), function(
						index, layero) {
					jsonGetAjax(basePath + '/house/keyadmin/cancelchangeshop.htm', {
						"id" : id
					}, function() {
						commonContainer.alert("操作成功");
						layer.close(index);
						jQuery('#J_dataTable')
						.bootstrapTable(
								'refresh');
					},{});
				}, 
				{
					area : '400px',
					btns : [ '确定', '取消' ]
				});
			}
		})
		
//领取人类型选中事件触发		
$('#J_receiveType').on("click",'input:radio[name=receiveType]',function(){
	if($(this).val()==2){
		$("#J_retreatuser_lable").css({"display":"block"});
		$("#J_auto").hide();
		$("#J_auto_none").show();
	}else if($(this).val()==3){
		$("#J_retreatuser_lable").css({"display":"block"});
		$("#J_auto").show();
		$("#J_auto_none").hide();
	}else{
		$("#J_retreatuser_lable").css({"display":"none"});
		$("#J_auto").hide();
		$("#J_auto_none").hide();
	}
});

//钥匙号修改
function updatekeycode(id,index,phshopid) {
	jsonAjax(basePath + '/house/keyadmin/updatekeycode.htm', {
		"id" : id,
		"keycode" : $("#up_keycode").val(),
		"phshopid" :phshopid,
	}, function() {
		commonContainer.alert("操作成功");
		layer.close(index);
		jQuery('#J_dataTable').bootstrapTable('refresh');
	}, {});
}