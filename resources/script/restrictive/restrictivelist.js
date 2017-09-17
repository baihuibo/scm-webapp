$(function(){
	//禁用后退
	try {
		
		findPermission('SCM:HOUSE:RESTRICTIVE:MANAGER');
	}catch (e) {
		
	}
    $("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	$("#J_reset").on('click',function(){
		$('#J_reason').html("");
		$('#J_houseCard').removeAttr("disabled");
		$('#J_houseCardType').removeAttr("disabled");
		$('#J_houseCardType').trigger("chosen:updated");
		dimContainer1.buildDimChosenSelector1($("#J_reason"), "0","");//上榜原因
	})
	dimContainer.buildDimChosenSelector($("#J_clientType"), "clientType","");//客户类型
	dimContainer.buildDimChosenSelector($("#J_business"), "businessType","");//业务类型
	//dimContainer.buildDimChosenSelector($("#J_state"), "PassType","");//审批状态
	dimContainer.buildDimChosenSelector($("#J_restrictType"), "restrictType","");//限制性房客源状态
	dimContainer.buildDimChosenSelector($("#J_restrictCriteria"), "restrictCriteria","");//限制条件
	dimContainer.buildDimChosenSelector($("#J_cardType"), "cardType","");//证件类型
	dimContainer.buildDimChosenSelector($("#J_houseCardType"), "HousecertificateType","");//房产证件类型
	dimContainer1.buildDimChosenSelector1($("#J_reason"), "0","");//上榜原因
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
	});
	
	$(document).on("change",'#J_clientType',function(){
		if($(this).val()==1){
			$('#J_reason').html("");
			$('#J_houseCard').removeAttr("disabled");
			$('#J_houseCardType').removeAttr("disabled");
			$('#J_houseCardType').trigger("chosen:updated");
			dimContainer1.buildDimChosenSelector1($("#J_reason"), "1","");//上榜原因
		}else if($(this).val()==2){
			$('#J_reason').html("");
			$('#J_houseCard').attr({"disabled":"disabled"});
			$('#J_houseCardType').attr({"disabled":"disabled"});
			$('#J_houseCardType').trigger("chosen:updated");
			dimContainer1.buildDimChosenSelector1($("#J_reason"), "2","");//上榜原因
		}else if($(this).val()==''){
			$('#J_reason').html("");
			$('#J_houseCard').removeAttr("disabled");
			$('#J_houseCardType').removeAttr("disabled");
			$('#J_houseCardType').trigger("chosen:updated");
			dimContainer1.buildDimChosenSelector1($("#J_reason"), "0","");//上榜原因
		}
	})
/*	;
	$.ajax({
		url : basePath + '/restrictive/findusername ',
		type : 'GET',
		async : true,
		cache : false,
		dataType : 'json',
		success : function(result) {	
		var	msg= result.data;
			
		},
		error : function(result) {
			layer.alert(errorMsg);
		}
	});*/

