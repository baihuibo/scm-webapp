$(function () {
	// 初始化数据
	$("select").chosen({
		width : "100%"
	});
	initEvent();
	//让下拉菜单带搜索功能
	dimContainer.buildDimChosenSelector($("#operationtype"), "operationType", "");
	dimContainer.buildDimRadio($("#J_receiveType"), "receiveType", "receiveType", "");
})
	
function initEvent(){
	// 初始化盘点状态
	dimContainer.buildDimChosenSelector($("#J_type"), "checkType", "");
	
	// 初始化盘点时间
	$('#J_begindate').val(new Date().Format("yyyy-MM-dd"));
	$('#J_enddate').val(new Date().Format("yyyy-MM-dd"));
	var begindate = {
		elem: '#J_begindate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	enddate.min = datas;
	    	enddate.start = datas
	    }
	}
	
	var enddate = {
		elem: '#J_enddate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	begindate.max = datas
	    }
	}
	
	laydate(begindate);
	laydate(enddate);
	
	// 加载表格数据
	loadTableData();
	
}
	
// 按条件查询日盘点列表
$('#J_search').on('click', function(event) {
	searchTableData();
	jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/keyadmin/checkbutton.htm'});
});

function searchTableData() {
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/house/keyadmin/checkbutton.htm',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = $('#J_query').serializeObject();
			o.userid = currUserId;
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			return o;
		},
		responseHandler: function(result) {
			console.log(result.data);
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				// 当日盘点是否显示
				if (result.data.flag == true) {
					$('#J_manualCheck').hide();
				} else {
					if($('#J_manualCheck')){
						$('#J_manualCheck').show();
					}
					
				}
				return { "rows": result.data.checklist, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 }
		},
		columns: [
				    {field: 'inputdate', title: '盘点时间<br/>盘点状态', align: 'center',  formatter: function(value, row, index) {
				    	var html = '';
				    	/*var valus=value.substring(0,value.length-3);*/
			    		html += row.inputdate + '<br/>' + row.strtype;
			    		return html;
			    		
				    }},
				    {
				    	field: 'checkusername', title: '盘点人', align: 'center',
					    formatter: function(value ,row, index){
		      	    		var html='';
		      	    		if(row.checkusername){
		      	    			html+='<a onclick="getUserStaffInfo('+row.checkusersid+')">'+row.checkusername+'</a>'
		      	    		}else{
		      	    			html+='-'
		      	    		}
		      	    		return html;
			      	    }
				    },
				    {field: 'keynum', title: '在管钥匙数量', align: 'center'},
				    {field: 'inshopnum', title: '实际在店数量', align: 'center'},  
				    {field: 'lendnum', title: '借出未还数量', align: 'center'},
				    {field: 'waitchangeshopnum', title: '待转店确认数量', align: 'center'},
				    {field: 'memo', title: '备注', formatter: function(value, row, index) {
				    	/*var html = '';
				    	if(value==undefined || value==''){
				    		html+="-";
				    	}else{
				    		var memo = row.memo;
				    		html+='<div class="remark_twolines">'+row.memo+'</div>'*/
				    	var html = '';
	      				var memo = row.memo ? row.memo : '-'
	      				html ='<div class="text-left">'+memo+'</div>';
				    	//html+='<div class="remark_twolines">'+row.memo+'</div>'
			    		return html;
				    }},
				    {field: 'id', title: '操作', align: 'center', formatter: function(value, row, index) {
				    	var html = '';
				    	if($("#temp_view").val()!=undefined){
			    		html += '<div class="text-left"><a id="J_checkDetail" data-id="'+value+'" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">查看</a></div>';
				    	}
			    		return html;
				    }}
				]
	});
}
	
// 加载盘点数据
function loadTableData() {
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/house/keyadmin/checklistview.htm',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = $('#J_query').serializeObject();
			o.userid = currUserId;
			o.onepage = 0;
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data) {
				if (result.data.flag == true) {
					$('#J_manualCheck').hide();
				} else {
					if($('#J_manualCheck')){
						$('#J_manualCheck').show();
					}
					
				}
				return { "rows": result.data.checklist, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 }
		},
		columns: [
				    {field: 'inputdate', title: '盘点时间<br/>盘点状态', align: 'center',  formatter: function(value, row, index) {
				    	var html = '';
				    	/*var valus=value.substring(0,value.length-3);*/
			    		html += row.inputdate + '<br/>' + row.strtype;
			    		return html;
			    		
				    }},
				    {field: 'checkusername', title: '盘点人', align: 'center',
					    formatter: function(value ,row, index){
		      	    		var html='';
		      	    		if(row.checkusername){
		      	    			html+='<a onclick="getUserStaffInfo('+row.checkusersid+')">'+row.checkusername+'</a>'
		      	    		}else{
		      	    			html+='-'
		      	    		}
		      	    		return html;
			      	    }
				    },
				    {field: 'keynum', title: '在管钥匙数量', align: 'center'},
				    {field: 'inshopnum', title: '实际在店数量', align: 'center'},
				    
				    {field: 'lendnum', title: '借出未还数量', align: 'center'},
				    {field: 'waitchangeshopnum', title: '待转店确认数量', align: 'center'},
				    {field: 'memo', title: '备注', align: 'center',
					    formatter: function(value, row, index) {
					    	var html = '';
		      				var memo = row.memo ? row.memo : '-'
		      				html ='<div class="text-left">'+memo+'</div>';
				    		return html;
					    }
				    },
				    {field: 'id', title: '操作', align: 'center', formatter: function(value, row, index) {
				    	var html = '';
			    		html += '<div class="text-left"><a id="J_checkDetail" data-id="'+value+'" href="javascript:void(0);" class="btn btn-outline btn-success btn-xs">查看</a></div>';
			    		return html;
				    }}
				]
	});
}


