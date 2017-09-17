var inquId=getQueryString('inquId');
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

// 实勘审核
// 模态框
/*

 */
//基础数据
searchContainer.searchUserListByComp($("#J_user"), true, 'right');
//实勘审核
function audit() {
	layer.open({
				title : '实勘审核',
				type : 1,
				shift : 1,
				skin : 'layui-layer-lan layui-layer-no-overflow',
				zIndex : 10,// 保证树在上面
				content : $('#demo_layer_audit'),
				area : [ '600px', '300px' ],
				btn : [ '确定' ],
				yes : function(index, layero) {
					if($('#auditOpinions').val()==''){
						//alert(1)
						layer.alert('请输入审核意见');
						return false;
					}
					var sHref = window.location.href;
						//'http://local.cbs.bacic5i5j.com:8083/sales/customer/main/findbuyerclientbycustomerid.htm?inquId=4279003'
					// window.location.href;
					var args = sHref.split("?");
					if (args[0] == sHref) {
						return retval;
					}
					var str = args[1];
					args = str.split("&");
					var a1 = args[0];
					var inquId = a1.replace(/[^0-9]/ig, "");
					var auditResult = $('input:radio[name="lists"]:checked')
							.val();
					var auditOpinions = $('#auditOpinions').val()
					$.ajax({
						url : basePath + '/house/inquisition/inqAudit',
						type : 'POST',
						async : true,
						cache : false,
						data : {
							"inquId" : inquId,
							"auditResult" : auditResult,
							"auditOpinion" : auditOpinions
						},
						dataType : 'json',
						success : function(result) {
//							console.log(result);
		    	    		if(result.code==1){
		    	    			layer.alert(result.data.describe);
		    	    		}else if(result.code==0){
		    	    			layer.msg("操作成功");
		    	    			/*jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/house/inquisition/inqAuditRecord'});*/
		    	    			window.location.reload();
		    	    		}
							
						},
						error : function(result) {

							layer.alert(errorMsg);
						}
					});
					layer.close(index);

				}

			});
};
$(document).delegate('#J_audit', 'click', function(event) {
	audit();
});
function init(inquId,housesId){
	//查看页面中的表格
	
	$('#J_dataTable_list').bootstrapTable(
				{
					url : basePath + '/house/inquisition/inqAuditRecord',
					sidePagination : 'server',
					dataType : 'json',
					method : 'post',
					pagination : true,
					striped : true,
					pageSize : 10,
					pageList : [ 10, 20, 50 ],
					queryParams : function(params) {
//						 alert(housesId);
						var o = {};
						o.pageindex = params.offset / params.limit+ 1;
						o.pagesize = params.limit;
						o.inquId = inquId;
						o.housesId=housesId;
						return o;
					},
					responseHandler: function(result){
						console.log(result.data)
						if(result.code == 0 && result.data && result.data.totalcount > 0) {
							return { "rows": result.data.list, "total": result.data.totalcount }
						}
						return { "rows": [], "total": 0 } 
					},
					columns : [ {
						field : 'operationTime',
						title : '操作时间',
						align : 'center'
					}, {
						field : 'operator',
						title : '操作人',
						align : 'center',
		      	    	formatter: function(value ,row, index){
		      	    		var html='';
		      	    		var operator=row.operator? row.operator:'-';
		      	    		if(operator!='-'){
		      	    			html='<a class="belongUser" attr="'+row.staffNo+'">'+operator+'</a>'
		      	    		}else{
		      	    			html='-';
		      	    		}
		      	    		return html;
		      	    	}
					}, {
						field : 'deptName',
						title : '所属部门',
						align : 'center'
					}, {
						field : 'operationContent',
						title : '操作内容',
						align : 'center'
					}

					]
				});
	
}
jQuery(document).delegate('.belongUser','click',function(event){
	getUserStaffInfo($(this).attr('attr'));
})
//编辑实勘页面跳转；
$(document).delegate(
		'#edit',
		'click',
		function(event) {
			var housesId=$('#housesId').text();
			window.location.href=basePath + '/house/inquisition/inqEditPage?inquId='+inquId+"&housesId="+housesId;
		});
//举报实勘页面跳转；
$(document).delegate(
		'#inform',
		'click',
		function(event) {
			var housesId=$('#housesId').text();
			window.location.href="/sales/house/inquisitionCtf/inqInformPage.html?inquId="+inquId+'&housesId='+housesId;// 出现浏览器拦截现象
		});
//取消实勘；
function view1() {
	layer.open({
		title : '取消实勘',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 100,// 保证树在上面
		content : $('#demo_layer2s'),
		area : [ '700px', '180px' ],
		btn : [ '确定' ],
		yes : function(index, layero) {
			layer.close(index);
			view2();
		}

	});
};
$(document).delegate('#cancle', 'click', function(event) {
	view1();
});
//请输入取消原因
function view2() {
	layer.open({
		title : '取消原因',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,// 保证树在上面
		content : $('#demo_layer_reson'),
		area : [ '700px', '220px' ],
		btn : [ '确定' ],
		yes : function(index, layero) {
			if($('#reason').val()==''){
				layer.alert('请输入取消原因');
				return false;
			}
			layer.close(index);
			var sHref =window.location.href;
			//'http://local.cbs.bacic5i5j.com:8080/sales/house/inquisition/inqHistory?inquId=4279003'
			var args = sHref.split("?");
			if (args[0] == sHref) {
				return retval;
			}
			var str = args[1];
			args = str.split('&');
			var a1 = args[0];
			var inquId = a1.replace(/[^0-9]/ig, "");
			var reason= $('#reason').val()
			$.ajax({
				url : basePath + '/house/inquisition/inqCancle',
				data : {
					inquId : inquId,
					reason :reason
				},
				type : 'post',
				dataType : 'json',
				cache : false,
				//contentType : "application/json ; charset=utf-8",
				success : function(result) {
					//alert(inquId);
					var sHref = window.location.href;
						//'http://local.cbs.bacic5i5j.com:8080/sales/house/inquisition/inqHistory?inquId=4279003'
						var args = sHref.split("?");
						if (args[0] == sHref) {
							return retval;
						}
						var str = args[1];
						args = str.split('&');
						var a1 = args[0];
						var inquId = a1.replace(/[^0-9]/ig, ""); 
						if(result.code==1){
							//弹出校验
	    	    			layer.alert(result.data.describe);
	    	    		} else if (result.code == '0') {
						
//						console.log(result)
						layer.msg("操作成功");
						//window.close();
						var housesId=result.data.housesId
						// window.location.href="inqCancleAfterPage.html";
						window.location.href="/sales/house/inquisition/inqAddPage.html?housesId="+housesId;// 出现浏览器拦截现象
						
	    	    	} 
				}
			})
		}

	});
};


