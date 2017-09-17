$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	jQuery('#J_search').on('click', function(event) {
		if($("#J_revamp_contractNo").val()==""){
			commonContainer.alert('请输入要调整的合同编号');
			return false;
		}else if($("#J_revamp_businessType").val()==""){
			commonContainer.alert('请选择业务类型');
			return false;
		}
		initListLoadTable();
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh', {url : basePath + '/perf/authorize/selectPerfApply'});
		
	});
})
function initListLoad() {
	var J_revamp_contractNo=$("#J_revamp_contractNo").val();
	var J_revamp_businessType=$("#J_revamp_businessType").val();
	$.ajax({
		url : basePath+ '/perf/authorize/selectPerfApply',
		dataType : 'json',
		method : 'get',
		data:{
			"contractNo":J_revamp_contractNo,
			"businessType":J_revamp_businessType
		},
		success:function(result){
			$("#none").hide();			
			$("#J_submit").css("visibility","hidden");
			if(result.data.listPerfProrateDetailDto.length!=0){
				$("#none").show();
				$("#J_submit").css("visibility","visible");
				$("#App_contractNo").attr("data-id",result.data.listPerfProrateDetailDto[0].contractId);
			}else{
				$("#App_contractNo").text("");
				$("#App_contractDate").text("");
				$("#App_Time").text("");
				$("#App_mondate").text("");
			}
			
			if(result.data.contractCode){
				$("#App_contractNo").text(result.data.contractCode);
			}else{
				$("#App_contractNo").text("");
				commonContainer.alert('输入的合同编号不合法');
				return false;
			}			
			if(result.data.inputDate){
				$("#App_contractDate").text(result.data.inputDate);
			}else{
				$("#App_contractDate").text("");
			}
			if(result.data.examineDate){
				$("#App_Time").text(result.data.examineDate);
			}else{
				$("#App_Time").text("");
			}
			if(result.data.firstSubmitDate){
				$("#App_mondate").text(result.data.firstSubmitDate);
			}else{
				$("#App_mondate").text("");
			}
			
		},
		error:function(){
			layer.alert(errorMsg);
		}
	})
}


function initListLoadTable() {
		$('#J_dataTable').bootstrapTable({
							url : basePath+ '/perf/authorize/selectPerfApply',
							sidePagination : 'server',
							dataType : 'json',
							method : 'get',
							pagination : false,
							striped : true,
							queryParams : function(params) {
								var o = jQuery('#newform').serializeObject();
								return o;
							},
						responseHandler: function(result){
								console.log(result.data)
								if(result.code == 0 && result.data) {
									return { "rows": result.data.listPerfProrateDetailDto}
								}
								return { "rows": [] } 
							},
							columns : [
									{field: 'id',title :'选择',align: 'center',
										formatter : function(value, row,index) {											
											return '<input type="checkbox" name="commit" data-index="'+index+'">';
										}
									},
									{
										field : 'perfTypeName',
										title : '业绩类型',
										align : 'center',
										formatter : function(value, row, index) {
												return '<div class="remark_all" data-id="'+row.perfType+'">'+value+'</div>';
										}
									},
									{
										field : 'belongerName',
										title : '业绩所有人',
										align : 'center',
										formatter : function(value, row) {											
												return '<div belonger="'+row.belonger+'">'+value+'</div>';
										}
										
									},
									{
										field : 'fullDeptName',
										title : '所属区/店',
										align : 'center',
										formatter : function(value, row) {											
											return '<div shoparea="'+row.belongShoparea+'" shopgroup="'+row.belongShopgroup+'" shop="'+row.belongShop+'">'+value+'</div>';
										}
									},
									{
										field : 'generateWay',
										title : '状态',
										align : 'center',
										formatter : function(value, row) {
											if (row.generateWay == 1) {
												return '<div generateWay=1>系统生成</div>';
											} else if(row.generateWay == 3) {
												return '<div generateWay=3>业绩调整申请</div>';
											}else{
												return '<div generateWay=2>分单调整</div>';
											}
										}
									},
									{
										field : 'percent',
										title : '分配比例',
										align : 'center',
										formatter : function(value, row, index) {
											var html = '';
											html = '<div>'+ value+ '%</div>';
											return html;
										}
									}
							 ]
						})
	}