// 查看盘点详情
$('#J_dataTable').delegate('#J_checkDetail', 'click', function(event){
	window.open(basePath + '/house/keyadmin/check_detail.htm?userid=' + currUserId + '&id=' + $(this).attr('data-id'));  
})

// 当日盘点
$("#J_manualCheck").click(function(){
	commonContainer.modal(
		'钥匙盘点信息',
		$('#J_check_manual'),
		function(index, layero) {
			addCheckManual(index);
		}, 
		{
			area : ['900px', '80%'],
			btns : [ '保存', '取消' ],
			overflow: true,
			success : function() {
				// 清空数据项
				$('#J_inshopnum').val('');
				$('#J_lendnum').val('');
				$('#J_waitchangeshopnum').val('');
				$('#J_memo').val('');
				// 加载页面
				loadTableDataDetail();
				
			}
		}
	);
})

// 保存当日盘点信息
function addCheckManual(index) {
	if($("#J_inshopnum").val().trim()==''){
		layer.alert("钥匙在店数量不能为空");
		return false;
	}else if(isNaN($("#J_inshopnum").val().trim())){
		layer.alert("钥匙在店数量须为数字");
		return false;
	}
	if($("#J_lendnum").val().trim()==''){
		layer.alert("钥匙借出数量不能为空");
		return false;
	}else if(isNaN($("#J_lendnum").val().trim())){
		layer.alert("钥匙借出数量须为数字");
		return false;
	} 
	if($("#J_waitchangeshopnum").val().trim()==''){
		layer.alert("待转店确认数量不能为空");
		return false;
	}else if(isNaN($("#J_waitchangeshopnum").val().trim())){
		layer.alert("待转店确认数量须为数字");
		return false;
	}
	
	
	var params = $('#J_form_add').serializeObject();
	jsonGetAjax(
		basePath + '/house/keyadmin/checkkeyinsert.htm',
		eval(params),
		function(result) {
			commonContainer.alert('保存成功');

			// 隐藏“当日盘点”按钮
			$('#J_manualCheck').hide();
			
			// 刷新列表数据
			$('#J_search').click();
		}
	);
	layer.close(index);
}


// 加载当日盘点页面列表
function loadTableDataDetail() {
	// 加载分页
	var totalcount = 0;
	$('#J_detail_dataTable').bootstrapTable({
		url: basePath + '/house/keyadmin/checkkeyview.htm',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = new Object();
			o.userid = currUserId;
			o.onepage = 0;
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			return o;
		},
		responseHandler: function(result) {
			console.log(result.data);
			if(result.code == 0 && result.data) {
				$('#J_phshopname').text(result.data.shopname?result.data.shopname:'-');
				$('#shopsid').val(result.data.shopsid);
				$('#J_checkusername').text(result.data.checkusername);
				$('#J_keynum').text(result.data.keynum);
				
				totalcount = result.data.keychecktrace.length;
				return { "rows": result.data.keychecktrace, "total": totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [
				    {field: 'houseid', title: '房源编号', align: 'center'},
				    {field: 'keycode', title: '钥匙编号', align: 'center'},
				    {field: 'strinfotype', title: '业务类型', align: 'center'},
				    {field: 'groupkeynum', title: '钥匙数量', align: 'center', formatter: function(value, row, index) {								
						var html='';
						html=value +'</br>'+row.keynum;
						return html;
				    }},
				    
				    {field: 'lendusername', title: '借钥匙人<br>借钥匙人电话', align: 'center', formatter: function(value, row, index) {								
						
				    	var html='';
				    	if(value==undefined){
				    		html="-";
				    	}else{
				    		var lendusertel = row.lendusertel;
				    		html=value +'</br>'+ lendusertel?row.lendusertel:'-';
				    	}
						return html;
						console.log(html);
				    }},
				    {field: 'lenddate', title: '借用时间', align: 'center'},
				    {field: 'strstatus', title: '钥匙状态', align: 'center'},
				    {field: 'opt', title: '备注', formatter: function(value, row, index) {
				    	var html = '';
				    	/*html+=value +'</br>'+ checktracememo?row.checktracememo:'-';*/
				    	var checktracememo = row.checktracememo ? row.checktracememo : '-'
				    	html+='<div class="text-left  remark_all">'+checktracememo+'</div>'
				    	/*if(value==undefined){
				    		html="-";
				    	}else{
				    		//var checktracememo = row.checktracememo;
				    		html=value +'</br>'+ checktracememo?row.checktracememo:'-';
				    	}*/
						
			    		return html;
				    }}
				]
	});
}
