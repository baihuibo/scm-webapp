$(function(){
try {
		
		findPermission('SCM:HOUSE:CONCEAL:MANAGER');
	}catch (e) {
		
	}
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	
	$('#J_reset').on('click', function(event) {
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})
	selectArealist($('#areaId'), '');// 区域
	dimContainer.buildDimChosenSelector($("#J_equityTypeId"), "houseown","");//产权
	dimContainer.buildDimChosenSelector($('#J_businessType'),'businessType','');//业务类型
	dimContainer.buildDimChosenSelector($('#J_concealStatus'),'ConcealType','');//隐藏状态
	dimContainer.buildDimChosenSelector($('#J_concealType'),'ConcealTime','');//隐藏到期时间
	searchHouses($("#J_build"), true, 'left'); // 楼盘名
	searchContainer.searchUserListByComp($("#J_concealUser"), true);//录入人
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
		    format: 'YYYY-MM-DD ',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	laydate(begindate);
	laydate(enddate);
	/*searchHouseId($("#J_serial"), true);*/
	

	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/house/conceal/findpageconcealhouses' });
		
	});
	$(document).on("change",'#J_concealType',function(){
		$("#J_begindate").val("");
		$("#J_enddate").val("");
		var val=$(this).val();
		if(val==2 || val==""){
			$(".none").hide();
		}else if(val==1){
			$(".none").show();
		}
	})
	$('#J_reset').on('click', function(event){
		$(".none").hide();
	})

	var concealType;
	//添加隐藏房源日期
	$("#J_expiretime").click(function(){
		var minDate=(new Date()).Format("yyyy-MM-dd hh:mm");
		datelayer( "#J_expiretime", {
			istime: true,
			format: 'YYYY-MM-DD hh:mm',
			min : minDate
		});
		concealType=1
	})
	$('#J_expireconceal').on('click',function(){
	    if(this.checked){
	    	$('#J_expiretime').attr({"disabled":"disabled"});
	    	$('#J_expiretime').val("");
	    	concealType=2;
	    }else{
	    	$('#J_expiretime').removeAttr("disabled");
	    }
	})

	//调整期限日期
	$("#J_hidetime").click(function(){
		var minDate=(new Date()).Format("yyyy-MM-dd hh:mm");
		datelayer( "#J_hidetime", {
			istime: true,
			format: 'YYYY-MM-DD hh:mm',
			min : minDate
		});
		concealType=1
	})
	$('#J_handconceal').on('click',function(){
	    if(this.checked){
	    	$('#J_hidetime').attr({"disabled":"disabled"});
	    	$('#J_hidetime').val("");
	    	concealType=2
	    }else{
	    	$('#J_hidetime').removeAttr("disabled");
	    }
	})

	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url:basePath + '/house/conceal/findpageconcealhouses',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_concealform').serializeObject();
				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				if(o.buildingDistrictId){
					o.buildingDistrictId = encodeURI($("#J_build").attr("data-id").split(';')[1])
				}
				if(o.concealUserId){
					o.concealUserId = encodeURI($("#J_concealUser").attr("data-id"))
				}
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
			      				html='<input type="hidden" name="houseId" houseId="'+row.houseId+'" data-status="'+row.concealStatusId+'"/>';
			      				return html;
			      	    	}
						},
			      	    {field: 'houseId', title: '房源编号', align: 'center',
							formatter: function (value, row, index){
			      				var html = '';

			      				if(row.businessTypeId=='1'){
			      					if($("#temp_viewhide").val()!=undefined){
			      						html ='<a target="_blank" href="../main/leasedetail.htm?houseid='+row.houseId+'">'+row.houseId+'</a>';
			      					}else{
			      						html =row.houseId;
			      					}
			      					
			      				}else if(row.businessTypeId=='2'){
			      					if($("#temp_viewhide").val()!=undefined){
			      						html ='<a target="_blank" href="../main/buydetail.htm?houseid='+row.houseId+'">'+row.houseId+'</a>';
			      					}else{
			      						html =row.houseId;
			      					}
			      				}
			      				return html;
							}
			      	    },
			      	    {field: 'businessTypeName', title: '业务类型', align: 'center'},
			      	    {field: 'planningPurposeName', title: '规划用途', align: 'center',},
			      	    {field: 'buildingDistrictName', title: '楼盘名',  align: 'center'},
			      	    {field: 'equityTypeName', title: '产权性质', align: 'center'},
			      	    {field: 'concealStartTime', title: '隐藏时间', align: 'center',},
			      	    {field: 'concealTypeNameOrEndTime', title: '隐藏到期时间',align: 'center',
			      	    	formatter: function (value, row, index){
			      				var dateValue=value;
			      				try{var d = Date.parseDate(dateValue);dateValue=d;}
			      				catch(err){

			      				}
			      				return dateValue;
			      	    	}
			      	    },
			           	{field: 'concealStatusName', title: '隐藏状态', align: 'center'},
			      	    {field: 'concealUserName', title: '操作人',align: 'center',
			           		formatter: function(value ,row, index){
			      	    		var html='';
			      	    		html='<a class="concealUser" attr="'+row.concealUserId+'">'+row.concealUserName+'</a>'
			      	    		return html;
			      	    	}
			      	    },
			      	],

		})

	}
	$(document).delegate("#add_concealhoust","click",function(event){
		$("#J_concealadd")[0].reset();
		$('#J_expiretime').removeAttr("disabled");
		
		commonContainer.modal(
				'添加隐藏房源', 
				$('#add_conceal_layer'), 
				function(index, layero){
					/*var houseIds=[];*/
					var houseId=$("#J_serial").val();
					/*houseIds.push(houseId);*/
					if($("#J_expiretime").val() !=''){
						var concealEndDate=$("#J_expiretime").val()+":00";
					}else{
						var concealEndDate=$("#J_expiretime").val();
					}
					var concealResion=$("#J_opinionContent").val();
					
					if(houseId==''){
						commonContainer.alert('请输入编号');
						return false;
					}
					if($("#J_expireconceal").prop("checked")){
						$("#J_expiretime").val();
					}else if($("#J_expiretime").val() == ""){
						layer.alert("请选择隐藏时间");
						return false;
					}
					if(concealResion==''){
						layer.alert('请输入隐藏原因');
						return false;
					}					
					jsonPostAjax(
						basePath + '/house/conceal/newhouseconceals',{
							'houseId':houseId,
							'concealEndTime':concealEndDate,
							'concealResion':concealResion,
							'concealTypeId':concealType,
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
					area: ['700px','300px'],
					btns: ['确认','取消'],
					
				}
			) ;
	})
	
	
	$(document).delegate("#adjusttime","click",function(event){
		$("#J_adjusttime")[0].reset();
		$('#J_hidetime').removeAttr("disabled");
		var inputName=$("#J_dataTable input[name='houseId']").eq(0).prev().attr("name");
		if($("input[name="+inputName+"]:checked").length==0){  
			layer.alert("请选择房源");
			return false;
		}
		var validArr = [];
		var invalidCount = 0;
		$("input[name="+inputName+"]:checked").each(function(){
			if($(this).next().attr("data-status")=='2' || $(this).next().attr("data-status")=='3'){
				layer.alert("您选择的房源中存在隐藏状态为已到期或已取消的房源，不能调整期限，请重新添加。");
				return false;
			}else{
				var validData = $(this).closest('tr').find('td').eq(1).text();
				invalidCount++
				validArr.push(validData);
			}
		})
		if(invalidCount==$("input[name="+inputName+"]:checked").length){
			commonContainer.modal('隐藏期限调整', 
					$('#adjusttime_layer'), 
					function(index, layero){
						if($("#J_handconceal").prop("checked")){
							$("#J_hidetime").val();
						}else if($("#J_hidetime").val() == ""){
							layer.alert("请选择隐藏时间");
							return false;
						}
						if($("#J_hidetime").val() !=''){
							var concealEndhidetime=$("#J_hidetime").val()+":00";
						}else{
							var concealEndhidetime=$("#J_hidetime").val()
						}
						
						jsonPostAjax(
							basePath + '/house/conceal/modifyhouseconceals',{
								'houseIds':validArr,
								'concealTypeId':concealType,
								'concealEndTime':concealEndhidetime,
							},
							function(){
								layer.msg("成功");
								layer.close(index);
								jQuery('#J_dataTable').bootstrapTable('refresh');
							}
						)
					}, 
					{
						overflow:true,
						area: ['600px'],
						btns: ['确认','取消'],
					}
			) ;
		}

	})
	
	$(document).delegate("#cancel_concealhoust","click",function(event){
		var inputName=$("#J_dataTable input[name='houseId']").eq(0).prev().attr("name");
		if($("input[name="+inputName+"]:checked").length==0){  
			layer.alert("请选择房源");
			return false;
		}
		var validArr = [];
		var invalidCount = 0;
		$("input[name="+inputName+"]:checked").each(function(){
			if($(this).next().attr("data-status")=='2' || $(this).next().attr("data-status")=='3'){
				layer.alert("您选择的房源中存在隐藏状态为已到期或已取消的房源，不能进行取消隐藏操作，请先处理。");
				return false;
			}else{
				var validData = $(this).closest('tr').find('td').eq(1).text();
				invalidCount++;
				validArr.push(validData);
			}
		})
		if(invalidCount==$("input[name="+inputName+"]:checked").length){
			commonContainer.confirm(
					'是否确认取消隐藏选中的房源?',
					function(index, layero){
						jsonPostAjax(
							basePath + '/house/conceal/cancelhouseconceals',{
								'houseIds':validArr,
							},
							function(){
								layer.msg("成功");
								layer.close(index);
								jQuery('#J_dataTable').bootstrapTable('refresh');
							}
						)
				});
		}
	});
	$(document).delegate("#termination_conceal","click",function(event){
		commonContainer.confirm(
				'是否确认手工执行隐藏终止Job?',
				function(index, layero){
					jsonPostAjax(
						basePath + '/house/conceal/terminationconcealhousesource',
						function(){
							layer.msg("成功");
							layer.close(index);
							jQuery('#J_dataTable').bootstrapTable('refresh');
						}
					)
			});
	});
	
	jQuery('#J_dataTable').delegate('.concealUser','click',function(event){
		getUserStaffInfo($(this).attr('attr'));
	})
	
})