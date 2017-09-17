/*//核查部门选择模态框
function view_change() {
	layer.open({
		title : '核查部门选择',
		type : 1,
		shift : 1,
		zIndex: 9,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer'),
		area : ['600px','46%'],
		btn : [ '确定' ],
		yes : function(index, layero) {
			layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success:function (layero, index){
			
		}
		
	});
};
//绑定事件
$(document).delegate(
		'#department',
		'click',
	      function(index){
//			$('#demo_layer').show();
			
			view_change();
//			$('#layui-layer').hide();
//			layer.close(index);
		}    
	
		
);
*/
// 进入页面带出来的数据请求
var commonHtml;
var department='';
$(function() {
	
	
	
	var sHref = window.location.href;
		//'http://local.cbs.bacic5i5j.com:8080/sales/restrictive/assignrestrictive.html?restrictiveId=7294'
		//window.location.href;

		var args = sHref.split("?");
		if (args[0] == sHref) {
			return retval;
		}
			//		获取实勘编号
	var str = args[1];
	args = str.split("&");
	var a1 = args[0];
	var restrictiveId = a1.replace(/[^0-9]/ig, "");
	try
	{
		readInq(restrictiveId);
	}catch(err){
		
	}
	// alert(inquId);
	$.ajax({
		url : basePath + '/restrictive/editviewrestrictive',
		type : 'POST',
		async : true,
		cache : false,
		data : {
			"restrictiveId" : restrictiveId
		},
		dataType : 'json',
		success : function(result) {
			console.log(result);
			//进入页面列表的数据
			$('#id').text(result.data.id);
			//customerName
			$('#customerName').text(result.data.customerName);
			//customerTypeName
			$('#customerTypeName').text(result.data.customerTypeName);
			//businessTypeName
			$('#businessTypeName').text(result.data.businessTypeName);
			//houseCardTypeName
			$('#houseCardTypeName').text(result.data.houseCardTypeName);
			//houseCard
			$('#houseCard').text(result.data.houseCard);
			//idCardTypeName
			$('#idCardTypeName').text(result.data.idCardTypeName);
			//idCard 
			$('#idCard').text(result.data.idCard);
			//reasonDisplay 
			$('#reasonDisplay').text(result.data.reasonDisplay);
			//customerTelephone
			$('#customerTelephone').text(result.data.customerTelephone);
			//address 
			$('#address').text(result.data.address);
			//contractNo
			$('#contractNo').text(result.data.contractNo);
			//netContractRecordNo 
			$('#netContractRecordNo').text(result.data.netContractRecordNo);
			//commitTime 
			$('#commitTime').text(result.data.commitTime);
			//commitUserName 
			$('#commitUserName').text(result.data.commitUserName);
			//commitShopName 
			$('#commitShopName').text(result.data.commitShopName);
			//complainNo
			$('#complainNo').text(result.data.complainNo);
			//complainTime 
			$('#complainTime').text(result.data.complainTime);
			//createBy 
			$('#createBy').text(result.data.createBy);
			//createTime 
			$('#createTime').text(result.data.createTime);
			//stateName 
			$('#stateName').text(result.data.stateName);
			//lockName
			$('#lockName').text(result.data.lockName);
			//remark
			$('#remark').text(result.data.remark);
			//lastApprovalTime
			$('#lastApprovalTime').text(result.data.lastApprovalTime);
			//lastApprovalUserId
			$('#lastApprovalUserName').text(result.data.lastApprovalUserName);
			//astApprovalDepartmentName
			$('#lastApprovalDepartmentName').text(result.data.lastApprovalDepartmentName);
			
			//分派按钮
			$(".pr5").hide();
			$("#J_dataTable1").hide();			
			if(result.data.isCanAssign){
				$(".pr5").show();
				$("#J_dataTable1").show();		
			}	
			
			
			//分派表格；
			var assignReasons=result.data.assignReasons;
			
	    		for(var i=0;i<assignReasons.length;i++){
	    			var reasonId = $("td").attr('reasonId');
	    			
	    			//var gradeLevelId = $("span").attr('gradeLevelId');
	    			
	    			commonHtml+='<tr id="fenpai"><td reasonId="'+assignReasons[i].reasonId+'" >'+assignReasons[i].reason+'</td>'
	    			+'<td><a id="allot" onclick="view_change(this)"> 分配部门'+'</a></td>'
	    			+'<td><textarea maxlength="50" class="remark" rows="1">'+'</textarea></td></tr>'
	    			
	    		}
	    		
	    		//console.log(commonHtml)	
	    	$('#J_dataTable1').append(commonHtml);
	    	//分派弹框	
	    	var assignDepartments=result.data.assignDepartments;
	    		for(var i=0;i<assignDepartments.length;i++){
	    			var departmentId=$("input").attr('departmentId')
	    			department+='<input value="'+assignDepartments[i].departmentName+'" departmentId="'+assignDepartments[i].departmentId+'" id="J_checkall" name="list" type="checkbox" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	    			assignDepartments[i].departmentName+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'		
	    		}
	    		$('#fen').append(department);
			/*for(var i=0;i<result.data.assignReasons.length;i++){
			}*/
		},
		error : function() {
			layer.alert(errorMsg);
		}
	});

})
function view_change(target){
	layer.open({
		title : '选择分派部门',
		type : 1,
		shift : 1,
		zIndex: 9,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer'),
		area : ['600px','30%'],
		btn : [ '确定' ],
		yes : function(index, layero) {
			//console.log(target)
			if($("input[name='list']:checked").length==0){
				layer.alert('请选择分派部门');
				return false;
			}else{
				var _this=this;
				//jquery获取复选框值
				//$(this).empty();
					/*var chk_value =[];*/
					var str='';
					$('input[name="list"]:checked').each(function(){
					/*chk_value.push($(this).val());*/
						str+='<span attr='+$(this).attr('departmentid')+'>'+$(this).val()+'&nbsp;'+'</span>'
					});
//					console.log(str);
					target.innerHTML=str;
					//$(this).append(chk_value);
					//alert(chk_value);
					//_this.append(str)
			}
			
			//layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success:function (layero, index){
			  $("input:checkbox").removeAttr("checked"); 
		}
		
	});
};
//分派
//绑定事件
$(document).delegate(
		'#assign',
		'click',
	      function(index){
			
			var data={};
			
			//console.log(data.id)
			var htmlh=[];
			
			var len = ($('#J_dataTable1').find(" tbody tr").length);
			console.log(len)
			for(var j=0;j<len;j++){	
				var reasonId = $("#fenpai td").eq().attr("reasonid");
				var departmentIds = [];
				if($("tr").eq(j+1).children().eq(1).find("#allot span").length===0){
					layer.alert("请选择审核部门");
					return false;
				}
				for(var i=0;i<$("tr").eq(j+1).children().eq(1).find("#allot span").length;i++){
//					console.log($("tr").eq(j+1).children().eq(1).find("#allot span"))
					
					departmentIds.push($("tr").eq(j+1).children().eq(1).find("#allot span").eq(i).attr("attr"));
					
				}
				console.log($("#fenpai").eq(j))
				var obj={
						"departmentIds":departmentIds,
						"reasonId":$("tr").eq(j+1).children().eq(0).attr("reasonid"),
						"remark":$("tr").eq(j+1).children().eq(2).find(".remark").val(),
						
				};
				
				
				htmlh.push(obj); 
			}
			var sHref = window.location.href;
			//'http://local.cbs.bacic5i5j.com:8080/sales/restrictive/assignrestrictive.html?restrictiveId=7294'
			//window.location.href;

			var args = sHref.split("?");
			if (args[0] == sHref) {
				return retval;
			}
				//		获取实勘编号
		var str = args[1];
		args = str.split("&");
		var a1 = args[0];
		var restrictiveId = a1.replace(/[^0-9]/ig, "");
			data.id=restrictiveId;
			data.departmentReasons=htmlh;
			$.ajax({
    			url: basePath+'/restrictive/assignrestrictive',
    		    type: 'POST',
    		    contentType : 'application/json;charset=UTF-8',
    		    data:JSON.stringify(data),
    		    dataType:'json',
    		    success:function(result){
    		    	//alert(housesId)
//    	    		console.log(result);
    	    		//console.log(result.msg);
//    	    		console.log(result.code);
    	    		if(result.code==1){
    	    			layer.alert(result.data.describe);
    	    		}else if(result.code==0){
    	    			commonContainer.closeWindow();
    					window.opener.location.href = window.opener.location.href;//刷新父页面
    	    			
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
 //操作日志的表格
/*var sHref = 'http://local.cbs.bacic5i5j.com:8080/sales/restrictive/assignrestrictive.html?restrictiveId=7295'
			var args = sHref.split("?");
			var str = args[1];
//			args = str.split("&");
//			var a1 = args[0];
//			var inquId = a1.replace(/[^0-9]/ig, "");
//			//alert(inquId)
//			var housesId=$("#housesId").text();
			var str = args[1];
			args = str.split("&");
			var a1 = args[0];
			var restrictiveId = a1.replace(/[^0-9]/ig, "");
			try
			{
				readInq(restrictiveId);
			}catch(err){
				
			}
		//查看页面中的表格
			function readInq(inquId){
				$('#J_dataTable').bootstrapTable(
							{
								url : basePath + '/restrictive/editviewrestrictive',
								sidePagination : 'server',
								dataType : 'json',
								method : 'post',
								pagination : true,
								striped : true,
								pageSize : 10,
								pageList : [ 10, 20, 50 ],
								queryParams : function(params) {
//									 alert(housesId);
									var o = {};
									o.pageindex = params.offset / params.limit+ 1;
									o.pagesize = params.limit;
									o.restrictiveId = restrictiveId;
									
									return o;
								},
								responseHandler: function(result){
									//console.log(result.data)
									if(result.code == 0 && result.data && result.data.totalcount > 0) {
										return { "rows": result.data.list, "total": result.data.totalcount }
									}
									return { "rows": [], "total": 0 } 
								},
								columns : [ 
									{
										field : 'operateUserName',
										title : '操作人',
										align : 'center'
									}, 
									{
										field : 'jobName',
										title : '职位',
										align : 'center'
									}, 
									{
										field : 'departmentName',
										title : '所在部门',
										align : 'center'
									},
									{
										field : 'operateTime',
										title : '操作时间',
										align : 'center'
									},
									{
										field : 'operateDesc',
										title : '操作内容',
										align : 'center'
									}
								      
								]
							});
			}
	*/
function getUrlParams(name){
 	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return unescape(r[2]);
	}
	return null;
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
		o.restrictiveId = getUrlParams('restrictiveId');
//		o.timestamp = new Date().getTime();
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
					return '<div style="text-align:left;max-width:500px;"  class="remark_all">'+value+'</div>';
				}
      	    },		      
	      	]
})

  