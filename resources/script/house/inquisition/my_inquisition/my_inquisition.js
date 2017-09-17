//tab切换
$("#fist_1").on("click",function(){
	$('#first').css('display','block');
	$('#second').css('display','none');
	$('#third').css('display','none');
	$('#fourth').css('display','none');
});
$("#second_2").on("click",function(){
	$('#first').css('display','none');
	$('#second').css('display','block');
	$('#third').css('display','none');
	$('#fourth').css('display','none');
});
$("#third_3").on("click",function(){
	$('#first').css('display','none');
	$('#second').css('display','none');
	$('#third').css('display','block');
	$('#fourth').css('display','none');
});
$("#fourth_4").on("click",function(){
	$('#first').css('display','none');
	$('#second').css('display','none');
	$('#third').css('display','none');
	$('#fourth').css('display','block');
});


//初始化数据
$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	//基础数据
	//销售阶段
	dimContainer.buildDimChosenSelector($("#businessType"), "businesstype","");
	
	//客户评价
	//dimContainer.buildDimChosenSelector($("#J_finalassessmentid"), "finalAssessment","");
	//基础数据

});

//公客
function all(event){
	alert(2222222);
}

//按条件查询客源调配列表
//我当前的实勘

$('#J_search_now').on('click', function(event) {
	var searchParam = null;
	searchTableDatas();
	jQuery('#J_dataTable_list_now').bootstrapTable('refresh', {url: basePath + '/house/inquisitionMine/myCurrentInqui'});
	
	// 拼接查询条件
	//searchParam.belonguserid=$('#J_user').attr('data-id');
	
	searchParam = $('#J_query_now').serializeObject();
	
	//console.log(searchParam);
});

function searchTableDatas() {
	$('#J_dataTable_list_now').bootstrapTable({
		url: basePath + '/house/inquisitionMine/myCurrentInqui',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query_now').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.belonguserid=$('#J_user').attr('data-id');;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			//html='<a href="#">'+housesId+'</a>'
		           			return html;
		           			}
		           	},
		          	{field: 'inquId', title: '实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var inquId=row.inquId;
		           			html = '<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			return html;
		           			}
		           	},
				    {field: 'businessType', title: '业务类型', align: 'center'},
				   /* {field: 'reportName', title: '举报人', align: 'center'},	    
				    {field: 'coverReportName', title: '被举报人', align: 'center'},
				    {field: 'reportTime', title: '举报时间', align: 'center'},
				    {field: 'handleName', title: '处理人', align: 'center'},*/
				    {field: 'uploadTime', title: '操作时间', align: 'center'}
				    
				   
				]
	});
}

//按条件查询客源调配列表
//我举报的实勘

$('#J_search_report').on('click', function(event) {
	var searchParam = null;
	searchTableDatas_r();
	jQuery('#J_dataTable_list_report').bootstrapTable('refresh', {url: basePath + '/house/inquisitionMine/myReportInqui'});
	
	// 拼接查询条件
	//searchParam.belonguserid=$('#J_user').attr('data-id');
	
	searchParam = $('#J_query_report').serializeObject();
	
	//console.log(searchParam);
});

function searchTableDatas_r() {
	$('#J_dataTable_list_report').bootstrapTable({
		url: basePath + '/house/inquisitionMine/myReportInqui',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query_report').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.belonguserid=$('#J_user').attr('data-id');;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			//html='<a href="#">'+housesId+'</a>'
		           			return html;
		           			}
		           	},
		          	{field: 'inquId', title: '实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var inquId=row.inquId;
		           			html = '<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			return html;
		           			}
		           	},
		        	{field: 'coverReportNo', title: '举报编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var coverReportNo=row.coverReportNo;
		           			html = '<a target="_blank" href="/sales/house/inquisitionCtf/inqDetailPage.html?coverReportNo='+coverReportNo+'">'+coverReportNo+'</a>';
		           			//html='<a href="#">'+coverReportNo+'</a>'
		           			return html;
		           			}
		           	},
		            {field: 'reportTime', title: '举报时间', align: 'center'},
				    {field: 'reportStatus', title: '处理状态', align: 'center'},
				    {field: 'reason', title: '举报处理描述', align: 'center'},	    
				    {field: 'reportResult', title: '处理结果', align: 'center'},
				    {field: 'userName', title: '实勘人', align: 'center'},
				    {field: 'operationCol', title: '操作列', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var operationCol=row.operationCol;
		           			var coverReportNo=row.coverReportNo;
		           			html = '<a target="_blank" href="/sales/house/inquisitionCtf/inqCanclesPage.html?id='+coverReportNo+'">'+operationCol+'</a>';
		           			//html='<a href="#">'+operationCol+'</a>'
		           			return html;
		           			}
		           	}
				    
				   
				]
	});
}

//按条件查询客源调配列表
//被取消的实勘

$('#J_search_cancle').on('click', function(event) {
	var searchParam = null;
	searchTableDatas_c();
	jQuery('#J_dataTable_list_cancle').bootstrapTable('refresh', {url: basePath + '/house/inquisitionMine/myCancelInqui'});
	
	// 拼接查询条件
	//searchParam.belonguserid=$('#J_user').attr('data-id');
	
	searchParam = $('#J_query_cancle').serializeObject();
	
	//console.log(searchParam);
});

