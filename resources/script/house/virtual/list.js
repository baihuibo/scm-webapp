searchContainer.searchUserListByComp($("#userid"), true);	//录入人
//searchDept($('#J_belongdeptName'), false, 'left');					//所属部门
//searchDept($('#J_inputdeptName'), false, 'left');					//录入部门
// 显示所属部门树状结构
$('#J_belongdeptSelect').on('click', function () {
    showDeptTree($('#J_belongdeptName'), $('#J_belongdeptLevel'), '');
});
//显示录入部门树状结构
$('#J_inputdeptSelect').on('click', function () {
    showDeptTree($('#J_inputdeptName'), $('#J_inputdeptLevel'), '');
});

$(function () {

    var last; // 判断事件间隔时间,用于文本框输入停止0.8s后触发事件

    $("select").chosen({
        width: "100%"
    });
    selectArealist($('#areaId'), '');// 区域
    dimContainer.buildDimCheckBoxHasAll($("#J_planningPurpose"), "planningPurposeIds", "plannedUses", "all","全部");//规划用途
    dimContainer.buildDimChosenSelector($("#housekind"), "businessType", "");//业务类型
    dimContainer.buildDimChosenSelector($("#virtualstatus"), "virtualStatus", "");//处理状态
    dimContainer.buildDimChosenSelector($("#housebustype"), "virtualHouseType", "");//类型

    //初始化表格
    //详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    $('#J_search').on('click', function (event) {
        $('#J_dataTable').bootstrapTable({
            url: basePath + '/house/virtual/selectvirtuallistbypage',
            sidePagination: 'server',
            dataType: 'json',
            method: 'post',
            pagination: true,
            striped: true,
            pageSize: 10,
            pageList: [10, 20, 50],
            queryParams: function (params) {
                var o = jQuery('#J_lease_form').serializeObject();
                // var dataid = $('#J_takekeyuser').attr('data-id');
                o.pageindex = params.offset / params.limit + 1;
                o.pagesize = params.limit;
                o.userid = $('#userid').attr('data-id');
                o.belongshopid = $('#J_belongdeptName').attr('data-id');
                o.registershop = $('#J_inputdeptName').attr('data-id');

                return o;
            },
            responseHandler: function (result) {
                if (result.code == 0 && result.data && result.data.totalcount > 0) {
                    return {"rows": result.data.list, "total": result.data.totalcount}
                }
                return {"rows": [], "total": 0}
            },
            columns: [
                {field: 'housesid', title: '房源编号', align: 'center',width:'2%',
                    formatter: function (value, row, index) {
                    	if(row.virtualstatus=="完结"){
                    		if(row.housekind==1){
                    			return "<a target='_blank' href='../main/leasedetail.htm?houseid=" + row.housesid + "'>" + row.housesid + "</a>";
                    		}else{
                    			return "<a target='_blank' href='../main/buydetail.htm?houseid=" + row.housesid + "'>" + row.housesid + "</a>";
                    		}
                    	}else{
                    		return "<a target='_blank' href='../virtual/detail.htm?houseid=" + row.housesid + "&type=" + row.housekind + "'>" + row.housesid + "</a>";
                    	}
                    }
                },
                {field: 'virtualstatus', title: '虚拟房源状态', align: 'center',width:'2%',},
                {field: 'housekindstr', title: '业务类型', align: 'center',width:'2%',},
                {field: 'guihuayongtu', title: '规划用途', align: 'center',width:'2%',},
                {field: 'areaname', title: '区域', align: 'center',width:'3%',},
                {field: 'conmmunityname', title: '楼盘名', align: 'center',width:'5%'},
                {field: 'louhao', title: '栋座', align: 'center',width:'2%'},
                {field: 'danyuan', title: '单元', align: 'center',width:'2%'},
                {field: 'loucen', title: '楼层', align: 'center',width:'2%'},
                {field: 'menpaihao',title: '门牌号',align: 'center',width:'2%'},
                {field: 'belongshopname', title: '所属部门', align: 'center',width:'10%'},
                {field: 'deptname', title: '录入部门', align: 'center',width:'10%'},
                {
                    field: 'username',
                    title: '录入人',
                    align: 'center',width:'2%',
                    formatter: function (value, row, index) {
                        return '<a href="javascript:" onclick="getUserStaffInfo(\'' + row.userid + '\')">' + row.username + '</a>';
                    }

                },
                {field: 'bookintime', title: '录入时间', align: 'center',width:'10%'},
                {
                    field: 'opt', title: '操作',
                    align: 'center',width:'10%',
                    formatter: function (value, row, index) {
                        var html = "";

                        var btnProcess = formatButton("JavaScript:doProcess(" + row.housesid + ")", "处理中");
                        var btnRelevance = formatButton("JavaScript:doRelevance(" + row.housesid + "," + row.housekind + ")", "关联楼盘");
                        var btnReject = formatButton("JavaScript:doReject(" + row.housesid + ")", "驳回");
                        var btmCancel = formatButton("JavaScript:doCancel(" + row.housesid + "," + row.housekind + ")", "取消关联");
                        var btmUp = formatButton("JavaScript:doRelevance(" + row.housesid + "," + row.housekind + ")", "重新关联");
                        if($("#temp_process").val()==undefined){
                        	btnProcess='';
                        }
						if($("#temp_associated").val()==undefined){
							btnRelevance='';               	
						                        }
						if($("#temp_reject").val()==undefined){
							btnReject='';
						}
						if($("#temp_cancelassociation").val()==undefined){
							btmCancel='';
						}
						if($("#temp_reassociation").val()==undefined){
							btmUp='';
						}
                        if (row.virtualstatus == "待处理") {
                            html = btnProcess + btnReject;
                        } else if (row.virtualstatus == "处理中") {
                            html = btnRelevance + btnReject;
                        } else if (row.virtualstatus == "完结") {
                            /*html = btmCancel;*/
                        	html=btmUp;
                        } else {
                            html = "-"
                        }
                        return html;
                    }
                }
            ]
        });
        $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/virtual/selectvirtuallistbypage'});
    });

    $("#guihuayongtu").click(function () {
        $('input[name="planningPurposeIds"]').prop("checked", this.checked);
        var $demandTypeall = $("input[name='planningPurposeIds']");
        $("input[name='planningPurposeIds']").click(function () {
            $("#J_demandTypeall").prop("checked", $demandTypeall.length == $("input[name='planningPurposeIds']:checked").length ? true : false);
        });

    });

    $('#J_reset_lease').on('click', function (event) {
        $('#J_inputdeptName').attr("data-id", "");
        $('#J_belongdeptName').attr("data-id", "");
        $('.J_chosen').val('');
        $('.J_chosen').trigger('chosen:updated');
    })

    function formatButton(href, text) {
        return "<a href=" + href + " data-opt=\'Inquire\' class=\'btn btn-outline btn-success btn-xs mt-3\' data-node=\'#node#\'>" + text + "</a>&nbsp;&nbsp";
    }
});

