/*
 * 签约管理 -> 租赁合同管理
 * 
 * */

//显示部门树状结构
$('#J_deptSelect').on('click', function() {
	showDeptTree($('#J_deptName'), $('#J_deptLevel'),'');
});
$('#J_areaSelect').on('click', function() {
	showDeptTree($('#J_areaName'), $('#J_deptLevel'),'');
});
// 初始化录入日期
var begindate = {
    elem: '#J_begindate',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate.min = datas;
    	enddate.start = datas
    },
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

//小区名称
searchBuild($("#J_build_add"),true,'left');
//成交人
searchContainer.searchUserListByComp($("#J_sendee"), true);
//合同状态 
dimContainer.buildDimChosenSelector($("#J_contractStatus"), "contractStatus", "");
//审核状态 
dimContainer.buildDimChosenSelector($("#J_auditStatus"), "formalAuditStatus", "");

$('#J_reset_lease').on('click', function() {
	setreset();
});
function setreset(){
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	enddate.min='';
	enddate.start='';
	begindate.max='';
	$("#J_contractCode").val("");
	$("#J_conId").val("");
	$("#J_begindate").val("");
	$("#J_enddate").val("");
	$("#J_ownerName").val("");
	$("#J_customerName").val("");
	$("#J_rentStandardBegin").val("");
	$("#J_rentStandardEnd").val("");
	$("#J_ownerCommissionBegin").val("");
	$("#J_ownerCommissionEnd").val("");
	$("#J_customerCommissionBegin").val("");
	$("#J_customerCommissionEnd").val("");
	//以下查询参数接口缺少参数
	$("#J_deptName").val("");
	$("#J_deptName").attr("data-id","");
	$("#J_sendee").val("");
	$("#J_area").val("");
	$("#J_area").attr("data-id","");
}



/*
 * 初始化表格
 * 详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
 * */

/* 租赁合同列表 start */
$(document).delegate('#J_search', 'click', function(event){
    initialListLoad();
    //$('#J_lease_form').bootstrapTable('destroy');
    $('#J_dataTable_lease').bootstrapTable('refresh', {url: basePath + '/sign/lease/list'});
});

function initialListLoad(){
	$('#J_dataTable_lease').bootstrapTable({
		method: 'post',
		//url: basePath + '/sign/lease/list',
		sidePagination: 'server',
		dataType:'json',
		pagination: true,
		//singleSelect:true,		//设置单选
		//clickToSelect:true,		//点击选中行
		striped:true,
		pageSize:10,
		pageList:[10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_contract_form').serializeObject();
			o.isDraft=0;//是否草签合同 1是 0否

            if (o.belongUserId) {
                o.belongUserId = $("#J_sendee").attr('data-id');
            }
			o.pageindex = params.offset / params.limit + 1,
			o.pagesize = params.limit;
			return o;
		},
        responseHandler: function (result) {
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
                return {"rows": result.data.rows, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 0}
        },
		columns: [
		          //{field: 'CON_ID', title: '检验编码', align: 'center'},
		          {field: 'CONTRACT_CODE', title: '合同编号', align: 'center',
		                formatter: function (value, row, index) {
		                	return '<a href="detail/detail.html?conid=' + row.CON_ID + '&formal=true" target="_blank">' + value + '</a>';
		                }},
		          {field: 'names', title: '客户姓名<br/>业主姓名', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  html = '<span class="blue_ath">'+row.CUSTOMER_NAME +'</span><br/>';
		        		  html +='<span class="red_ath">'+row.OWNER_NAME +'</span><br/>';
		        		  return html;
		        	  }
		          },
		          {field: 'names', title: '客户佣金<br/>业主佣金', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  var cus_comm=row.CUSTOMER_COMMISSION==undefined?"-":row.CUSTOMER_COMMISSION;
		        		  var own_comm=row.OWNER_COMMISSION==undefined?"-":row.OWNER_COMMISSION;
		        		  html = '<span class="blue_ath J_list_customercount">'+cus_comm +'</span><br/>';
		        		  html +='<span class="red_ath J_list_ownercount">'+own_comm +'</span><br/>';
		        		  return html;
		        	  }
		          },
		          {field: 'RENT_STANDARD', title: '月租金<br/>（元）', align: 'center'},
		          {field: 'SHOP_NAME', title: '成交区/成交店', align: 'center'},
		          {field: 'USER_NAME', title: '成交人', align: 'center'},
		          {field: 'CRT_DTTM', title: '提交日期', align: 'center'},
		          {field: 'AUDIT_STATUS', title: '审核状态', align: 'center'},
		          {field: 'CONTRACT_STATUS', title: '合同状态', align: 'center'}
	        ],
	        onLoadSuccess:function(){
	        	settotalcount();
	        }
	});
}

/*
 * 计算列表佣金
 * */
function settotalcount(){
	var ss1=$(".J_list_customercount");
	var val1=0;
	var ss2=$(".J_list_ownercount")
	var val2=0;
	
	for(var i=0;i<ss1.length;i++){
		var num=Number($(ss1[i]).html());
		if(!isNaN(num)){
		   val1 +=num;
			console.log(num);
		}
	}
	for(var i=0;i<ss2.length;i++){
		var num=Number($(ss2[i]).html());
		if(!isNaN(num)){
		   val2 +=num;
			console.log(num);
		}
	}
	$(".J_customercount_total").text(val1);
	$(".J_ownercount_total").text(val2);
	console.log(val1);
}
/* 租赁合同列表 end */