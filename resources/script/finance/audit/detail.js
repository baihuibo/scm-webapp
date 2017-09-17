var collectionId=getQueryString("collectionId");
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).attr("href");
    	var $ctrl = $('#ibox').controller();
    	var $scope = $('#ibox').scope();
        if(activeTab=='#tab-11'){
        	$ctrl.gatherinfo();
    		$scope.$digest();//外调ag的方法
        }else if(activeTab=='#tab-12'){
        	operration();
        }
});

/*$(document).delegate('#chequeCheckinTime','click',function(event){
	laydate({
		elem:'#chequeCheckinTime',
	    format:'YYYY-MM-DD',
	    min:laydate.now()
	});
})
$(document).delegate('#chequeReceiveTime','click',function(event){
	laydate({
		elem:'#chequeReceiveTime',
	    format:'YYYY-MM-DD',
	    min:laydate.now()
	});
})
$(document).delegate('#chequeConfirmTime','click',function(event){
	laydate({
		elem:'#chequeConfirmTime',
	    format:'YYYY-MM-DD',
	    min:laydate.now()
	});
})*/


function operration(){
	$('#J_operationtaTable').bootstrapTable({ 
		url:basePath + '/finance/audit/selectOperationLogList',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o={};
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			o.collectionId = collectionId;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount}
			}
			return { "rows": [], "total": 0 } 
		},
		columns:[
			      	{title: '序号', align: 'center',
			      		formatter: function (value, row, index) {  
                            return index+1;  
                        } 
			      	},
			      	{field: 'createByName', title: '操作人', align: 'center',
			      		formatter: function(value ,row, index){
 		      	    		var html='';
 		      	    		html='<a onclick="getUserStaffInfo('+row.createBy+')">'+row.createByName+'</a>'
 		      	    		return html;
 		      	    	}	
			      	},
			      	{field: 'createByPositionName', title: '岗位', align: 'center'},
			      	{field: 'belongDeptName', title: '所属部门', align: 'center'},
			      	{field: 'typeName', title: '操作类型', align: 'center'},
			      	{field: 'content', title: '操作内容', align: 'center'},
			      	{field: 'createTime', title: '操作时间', align: 'center'},
		],
	})
}
/*if($('#chequeReceiveTime')==''){
	$("#J_accept").show();
	$("#add").hide();
}

if($('#chequeReceiveTime')!=''){
	$("#J_accept").hide();
	$("#add").show();
}*/