//	initListLoad();
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/restrictive/findpagerestrictives',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_restrictiveform').serializeObject();
				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				console.log(result);
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[      
		      	    {field: 'id', title: '信息编号', align: 'center',
						formatter: function(value, row, index){	
		      				var html='';
		      				html='<a target="_blank" href="../restrictive/viewrestrictives.htm?id='+row.id+'">'+row.id+'</a>';
		      				return html;
		      	    	}
		      	    },
		      	    {field: 'customerName', title: '姓名', align: 'center'},
		      	    {field: 'customerTypeName', title: '客户类型', align: 'center'},
		      	    {field: 'businessTypeName', title: '业务类型',  align: 'center'},
		      	    {field: 'reasonDisplay', title: '上榜原因',  align: 'center',
		      	    	formatter:function(value){
							return '<div style="text-align:left;" class="remark_all">'+value+'</div>';
						}
		      	    },
		      	    {field: 'stateName', title: '审批状态',  align: 'center'},
		      	    {field: 'lockName', title: '限制性房客源状态',  align: 'center'},
		      	    {field: 'equityTypeName', title: '操作', align: 'center',
		      	    	formatter: function(value, row, index){	
		      				var html='';
		      				//console.log(row)
		      				if(row.isCanApproval){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../restrictive/approvalrestrictive.htm?id='+row.currentNodeId+'&reid='+row.id+'">审批</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanAssign){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../restrictive/assignrestrictive.htm?restrictiveId='+row.id+'">分派</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanEdit){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../restrictive/editrestrictive.htm?id='+row.id+'">修改</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanCancel){
		      					html+='<a type=\"repeal\" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs cancel">撤销</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanLock ){
		      					html+='<a type=\"amend\" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs lock">锁定</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanUnlock){
		      					html+='<a type=\"amend\" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs unlock">解锁</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanLockedEdit){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../restrictive/editagainrestrictive.htm?id='+row.id+'">修改</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanRecord){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs"  href="../restrictive/recordrestrictive.htm?id='+row.id+'">备案</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanSubmitAgain){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs" href="../restrictive/editrestrictive.htm?id='+row.id+'">修改</a>&nbsp;&nbsp;'
		      				}
		      				if(row.isCanCheck){
		      					html+='<a type=\"amend\" target="_blank" class="btn btn-outline btn-success btn-xs mt-3 m-r-xs"  href="../restrictive/checkrestrictive.htm?restrictiveId='+row.id+'">核查</a>'
		      				}
		      				
		      				return html;
		      	    	}
		      	    },
		      	]
		})
	}


	$('#J_dataTable').delegate('a','click',function(event){
		var num=$(this).parent().parent().children().eq(0).children().text();
		console.log(num)
		if(this.type=='repeal'){
			commonContainer.confirm(
				'确定执行撤销操作吗？',
				function(index, layero){
					var data={};				
					//alert(num)
					data.id=num;
					$.ajax({
		    			url: basePath+'/restrictive/cancelrestrictive',
		    		    type: 'POST',
		    		    contentType : 'application/json;charset=UTF-8',
		    		    data:JSON.stringify(data),
		    		    dataType:'json',
		    		    success:function(result){
		    		    	//alert(housesId)
		    	    		console.log(result);
		    	    		//console.log(result.msg);
		    	    		console.log(result.code);
		    	    		if(result.code==1){
		    	    			layer.alert(result.data.describe);
		    	    			
		    	    		}else if(result.code==0){
		    	    			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
		    	    			//commonContainer.closeWindow()
		    	    			//window.opener.location.href = window.opener.location.href;
		    	    		}
		    	    		//layer.msg("操作成功");
		    	    		//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
		    	    		
		    		    },
		    		    error:function(){
		    		    	layer.alert(errorMsg);
							//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
		    	    	}
		    		});
					layer.close(index);
				}
			)
		}
	})

})

window.dimContainer1 = {
	getDimReqUrl: function() {
		return basePath + '/restrictive/findrestrictivereasons';
	},
	buildDimChosenSelector1: function($container, keyCode, selectedValues) {
		// 初始化chosen控件
		commonContainer.initChosen($container);

		var that = this;
	    var options = [];
	    jsonPostAjax(that.getDimReqUrl(), {'customerTypeId':keyCode}, function(result) {
    		$.each(result.data, function(n, value) {
    	    	options.push('<option value="' + value.reasonId + '">' + value.reason + '</option>');
    	    })
    	    $container.append(options);

    		var selectedValueArr = selectedValues.split(',');
    		$container.val(selectedValueArr);
    		$container.trigger("chosen:updated");
		})
	},
}

