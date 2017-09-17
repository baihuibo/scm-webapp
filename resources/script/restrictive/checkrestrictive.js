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
$(function() {
	
	
	
	var sHref = window.location.href;

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
			//createUserName
			$('#createUserName').text(result.data.createUserName);
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
			$('#lastApprovalUserName').text(result.data.lastApprovalUserId);
			//astApprovalDepartmentName
			$('#lastApprovalDepartmentName').text(result.data.lastApprovalDepartmentName);
			
			
		//核查按钮
			$(".pr5").hide();
			$(".sugges").hide();			
			if(result.data.isCanCheck){
				$(".pr5").show();
				$(".sugges").show();		
			}	
		},
		error : function() {
			layer.alert(errorMsg);
		}
	});

})


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
					return '<div style="text-align:left;" class="remark_all">'+value+'</div>';
				}
      	    },		      
	      	]
})
//核查通过
$(document).delegate(
		'#go',
		'click',
	      function(){
			//var newTab=window.open('about:blank');
			var sHref = window.location.href;
				//'http://local.cbs.bacic5i5j.com:8080/sales/restrictive/assignrestrictive.html?restrictiveId=7295'
				var args = sHref.split("?");
				var str = args[1];

				var str = args[1];
				args = str.split("&");
				var a1 = args[0];
				var id = a1.replace(/[^0-9]/ig, "");
				var remark=$('#remarks').val();
			if(remark==''){
				layer.alert('请输入审核意见');
				return false;
			}else{
				var data={};
				data.id=id;
				data.remark=remark;
				
				$.ajax({
	    			url: basePath+'/restrictive/appprovalreasonsrestrictive',
	    		    type: 'POST',
	    		   // contentType : 'application/json;charset=UTF-8',
	    		    contentType : 'application/json;charset=UTF-8',
	    		    data:JSON.stringify(data),
	    		    dataType:'json',
	    		    success:function(result){
	    	    		if(result.code==-1){
	    	    			layer.alert(errorMsg);
	    	    			return false;			
	    	    		}else if(result.code==0){
	    	    			commonContainer.closeWindow();
	    					window.opener.location.href = window.opener.location.href;//刷新父页面
	    	    		}
	    		    },
	    		    error:function(){
	    		    	layer.alert(errorMsg);
	    		    	return false;
	    	    	}
	    		});
			}
		
		}    
	
		
);
//不通过
$(document).delegate(
		'#no',
		'click',
	      function(){
			var sHref = window.location.href;
				//'http://local.cbs.bacic5i5j.com:8080/sales/restrictive/assignrestrictive.html?restrictiveId=7295'
				var args = sHref.split("?");
				var str = args[1];
				args = str.split("&");
				var a1 = args[0];
				var id = a1.replace(/[^0-9]/ig, "");
				var remark=$('#remarks').val();
			if(remark==''){
				layer.alert('请输入审核意见');
				return false;
			}else{
				var data={};
				data.id=id;
				data.remark=remark;
				$.ajax({
	    			url: basePath+'/restrictive/rejectreasonsrestrictive',
	    		    type: 'POST',
	    		   contentType : 'application/json;charset=UTF-8',
	    		   data:JSON.stringify(data),
	    		    dataType:'json',
	    		    success:function(result){
	    	    		if(result.code==-1){
	    	    			layer.alert(errorMsg);
	    	    			/*commonContainer.closeWindow()//关闭当前窗口
	    	    			window.opener.location.href = window.opener.location.href;//刷新父页面
*/	    	    			return false; 
	    	    		}else if(result.code==0){
//	    	    			window.open("restrictivelist.html");
	    	    			commonContainer.closeWindow()//关闭当前窗口
	    	    			window.opener.location.href = window.opener.location.href;//刷新父页面
	    	    		}
	    		    },
	    		    error:function(){
	    		    	layer.alert(errorMsg);
						//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
	    	    	}
	    		});
			}

		}    
	
		
);
  