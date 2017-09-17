/*
 * 签约管理 -> 草签合同管理
 * athena
 * */
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
//草签合同状态 J_contractStatus
dimContainer.buildDimChosenSelector($("#J_contractStatus"), "DraftcontractStatus", "");
//草签审核状态 J_auditStatus
dimContainer.buildDimChosenSelector($("#J_auditStatus"), "signAuditStatus", "");

//显示部门树状结构
$('#J_deptSelect').on('click', function() {
	showDeptTree($('#J_deptName'), $('#J_deptLevel'),'');
});
$('#J_areaSelect').on('click', function() {
	showDeptTree($('#J_areaName'), $('#J_deptLevel'),'');
});
//小区名称
searchBuild($("#J_build_add"),true,'left');
//成交人
searchContainer.searchUserListByComp($("#J_sendee"), true);

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

/* 租赁草签合同列表 start */

$(document).delegate('#J_search', 'click', function(event){
    initialListLoad();
    //$('#J_lease_form').bootstrapTable('destroy');
    $('#J_dataTable_initial').bootstrapTable('refresh', {url: basePath + '/sign/lease/list'});
    
});
/*$('#J_search').on('click', function() {
	initialListLoad();
});*/

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
function initialListLoad(){
	$('#J_dataTable_initial').bootstrapTable({
		method: 'post',
		// url: basePath + '/sign/lease/list',
		sidePagination: 'server',
		dataType:'json',
		pagination: true,
		//singleSelect:true,		//设置单选
		//clickToSelect:true,		//点击选中行
		striped:true,
		pageSize:10,
		pageList:[10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_initialcontract_form').serializeObject();
			o.isDraft=1;//是否草签合同 1是 0否

			o.pageindex = params.offset / params.limit + 1,
			o.pagesize = params.limit;

            if (o.belongUserId) {
                o.belongUserId = $("#J_sendee").attr('data-id');
            }
			return o;
		},
        responseHandler: function (result) {
        	console.log(result.data);
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
                return {"rows": result.data.rows, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 0}
        },
		columns: [
		          {field: 'CON_ID', title: '检验编码', align: 'center'},
		          {field: 'CONTRACT_CODE', title: '合同编号', align: 'center',
		                formatter: function (value, row, index) {
		                	if(row.CURRENT_STEP==3){
		                		return '<a href="detail/detail.html?conid=' + row.CON_ID + '" target="_blank">' + value + '</a>';
		                	}else{
		                		return value;
		                	}
		                }
		          },
		          {field: 'names', title: '客户姓名<br/>业主姓名', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  html = '<span class="blue_ath">'+row.CUSTOMER_NAME +'</span><br/>';
		        		  html +='<span class="red_ath">'+row.OWNER_NAME +'</span><br/>';
		        		  return html;
		        	  }
		          },
		          {field: 'names', title: '客户佣金（元）<br/>业主佣金（元）', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  var cus_comm=row.CUSTOMER_COMMISSION==undefined?"-":row.CUSTOMER_COMMISSION;
		        		  var own_comm=row.OWNER_COMMISSION==undefined?"-":row.OWNER_COMMISSION;
		        		  html = '<span class="blue_ath J_list_customercount">'+cus_comm +'</span><br/>';
		        		  html +='<span class="red_ath J_list_ownercount">'+own_comm +'</span><br/>';
		        		  return html;
		        	  }
		          },
		          {field: 'RENT_STANDARD', title: '月租金（元）', align: 'center'},
		          {field: 'SHOP_NAME', title: '成交区/成交店', align: 'center'},
		          {field: 'USER_NAME', title: '成交人', align: 'center'},
		          {field: 'CRT_DTTM', title: '提交日期', align: 'center'},
		          {field: 'AUDIT_STATUS', title: '审核状态', align: 'center'},
		          {field: 'CONTRACT_STATUS', title: '合同状态', align: 'center'},
		          {field: 'CURRENT_STEP', title: '当前进度', align: 'center',
		        	  formatter: function (value, row, index) {
		        		  var html = "";
		        		  var lease_id=row.LEASE_CONTRACT_ID==undefined?"":row.LEASE_CONTRACT_ID;
		        		  if(row.CURRENT_STEP==1){
		        			  html='<a class="red_ath" href="create-sign-house-lease.html?conId=' + row.CON_ID + '&leaseContractId='+lease_id+'" target="_blank">' + value + '</a>/3';
		        		  }else if(row.CURRENT_STEP==2){
		        			  html='<a class="red_ath" href="create-sign-service-surrender.html?conId=' + row.CON_ID + '&leaseContractId='+lease_id+'" target="_blank">' + value + '</a>/3';		                		
		        		  }else{
		        			  html=value +'/3';
		        		  }
		        		  return html;
		        	  }		          
		          }
	        ],
	        onLoadSuccess:function(){
	        	settotalcount();
	        }
	});
}

