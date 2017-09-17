// 进入页面带出来的数据请求
$(function() {
	
	var sHref =window.location.href;
		//'http://local.cbs.bacic5i5j.com:8083/sales/customer/main/findbuyerclientbycustomerid.htm?inquId=4279003'
	

	var args = sHref.split("?");
	if (args[0] == sHref) {
		return retval;
	}

	var str = args[1];
	args = str.split("&");
	var a1 = args[0];
	var inquId = a1.replace(/[^0-9]/ig, "");
	try
	{
		readInq(inquId);
	}catch(err){
		
	}
	// alert(inquId);
	$.ajax({
		url : basePath + '/house/inquisition/inqCheck',
		type : 'GET',
		async : true,
		cache : false,
		data : {
			"inquId" : inquId
		},
		dataType : 'json',
		success : function(result) {
			console.log(result);
			$('#conmmunityName').text(result.data.housesInquBase.conmmunityName);
			$('#bookinTime').text(result.data.housesInquBase.bookinTime);
			$('#housesId').text(result.data.housesInquBase.housesId);
			$('#deptName').text(result.data.housesInquBase.deptName);
			$('#userName').text(result.data.housesInquBase.userName);
			$('#housesLayout').text(result.data.housesInquBase.housesLayout);
			$('#acreage').text(result.data.housesInquBase.acreage+"平方米");

			$('#inquName').text(result.data.housesInquBase.inquName);
			$('#uploadName').text(result.data.housesInquBase.uploadName);
			$('#uploadTime').text(result.data.housesInquBase.uploadTime);
			$('#uploadWay').text(result.data.housesInquBase.uploadWay);
			$('#imgNumTotal').text(result.data.housesInquBase.imgNumTotal);
			$('#comment').text(result.data.housesInquBase.comment);
			//根据业务类型，点击房源编号跳转页面
			var businessType=result.data.housesInquBase.businessType;
    		var housesId=$('#housesId').text()
    		if(businessType==1){
    			$('#housesId').attr('href','../../house/main/leasedetail.htm?houseid='+housesId+'')
    		}else{
    			$('#housesId').attr('href','../../house/main/buydetail.htm?houseid='+housesId+'')
    		}
			//staffId所属人id
    		$('#J_usid').val(result.data.housesInquBase.staffId);
			//请先添加实勘图片的页面跳转；
			$(document).delegate(
					'#add',
					'click',
					function(event) {
						var houseid=result.data.housesInquBase.housesId
						//alert(houseid);
						window.location.href="inqAddPage.html?housesId="+houseid;// 出现浏览器拦截现象
					});
	

		},
		error : function() {
			layer.alert(errorMsg);
		}
	});

})
//查看页面中的表格
function readInq(inquId){
		$('#J_dataTable_list').bootstrapTable(
					{
						url : basePath + '/house/inquisition/inqCheck',
						sidePagination : 'server',
						dataType : 'json',
						method : 'get',
						pagination : true,
						striped : true,
						pageSize : 10,
						pageList : [ 10, 20, 50 ],
						queryParams : function(params) {
							// alert(111);
							var o = {};

							o.inquId = inquId;
							return o;
						},
						responseHandler : function(result) {
							// alert(1);
							console.log(result.data.housesInquRecord);
							if(result.data.housesInquRecord){
								return {
									"rows" : result.data.housesInquRecord,
									"total" :result.data.housesInquRecord.length
								}
							}
							
							return {
								"rows" : [],
								"total" : 0
							}
						},
						columns : [ {
							field : 'operationTime',
							title : '操作时间',
							align : 'center'
						}, {
							field : 'operator',
							title : '操作人',
							align : 'center'
						}, {
							field : 'staffNo',
							title : '员工编号',
							align : 'center'
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




//过往实勘模态框；
function canclePast() {
	layer.open({
		title : '实勘管理',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard2'),
		area :   ['700px','548px'],
			
		
	});	
};
$(document).delegate(
		'#cancle_past',
		'click',
		function(event) {
			canclePast();
		});
//过往实勘模态框动态图片；
$(".inq_past_img").mouseover(function(){
	$(this).next().show();
})
$(".inq_past_img").mouseout(function(){
	$(this).next().hide();
})
$(".inq_past_sTitle").mouseover(function(){
	$(this).show();
})
$(".inq_past_sTitle").mouseout(function(){
	$(this).hide();
})


//后台获取数据(过往实勘)
$(function() {
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
	$.ajax({
		url : basePath + '/house/inquisition/inqHistory',
		type : 'POST',
		async : true,
		cache : false,
		data : {
			"inquId" : 4279117
		},
		dataType : 'json',
		success : function(result) {
			console.log(result.data);
			//console.log(result.data.length);
			
			for(var i=0;i<result.data.length;i++){
				var operateTime=result.data[i].operateTime;//操作时间
				var operateName=result.data[i].operateName;//操作人
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
					'</span>操作人：<a class="inq_past_time inq_past_name" href="javascript:;">'+operateName+
						'</a>'+
					'</p>'+
					'<p class="break-word">'+memo+'</p>'+
					'<ul class="inq_past_imglist">'+html2+'</ul>'+
				'</div>';
				
				$(".inq_past_box").append(html);
			};
			//$(".inq_past_box").append(inq_past_list);
			
			/*'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time">'+operateTime+
			'</span>操作人：<a class="inq_past_time inq_past_name" href="javascript:;">'+operateName+
				'</a>'
		'</p>'+
		'<p>'+memo+'</p>'+
		'<ul class="inq_past_imglist">'+'</ul>'*/
/*			var htmlh2='';
			for(var i=0;i<result.data.housesPicture.length;i++){
				console.log(result.data.housesPicture[i].pictureType);
				var imgDescribe=result.data.housesPicture[i].imgDescribe;
				var pictureId=result.data.housesPicture[i].pictureId;
				var pictureKey=result.data.housesPicture[i].pictureKey;
				var picturePath=result.data.housesPicture[i].picturePath;
				var pictureType= result.data.housesPicture[i].pictureType;
				if(pictureType==1){
					htmlh=htmlh+'<div class="out_img_deal" ><img src="'+picturePath+'"/>'+
					'<p  class="reported_out">'+imgDescribe+'</p>'+
					'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
					
				'</div>';
					//alert(htmlh);
				}else if(pictureType==2){
					htmlh2=htmlh2+'<div class="out_img_deal" ><img src="'+picturePath+'"/>'+
					'<p  class="reported_out">'+imgDescribe+'</p>'+
					'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
					
				'</div>';
				}
			}
			$(".img_outer2").append(htmlh);
			$(".img_ins2").append(htmlh2);*/
			/*commonHtml='<select name="guidstatus" class="J_chosen form-control" style="width:80%;height:20%;">'
	    		for(var i=0;i<result.data.length;i++){
	    			var pictureKey = $("option").attr('pictureKey');
	    			commonHtml+='<option pictureKey="'+result.data[i].pictureKey+'"  value="'+result.data[i].describe+'">'+result.data[i].describe+'</option>'
	    		}
	    		commonHtml+='</select>'*/
//			$('#inq_past_time').text(result.data.operateTime);
			//var html="";
/*			$.each(result.data,function(idx,obj){
				console.log(obj.memo);
				var operateTime=
				html+='<div class="inq_past_list">'+		
						'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time"></span>操作人：<span class="inq_past_time">李武</span></p>'+
						'<p>删除/上传实勘</p>'+
						'<ul class="inq_past_imglist">'+
							'<li>'+
								'<img class="inq_past_img" src="http://preview.quanjing.com/pm0015/pm0015-7378lp.jpg" />'+
								'<div class="inq_past_sTitle">户型图</div>'+
								'<p>删除了户型图</p>'+
							'</li>'+
						'</ul>'+
					'</div>'
			})*/
		},
		error : function() {
			layer.alert(errorMsg);
		}
	});
})

// 过往实勘模态框；
function pastView() {
	layer.open({
		title : '实勘管理',
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
$(document).delegate('#close', 'click', function(event) {
	window.close();
});

//后台获取数据(过往实勘)
$(function() {
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
			//console.log(result.data.length);
			
			for(var i=0;i<result.data.length;i++){
				var operateTime=result.data[i].operateTime;//操作时间
				var operateName=result.data[i].operateName;//操作人
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
					'</span>操作人：<a class="inq_past_time inq_past_name" href="javascript:;">'+operateName+
						'</a>'+
					'</p>'+
					'<p>'+memo+'</p>'+
					'<ul class="inq_past_imglist">'+html2+'</ul>'+
				'</div>';
				
				$(".inq_past_box").append(html);
			};
			//$(".inq_past_box").append(inq_past_list);
			
			/*'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time">'+operateTime+
			'</span>操作人：<a class="inq_past_time inq_past_name" href="javascript:;">'+operateName+
				'</a>'
		'</p>'+
		'<p>'+memo+'</p>'+
		'<ul class="inq_past_imglist">'+'</ul>'*/
/*			var htmlh2='';
			for(var i=0;i<result.data.housesPicture.length;i++){
				console.log(result.data.housesPicture[i].pictureType);
				var imgDescribe=result.data.housesPicture[i].imgDescribe;
				var pictureId=result.data.housesPicture[i].pictureId;
				var pictureKey=result.data.housesPicture[i].pictureKey;
				var picturePath=result.data.housesPicture[i].picturePath;
				var pictureType= result.data.housesPicture[i].pictureType;
				if(pictureType==1){
					htmlh=htmlh+'<div class="out_img_deal" ><img src="'+picturePath+'"/>'+
					'<p  class="reported_out">'+imgDescribe+'</p>'+
					'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
					
				'</div>';
					//alert(htmlh);
				}else if(pictureType==2){
					htmlh2=htmlh2+'<div class="out_img_deal" ><img src="'+picturePath+'"/>'+
					'<p  class="reported_out">'+imgDescribe+'</p>'+
					'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
					
				'</div>';
				}
			}
			$(".img_outer2").append(htmlh);
			$(".img_ins2").append(htmlh2);*/
			/*commonHtml='<select name="guidstatus" class="J_chosen form-control" style="width:80%;height:20%;">'
	    		for(var i=0;i<result.data.length;i++){
	    			var pictureKey = $("option").attr('pictureKey');
	    			commonHtml+='<option pictureKey="'+result.data[i].pictureKey+'"  value="'+result.data[i].describe+'">'+result.data[i].describe+'</option>'
	    		}
	    		commonHtml+='</select>'*/
//			$('#inq_past_time').text(result.data.operateTime);
			//var html="";
/*			$.each(result.data,function(idx,obj){
				console.log(obj.memo);
				var operateTime=
				html+='<div class="inq_past_list">'+		
						'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time"></span>操作人：<span class="inq_past_time">李武</span></p>'+
						'<p>删除/上传实勘</p>'+
						'<ul class="inq_past_imglist">'+
							'<li>'+
								'<img class="inq_past_img" src="http://preview.quanjing.com/pm0015/pm0015-7378lp.jpg" />'+
								'<div class="inq_past_sTitle">户型图</div>'+
								'<p>删除了户型图</p>'+
							'</li>'+
						'</ul>'+
					'</div>'
			})*/
		},
		error : function() {
			layer.alert(errorMsg);
		}
	});
})



//所属人模态框
$(document).delegate(
		'#userName',
		'click',
		function(event) {
			var userId = $('#J_usid').val();
			getUserStaffInfo(userId);
		}
	)
