

//初始化所属人
searchContainer.searchUserListByComp($("#J_user"), true, 'left');

$(document).delegate(
		'#J_search',
		'click',
		function(event) {
			searchTableDatas();
			jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/performanceIncome/getExcelInfoByCondition'});
		});



function searchTableDatas(){
	$('#J_dataTable_list').bootstrapTable({
		url: basePath + '/performanceIncome/getExcelInfoByCondition',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.pageindex = params.offset/ params.limit + 1,
			o.pagesize = params.limit;
			if(o.createBy){
				o.createBy  = encodeURI($("#J_user").attr("data-id"))
			}
			return o;
		},
		responseHandler: function(result){
//			console.log(result.data);
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'index',title :'序号',align: 'center',
		           		formatter : function(value, row, index) {
							return index + 1;
						}
		           	},
		          	{field: 'createTime', title: '上传时间', align: 'center'},
		            {field: 'createByName', title: '上传人', align: 'center'},
		          	{field: '', title: '操作', align: 'center',
		            	formatter : function(value,row) {	
							return '<a download="" id="downloadfile" href="/sales/performanceIncome/fileDownload?fileUrl='+row.filePath+'&fileName='+encodeURI(encodeURI(row.fileName))+'">上传文件下载</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="/sales/performanceIncome/batchAdjustHisList.htm?createBy='+row.createBy+'&createTime='+row.createTime+'">查看导入明细</a>';
						}
		          	},
				]
	});
}

//初始化调整日期
var begindate = {
	elem : '#J_begindate',
	format : 'YYYY-MM-DD',
	istime : false,
	isclear: false,
	choose : function(datas) {
		enddate.min = datas;
		enddate.start = datas
	}
}

var enddate = {
	elem : '#J_enddate',
	format : 'YYYY-MM-DD',
	istime : false,
	isclear: false,
	choose : function(datas) {
		begindate.max = datas
	}
}

laydate(begindate);
laydate(enddate);

$('#J_enddate').on('change', function() {
	starttime.max = '';
})
$('#J_reset_buy').on('click', function(event) {
		$('.J_chosen').val('');		
		$('.J_chosen').trigger('chosen:updated'); 
		$('#J_user').val('');
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})	
/*
上传下载文件*/

/*$(document).delegate('#downloadfile', 'click', function(event) {
	var fileUrl=$(this).attr("url");
	var fileName=$(this).attr("name");

$.ajax({
	url : basePath + '/performanceIncome/fileDownload',
	data : {"fileUrl":fileUrl,"fileName":fileName},
	type : 'GET',
	cache : false,
	success : function(result) {	
		var Url=encodeURIComponent("/group1/M00/08/3F/CgIBEllkfgaActRyAABgAE19oB8890.xls");
		window.open( '/sales/performanceIncome/fileDownload?fileUrl='+Url+'&fileName='+fileName)
	}
});
})*/


document.onkeydown = function (e) {  
    if (!e) e = window.event;  
    if ((e.keyCode || e.which) == 13) {  
        var obtnLogin = document.getElementById("J_search");   //submit_btn为按钮ID  
        obtnLogin.focus();  
    }  
}  












