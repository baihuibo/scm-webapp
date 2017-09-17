//searchDept($('#J_belongdeptName'), false, 'left');						//所属部门

// 显示所属部门树状结构

$('#J_belongdeptSelect').on('click', function () {
    showDeptTree($('#J_belongdeptName'), $('#J_belongdeptLevel'), '');
});

$(function () {
	clearAll();

	// 规划用途
    dimContainer.buildDimCheckBoxHasAll($('#J_planningPurpose'), 'propertytype', 'plannedUses','all','全部');
    searchContainer.searchUserListByComp($("#J_belongperson"), true);		//保护人
    searchContainer.searchUserListByComp($("#J_propectperson"), true);		//变更保护人弹层

    $("select").chosen({
        width: "100%"
    });
    var seeBeginDate={
			elem:'#J_begintime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#J_endtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
    //初始化表格
    //详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    // 查询操作
    jQuery('#J_search').on('click', function (event) {
        initListLoad();
        $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/protect/listview.htm'});
    });

    $('#J_reset_lease').on('click', function(event) {
        //$('#J_protect_form').reset();
    	clearAll();
    })
});

/*
 * 清空查询条件
 * */
function clearAll(){
	$('#Q_houseid').val('');
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	$('#J_belongdeptName').val('');
	$('#J_belongdeptName').attr("data-id","");
	$('#J_belongperson').val('');
	$('#J_belongperson').attr("data-id","");	
	$('#J_begintime').val('');
	$('#J_endtime').val('');
}

function getHouseLink(houseId, houseKind) {
    if (houseKind=='租赁') {
        return basePath+'/house/main/leasedetail.htm?houseid='+houseId;		//房源id
    } else if (houseKind=='买卖') {
        return basePath+'/house/main/buydetail.htm?houseid='+houseId;
    }
}

/*
 * 房源保护分页
 */
function initListLoad() {
    var j_datatable = $('#J_dataTable');
    if (!j_datatable.data('bootstrap.table')) {
        j_datatable.bootstrapTable({
            // url: basePath + '/house/protect/listview.htm',
            sidePagination: 'server',
            dataType: 'json',
            method: 'post',
            pagination: true,
            striped: true,
            pageSize: 10,
            pageList: [10, 20, 50],
            queryParams: function (params) {
                var o = jQuery('#J_protect_form').serializeObject();
                o.timestamp = new Date().getTime();
                o.pageindex = params.offset / params.limit + 1,
                    o.pagesize = params.limit;
                if (o.createstarttime) {
                    o.createstarttime = encodeURI(o.createstarttime);
                }
                if (o.createendtime) {
                    o.createendtime = encodeURI(o.createendtime);
                }
                o.deptid = $("#J_belongdeptName").attr('data-id');
                o.userid = $("#J_belongperson").attr('data-id');
                if (o.propertytype && Array.isArray(o.propertytype)) {
                    o.propertytype = o.propertytype.join(',');
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
                {field: 'houseid', title: '房源编号', align: 'center',
                    formatter:function(value,row){
                        return value?'<a href="'+ getHouseLink(value , row.housekind) +'" target="_blank">'+value+'</a>':'-';
                    }
                },
                {field: 'housekind', title: '业务类型', align: 'center'},
                {field: 'propertytype', title: '规划用途', align: 'center'},
                {field: 'protectname', title: '保护人', align: 'center',formatter:function(value,row){
                    return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.userid+')">'+value+'</a>':'-';
                }},
                {field: 'deptname', title: '保护部门', align: 'center'},
                {field: 'protecttime', title: '保护时间', align: 'center'},
                {field: 'limitday', title: '房源保护倒计时', align: 'center'},
                {field: 'status', title: '保护状态', align: 'center'},
                {
                    field: 'opt', title: '操作', align: 'center',
                    formatter: function (value, row, index) {
                        var html = "<a type=\'show\' class=\'btn btn-outline btn-success btn-xs mt-3 J_protect_detail\' onclick=\'detail(" + row.houseid + " , \"" + row.housekind + "\" , \"" + row.id + "\")\'>查看</a>&nbsp;";
                        if($("#temp_view").val()==undefined){
							html='';               	
						}
                        if (row.status === '已取消' || row.status === '已到期') {
                            // 已取消，已到期的状态只有查看按钮
                            return html;
                        }

                        var cancleItem = "<a type=\'cancel\' class=\'btn btn-outline btn-success btn-xs mt-3 J_protect_cancel\' onclick=\'cancel(" + row.id + ")\'>取消保护</a>&nbsp;";

                        var changeItem = $("<a type=\'change\' class=\'btn btn-outline btn-success btn-xs mt-3 J_protect_edit\' onclick=\'changeUser("+index+")\'>变更保护人</a>");
                        changeItem.attr('id','protect_edit'+index);
                        changeItem.attr('data-oldprotectname',row.protectname);
                        changeItem.attr('data-id',row.id);
                        if($("#temp_cancel").val()==undefined){
                        	cancleItem='';
                        }
						
						if($("#temp_change").val()==undefined){
							changeItem='';
							return html+cancleItem;
						}else{
							return html+cancleItem+changeItem.prop("outerHTML");
						}
                    }
                }
            ]
        });
    }
}

/*
 * 房源保护详情
 */
function detail(houseid , housekind,id) {
    commonContainer.modal('保护详情', $('#J_protect_detail_layer'), function (index, layero) {
        layer.close(index);
    },
    {
        overflow: 'auto',
        area: ['80%', '90%'],
        btnAlign: 'c',
        btns: ['关闭'],
        cancel: function (index, layerno) {
            layer.close(index);
        },
		success: function() {
			jsonGetAjax(
				basePath + '/house/protect/detail.htm',
				{
					houseid: houseid,
					id:id
				},
				function (result) {
					if (result.code == 0 && result.data) {
						console.log(result.data);
						var obj = result.data;
						$('#houseid').text(obj.house.housesid).prop('href' , getHouseLink(houseid , housekind));
						$('#conmmunityname').html(obj.house.conmmunityname);
						$('#housekind').html(obj.house.unitname);
						$('#propertytype').html(obj.house.memo);
						$('#buildarea').html(obj.house.buildarea+'平方米');
						if(obj.house.floor == undefined){
							$('#floor').html(0+'/'+obj.house.houseallfloor);
						}else{
							$('#floor').html(obj.house.floor+'/'+obj.house.houseallfloor);
						}
						$('#shape').html(obj.house.bedroom+'-'+obj.house.livingroom+'-'+obj.house.kitchen+'-'+obj.house.toilet+'-'+obj.house.balcony);
						
						$('#userName').html(obj.houseProtectInfo.userName);
                        $('#userName').on('click',function(){
                            getUserStaffInfo(obj.houseProtectInfo.userId);
                        })
						$('#groupName').html(obj.houseProtectInfo.groupName);
						$('#createTime').html(obj.houseProtectInfo.createTime);
						$('#reason').html(obj.houseProtectInfo.reason);
                        $('#status').html(obj.houseProtectInfo.statusName);
						
						console.log(obj.houseProtectInfo);
						$('#protectTab').bootstrapTable('destroy');
						$('#protectTab').bootstrapTable({
							data:obj.houseProtectHistory,
							pagination: false,
							responseHandler: function (result) {
								if (result.code == 0 && result.data && result.data.totalcount > 0) {
									return {"rows": result.data.rows, "total": result.data.totalcount}
								}
								return {"rows": [], "total": 0}
							},
							columns:[
	       	                         {
	       	                             field: 'userName', title: '操作人', align: 'center',
                                         formatter: function(value ,row, index){
                                             var html='';
                                             if(row.userName){
                                                 html='<a onclick="getUserStaffInfo('+row.userId+')">'+row.userName+'</a>'
                                             }else{
                                                 html='-'
                                             }
                                             return html;
                                         }
                                     },
	       	                         {field: 'createTime', title: '保护时间', align: 'center'},
	       	                         {field: 'reason', title: '保护原因', align: 'center'},
							         ]
						});
					}
				});
		}
    });
}
	

/*
 * 取消保护 
 * */

function cancel(id){
    commonContainer.confirm('确认取消保护',  function (index, layero) {
        jsonGetAjax(
            basePath + '/house/protect/cancel.htm',
            {
               id: id
            },
            function (result) {
                if (result.code == 0) {
                    layer.msg('取消成功');
                    layer.close(index);
                    $('#J_dataTable').bootstrapTable('refresh');
                }else{
                    layer.alert(result.msg);
            }
        });

    });
}
/*
 * 变更保护人
 * */
function changeUser(index) {
    var propectPerson = $('#J_propectperson');
    var protect_edit = $('#protect_edit'+index);
    propectPerson.val('');
    $('#J_old_protectperson').text(protect_edit.attr('data-oldprotectname'));
    var protect_id = protect_edit.attr('data-id');
    commonContainer.modal('变更保护人', $('#J_protectedit_layer'), function (index, layero) {

            if (!propectPerson.val()) {
                return layer.alert('请选择变更的保护人');
            }

            jsonGetAjax(basePath + '/house/protect/change.htm' , {
                id: protect_id,
                userid: propectPerson.attr('data-id')
            } , $.noop)
                .then(function (result) {
                    if (result.code != 0) {
                        return layer.alert(result.msg);
                    }
                    layer.msg('更改保护人成功');
                    layer.close(index);
                    $('#J_dataTable').bootstrapTable('refresh');
            });
        },
        {
            overflow: false,
            area: ['380px', '240px'],
            btns: ['确定', '关闭']
        });
}