/* 租赁草签合同列表 end */

/* 操作日志列表 start */
var tableData_operlog = [{
	"number" : "1",
	"operdept" : "南门仓店",
	"operperson" : "王五",
	"operdate" : "2016-09-17 08:18:00",
	"operstatus" : "新增",
	"opercontent" : ""
},{
	"number" : "2",
	"operdept" : "南门仓店",
	"operperson" : "王五",
	"operdate" : "2016-09-18 09:18:00",
	"operstatus" : "修改",
	"opercontent" : "修改房租：修改前3000元，修改后3500元"
}];

$('#J_dataTable_operlog').bootstrapTable({
	data : tableData_operlog,
	pagination: true
});
/* 操作日志列表 end */

/* 打印历史列表 start */
var tablecontractid_history = "<a href=\'\' class=\'J_houseid\'>Z000001</a>";
var dataTable_print = [{
	"number" : "1",
	"type" : "租赁合同",
	"contractid" : tablecontractid_history,
	"printdept" : "大望路店",
	"printperson" : "张三",
	"printtime" : "2017-04-16 12:00:00",
	"printnum" : "3"
},{
	"number" : "2",
	"type" : "补充协议",
	"contractid" : tablecontractid_history,
	"printdept" : "风控中心",
	"printperson" : "李四",
	"printtime" : "2017-04-16 12:00:00",
	"printnum" : "6"
}];


$('#J_dataTable_print').bootstrapTable({
	data : dataTable_print,
	pagination: true
});

/* 打印历史列表 end */

/* 审批流程列表 start */
var dataTable_examine = [{
	"processnum" : "1",
	"type" : "租赁",
	"examinedept" : "大望路店",
	"role" : "经纪人",
	"examineperson" : "张三",
	"examinetime" : "2016-09-17 08:18:00",
	"examineresult" : "提交",
	"examineopinion" : "请审批",
	"examineduration" : ""
},{
	"processnum" : "2",
	"type" : "租赁",
	"examinedept" : "分控中心",
	"role" : "店经理",
	"examineperson" : "李四",
	"examinetime" : "",
	"examineresult" : "",
	"examineopinion" : "",
	"examineduration" : "1天1h"
}];
$('#J_dataTable_examine').bootstrapTable({
	data : dataTable_examine,
	pagination: true
});
/* 审批流程列表 end */

/* 补充协议列表 start */
var dataTable_agreement = [{
	"number" : "1",
	"contractid" : "jzl0010",
	"type" : "租户以及物业交验类",
	"agreementid" : "L0001",
	"inputdept" : "大望路店",
	"inputperson" : "王五",
	"status" : "已审批 ",
	"latesttime" : "2016-08-17 08:18:00"
}];
$('#J_dataTable_agreement').bootstrapTable({
	data : dataTable_agreement,
	pagination: true
});
/* 补充协议列表 end */

/* 房屋交割清单列表 start */
/* 设备设施损赔 */
var tabledeviceopt='';
tabledeviceopt = '<div class="text-left">';
tabledeviceopt += '<a type="edit" data-id="1051904" class="btn btn-outline btn-success btn-xs" onclick="editdevice(\'edit\')">修改</a>&nbsp;&nbsp';
tabledeviceopt += '<a type="del" data-id="1051904" class="btn btn-outline btn-danger btn-xs">删除</a>';
tabledeviceopt += '</div>';

var dataTable_device = [{
	"devicename" : "电视机",
	"devicebrand" : "小米",
	"deviceunit" : "台",
	"devicenum" : "1",
	"deviceprice" : "2000",
	"deviceamount" : "1500",
	"deviceopt" : tabledeviceopt
}];
$('#J_dataTable_device').bootstrapTable({
	data : dataTable_device,
	pagination: true
});
/* 其他费用 */
var tableotheropt='';
tableotheropt = '<div class="text-left">';
tableotheropt += '<a type="edit" data-id="1051904" class="btn btn-outline btn-success btn-xs" onclick="editother(\'edit\')">修改</a>&nbsp;&nbsp';
tableotheropt += '<a type="del" data-id="1051904" class="btn btn-outline btn-danger btn-xs">删除</a>';
tableotheropt += '</div>';

var dataTable_others = [{
	"otheritem" : "电费",
	"otherunit" : "度",
	"otherprice" : "5.0",
	"othertime" : "1",
	"othernum" : "2000",
	"otheropt" : tableotheropt
}];
$('#J_dataTable_others').bootstrapTable({
	data : dataTable_others,
	pagination: true
});
/* 房屋交割清单列表 end */

