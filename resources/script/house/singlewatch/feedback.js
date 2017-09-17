/*
 * 空看返回 调数据
 * */
function getdata_singleback(emptyid){
	jsonGetAjax(
			basePath + '/house/singlewatch/backbyemptyid',
			{
				emptyid: emptyid
			},
			function (result) {
				if (result.code == 0 && result.data) {
					
					var obj = result.data;
					//console.log(result.data.emptyhouselist[0].houseid);
					
					$('#J_singlestrstatus').html(obj.strstatus);		//状态
					$('#J_singledepart').html(obj.shopgroupname);	//空看部门
					var perhtml="<a onclick='getUserStaffInfo("+obj.createby+")'>"+obj.createbyname+"</a>";
					$('#J_singleperson').html(perhtml);	//空看人
					$('#J_outtime').text(obj.goouttime);			//外出时间

					//空看单反馈的返回时间要大于外出时间，小于等于当前时间
					setbacktime();
					$('#J_estimatetime').html(obj.expecttime);		//预计返回时间
					
					var time=$("#J_outtime").text();
				 	 var end = {
		                   elem: "#J_singlewatch_backtime",
		                   format: "YYYY-MM-DD hh:mm",
		                   istime: true,
		                   istoday: false,
		                   min: time,
		                   choose: function (datas) {
		                       /*start.max = datas*/
		                   	if(new Date(datas)<new Date(time)){
		           	    		layer.msg('返回时间不能早于外出时间！');
		           	    		$("#J_singlewatch_backtime").val('');
		           	    	}
		                   }
		               };
		              laydate(end);
					$('#J_feedback_time_add').hide();			//需要填写返回时间
					$('#J_feedback_time_desc').hide();			//显示返回时间和耗时

					var feedbacknum=obj.feedbacknum+"/"+obj.emptylooknum;
					var feedbackval="("+obj.feedbacknumvalue+"/"+obj.emptylooknumvalue+")";
					if(obj.status==3){//未返回
						$('#J_singlewatchnum_desc').html("");
						$('#J_feedback_time_add').show();
						$('#J_backtime').val("");
					}else if(obj.status==4 && obj.backtime==null){
						$('#J_feedback_time_desc').show();
						$('#J_singlewatchnum_desc').html("");
						$('#J_singlewatchnum_desc').html(feedbacknum+feedbackval);
						$('#J_backtime_text').html("");
						$('#J_costime_text').html("");
					}else{
						$('#J_feedback_time_desc').show();
						$('#J_singlewatchnum_desc').html("");
						$('#J_singlewatchnum_desc').html(feedbacknum+feedbackval);
						$('#J_backtime_text').html(obj.backtime);		//返回时间
						$('#J_costime_text').html(obj.costtime);		//耗时
					}
					
					$('#J_singleback_dataTable').bootstrapTable('destroy');
					$('#J_singleback_dataTable').bootstrapTable({
						//data:tableDatasingleback,
						data:obj.emptyhouselist.slice(0),
						pagination: false,
						responseHandler: function (result) {
							//console.log("result.data:"+result.data);
							if (result.code == 0 && result.data && result.data.totalcount > 0) {
								return {"rows": result.data.emptyhouselist, "total": result.data.totalcount}
							}
							return {"rows": [], "total": 0}
						},
						columns:[
					            {
					            	field: 'houseid', title: '房源编号', align: 'center',
					                formatter: function (value, row, index) {
					                	var html = "";
					                	var leaseurl="/sales/house/main/leasedetail.htm?houseid=";
					                	var buyurl="/sales/house/main/buydetail.htm?houseid=";
				                		if(row.housekind==1){//租赁
				                			html+='<a target="_blank" href="'+leaseurl+value+'" data-houseid="'+value+'">'+value+'</a><br />';
				                		}else{//买卖
				                			html+='<a target="_blank" href="'+buyurl+value+'" data-houseid="'+value+'">'+value+'</a><br />';
				                		}
					                    return html;
					                }					            	
					            },
					            {field: 'building', title: '楼盘', align: 'center'},
					            {
					            	field: '', title: '详细地址', align: 'center',
					            	formatter: function (value, row, index) {
					            		var html = "<a type=\'show\' class=\'btn-xs mt-3 J_single_address_detail\' onclick=\'checkAddress("+row.houseid+")\'>查看</a>&nbsp;";
					            		return html;
					            	}
					            },
					            {
					            	field: 'feedbacktime', title: '反馈结果/时间', align: 'center',
					                formatter: function (value, row, index) {
					                	var html = "";
					                	switch(row.feedback){
						                	case "已看":
						                		html = row.feedback + "/" + row.feedbacktime;
						                		break;
						                	case "未看":
						                		html = row.feedback + "/" + row.feedbacktime;
						                		break;
						                	case "未反馈":
						                		html = row.feedback;
						                		break;
					                	}
					                	
					                    return html;
					                }
					            },
					            {
					                field: 'opt', title: '操作', align: 'center',
					                formatter: function (value, row, index) {
					                	var html="";
					                	switch(obj.status){
					                	case 3://未返回
					                		html= "";
					                		break;
					                	case 1://已完成
					                		html = "<a type=\'show\' class=\'mt-3 J_showback_detail\' onclick=\'feedbackdesc(" + row.houseid + ","+obj.emptyid+")\'>查看</a>&nbsp;";
					                		break;
					                	case 2://可反馈
					                		if(row.feedback=="未反馈"){
					                			html = "<a type=\'show\' class=\'J_showback_add\' onclick=\'feedbackadd("+ obj.emptyid +"," + row.houseid + ")\'>反馈</a>&nbsp;";
					                		}else{
					                			html = "<a type=\'show\' class=\'J_showback_detail\' onclick=\'feedbackdesc(" + row.houseid + ","+obj.emptyid+")\'>查看</a>&nbsp;";
					                		}
					                		break;
					                	case 4://超期作废
					                		if(row.isfeedback ==1){
					                			html = "<a type=\'show\' class=\'mt-3 J_showback_detail\' onclick=\'feedbackdesc(" + row.houseid + ","+obj.emptyid+")\'>查看</a>&nbsp;";
					                		}else{
					                			html="---";
					                		}	
					                		break;
					                	}
					                    return html;
					                }
					            }]
					});
				}
			});
}