$('#J_submit').show().off().on('click',function(){

	//查询流程创建的审批人
	jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=findUserOnStart',{
		//conId:result.data.contractid
	},function(redata){
		commonContainer.modal(redata.data[0].currentApprovalProcess,'<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
			var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
			//创建工作流
			var perfApplyAdjustForm=[];
			$("input[name='commit']:checked").each(function(){
				var reason={};
				reason.perfType=$(this).parent().next().children().attr("data-id");
				reason.perfTypeName=$(this).parent().next().find("div").text();
				reason.belonger=$(this).parent().parent().find("td").eq(2).find("div").attr("belonger");
				reason.belongerName=$(this).parent().parent().find("td").eq(2).find("div").text();
				reason.fullDeptName=$(this).parent().parent().find("td").eq(3).find("div").text();
				reason.belongShoparea=$(this).parent().parent().find("td").eq(3).find("div").attr("shoparea");
				reason.belongShopgroup=$(this).parent().parent().find("td").eq(3).find("div").attr("shopgroup");
				reason.belongShop=$(this).parent().parent().find("td").eq(3).find("div").attr("shop");
				reason.generateway=$(this).parent().parent().find("td").eq(4).find("div").attr("generateway");
				reason.percent=parseInt($(this).parent().parent().find("td").eq(5).find("div").text());
				perfApplyAdjustForm.push(reason);
			});
			console.log(perfApplyAdjustForm);
			if($("#J_revamp_remark").val()==""){				
				layer.closeAll();
				commonContainer.alert("未输入调整原因，不能提交");
				return false
			}else if(perfApplyAdjustForm==""){
				layer.closeAll();
				commonContainer.alert("未选择调整项，不能提交");
				return false
			}else if(getSelections.length>0){
				layer.close(i);				
				var timestamp=new Date().getTime();
				jsonPostAjax(basePath+'/workflow/doJob?modelName=PERF_AUTHORIZE_STATE&methodName=createWorkflow',{
					   perfApplyAdjustForm : perfApplyAdjustForm,
					   contractPerFormanceId :$("#App_contractNo").attr("data-id"),
					   nextUser :getSelections[0].userId,
					   applyType:"3",
					   mome:$("#J_revamp_remark").val(),
					   formId:timestamp
				},function(){
					layer.alert('提交成功', {
						skin: 'layui-layer-lan',
						closeBtn:0,  // 是否显示关闭按钮
						yes:function(){
							location.reload();
						}
					});
				});
			}else{
				commonContainer.alert('请选择审批人');
			}
		},{
			btns:['确定','取消'],
			area:'600px',
			overflow :true,
			success:function(){
				$('#approver').bootstrapTable({
					singleSelect:true,		//设置单选
					clickToSelect:true,		//点击选中行
				    columns: [{
				        field: '',
				        title: '选择',
			        	radio:true,
				    	align:'center'
				    }, {
				        field: 'userName',
				        title: '用户姓名',
				        align:'center'
				    }, {
				        field: 'userDept',
				        title: '用户部门',
				        align:'center'
				    }],
				    data:redata.data
				});
			}
		});
	},{
		completeCallBack:function(){
			
		}
	});
});
//textarae字数限制
J_revamp_remark.oninput = function strLenCalc(obj, checklen, maxlen) {
	var v = $("#J_revamp_remark").val(), charlen = 0, maxlen = !maxlen ? 240 : maxlen, curlen = maxlen, len = v.length;
	for(var i = 0; i < v.length; i++) {
	if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
	curlen -= 1;
	}
	}
  if(curlen >= len) {
	$("#checklen").html("还可输入 <strong>"+Math.floor((curlen-len)/2)+"</strong> 个字").css('color', '');
	$("#J_submit").removeAttr("disabled");
	} else {
	$("#checklen").html("已经超过 <strong>"+Math.ceil((len-curlen)/2)+"</strong> 个字").css('color', '#FF0000');
	$("#J_submit").attr("disabled", "disabled");
	}
 }