//锁定
$(document).delegate('.lock','click',function(event){
	var num=$(this).parent().parent().children().eq(0).children().text();
		layer.open({
			title : ' ',
			type : 1,
			shift : 1,
			skin : 'layui-layer-lan layui-layer-no-overflow',
			zIndex: 10,
			content : $('#demo_layer_stantard_lock'),
			area :   ['300px','250px'],
			btn : [ '确定'],
			yes : function(index, layero) {
				var remark =$("#lock").val();
				if(remark==''){
					layer.alert('请输入锁定原因');
					return false;
				}
				var data={};
					data.id=num;
					data.remark=remark;
				$.ajax({
	    			url: basePath+'/restrictive/lockedrestrictive',
	    		    type: 'POST',
	    		    contentType : 'application/json;charset=UTF-8',
	    		    data:JSON.stringify(data),
	    		    dataType:'json',
	    		    success:function(result){
	    		    	//alert(housesId)
	    	    		console.log(result);
	    	    		//console.log(result.msg);
	    	    		console.log(result.code);
	    	    		if(result.code==1){
	    	    			layer.alert(result.data.describe);
	    	    		}else if(result.code==0){
	    	    			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
	    	    			//commonContainer.closeWindow()
	    	    			//window.opener.location.href = window.opener.location.href;
	    	    		}
	    	    		//layer.msg("操作成功");
	    	    		//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
	    	    		
	    		    },
	    		    error:function(){
	    		    	layer.alert(errorMsg);
						//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
	    	    	}
	    		});	
				layer.close(index);
					
			}							
	});	
})

//解锁

$(document).delegate('.unlock','click',function(event){
	var num=$(this).parent().parent().children().eq(0).children().text();
		layer.open({
			title : ' ',
			type : 1,
			shift : 1,
			skin : 'layui-layer-lan layui-layer-no-overflow',
			zIndex: 10,//保证树在上面
			content : $('#demo_layer_stantard_unlock'),
			area :   ['300px','250px'],
			btn : [ '确定'],
			yes : function(index, layero) {
				
				var remark =$("#unlock").val();
				if(remark==''){
					layer.alert('请输入解锁原因');
					return false;
				}
				var data={};
					data.id=num;
					data.remark=remark;
				$.ajax({
	    			url: basePath+'/restrictive/unlockedrestrictive',
	    		    type: 'POST',
	    		    contentType : 'application/json;charset=UTF-8',
	    		    data:JSON.stringify(data),
	    		    dataType:'json',
	    		    success:function(result){
	    		    	//alert(housesId)
	    	    		console.log(result);
	    	    		//console.log(result.msg);
	    	    		console.log(result.code);
	    	    		if(result.code==1){
	    	    			layer.alert(result.data.describe);
	    	    		}else if(result.code==0){
	    	    			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
	    	    			//commonContainer.closeWindow()
	    	    			//window.opener.location.href = window.opener.location.href;
	    	    		}
	    	    		
	    		    },
	    		    error:function(){
	    		    	layer.alert(errorMsg);
	    	    	}
	    		});	
				layer.close(index);
					
			}							
	});	
})




/*$(document).delegate(
		'.cancel',
>>>>>>> .r24791
		'click',
	      function(index){
			layer.alert('确认执行撤销操作吗')
			var data={};
			
			var num=$(this).parent().parent().children().eq(0).children().text();
			//alert(num)
			data.id=num;
			$.ajax({
    			url: basePath+'/restrictive/cancelrestrictive',
    		    type: 'POST',
    		    contentType : 'application/json;charset=UTF-8',
    		    data:JSON.stringify(data),
    		    dataType:'json',
    		    success:function(result){
    		    	//alert(housesId)
    	    		console.log(result);
    	    		//console.log(result.msg);
    	    		console.log(result.code);
    	    		if(result.code==1){
    	    			layer.alert(result.data.describe);
    	    		}else if(result.code==0){
    	    			$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagerestrictives' });
    	    			//commonContainer.closeWindow()
    	    			//window.opener.location.href = window.opener.location.href;
    	    		}
    	    		//layer.msg("操作成功");
    	    		//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
    	    		
    		    },
    		    error:function(){
    		    	layer.alert(errorMsg);
					//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
    	    	}
    		});	
		}    
	
		
);
*/