/*
 * 空看反馈的返回时间要大于外出时间，小于等于当前时间
 * 返回时间 最小是外出时间，最大是当前时间 
 * */
var singlewatch_backtime='';
function setbacktime(){
	/*var  $outtime=$('#J_outtime').html();//外出时间
*/	/*if(singlewatch_backtime!=''){
		singlewatch_backtime.min=$outtime;
	}*/
	/*singlewatch_backtime = {//返回时间
		elem: '#J_singlewatch_backtime',  
	    format: 'YYYY-MM-DD hh:mm',
	    istime: true,
	    min:$outtime,
	    max:laydate.now(0, 'YYYY-MM-DD hh:mm'),
	    choose: function(datas){
	    	//singlewatch_backtime.min = $outtime;
	    	//singlewatch_backtime.max = laydate.now(0, 'YYYY-MM-DD hh:mm');	    	
	    }
	}
	laydate(singlewatch_backtime);*/
	var time=$("#J_outtime").text();
	 var end = {
          elem: "#J_singlewatch_backtime",
          format: "YYYY-MM-DD hh:mm",
          istime: true,
          istoday: false,
          min: time,
          choose: function (datas) {
              /*start.max = datas*/
          	if(new Date(datas)<new Date(time)){
  	    		layer.msg('返回时间不能早于外出时间！');
  	    		$("#J_singlewatch_backtime").val('');
  	    	}
          }
      };
     laydate(end);
}


/*
 * 空看返回
 * */