/* 附件管理列表 start */
/*<th data-field="attachmentid"><input type="checkbox"/></th>
<th data-field="attachmenttype">附件类型</th>
<th data-field="uploaddate">上传日期</th>
<th data-field="uploadperson">上传人</th>
<th data-field="attachmentstatus">状态</th>
<th data-field="attachmentmemo">备注</th>
<th data-field="attachmentopinion">财务签收意见</th>
<th data-field="attachmentopt">操作</th>
*/
var tableattachmentopt="";
tableattachmentopt = '<div class="text-left">';
tableattachmentopt += '<a type="edit" data-id="1051904" class="btn btn-outline btn-success btn-xs">修改</a>&nbsp;&nbsp';
tableattachmentopt += '<a type="detail" data-id="1051904" class="btn btn-outline btn-success btn-xs" onclick="attachmentdetail()">查看</a>&nbsp;&nbsp';
tableattachmentopt += '<a type="check" data-id="1051904" class="btn btn-outline btn-success btn-xs" onclick="attachmentedit()">签收</a>&nbsp;&nbsp';
tableattachmentopt += '<a type="del" data-id="1051904" class="btn btn-outline btn-danger btn-xs">删除</a>';
tableattachmentopt += '</div>';

var tableattachmentreason="";
tableattachmentreason = '<a type="reason" class="btn btn-outline btn-danger btn-xs J_rejectreason" onclick="rejectreason(\'detail\')">驳回原因</a>';
var dataTable_attachment = [{
	"attachmentid" : "<input type='checkbox' />",
	"attachmenttype" : "客户身份证明",
	"uploaddate" : "2017-10-21 10:00",
	"uploadperson" : "张三",
	"attachmentstatus" : "已签收",
	"attachmentmemo" : "",
	"attachmentopinion" : "同意",
	"attachmentopt" : tableattachmentopt
},{
	"attachmentid" : "<input type='checkbox' />",
	"attachmenttype" : "业主身份证明",
	"uploaddate" : "2017-10-21 10:00",
	"uploadperson" : "张三",
	"attachmentstatus" : "已驳回",
	"attachmentmemo" : "",
	"attachmentopinion" : tableattachmentreason,
	"attachmentopt" : tableattachmentopt
}];
$('#J_dataTable_attachment').bootstrapTable({
	data : dataTable_attachment,
	pagination: true
});

/*
 * 驳回原因
 * */
function rejectreason(atype){
	commonContainer.modal('驳回原因', $('#J_rejectreason_layer'), function(index, layero) {
        },
	{
		overflow :true,
		area : ['85%', '80%'],
		btns : ['确定','关闭'],
		cancel : function(index, layerno) {
			layer.close(index);
			$('input:checkbox').each(function() {
		        $(this).attr('checked', false);
			});
		},
		success: function() {
			if(atype=='detail'){
				$(".J_reject_edit").hide();
				$(".J_reject_detail").show();
			}else if(atype=='edit'){
				$(".J_reject_detail").hide();
				$(".J_reject_edit").show();

			}
		}
	});
}


/*
 * 查看附件
 * */
function attachmentdetail(){
	commonContainer.modal('查看附件', $('#J_attachmentdetail_layer'), function(index, layero) {
		//确认 onclick
        },
	{
		overflow :true,
		area : ['85%', '80%'],
		btns : [],
		cancel : function(index, layerno) {
		},
		success: function() {
		}
	});
}
/*
 * 签收附件
 * */
function attachmentedit(){
	commonContainer.modal('签收附件', $('#J_attachmentdetail_layer'), function(index, layero) {
		//确认 onclick
		alert("check");
        },
	{
		overflow :true,
		area : ['85%', '80%'],
		btns : ['签收','驳回'],
		yes  : [rejectreason('edit')],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			/*//时间控件加载
	  		initsingletime();*/
		}
    });
}

/*
 * 上传附件
 * */
$(document).delegate('#J_add_attachment', 'click', function(event){
	commonContainer.modal('上传附件', $('#J_uploadattachment_layer'), function(index, layero) {

        },
	{
		overflow :true,
		area : ['900px', '80%'],
		btns : ['确认','取消'],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			/*//时间控件加载
	  		initsingletime();*/
		}
    });
});
/*function singlewatchadd(houseid,housekind){
	commonContainer.modal('添加空看', $('#J_editsinglewatch_layer'), function(index, layero) {
	    var leng = $("#seeListings tbody tr").length;
	    var goouttime=$('#J_singleouttime').val();
	    var expecttime=$('#J_singleestimatetime').val();
	    var filter_numbs = new Array();
 for(var i=0; i<leng; i++)
 {
 numberStr = $("#seeListings tbody tr").eq(i).find("td:first").html();
	        filter_numbs.push(numberStr);
	    }

	    if(goouttime=="" || expecttime==""){
	    	commonContainer.alert("时间不能为空");
	    }else{
	    	jsonGetAjax(
					basePath + '/house/singlewatch/insertemptylook',
					{
						houseids: filter_numbs.join(','),
						goouttime: goouttime,
						expecttime: expecttime
					},
 function (result) {
						layer.msg('添加空看成功！');
						layer.close(index);
 $("#J_search").trigger("click");
					},{});
	    }
 },
	{
		overflow :true,
		area : ['85%', '80%'],
		btns : ['确定','关闭'],
		cancel : function(index, layerno) {
			layer.close(index);
			$('input:checkbox').each(function() {
		        $(this).attr('checked', false);
			});
		},
		success: function() {

			 * 1 租赁 意向租金
			 * 2 买卖 委托价
			 * 为了区分两个列的title
 *

			//alert("添加空看时的housekind："+housekind);
			if(housekind==1){
				setsinglewatchlist1(houseid);
			}else{
				setsinglewatchlist2(houseid);
			}
			$('#J_singlewatch_addHouse').attr("onclick","singlewatch_addHouse("+housekind+")");

 //时间控件加载
	  		initsingletime();
		}
	});
}*/

