 function getUrlParams(name){
     	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg);
 	if(r!=null){
 		return unescape(r[2]);
 	}
 	return null;
 }
 //模糊查询
 searchContainer.searchUserListByComp($("#J_revamp_nextAppvalUserId"), true);
 $.fn.serializeJson=function(){  
     var serializeObj={};  
     var array=this.serializeArray();  
     var str=this.serialize();  
     $(array).each(function(){  
         if(serializeObj[this.name]){  
             if($.isArray(serializeObj[this.name])){  
                 serializeObj[this.name].push(this.value);  
             }else{  
                 serializeObj[this.name]=[serializeObj[this.name],this.value];  
             }  
         }else{  
             serializeObj[this.name]=this.value;   
         }  
     });  
     return serializeObj;  
 };
 
$(function(){
	
	//获取基本信息
	window.onload=function(){
		$.ajax({
			url : basePath + '/restrictive/approvalnodeviewrestrictivenode ',
			data : {"approvalNodeId":getUrlParams('id')},
			type : 'post',
			dataType : 'json',
			cache : false,
			success : function(result) {	
//				console.log(result.data.restrictive)
				if (result.code == '0') {				
					for(var key in result.data.restrictive){
						if($("#App_"+key)){
							$("#App_"+key).text (result.data.restrictive[key]);
//							console.log(result.data[key])
						}			
					}
					//有值才赋值
					if(result.data.restrictive.nextNodeId&&result.data.restrictive.nextApprovalUserId&&result.data.restrictive.nextApprovalUserName){
						if(result.data.restrictive.nextNodeId==getUrlParams('id')){
							//相等时，是修改时的上一级人员
						}else{
							//退回当前节点，上一级人员
							$("#J_revamp_nextAppvalUserId").attr("data-id",result.data.restrictive.nextApprovalUserId);
							$("#J_revamp_nextAppvalUserId").val(result.data.restrictive.nextApprovalUserName);
							
						}
						
					}
					$(".btn-success").hide();
					$(".doshow").hide();
					if(result.data.restrictive.stateId=="1"){
							$("#next_submit").show();
							$("#first_submit").show();
							$("#last_submit").show();
							$(".doshow").show();
					}else if(result.data.restrictive.stateId=="4"&&result.data.restrictive.isCanApproval){
						if(result.data.restrictive.isCanBackPreviousNode){
							$("#next_submit").show();
							$("#prev_submit").show();
							$("#first_submit").show();
							$("#last_submit").show();
							$(".doshow").show();
						}else{
							$("#next_submit").show();
							$("#first_submit").show();
							$("#last_submit").show();
							$(".doshow").show();
						}
					}else if(result.data.restrictive.stateId=="3"){
						$(".chage-tit").text("退回审批");					
						$(".pr5").hide();
						$("#cancel_submit").show();
						$("#next_submit").show();
						$(".doshow").show();
					}
				} else {
					layer.alert(result.msg);
				}
			}
		});
		
		
	}
	//日志
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/restrictive/findpageoperatehistories ',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o ={};
				o.restrictiveId = getUrlParams('reid');
//				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[      
				        {field: 'operateUserName', title: '操作人', align: 'center'},		      	  
			      	    {field: 'jobName', title: '职务', align: 'center'},
			      	    {field: 'departmentName', title: '所在组店', align: 'center'},
			      	    {field: 'operateTime', title: '操作时间',  align: 'center'},
			      	    {field: 'operateDesc', title: '操作内容',  align: 'center',
			      	    	formatter:function(value){
								return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
							}
			      	    },		      
				      	]
		})
		

	
//交备案
	$("#last_submit").click(function(){
		var id=getUrlParams('id');
		var remark=$("#J_memo").val();
		if(remark==""){
			layer.alert("请添加审核意见");
			return false;
		}
		$.ajax({
			url : basePath + '/restrictive/approvaledrestrictive',
			type : 'post',
			async : true,
			dataType : 'json',
			cache : true,
			contentType : 'application/json;charset=UTF-8',		
			data:JSON.stringify({
				"id":id,
				"remark":remark
			}),
			success: function(result){
//				console.log(result)
				if (result.code=="0") {					
					commonContainer.closeWindow();
					window.opener.location.href = window.opener.location.href;//刷新父页面
	    			
				}else{
					layer.alert(result.msg);
				}
			},
			error : function() {				
				layer.alert(errorMsg);
			}
		})
	})
	

