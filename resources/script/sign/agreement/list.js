// 初始化录入日期
var begindate = {
    elem: '#J_startcreatetime',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function (datas) {
        enddate.min = datas;
        enddate.start = datas
    },
}

var enddate = {
    elem: '#J_endcreatetime',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function (datas) {
        begindate.max = datas
    }
}
laydate(begindate);
laydate(enddate);

dimContainer.buildDimChosenSelector($("#J_businesstype"), "businesstype", "");
dimContainer.buildDimChosenSelector($("#J_auditstatus"), "agreementauditstatus", "");

//显示部门树状结构
$('#J_deptSelect').on('click', function () {
    showDeptTree($('#J_deptName'), $('#J_deptLevel'), '');
});

$('#J_reset').on('click', function (event) {
    reset();
})
/* 
 * 重置 
 * */
function reset() {
	enddate.min='';
	enddate.start='';
	begindate.max='';
	$(".J_chosen").val("");
	$(".J_chosen").trigger("chosen:updated");
	$("#J_signnumber").val("");
	$("#J_contractcode").val("");
	$("#J_startcreatetime").val("");
	$("#J_endcreatetime").val("");
	$("#J_housescode").val("");
	$("#J_customercode").val("");
	$("#J_deptName").val("");
	$('#J_deptName').attr("data-id", "");
	$("#J_ownername").val("");
	$("#J_customername").val("");
}
/*
 * 刷新
 * */

$('#J_agreement_refresh').on('click', function (event) {
    $('#J_dataTable_agreement').bootstrapTable('refresh', {url: basePath + '/contract/supplagrt/getList'});
    $("th[data-field='agrt_type']").css("width","200px");
})
/*
 * 新增
 * */
$(document).delegate('#J_agreement_add', 'click', function (event) {
    commonContainer.modal('新增补充协议', $('#J_agreementadd_layer'), function (index, layero) {
            var agrtType = $('#J_agreement_type :checked');
            var paymentType = $('#J_paymentType').val();
            if (!agrtType.length) {
                return layer.alert('请选择分类');
            }
            agrtType = agrtType.val();
            if (+agrtType === 2 && !paymentType) {
                return layer.alert('请选择适用场景');
            }

            var a = document.createElement('a');
            a.href = basePath + '/sign/agreement/agreement-edit.html?' + $.param({
                    agrtType: agrtType,
                    paymentType: paymentType || void 0
                });
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            layer.close(index);
        },
        {
            overflow: true,
            area: ['500px', '400px'],
            btns: ['确定', '取消'],
            success: function () {

            }
        }
    );
});
//$("input[name='rd']:checked").val();
//初始化表格
//详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
/*jQuery('#J_search').on('click', function (event) {*/
$(document).delegate('#J_search', 'click', function (event) {
    initListLoad();
    //$('#J_lease_form').bootstrapTable('destroy');
    $('#J_dataTable_agreement').bootstrapTable('refresh', {url: basePath + '/contract/supplagrt/getList'});
    $("th[data-field='agrt_type']").css("width","200px");
});

//加载列表数据项
function initListLoad() {
    $('#J_dataTable_agreement').bootstrapTable({
        //url: basePath + '/contract/supplagrt/getList',
        sidePagination: 'server',
        dataType: 'json',
        method: 'post',
        pagination: true,
        striped: true,
        pageSize: 10,
        pageList: [10, 20, 50],
        queryParams: function (params) {
            var o = jQuery('#J_agreement_form').serializeObject();
            /*o.timestamp = new Date().getTime();
             o.userid = currUserId;*/
            o.pageindex = params.offset / params.limit + 1,
                o.pagesize = params.limit;
            if (o.deptid) {
                o.deptid = $("#J_deptName").attr('data-id');
            }
            return o;
        },
        responseHandler: function (result) {
            console.log(result.data);
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
                return {"rows": result.data.rows, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 8}
        },
        columns: [
            {
                field: 'id', title: '序号', align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {	
            	field: 'agrt_type', title: '协议类型', align: 'center',
            	formatter:function(value,row,index){
            		var v_len=value.length
            		var html = "";
            		if(v_len>=32){
            			html=value.substring(0,29)+"...";
            		}else{
                        html = value;
            		}
                    return "<span class='agrtall' data-content='"+value+"'>"+html+"</span>";
            	}
            },
            {
                field: 'sign_number', title: '协议编号', align: 'center',
                formatter: function (value, row, index) {
                    var detailurl = basePath + '/sign/agreement/agreement-detail.html?supplAgrtId=' + row.suppl_agrt_id;
                    var html = "";
                    //$link.contextPath/contract/discount/detail?discountId=6
                    html = '<a href="' + detailurl + '" target="_blank">' + value + '</a>';
                    return html;
                }
            },
            {
                field: 'contract_code', title: '合同编号', align: 'center',
                formatter: function (value, row, index) {
                	var contractcode_url="";
                	var b_t=row.business_type;//业务类型
                	if(b_t==1 || b_t==3){//租赁 1,3
                		contractcode_url="<a href='"+basePath+"/sign/detail/detail.html?conid="+row.con_id+"&formal=true&other=true' target='_blank'>"+value+"</a>";
                	}else if(b_t==2 || b_t==4){//买卖 2,4
                		contractcode_url="<a href='"+basePath+"/sign/signthecontract/contractdetail.htm?conid="+row.con_id+"&other=true' target='_blank'>"+value+"</a>";
                	}
                    // html = '<a target="_blank" href="" data-contractcode="' + value + '">' + value + '</a>';
                    return contractcode_url;
                }
            },
            {
                field: 'names', title: '业主姓名<br/>客户姓名', align: 'center',
                formatter: function (value, row, index) {
                    var html = "<span class='blue_ath b_ath'>" + row.owner_name + "</span><br/><span class='red_ath b_ath'>" + row.customer_name + "</span>";
                    return html;
                }
            },
            {
                field: 'dept_name', title: '所属部门', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<div class="text-left">' + value + '</div>';
                    return html;
                }
            },
            {field: 'create_by_name', title: '录入人', align: 'center',
            	formatter: function (value, row, index) {
            		var html='';
            		html='<a onclick="getUserStaffInfo('+row.create_by_id+')">'+row.create_by_name+'</a>'
            		return html;
            	}
            },
            {field: 'create_time', title: '录入日期', align: 'center'},
            {field: 'current_approver', title: '当前审批人', align: 'center'},
            {field: 'audit_status', title: '审核状态', align: 'center'},
        ]
    });
}