// 过往实勘模态框；
function pastView() {
	$.ajax({
		url : basePath + '/house/inquisition/inqHistory',
		type : 'POST',
		async : true,
		cache : false,
		data : {
			"inquId" : inquId
		},
		dataType : 'json',
		success : function(result) {
			console.log(result.data);
			console.log(result.data.length);
			
			for(var i=0;i<result.data.length;i++){
				var operateTime=result.data[i].operateTime;//操作时间
				var operateName=result.data[i].operateName;//操作人
				var userId=result.data[i].userId//操作人id
				var memo//描述
				if(result.data[i].memo==undefined){
					memo='';
					
				}else{
					memo=result.data[i].memo;
				}
				var html2='';
				if(result.data[i].pictureList==undefined){
					 html2='';
				}else{
					for(var j=0;j<result.data[i].pictureList.length;j++){
						var pictureList = result.data[i].pictureList[j];
						if(pictureList.picturePath != undefined){
							var picturePath=pictureList.picturePath;
							var imgDescribe=pictureList.imgDescribe;
							html2=html2+ '<li>'+
											'<img class="inq_past_img" src="'+picturePath+'" />'+
											'<div class="inq_past_sTitle">'+'</div>'+
											'<p class="inq_past_title">'+imgDescribe+'</p>'+
										'</li>'
						}
					}
				}
			
				
				var html='<div class="inq_past_list">'+
					
					'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time">'+operateTime+
					'</span>操作人：<a id="userName2" class="inq_past_time inq_past_name" data-userid="'+userId+'" href="javascript:;">'+operateName+
						'</a>'+
					'</p>'+
					'<p class="break-word">'+memo+'</p>'+
					'<ul class="inq_past_imglist">'+html2+'</ul>'+
				'</div>';
				
				$(".inq_past_box").append(html);
			};

		},
		error : function() {
			layer.alert(errorMsg);
		}
	});
	layer.open({
		title : '过往实勘',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,// 保证树在上面
		content : $('#demo_layer_stantard1'),
		area : [ '700px', '548px' ],

	});
};
$(document).delegate('#past', 'click', function(event) {
	pastView();
});

	



// 过往实勘模态框动态图片；
$(".inq_past_img").mouseover(function() {
	$(this).next().show();
})
$(".inq_past_img").mouseout(function() {
	$(this).next().hide();
})
$(".inq_past_sTitle").mouseover(function() {
	$(this).show();
})
$(".inq_past_sTitle").mouseout(function() {
	$(this).hide();
})

/*实勘中变更实勘人模态框*/
//分配实勘人；
function inquese() {
	layer.open({
		title : '请选择实勘人',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#change_inquese'),
		area :   ['500px','320px'],
		btn : [ '确定'],
		yes : function(index, layero) {	
				var sHref = window.location.href;
				//'http://local.cbs.bacic5i5j.com:8083/sales/customer/main/findbuyerclientbycustomerid.htm?inquId=4279003'
			// window.location.href;
			var args = sHref.split("?");
			if (args[0] == sHref) {
				return retval;
			}
			var str = args[1];
			args = str.split("&");
			var a1 = args[0];
			var inquId = a1.replace(/[^0-9]/ig, "");
			/*var auditResult = $('input:radio[name="lists"]:checked')
					.val();*/
			var admeasureId = $("#J_user").attr("data-id");
			if(!admeasureId){
				layer.alert('请输入实勘人');
				return false;
			}
			//alert(admeasureId)
			//inquName实勘人
			//var admeasureId=$('#J_user').val()
			$.ajax({
				url : basePath + '/house/inquisition/admeasureInqu',
				type : 'POST',
				async : true,
				cache : false,
				data : {
					"inquId" : inquId,
					"admeasureId" : admeasureId
				},
				dataType : 'json',
				success : function(result) {
//					console.log(result);
    	    		if(result.code==1){
    	    			//layer.alert(errorMsg);
    	    			layer.alert(result.data.describe);
    	    			return false;
    	    		}else if(result.code==0){
    	    			layer.msg("操作成功");
    	    			window.location.href=window.location.href; 
    	    		}
				},
				error : function(result) {

					layer.alert(errorMsg);
				}
			});
			
				layer.close(index);
			}
			
		
	});	
};
$(document).delegate(
		'#inquese',
		'click',
		function(event) {
			inquese();
		});

//所属人模态框
/*$(document).delegate('#userName','click',
	function(event) {
		var userId = $('#J_usid').val();
		getUserStaffInfo(userId);
})*/
//所属人模态框<过往实勘>
$(document).delegate(
		'#userName2',
		'click',
		function(event) {
			var userId2 = $(this).attr('data-userid');
			getUserStaffInfo(userId2);
		}
	)	
	