function searchTableDatas_c() {
	$('#J_dataTable_list_cancle').bootstrapTable({
		url: basePath + '/house/inquisitionMine/myCancelInqui',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query_cancle').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.belonguserid=$('#J_user').attr('data-id');;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			//html='<a href="#">'+housesId+'</a>'
		           			return html;
		           			}
		           	},
		          	{field: 'inquId', title: '实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var inquId=row.inquId;
		           			html = '<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			return html;
		           			}
		           	},
		           	{field: 'businessType', title: '业务类型', align: 'center'},
		            {field: 'operationTime', title: '操作时间', align: 'center'},
				   
				    {field: 'operationCol', title: '操作列', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var operationCol=row.operationCol;
		           			var inquId=row.inquId;
		           			html='<a id="cancle" href="#" onclick="canle('+inquId+')">'+operationCol+'</a>'
		           			return html;
		           			}
		           	}
				    
				   
				]
	});
}


//按条件查询客源调配列表
//被举报的实勘

$('#J_search_reported').on('click', function(event) {
	var searchParam = null;
	searchTableDatas_ted();
	jQuery('#J_dataTable_list_reported').bootstrapTable('refresh', {url: basePath + '/house/inquisitionMine/myCoverInqui'});
	
	// 拼接查询条件
	//searchParam.belonguserid=$('#J_user').attr('data-id');
	
	searchParam = $('#J_query_reported').serializeObject();
	
	//console.log(searchParam);
});

function searchTableDatas_ted() {
	$('#J_dataTable_list_reported').bootstrapTable({
		url: basePath + '/house/inquisitionMine/myCoverInqui',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query_reported').serializeObject();
			o.timestamp = new Date().getTime();
			o.userid = currUserId;
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			o.belonguserid=$('#J_user').attr('data-id');;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="http://local.cbs.bacic5i5j.com:8083/sales/house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			//html='<a href="#">'+housesId+'</a>'
		           			return html;
		           			}
		           	},
		          	{field: 'inquId', title: '实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var inquId=row.inquId;
		           			html = '<a target="_blank" href="/sales/house/inquisition/inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			return html;
		           			}
		           	},
		        	{field: 'coverReportNo', title: '举报编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var coverReportNo=row.coverReportNo;
		           			html='<a href="#">'+coverReportNo+'</a>'
		           			return html;
		           			}
		           	},
		            {field: 'reportTime', title: '举报时间', align: 'center'},
		            {field: 'reportResult', title: '处理结果', align: 'center'}
				   
				]
	});
}
//被取消的实勘；
function canle(inquId){
	//alert(inquId)
	$('#inquIds').text(inquId);
	pastView();
	$.ajax({
		url : basePath + '/house/inquisitionMine/queryCancleInqu',
		data : {
			inquId : inquId,
			
		},
		type : 'get',
		dataType : 'json',
		cache : false,
		contentType : "application/json ; charset=utf-8",
		success : function(result) {
			//alert(inquId);
			console.log(result)
			if (result.code == '0') {
				$('#comment').text(result.data.comment);
				$('#cancleReason').text(result.data.cancleReason);
				var htmlh='';
				var htmlh2='';
				for(var i=0;i<result.data.housesPicture.length;i++){
					console.log(result.data.housesPicture[i].pictureType);
					var imgDescribe=result.data.housesPicture[i].imgDescribe;
					var pictureId=result.data.housesPicture[i].pictureId;
					var pictureKey=result.data.housesPicture[i].pictureKey;
					var picturePath=result.data.housesPicture[i].picturePath;
					var pictureType= result.data.housesPicture[i].pictureType;
					if(pictureType==1){
						htmlh=htmlh+'<div class="out_img_deal" ><div class="out_imgDeal"><img class="upload_image1"  src="'+picturePath+'"/>'+
						'<p  class="reported_out">'+imgDescribe+'</p></div>'+
//						'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
						
					'</div>';
						//alert(htmlh);
					}else if(pictureType==2){
						htmlh2=htmlh2+'<div class="out_img_deal" ><div class="out_imgDeal"><img class="upload_image1" src="'+picturePath+'"/>'+
						'<p  class="reported_out">'+imgDescribe+'</p></div>'+
//						'<span  class="big glyphicon glyphicon-search"  >'+'</span>'+
						
					'</div>';
					}
				}
				$(".img_outer2").append(htmlh);
				$(".img_ins2").append(htmlh2);
				//layer.msg("操作成功");
				// window.location.href="inqCancleAfterPage.html";
				//window.open("inqCancleAfterPage.html?inquId="+inquId);// 出现浏览器拦截现象
			} else {
				layer.alert(result.msg);
			}
		}
	})
}
function pastView() {
	layer.open({
		title : '取消的实勘',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,// 保证树在上面
		content : $('#demo_layer_stantard1'),
		area : [ '800px', '548px' ],
		yes : function(index, layero) {
			layer.close(index);

		}

	});
};



//if($(".out_img").length>5){
	$(function(){
		//图片放大
		$('#apart_outer').imgZoom();
		$('#indoor_ins').imgZoom();
		//轮播
		  	$('.img_outer2').slider({
		  		prev_btn:'outerRight',
		  		next_btn:'outerLeft',
		  		count:1
		  	})
		  		$('.img_ins2').slider({
		  		prev_btn:'insRight',
		  		next_btn:'insLeft',
		  		count:1
		  	})
	 })
	
//}