/* 附件管理列表 end */

/*
 * 房屋交割单 编辑(添加及修改) start 
 * */
/* 设备设施状况及赔损 start */
function editdevice(devicetype){
	var dtype=devicetype=="add"?"添加":"修改";
	commonContainer.modal(dtype, $('#J_edit_device_layer'), function(index, layero) {
		if(devicetype=="add"){
			alert("添加");
		}else if(devicetype=="edit"){
			alert("修改");
		}
        },
	{
		overflow :true,
		area : ['80%', '60%'],
		btns : ['确认','取消'],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			if(devicetype=="add"){
				//添加操作
			}else if(devicetype=="edit"){
				//修改操作
				$("#J_devicename_edit").val("111");
				$("#J_devicebrand_edit").val("222");
				$("#J_deviceunit_edit").val("333");
				$("#J_devicenum_edit").val("444");
				$("#J_deviceprice_edit").val("555");
				$("#J_devicemount_edit").val("666");
			}
		}
    });
}
/* 设备设施状况及赔损 end */
/* 其他相关费用 start */
function editother(othertype){
	var otype=othertype=="add"?"添加":"修改";
	commonContainer.modal(otype, $('#J_edit_other_layer'), function(index, layero) {
		if(othertype=="add"){
			alert("添加");
		}else if(othertype=="edit"){
			alert("修改");
		}
        },
	{
		overflow :true,
		area : ['80%', '60%'],
		btns : ['确认','取消'],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			if(othertype=="add"){
				//添加操作
			}else if(othertype=="edit"){
				//修改操作
				$("#J_otheritem_edit").val("111");
				$("#J_otherunit_edit").val("222");
				$("#J_otherprice_edit").val("333");
				$("#J_othertime_edit").val("444");
				$("#J_othernum_edit").val("555");
			}
		}
    });
}
/* 其他相关费用 end */

/* 佣金折扣列表 start */
var tabledocumentid_commission = "<a href=\'\' class=\'J_documentid\'>ZK0001</a>";
var tablecontractid_commission = "<a href=\'\' class=\'J_contractid\'>E201703210001</a>";
var tablenames_commission = "<a href=\'\' class=\'J_ownername\'><strong>张先生</strong></a><br/><a href=\'\' class=\'J_customername\'><strong style=\'color:red;\'>赵先生</strong></a>";

var tableData_commission = [{
	"servicetype" : "买卖",
	"documentid" : tabledocumentid_commission,
	"contractid" : tablecontractid_commission,
	"names" : tablenames_commission,
	"discount" : "9.00",
	"belongdept" : "李绵组团1南新仓管理中心",
	"inputperson" : "tom4",
	"inputdate" : "2017-03-20",
	"auditstatus" : "签约中-待提交审批"
},{
	"servicetype" : "买卖",
	"documentid" : tabledocumentid_commission,
	"contractid" : tablecontractid_commission,
	"names" : tablenames_commission,
	"discount" : "9.00",
	"belongdept" : "李绵组团1南新仓管理中心",
	"inputperson" : "tom4",
	"inputdate" : "2017-03-20",
	"auditstatus" : "签约中-待提交审批"
},{
	"servicetype" : "租赁",
	"documentid" : tabledocumentid_commission,
	"contractid" : tablecontractid_commission,
	"names" : tablenames_commission,
	"discount" : "9.00",
	"belongdept" : "李绵组团1南新仓管理中心",
	"inputperson" : "tom4",
	"inputdate" : "2017-03-20",
	"auditstatus" : "签约中-待提交审批"
}];

$('#J_dataTable_commission').bootstrapTable({
	data : tableData_commission,
	pagination: true
});
/* 佣金折扣列表 end */
/* 草签合同管理列表 查询条件验证 */
// validate