/**
 * 更新状态为处理中
 * @param houseId
 */
function doProcess(hoursesId) {
    commonContainer.confirm('是否确认将此虚拟楼盘的状态改为处理中？', function (index, layero) {

        $.ajax({
            url: basePath + '/house/virtual/updatestatustoprocess',
            data: {hoursesId: hoursesId},
            type: 'get',
            dataType: 'json',
            cache: false,
            contentType: "application/json ; charset=utf-8",
            success: function (result) {
                if (result.code == '0') {
                    layer.msg("更新状态成功");
                    layer.close(index);
                    jQuery('#J_dataTable').bootstrapTable('refresh');
                } else {
                    layer.alert(result.msg);
                }
            }
        });
    });
}

/**
 * 驳回
 * @param houseId
 */
function doReject(hoursesId) {
    commonContainer.modal(
        "虚拟楼盘驳回",
        $('#J_reject'), // 弹出窗口ID
        function (index, layero) {
            var rejectReason = $('#rejectReason').val();

            if (rejectReason == '') {
                commonContainer.alert('请输入驳回原因！');
                return;
            }
            jsonGetAjax(
                basePath + '/house/virtual/updatestatustoreject',
                {hoursesId: hoursesId, rejectReason: rejectReason},
                function (result) {
                    if (result.code == '0') {
                        layer.msg("驳回成功");
                        layer.close(index);
                        $('#rejectReason').val('');
                        jQuery('#J_dataTable').bootstrapTable('refresh');
                    } else {
                        layer.alert(result.msg);
                    }
                }
            )
        },
        {btns: ['确定', '取消']}
    )
}

/**
 * 关联ID
 * @param houseId
 */


