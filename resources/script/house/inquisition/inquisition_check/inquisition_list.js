//初始化数据
$(function(){
	$("#inquState").val("1");
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	//业务类型 discountbusinesstype
	dimContainer.buildDimChosenSelector($("#J_housekInd"), "operationType","");
	$('#J_createSelect').on('click', function() {
		showDeptTree($('#J_groupid'),$("#J_grouplevel"));
	});
	searchContainer.searchUserListByComp($("#J_userId"), true);
	searchContainer.searchUserListByComp($("#J_fenpeirenId"), true);
	//审核状态；isPass
	dimContainer.buildDimChosenSelector($("#checkState"), "AuditType","");
	//dimContainer.buildDimChosenSelector($("#inquState"), "inquisitionType","");//实勘状态 
	//dimContainer.buildDimChosenSelector($("#checkState"), "DisposeStatus","");//审核状态 
	dimContainer.buildDimChosenSelector($("#checkResult"), "PassResult","");//审核结果
	
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
	
	$('#J_enddate').on('change', function() {
		starttime.max = '';
	})
	//$("#inquState").val("1");
});
function res(){
	$('.J_chosen').val('');	
	$('.J_chosen').trigger('chosen:updated');
	$("#inquState").val("1");
	$("#inquState").trigger('chosen:updated');
	$('#J_groupid').attr({'data-id':''});
	$('#J_fenpeirenId').attr({'data-id':''});
	$("#J_grouplevel").val("");
	$('#J_userId').attr({'data-id':''});
	console.log($("#inquState").val());
	
}
//按条件查询客源调配列表
var searchParam = null;
$('#J_search').on('click', function(event) {
	console.log($("#inquState").val());
	searchTableDatas();
	jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/house/inquisition/inqList'});
	searchParam = $('#J_query').serializeObject();
});

function searchTableDatas() {
	$('#J_dataTable_list').bootstrapTable({
		url: basePath + '/house/inquisition/inqList',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			if(o.userId){
			o.userId=$('#J_userId').attr('data-id');
			}
			if(o.fenpeirenId){
			o.fenpeirenId=$('#J_fenpeirenId').attr('data-id');
			}
			if(o.groupid){
				o.groupid = encodeURI($("#J_groupid").attr("data-id"))
			}
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'housesId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.housesId;
		           			//html='<a href="#">'+housesId+'</a>'
		           			var businessType=row.businessType;
		           			if(businessType=='租赁'){
		           				html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='买卖'){
		           				html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			return html;
		           			}
		           	},
		          	{field: 'inquId', title: '实勘编号', align: 'center',
		          		formatter: function(value, row, index){	
		           			var html='';
		           			var inquId=row.inquId;
		           			if($("#temp_check").val()!=undefined){
		           				html = '<a target="_blank" href="inqCheckPage.html?inquId='+inquId+'">'+inquId+'</a>';
		           			}else{
		           				html = inquId;
		           			}
		           			
		           			//html='<a href="#">'+inquId+'</a>'
		           			return html;
		           			}
		           	},
		            {field: 'uploadName', title: '上传人', align: 'center',
		           		formatter: function(value, row, index){	
		           			return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.uploadNameId+')">'+value+'</a>':'-';
		           			}
		           	},
				    {field: 'inquName', title: '实勘人', align: 'center',
		           		formatter:function(value,row){
							return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.inquNameId+')">'+value+'</a>':'-';
						}
		           	},
				    {field: 'uploadTime', title: '上传时间', align: 'center'},	    
				    {field: 'inquState', title: '实勘状态', align: 'center'},
				    {field: 'checkState', title: '审核状态', align: 'center'},
				    {field: 'checkResult', title: '审核结果', align: 'center'},
				  
				]
	});
}

//实勘结果批量上传模态框；
function view1() {
	layer.open({
		title : '实勘结果批量上传',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard'),
		area :   ['700px','520px'],
		btn : [ '确定'],
		yes : function(index, layero) {								
				jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/house/inquisition/inqList'});
				layer.close(index);
			}
			
		
	});	
};
$(document).delegate(
		'#J_del',
		'click',
		function(event) {
			view1();
		});

//实勘结果批量上传；
$(".up_btn").on("click",function(){
	
	//
	var upFile=$('#file1');
	upFile.off().click();
	upFile.off().on('change',function(){
		var upFileObj=this.files[0];
		//上传至文件服务器（获取文件路径）
		var formData=new FormData();
		formData.append('file',upFileObj);
		$.ajax({
			url: basePath+'/house/inquisition/excelUpload.htm',
		    type: 'POST',
		    async:false,
		    cache: false,
		    data: formData,
		    processData: false,
		    contentType: false,
		    dataType:'json',
		    success:function(result){
		    	if(result.code == '0'){
		    		var html='<div data-attachname='+result.data.filename+' data-attachurl="'+result.data.filepath+'"><span class="btn btn-green btn-bitbucket" onclick="tapeManagViseView.deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>'+result.data.filename+'</div>';
		    		$('#upFileList').append(html);
					$('#fileHidden').html('<input type="file" id="file1">');	//重置上传文件
					layer.alert(result.data);
		    	}else{
		    		layer.alert(result.msg);
		    	}
		    },
		    error:function(){
		    	layer.alert(errorMsg);
	    	}
		});
	});
	
})


//实勘结果批量下载；
$("#exceldown").on("click",function(){
	window.open(basePath + '/house/inquisition/downloadExcel',"_blank");
})

	






