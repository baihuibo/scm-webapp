$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	
	$('#J_resetblack').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})


	dimContainer.buildDimChosenSelector($("#isPass"), "blackAuditStatus","");
	dimContainer.buildDimChosenSelector($("#J_status"), "blackAuditStatus","");
	dimContainer.buildDimChosenSelector($("#infotype"), "businessType","");
	// 初始化录入日期
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
	
	// 查询操作
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/custom/black/listview.htm' });
		
	});
})
// 加载列表数据
var checkvals=[];
function initListLoad(){
	$('#J_dataTable').bootstrapTable({ 
		url:basePath + '/custom/black/listview.htm',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = jQuery('#J_black_form').serializeObject();
			o.timestamp = new Date().getTime();
			//o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			if(o.begindate) {o.begindate = encodeURI(o.begindate);}
			if(o.enddate) {o.enddate = encodeURI(o.enddate);}
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.black, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[
		           	{field: 'id',title :'序号',checkbox:true, align: 'center',
		           		formatter: function(value, row, index){	
		      				var html='';
		      				html='<input type="hidden" name="blackid" blackid="'+row.blackid+'" data-status="'+row.ispass+'"/>';
		      				return html;
		      	    	}
		           	 
		           	},
		      	    {field: 'info', title: '名单内容</br>信息编号', align: 'center',
		      	    	formatter: function(value, row, index){	
		      				var html='';
		      				html='电话：'+value +'</br>'+row.infotypename+'：'+row.infoid;
		      				return html;
		      	    	}
		           	},
		      	    {field: 'userid', title: '录入人</br>录入日期', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				var username = row.username ? row.username : '-'
		      				html = username +'</br>'+row.inputdate;
		      				return html;
		      	    	}
		           	},
		      	    {field: 'ispass', title: '审批状态</br>审批日期', align: 'center',
		      	    	formatter: function(value, row, index) {
		      	    		var html = '';
		      	    		if (value == '1') { // 已审批
		      	    			html = '已审批'+'</br>'+'<span class="color_red">'+row.passdate+'</span>';
		      	    		} else {
		      	    			html = '未审批';
		      	    		}
		      				return html;
		      	    	}
		           	},
		      	    {field: 'memo', title: '备注信息', align: 'center',
		           		formatter:function(value,row,index){
		           			var html = '';
		           			var memo = row.memo? row.memo : '';
		           			html+='<div class="remark_all text-left" >'+memo.encodeHTML()+'</div>'
		           			return html;
		           		}
		      	    },
		      	 	{field: 'opt', title: '操作', align: 'center', 
		      	    	formatter: function(value, row, index) {
		      		    	var html = '';
		      		    	var memo = row.memo? row.memo : '';
		      		    	html +='<div class="text-left">';
		      	    		html += '<a type=\"edit\" data-blackid="'+row.blackid+'" data-memo="'+memo.encodeHTML()+'" class=\"btn btn-outline btn-success btn-xs\">备注</a>&nbsp;&nbsp;'
		      	    		html += '<a type=\"del\" data-blackid="'+row.blackid+'" class=\"btn btn-outline btn-danger btn-xs\">删除</a>';
		      	    		html += '</div>';
		      	    		return html;
		      	    	}
		      	    }
		      	],
	})
}



/**
 * 编辑备注信息
 * 
 * @param obj
 * @returns
 */
$('#J_dataTable').delegate('a','click',function(event){
	if(this.type=='edit'){
		var old_memo = $(this).attr('data-memo');
		var blackid = $(this).attr('data-blackid')
		
		commonContainer.modal(
			'编辑备注信息', 
			$('#demo_layer'), 
			function(index, layero){
					var dataArr = [];
					var data = {};
					data['blackid'] = blackid;
					data['memo'] = $("#J_memo").val();
					dataArr.push(data);
					$.ajax({
						url : basePath + '/custom/black/updateinfo.htm',
						data : JSON.stringify(dataArr),
						type : 'post',
						dataType : 'json',
						cache : false,
						contentType : "application/json ; charset=utf-8",
						success : function(result) {
							if (result.code == '0') {
								layer.msg("修改成功");
								layer.close(index)
								jQuery('#J_dataTable').bootstrapTable('refresh');
							} else {
								layer.alert(result.msg);
							}
						}
					});
			}, 
			{
				'btns': ['确认','取消'],
				'success': function() {
					$("#J_memo").val(old_memo);
				}
			}
		) ;	
	}else if(this.type=='del'){
		var blackid = $(this).attr('data-blackid');
		
		commonContainer.confirm(
			'是否确认删除此条黑名单？',
			function(index, layero){
				jsonAjax(
					basePath + '/custom/black/delinfo.htm',
					{"blackid" : blackid},
					function(){
						layer.msg("删除成功");
						jQuery('#J_dataTable').bootstrapTable('refresh');
					}
				)
			}
		);
	}
})


$("#J_edit_status").on("click",function(){
	var currStatus = $('#J_status').val();
	if(currStatus==0 || currStatus==null){
		layer.alert("请选择审批状态");
		return false;
	}
	var inputName=$("input[name='blackid']").eq(0).prev().attr("name");
	
	if($("input[name="+inputName+"]:checked").length==0){  
		layer.alert("请选择需要修改审批状态的黑名单");
		return false;
	}
	var validArr = [];
	var invalidCount = 0;
	$("input[name="+inputName+"]:checked").each(function(){
		if($(this).next().attr("data-status") == currStatus){
			layer.alert("所选黑名单的状态至少有一个与修改状态相同，请重新选择");
			return false;
		}else{
			var validData = {};
			invalidCount++;
			validData.blackid = $(this).next().attr('blackid');
			validData.ispass = currStatus;
			validArr.push(validData);
		}
	})
	if(invalidCount==$("input[name="+inputName+"]:checked").length){
		commonContainer.confirm('确认是否修改吗?',function(index, layero){
			$.ajax({
				url : basePath + '/custom/black/updateinfo.htm',
				data : JSON.stringify(validArr),
				type : 'post',
				dataType : 'json',
				cache : false,
				contentType : "application/json ; charset=utf-8",
				success : function(result) {
					if (result.code == '0') {
						layer.msg("成功");
						jQuery('#J_dataTable').bootstrapTable('refresh');
					} else {
						layer.alert(result.msg);
					}
				}
			});
		});
	}
	
})