$(document).on("change",'#J_building',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#unit"),1,val,'');
    findbuildinglist($("#floor"),2,'','');
    findbuildinglist($("#houseNumber"),3,'','');
})
$(document).on("change",'#unit',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#floor"),2,val,'');
	findbuildinglist($("#houseNumber"),3,'','');
})
$(document).on("change",'#floor',function(){
	var val=$(this).val().split(';')[0];
	findbuildinglist($("#houseNumber"),3,val,'');
})
var buildflag=1;
function doRelevance(houseId, housekind) {
	if(buildflag==1){
		searchHouses($("#J_build"), true, 'left').then(function(){
			$("#J_build").on('onDataRequestSuccess', function (e, result) {       	
				result.value = result.data;
				console.log(result.value);
			    console.log('onDataRequestSuccess: ', result);
			}).on('onSetSelectValue', function (e, keyword) {
				var value=$(this).attr("data-id");
				var val=value.split(';')[0];
			    if(val){
			    	 findbuildinglist($("#J_building"),0,val,'');
			         findbuildinglist($("#unit"),1,'','');
			         findbuildinglist($("#floor"),2,'','');
			         findbuildinglist($("#houseNumber"),3,'','');
			    }else{
			    	virtualtype=1; 
			    	fictitiousHref(1,'');
			    }
			});
		}
		); // 楼盘
	}else{
		buildflag=0;
	}	
    $('#buildinghouseid').val('');
    commonContainer.modal(
        '虚拟楼盘房源关联', //title
        $('#J_relevance_house'), // 弹出窗口ID
        function (index, layero) { // 点击确定按钮回调

        	if($("#houseNumber").val()==null||$("#houseNumber").val()==''){
				commonContainer.alert("此页信息尚未填写完整");
				return false;
			}else{
				/*jsonGetAjax(basePath + '/house/main/checkhousevalidity', {"businesstype":1,"buildinghouseid":$("#houseNumber").val()}, function(result) {*/
				jsonGetAjax(basePath + '/house/main/checkhousevalidity', {"businesstype":housekind,"buildinghouseid":$("#houseNumber").val().split(';')[0]}, function(result) {//为了有数据，先注掉用租赁的
					var operationalservicetype= $("#houseNumber option[value='"+$("#houseNumber").val()+"']").attr("operationalservicetype");
					if(operationalservicetype.indexOf(housekind) == -1 ){//为了有数据，先注掉用租赁的
					/*if(operationalservicetype.indexOf("1") == -1 ){*/
						if(housekind==1){
							commonContainer.alert('该房间不能做租赁业务');
						}else if(housekind==2){
							commonContainer.alert("该房间不能做买卖业务");
						}
						return false;
					}
					if (result.code == '0') {
						jsonGetAjax(
	                            basePath + "/house/virtual/relevancevirtualhouse.htm",
	                            {
	                                houseId: houseId,
	                                buildingHouseId: $("#houseNumber").val().split(';')[0],
	                                housekind: housekind
	                            },
	                            function (data) {
	                            	if (result.code == '0') {
	                            		  layer.msg("关联成功！");
	                                      layer.close(index);
	                                      jQuery('#J_dataTable').bootstrapTable('refresh');
	                            	}
	                            }
					)
                    } else {
                        layer.alert(data.msg);
                    }
				})
			}


        },
        {
            overflow: true,
            area:['80%','400px'],
            btns: ['关联', '取消'],
            success: function() {
				$("#form1")[0].reset();
				$("#J_building").trigger("chosen:updated")
				$("#unit").trigger("chosen:updated")
				$("#floor").trigger("chosen:updated")
				$("#houseNumber").trigger("chosen:updated")	
			}
        }
    );
}

/**
 * 取消关联
 */
function doCancel(houseId, housekind) {

    commonContainer.confirm('是否确认取消关联该虚拟楼盘，取消关联后，该虚拟楼盘的状态将变为处理中？',
        function (index, layero) {
            jsonGetAjax(
                basePath + "/house/virtual/cancelrelevancevirtualhouse.htm",
                {
                    houseId: houseId,
                    housekind: housekind
                },
                function (data) {
                    if (data.code == '0') {
                        layer.msg("取消关联成功！");
                        clearValue();
                        jQuery('#J_dataTable').bootstrapTable('refresh');
                    } else {
                        layer.alert(data.msg);
                    }
                }
            )
        });
}

/**
 * 查看楼盘房间详情
 */
function showDetail(event) {

    last = event.timeStamp;
    var houseId = $('#buildinghouseid').val();

    /**
     * 延时800ms触发
     */
    if (houseId != null && houseId != "" && !isNaN(houseId)) {
        setTimeout(
            function () {
                if (last - event.timeStamp == 0) {
                    jsonGetAjax(
                        basePath + "/house/virtual/selecthouseaddressbyid.htm",
                        {houseId: houseId},
                        function (data) {
                            console.log(data);
                            clearLoadValue();
                            if (data.code == 0 && data.data != null) {
                                $('#showHouseDetail').show();
                                checkValue(data, 'spraypropertyname');
                                checkValue(data, 'spraybuildingname');
                                checkValue(data, 'sprayunitname');
                                checkValue(data, 'sprayfloorname');
                                checkValue(data, 'sprayhouseno');
                                checkValue(data, 'operationalservicetype');
                            }

                        }
                    )
                }
            }, 800);

    }
}

function checkValue(data, id) {
    if (data.data) {
        if (data.data[id]) {
            $("#" + id).text(data.data[id]);
        } else {
            $("#" + id + "").text('');
        }
    } else {
        $("#" + id + "").text('');
    }
}

function clearValue() {
    $('#buildinghouseid').val('');
    $('#spraypropertyname').text('');
    $('#spraybuildingname').text('');
    $('#sprayunitname').text('');
    $('#sprayfloorname').text('');
    $('#sprayhouseno').text('');
    $('#showHouseDetail').hide();
}

function clearLoadValue() {
    $('#spraypropertyname').text('');
    $('#spraybuildingname').text('');
    $('#sprayunitname').text('');
    $('#sprayfloorname').text('');
    $('#sprayhouseno').text('');
    $('#showHouseDetail').hide();
}