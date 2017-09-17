// 初始化录入日期
var begindate = {
	elem: '#J_startcreatetime',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	enddate.min = datas;
    	enddate.start = datas
    }
}
var enddate = {
	elem: '#J_endcreatetime',  
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
    	begindate.max = datas
    }
}
laydate(begindate);
laydate(enddate);
//审核状态
dimContainer.buildDimChosenSelector($("#J_status"), "agreementauditstatus", "");

dimContainer.buildDimChosenSelector($("#J_contracttype"), "businessType","");

//显示部门树状结构
$('#J_deptSelect').on('click', function() {
	showDeptTree($('#J_deptName'), $('#J_deptLevel'),'');
});

$(document).delegate('#J_search', 'click', function(event){
    initListLoad();
    $('#J_dataTable_commission').bootstrapTable('refresh', {url: basePath + '/contract/discount/getList'});
});

$('#J_reset').on('click', function(event) {
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	enddate.min='';
	enddate.start='';
	begindate.max='';
	$('#J_signnumber').val('');
	$('#J_contractcode').val('');
	$('#J_startcreatetime').val('');
	$('#J_endcreatetime').val('');
	$('#J_housescode').val('');
	$('#J_customercode').val('');
	$('#J_deptName').val('');
	$('#J_deptName').attr("data-id","");
	$('#J_lowerdiscount').val('');
	$('#J_higherdiscount').val('');
	$('#J_ownername').val('');
	$('#J_customername').val('');
})	

/*
 * 刷新
 * */
$('#J_commission_refresh').on('click', function(event) {
	$('#J_dataTable_commission').bootstrapTable('refresh', {url: basePath + '/contract/discount/getList'});
})
//加载列表数据项
function initListLoad() {
	$('#J_dataTable_commission').bootstrapTable({
		//url: basePath + '/contract/discount/getList',
		sidePagination: 'server',
		dataType: 'json',
		method: 'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_contract_form').serializeObject();
			o.timestamp = new Date().getTime();
			/*o.userid = currUserId;*/
			if($("#J_contracttype_lease").is(':checked') && $("#J_contracttype_buy").is(':checked')) {
				o.contracttype = "1,2";
			}
			o.pageindex = params.offset / params.limit + 1,
			o.pagesize = params.limit;
			
			var deptid=$("#J_deptName").attr('data-id');
			if(deptid!=""){
				o.deptid = $("#J_deptName").attr('data-id');
			}else{
				o.deptid ="";
			}
			return o;
		},
		responseHandler: function (result) {
			if (result.code == 0 && result.data && result.data.totalcount > 0) {
				return {"rows": result.data.rows, "total": result.data.totalcount}
			}
			return {"rows": [], "total": 0}
		},
		columns: [
		          {field: 'contracttype', title: '业务类型', align: 'center'},
		          {field: 'signnumber', title: '单据编号', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var detailurl = basePath + '/contract/discount/detail?discountId=' + row.discountid;
		        		  var html = "";
		        		  html = '<a target="_blank" href="'+ detailurl +'" data-signnumber="'+ value +'">'+ value +'</a>';
		        		  return html;
		        	  }
		          },
		          {field: 'contractcode', title: '合同编号', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  var con_type=row.contracttype;
		        		  if(con_type=="租赁"){
		        			  html="<a href='"+basePath+"/sign/detail/detail.html?conid="+ row.conid +"&formal=true&other=true' target='_blank' data-contractcode='"+ value +"'>"+value+"</a>";
		        		  }else if(con_type="买卖"){
		        			  html="<a href='"+basePath+"/sign/signthecontract/contractdetail.html?conid="+ row.conid +"&other=true' target='_blank' data-contractcode='"+ value +"'>"+value+"</a>";
		        		  }
		        		  return html;
		        	  }
		          },
		          {field: 'names', title: '业主姓名<br/>客户姓名', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "<span class='blue_ath b_ath'>"+row.ownername + "</span><br/><span class='red_ath b_ath'>" + row.customername + "</span>";
		        		  return html;
		        	  }
		          },
		          {field: 'totaldiscount', title: '总折扣（折）', align: 'center'},
		          {field: 'deptname', title: '所属部门', align: 'center',
		        	  /*formatter: function(value, row, index) {
		        		  var html = '';
		        		  html='<div class="text-left">'+value+'</div>';
		        		  return html;
		        	  }*/
		          },
		          {field: 'createby', title: '录入人', align: 'center'},
		          {field: 'createtime', title: '录入日期', align: 'center'},
		          {field: 'auditstatus', title: '审核状态', align: 'center'}
	        ]
	});
}
