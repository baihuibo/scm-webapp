$(function(){
	try {
		
		findPermission('SCM:HOUSE:RESTRICTIVE_REASION_LIST:MANAGER');
	}catch (e) {
		
	}
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	
	dimContainer.buildDimChosenSelector($(".clientType"), "clientType","");//客户类型
	dimContainer.buildDimChosenSelector($("#J_gradeLevel"), "RiskGrade","");//危险等级
	dimContainer.buildDimChosenSelector($("#J_reasionType"), "inquisitionType","");//状态

	initListLoad();
	jQuery('#J_search').on('click', function(event){
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/restrictive/findpagereasions' });
		
	});

	var concealType;

	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url:basePath + '/restrictive/findpagereasions',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_reasionform').serializeObject();
				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.recordTotal> 0) {
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0}
			},
			columns:[
				    {field: 'id',title :'序号',checkbox:true,align: 'center',
						formatter: function(value, row, index){
		      				var html='';
		      				html='<input type="hidden" name="id" data-id="'+row.reasonId+'" data-status="'+row.statusId+'"/>';
		      				return html;
		      	    	}
					},
		      	    {field: 'customerTypeName', title: '客户类型', align: 'center'},
		      	    {field: 'reason', title: '上榜原因', align: 'center',
		      	    	formatter:function(value){
							return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
						}
		      	    },
		      	    {field: 'sortId', title: '排序', align: 'center',
		      	    	formatter:function(value){
							return '<div class="num">'+value+'</div>';
						}
		      	    },
		      	    {field: 'gradeLevelName', title: '危险等级',  align: 'center'},
		      	    {field: 'statusName', title: '状态', align: 'center'},
			      	{field: 'opt', title: '操作', align: 'left',
		      	    	formatter: function(value, row, index){	
		      				var html='';
		      				var reason = row.reason? row.reason : '';
		      				if(row.canUpdate)
		      					html='<a type=\"amend\" data-id="'+row.reasonId+'" data-customer='+row.customerTypeId+' data-gradeLevel='+row.gradeLevelId+' data-sort='+row.sortId+' data-reason='+row.reason+' class="btn btn-outline btn-success btn-xs mt-3"">修改</a>';
		      				return html;
		      	    	}
			      	  },
		      	],
		})

	}
	
	/* function findMaxSortId(){
	    	if($("#J_customerType").val()){
				jsonPostAjax(basePath + '/restrictive/findrestrictivereasonmaxsortid', {
					'customerTypeId' : $("#J_customerType").val()
				}, function(result) {
					$('#J_sort').val(result.data.sortId);
				});
			}
	    }
	*/
	//新增上榜原因
	/*$(document).delegate("#J_customerType","change",function(event){
		findMaxSortId();
	})*/
	$(document).delegate("#addcause","click",function(event){
		$(".num").each(function(){
		      console.log($(this).text())
		})
		commonContainer.modal(
				'上榜原因新增', 
				$('#addcause_layer'),
				function(index, layero){
					var customerType=$('#J_customerType').val();
					var sort=$('#J_sort').val();
					var gradeLevel=$('#J_gradeLevel').val();
					var addreason=$('#J_addreason').val();
					
					if(customerType==''){
						layer.alert('请输入客户类型');
						return false;
					}
					if(sort==''){
						layer.alert('请输入排序');
						return false;
					}
					if(gradeLevel==''){
						layer.alert('请输入危险等级');
						return false;
					}
					if(addreason==''){
						layer.alert('请输入上榜原因');
						return false;
					}
					jsonPostAjax(
						basePath + '/restrictive/insertreasion',{
							'customerTypeId':customerType,
							'gradeLevelId':gradeLevel,
							'reason':addreason,
							'sortId':sort,
						},
						function(){
							layer.msg("操作成功");
							layer.close(index);
							jQuery('#J_dataTable').bootstrapTable('refresh');
						}
					)
				}, 
				{
					overflow:true,
					area: ['700px','400px'],
					btns: ['确认','取消'],
					success:function(){
						$("#J_reasionadd")[0].reset();
						$("#J_gradeLevel").trigger("chosen:updated");
						$("#J_customerType").trigger("chosen:updated");
					}
					
				}
			) ;
	})
	
	
	//修改
	$('#J_dataTable').delegate('a','click',function(event){
			if(this.type=='amend'){
				var reasonid = $(this).attr('data-id');
				var old_customer=$(this).attr('data-customer');
				var old_gradeLevel = $(this).attr('data-gradeLevel');
				var old_reason=$(this).attr('data-reason');
				var old_sort=$(this).attr('data-sort');
				commonContainer.modal(
						'上榜原因修改',
						$("#addcause_layer"),
						function(index, layero){
							var dataArr = [];
							var data = {};
							data['id'] = reasonid;
							data['customerTypeId'] = $("#J_customerType").val();
							data['gradeLevelId'] = $("#J_gradeLevel").val();
							data['reason'] = $("#J_addreason").val();
							data['sortId'] = $("#J_sort").val();
							dataArr.push(data);
							jsonPostAjax(
								basePath + '/restrictive/updatereasion',
								{
									'reasonId':reasonid,
									'customerTypeId':$("#J_customerType").val(),
									'gradeLevelId':$("#J_gradeLevel").val(),
									'reason':$("#J_addreason").val(),
									'sortId':$("#J_sort").val(),
								},
								function(){
									layer.msg("操作成功");
									layer.close(index);
									jQuery('#J_dataTable').bootstrapTable('refresh');
								}
							)	
						},
						{
							overflow:true,
							area: ['700px','350px'],
							btns: ['确认','取消'],
							success: function(){
								$("#J_customerType").val(old_customer);
								$("#J_customerType").attr("disabled","disabled")
								$("#J_customerType").trigger("chosen:updated");
								
								$("#J_gradeLevel").val(old_gradeLevel);
								$("#J_gradeLevel").trigger("chosen:updated");
								
								$("#J_addreason").val(old_reason);
								$('#J_sort').val(old_sort);
															
							}
						}
					)
			}
		})
		
		//恢复
		$(document).delegate("#adjusttime","click",function(event){
				var inputName=$("#J_dataTable input[name='id']").eq(0).prev().attr("name");
				if($("input[name="+inputName+"]:checked").length==0){  
					layer.alert("请至少选择一条记录");
					return false;
				}
				var validArr = [];
				var invalidCount = 0;
				var statusId = $("input[name="+inputName+"]:checked").next().attr('data-status');
				$("input[name="+inputName+"]:checked").each(function(){
					if($(this).next().attr("data-status")=='1'){
						layer.alert("请选择无效状态进行恢复");
						return false;
					}else{
						var validData = $(this).next().attr('data-id');
						invalidCount++
						validArr.push(validData);
						
					}
				})
				if(invalidCount==$("input[name="+inputName+"]:checked").length){
					commonContainer.confirm(
							'是否确定更改所选信息？',
						function(index, layero){
							jsonPostAjax(
								basePath + '/restrictive/changereasonsstatus',
								{
									'reasonIds':validArr,
									'statusId':1,
								},
								function(){
									layer.msg("成功");
									layer.close(index);
									jQuery('#J_dataTable').bootstrapTable('refresh');
								}
							)
						}	
					)
				}
				
			})
			
		//删除
		$(document).delegate("#cancelcause","click",function(event){
				var inputName=$("#J_dataTable input[name='id']").eq(0).prev().attr("name");
				if($("input[name="+inputName+"]:checked").length==0){  
					layer.alert("请至少选择一条记录");
					return false;
				}
				var validArr = [];
				var invalidCount = 0;
				var statusId = $("input[name="+inputName+"]:checked").next().attr('data-status');
				$("input[name="+inputName+"]:checked").each(function(){
					if($(this).next().attr("data-status")=='2'){
						layer.alert("请选择有效状态进行删除");
						return false;
					}else{
						var validData = $(this).next().attr('data-id');
						invalidCount++
						validArr.push(validData);
						
					}
				})
				if(invalidCount==$("input[name="+inputName+"]:checked").length){
					commonContainer.confirm(
							'是否确定更改所选信息？',
						function(index, layero){
							jsonPostAjax(
								basePath + '/restrictive/changereasonsstatus',
								{
									'reasonIds':validArr,
									'statusId':2,
								},
								function(){
									layer.msg("成功");
									layer.close(index);
									jQuery('#J_dataTable').bootstrapTable('refresh');
								}
							)
						}	
					)
				}
				
			})
	
})
//textarea 长度限制
/*function isMaxLen(o){  
 var nMaxLen=o.getAttribute? parseInt(o.getAttribute("maxlength")):"";  
 if(o.getAttribute && o.value.length>nMaxLen){  
 o.value=o.value.substring(0,nMaxLen)  
 }  
}  */