var btns=['确定', '关闭'];
function singleback(emptyid,backtype) {
	var backtext="";
	if(backtype=="feedback"){
		backtext="空看反馈";
		btns=['关闭'];
	}else if(backtype=="back"){
		backtext="空看返回";
	}else{
        backtext = "空看反馈";
	}
    commonContainer.modal(backtext, $('#J_editsingleback_layer'), function (index, layero) {
    	var backtime=$('#J_singlewatch_backtime').val();
    	var add_display=$('#J_feedback_time_add').css("display");
    	if(add_display=="none"){
    		layer.close(index);
    	}else{
    		if(backtime==""){
        		commonContainer.alert("请输入返回时间");
        	}else{
        		jsonGetAjax(
        				basePath + '/house/singlewatch/backtimeupdate',
        				{
        					emptyid: emptyid,
        					backtime:backtime
        				},
        				function (result) {
        					//commonContainer.alert("操作成功");
        					layer.close(index);
        					//location.reload();
        					$("#J_search").trigger("click");
        					singleback(emptyid);
        				},{});
        	} 
    	}
    	$('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/singlewatch/listview'});    	  	
    },
    {
        overflow: 'auto',
        area: ['80%', '60%'],
        btns: btns,
		success: function() {
			//TODO
			getdata_singleback(emptyid);
			$("#J_singlewatch_backtime").val(laydate.now(0, 'YYYY-MM-DD hh:mm'));
			
		}
    });
}




var tableBackhref_id = "<a href=\'#\'  target=\'_blank\'>AJDBZ00224</a>";
var tableBackhref_address = "<a href=\'#\' class=\'J_detail_address\'>查看</a>";  // TODO 添加dataid
var tableBackhref_opt = "<a href=\'#\' class=\'J_showback\'>查看</a>";
var tableDatasingleback = [{
	"id" : tableBackhref_id,
	"name" : "华宇名都",
	"address" : tableBackhref_address,
	"time" : "2016-05-03 23:59",
	"opt" : tableBackhref_opt
},{
	"id" : tableBackhref_id,
	"name" : "华宇名都",
	"address" : tableBackhref_address,
	"time" : "<font color='#ff6600'>未反馈</font>",
	"opt" : tableBackhref_opt
},{
	"id" : tableBackhref_id,
	"name" : "华宇名都",
	"address" : tableBackhref_address,
	"time" : "<font color='#ff0000'>未看</font>",
	"opt" : tableBackhref_opt
}];


/*
 * 空看返回 弹出层 中的 反馈/查看 新增 操作
 */
function feedbackadd(emptyid,houseid) {
	commonContainer.modal('反馈结果', $('#J_feedback_add_layer'), function(index, layero) {

		var feedbackstatus=$('input:radio[name="feedback_status_add"]:checked').val();		
		if(feedbackstatus==null){
			commonContainer.alert("请选择是否看房");
		}
		if(feedbackstatus==1){
			var merits=$("#J_advantage_content_add").val();
			var weak=$("#J_weakness_content_add").val();
			if(merits==""){
				commonContainer.alert("请输入优点");
			}else if(weak==""){
				commonContainer.alert("请输入缺点");
			}else{
				jsonPostAjax(
						basePath + '/house/singlewatch/feedbackempty',
						{
							"emptyid": emptyid,
							"houseid": houseid,
							"iswatch": 1,
							"merits":merits,
							"weak":weak
						}, function() {
							//commonContainer.alert("操作成功");
							//location.reload();
							layer.close(index);        					
							getdata_singleback(emptyid);							
						},{});
			}
			
		}else if(feedbackstatus==0){
			var reason=$("#J_reason_area_add").val();			
			if(reason==""){
				commonContainer.alert("请输入原因");
			}else{
				jsonPostAjax(
						basePath + '/house/singlewatch/feedbackempty',
						{
							"emptyid": emptyid,
							"houseid": houseid,
							"iswatch": 0,
							"reason":reason
						}, function() {
							//commonContainer.alert("操作成功");
							//location.reload();
							layer.close(index);
							//singleback(emptyid);
							getdata_singleback(emptyid);

						},{});				
			}
		}
	}, 
	{
		overflow :false,
		area : ['500px','300px'],
		btns : ['保存'],
		cancel : function(index, layerno) {
			layer.close(index);
			$('input:checkbox').each(function() {
		        $(this).attr('checked', false);
			});
		},
		success: function() {
			var html = '<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="1" name="feedback_status_add" id="is_feedback_add"><label for="is_feedback_add">是</label>'+
				'</div>'+
				'<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="0" name="feedback_status_add" id="not_feedback_add" style="margin-left:8px;"><label for="not_feedback_add">否</label>'+
				'</div>';
			$('#J_feedback_status_add').html(html);
			$("#J_reason_add").hide();
			$('#J_advantage_content_add').val('');
			$('#J_weakness_content_add').val('');
			$('#J_reason_area_add').val('');
			
			/*$("#J_advantage_content_add").val('');
			$("#J_weakness_content_add").val('');
			$("#J_reason_area_add").val('');*/
			
		}
	});
}
/*$(document).delegate('.J_showback_add', 'click', function(event){
	commonContainer.modal('反馈结果', $('#J_feedback_add_layer'), function(index, layero) {
		
	}, 
	{
		overflow :false,
		area : ['500px','300px'],
		btns : ['保存'],
		cancel : function(index, layerno) {
			layer.close(index);
			$('input:checkbox').each(function() {
		        $(this).attr('checked', false);
			});
		},
		success: function() {
			var html = '<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="1" name="feedback_status_add" id="is_feedback_add"><label for="is_feedback_add">是</label>'+
				'</div>'+
				'<div class="radio radio-primary radio-inline">'+
					'<input type="radio" value="0" name="feedback_status_add" id="not_feedback_add" style="margin-left:8px;"><label for="not_feedback_add">否</label>'+
				'</div>';
			$('#J_feedback_status_add').html(html);
			$("#J_reason_add").hide();
			
			$("#J_sendee").val('');
			$("#J_deptLevel").val('');
			$("#J_deptName").val('');
			
		}
	});

});*/