//返回上一级
	$("#prev_submit").click(function(){
		var id=getUrlParams('id');
		var remark=$("#J_memo").val();
		if(remark==""){
			layer.alert("请添加审核意见");
			return false;
		}
		$.ajax({
			url : basePath + '/restrictive/rejectedpreviousnoderestrictive',
			type : 'post',
			async : true,
			dataType : 'json',
			cache : true,
			contentType : 'application/json;charset=UTF-8',		
			data:JSON.stringify({
				"id":id,
				"remark":remark
			}),
			success: function(result){
//				console.log(result)
				if (result.code=="0") {
					commonContainer.closeWindow();
					window.opener.location.href = window.opener.location.href;//刷新父页面
	    			
				}else{
					layer.alert(result.msg);
				}
			},
			error : function() {				
				layer.alert(errorMsg);
			}
		})
	})
	
//返回申请人	
	$("#first_submit").click(function(){
		var id=getUrlParams('id');
		var remark=$("#J_memo").val();
		if(remark==""){
			layer.alert("请添加审核意见");
			return false;
		}
		
		$.ajax({
			url : basePath + '/restrictive/rejectedrestrictive',
			type : 'post',
			async : true,
			dataType : 'json',
			cache : true,
			contentType : 'application/json;charset=UTF-8',		
			data:JSON.stringify({
				"id":id,
				"remark":remark
			}),
			success: function(result){
//				console.log(result)
				if (result.code=="0") {
					commonContainer.closeWindow();
					window.opener.location.href = window.opener.location.href;//刷新父页面
	    			
				}else{
					layer.alert(result.msg);
				}
			},
			error : function() {				
				layer.alert(errorMsg);
			}
		})
	})
	
	
	//撤销按钮
	$("#cancel_submit").click(function(){
		var id=getUrlParams('id');
		var remark=$("#J_memo").val();
		if(remark==""){
			layer.alert("请添加审核意见");
			return false;
		}
		$.ajax({
			url : basePath + '/restrictive/cancelrestrictive',
			type : 'post',
			async : true,
			dataType : 'json',
			cache : true,
			contentType : 'application/json;charset=UTF-8',		
			data:JSON.stringify({
				"id":id,
				"remark":remark
			}),
			success: function(result){
//				console.log(result)
				if (result.code=="0") {					
					commonContainer.closeWindow()
					window.opener.location.href = window.opener.location.href;//刷新父页面
	    			
				}else{
					layer.alert(result.msg);
				}
			},
			error : function() {				
				layer.alert(errorMsg);
			}
		})
	})
	
//发送上级审批人
	$("#next_submit").click(function(){
		var id=getUrlParams('id');
		var remark=$("#J_memo").val();
		var nextAppvalUserId=$("#J_revamp_nextAppvalUserId").attr("data-id");
		if(remark==""){
			layer.alert("请添加审核意见");
			return false;
		}
		if($("#J_revamp_nextAppvalUserId").val()==""){
			layer.alert("请添加上级审批人");
			return false;
		}
		$.ajax({
			url : basePath + '/restrictive/approvaledneednextrestrictive',
			type : 'post',
			async : true,
			dataType : 'json',
			cache : true,
			contentType : 'application/json;charset=UTF-8',		
			data:JSON.stringify({
				"id":id,
				"nextApprovalUserId":nextAppvalUserId,
				"remark":remark
			}),
			success: function(result){
//				console.log(result)
				if (result.code=="0") {
					commonContainer.closeWindow();
					window.opener.location.href = window.opener.location.href;//刷新父页面sss				
				}else{
					layer.alert(result.msg);
				}
			},
			error : function() {				
				layer.alert(errorMsg);
			}
		})
	})	
	
//操作日志
	
	initListLoad();
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/restrictive/approvalnodeviewrestrictivenode',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o ={};
				o.approvalNodeId=getUrlParams('id');
				return o;
			},
//			 data:{"approvalNodeId":getUrlParams('id')},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0} 
			},
			columns:[      
		      	    {field: 'operateUserName', title: '操作人', align: 'center'},
		      	    {field: 'jobName', title: '职位', align: 'center',},
		      	    {field: 'departmentName', title: '所在组店',  align: 'center'},
		      	    {field: 'operateTime', title: '操作时间',  align: 'center'},
		      	    {field: 'operateDesc', title: '操作内容',  align: 'left'},
		      	]
		})
	
	}
	
//	

	
})