/*
 * 空看返回 弹出层 中的 反馈/查看 查看 操作
 */
function feedbackdesc(houseid,emptyid) {
	commonContainer.modal('反馈结果', $('#J_feedback_desc_layer'), function(index, layero) {
		layer.close(index);
	}, 
	{
		overflow :false,
		area : ['500px','300px'],
		btns : ['返回'],
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success: function() {
			jsonGetAjax(
					basePath + '/house/singlewatch/feedbackresult',
					{
						houseid: houseid,
						emptyid: emptyid
					},
					function (result) {
						var html = '<div class="radio radio-primary radio-inline">'+
									'<input type="radio" value="1" name="feedback_status_desc" id="is_feedback_desc" disabled><label for="is_feedback_desc">是</label>'+
								'</div>'+
								'<div class="radio radio-primary radio-inline">'+
									'<input type="radio" value="0" name="feedback_status_desc" id="not_feedback_desc" style="margin-left:8px;" disabled><label for="not_feedback_desc">否</label>'+
								'</div>';
						$('#J_feedback_status_desc').html(html);
						$("#J_reason_desc").hide();
						

						/*$("#J_special_desc").show();//是 优缺点
						$("#J_reason_desc").hide();*/ //否 原因
						
						if (result.code == 0 && result.data) {
							var obj = result.data;
							$("input[name='feedback_status_desc'][value="+obj.iswatch+"]").attr("checked",true);
							if(obj.iswatch==1){
								$("#J_special_desc").show();
								$("#J_reason_desc").hide();
								$("#J_advantage_content_desc").val(obj.merits);
								$("#J_weakness_content_desc").val(obj.weak);
							}else if(obj.iswatch==0){
								$("#J_reason_desc").show();
								$("#J_special_desc").hide();
								$("#J_reason_desc_add").val(obj.reason);
							}
							
						}
					});
		}
	});
}


/*J_special_add
J_reason_add

J_special_desc
J_reason_desc*/

$(document).delegate('input:radio[name="feedback_status_add"]', 'click', function(event){
	if($(this).val()=="1"){
		$("#J_special_add").show();
		$("#J_reason_add").hide();
	}else if($(this).val()=="0"){
		$("#J_reason_add").show();
		$("#J_special_add").hide();
	}
});
$(document).delegate('input:radio[name="feedback_status_desc"]', 'click', function(event){
	if($(this).val()=="1"){
		$("#J_special_desc").show();
		$("#J_reason_desc").hide();
	}else if($(this).val()=="0"){
		$("#J_reason_desc").show();
		$("#J_special_desc").hide();
	}
});

