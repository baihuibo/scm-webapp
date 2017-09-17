var sort='registerDate';
var rank='desc';
$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	selectArealist($('#areaId'), '');// 区域
	searchHouses($("#J_build"), true, 'left'); // 楼盘名
	dimContainer.buildDimChosenSelector($("#yesOrNo"), "yesOrNo","1");//是否签委托协议
	dimContainer.buildDimChosenSelector($("#customerSource"), "customerSource","");//客户来源
	dimContainer.buildDimCheckBox($("#J_orientation"), "headingIds", "orientation", "");//朝向
	dimContainer.buildDimCheckBoxHasAll($("#J_houseappraise"), "finalAssessmentIds", "LessorHouseFinalAssessment", "1",'全部');//房源评价
	dimContainer.buildDimChosenSelector($("#J_fitmentTypeId"), "housedecorationstatus","");//装修
	dimContainer.buildDimChosenSelector($("#J_rentType"),"rentType","");//出租方式
	dimContainer.buildDimChosenSelector($("#J_payType"),"payType","");//付款方式
	dimContainer.buildDimChosenSelector($("#J_priceChangeTimes"),"PriceChangeTimes","");//付款方式
	dimContainer.buildDimCheckBoxHasAll($("#J_planningPurpose"),"planningPurposeIds", "plannedUses",'all','全部');//规划用途
	var str='';
	var numArr=['零','一','二','三','四','五','六','七','八','九','十']
	for(var i=0;i<21;i++){
		if(i>9){
			str+='<option value="'+i+'">'+i+'</option>';
		}else{
			str+='<option value="0'+i+'">'+i+'</option>';
		}
	}
	$(".layout").append(str);
	$(".layout").trigger("chosen:updated");
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
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/house/main/findpagelessors'});
		
	});
	// 初始化所属人
	searchContainer.searchUserListByComp($("#J_user"), true);
	// 初始化录入人
	searchContainer.searchUserListByComp($("#J_createUser"), true);
	searchBusiness($("#J_business"),true,'right');
	$('#J_reset_buy').on('click', function(event){
		$('.J_chosen').val('');		
		enddate.min='';
		enddate.start='';
		begindate.max='';
		$("#datetype").val('1');
		$('.J_chosen').trigger('chosen:updated');
		$('#J_deptLevel').val('');
		$('#J_createDepartmentLevel').val('');
	})
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	
	// 显示录入部门树状结构
	$('#J_createSelect').on('click', function() {
		showDeptTree($('#J_createDepartment'),$("#J_createDepartmentLevel"));
	});
	$(document).on("change",'#yesOrNo',function(){
		var val=$(this).val();
		if(val==''){
			$("#proxyStatus").val('');
			$("#proxyType").val('');
			$("#proxyStatusCon").hide();
			$("#proxyTypeCon").hide();
			
		}else if(val=='1'){
			$("#proxyType").val('');
			$("#proxyStatusCon").show();
			$("#proxyTypeCon").hide();
			$("#proxyStatus").val('0');
		}else if(val=='0'){
			$("#proxyStatus").val('');
			$("#proxyStatusCon").hide();
			$("#proxyTypeCon").show();
			$("#proxyType").val('10');
		}
		$('#proxyType').trigger('chosen:updated');
		$('#proxyStatus').trigger('chosen:updated');
		
	})
	$(document).on("change",'#customerSource',function(){
			$(".none").empty();
			var val=$(this).val();
			if(val==29||val==36||val==45||val==4||val==8){
				var str='<select id="customerSourceType" name="infoSourceId" class="J_chosen form-control m-b" data-placeholder="请选择" required></select>';
				$(".none").append(str);
			}
			if(val==29){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource29","10_29");
			}else if(val==36){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource36","20_36");
			}else if(val==45){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource45","30_45");
			}else if(val==4){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource4","40_4");
			/*}else if(val==43){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource43","50_43");*/
			}else if(val==8){
				dimContainer.buildDimChosenSelector($("#customerSourceType"), "customerSource8","60_8");
			}
		});
	
	$("#dataTableArea th").on("click",function(){
		if($(this).children('.fa').length==0){
			 var html='<i class="fa fa-caret-up"></i>';
			 $(this).closest("#dataTableArea").find('.fa-caret-down').remove();
			 $(this).closest("#dataTableArea").find('.fa-caret-up').remove();
			 rank='asc';
			 $(this).append(html);
		 }else{
			 if($(this).children('.fa').hasClass("fa-caret-up")){
				 	$(this).children('.fa').remove();
				 	var html='<i class="fa fa-caret-down"></i>';
				 	$(this).append(html);
				 	 rank='desc';
			 }else if($(this).children('.fa').hasClass("fa-caret-down")){
			 	$(this).children('.fa').remove();
				var html='<i class="fa fa-caret-up"></i>';
			    $(this).append(html);
			    rank='asc';
			 }
		 }
		 sort=$(this).attr('id');
		 $('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/house/main/findpagelessors' });
		// initListLoad();

})

	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/house/main/findpagelessors',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_lessorform').serializeObject();
				o.sortPropertyName=sort;
				o.sortDirectName=rank; 
				o.timestamp = new Date().getTime();
				o.currentPageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				if(o.departmentId){
					o.departmentId = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.belongUserId){
					o.belongUserId = encodeURI($("#J_user").attr("data-id"))
				}
				if(o.createDepartmentId){
					o.createDepartmentId = encodeURI($("#J_createDepartment").attr("data-id"))
				}
				if(o.createUserId){
					o.createUserId = encodeURI($("#J_createUser").attr("data-id"))
				}
				if(o.buildingIds){
					o.buildingIds = encodeURI($("#J_build").attr("data-id").split(';')[1])
				}
				if(o.businessId){
					o.businessId = encodeURI($("#J_business").attr("data-id"))
				}
				var val=$("#yesOrNo").val();
				if(val==''){
					o.proxyStatus='';	
				}else if(val=='1'){
					o.proxyStatus=$("#proxyStatus").val();					
				}else if(val=='0'){
					o.proxyStatus=$("#proxyType").val();
				}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.recordTotal > 0) {
					//console.log(result.data.recordTotal);
					return { "rows": result.data.records, "total": result.data.recordTotal }
				}
				return { "rows": [], "total": 0 } 
			},
				columns:[{field: '', title: '',align: 'center',
							formatter: function (value, row, index){ 
								var html="";
								var classes="";
								if(row.blacklistStatusId==1){
									classes+=" fa-exclamation-circle";
								} 
								if(row.limitedCustomerStatusId==1){
									classes+=" fa-ban";
								}
								if(classes){
									classes="fa"+classes;
									html+='<i class="'+classes+'"></i>';
									return html;
								}
								if(row.ownerCredibilityLabelId==2){
									html+='<i class="fa fa-star" style="color:#F1C40F"></i>';
								}else{
									html+='<i class="fa"></i>';
								}
								return html; 
							}
						},	         
			      	    {field: 'houseId', title: '房源编号', align: 'center',
							formatter: function (value, row, index){ 
			      				var html = '';
			      				html ='<a target="_blank" href="../main/leasedetail.htm?houseid='+row.houseId+'">'+row.houseId+'</a>';
			      				return html;
							}
			      	    },
			      	    {field: 'planningPurposeName', title: '规划用途', align: 'center'},
			      	    {field: 'inquisitionId', title: '图/钥', align: 'center',
			      	    	formatter: function (value, row, index){ 
			      				var html = '';
		      					if(row.inquisitionId){
		      						if($("#temp_check").val()!=undefined){
		      						html += '<a target="_blank" href="../inquisition/inqCheckPage.html?inquId='+row.inquisitionId+'"><i class="fa fa-picture-o" style="font-size: 16px;"></i></a>'
		      						}else{
		      							html+='-';
		      						}
		      					}else{
				      				html+='-';	
			      				}
			      				if(row.keyId){
			      					if($("#temp_view").val()!=undefined){
			      						html +='<a target="_blank" href="../keyadmin/detail.htm?id='+row.keyId+'" class="m-l-sm"><i class="fa fa-key" style="font-size: 16px;color:#fd9917"></i></a>';
			      					}else{
			      						html+='-';
			      					}
			      					
			      				}else{
			      					html+='-';
			      				}
			      				return html;
							}
			      	    },
			      	    {field: 'buildingName', title: '楼盘名',  align: 'center'},
			      	    {field: 'floorIndex', title: '楼层', align: 'center',
			      	    	formatter: function (value, row, index){
			      	    		var html='';
			      	    		var floorIndex=row.floorIndex? row.floorIndex:'-',
			      	    			floorNumber=row.floorNumber?row.floorNumber:'-';
			      	    		html=floorIndex+'/'+floorNumber;
			      	    		return html;
			      	    	}
			      	    },
			      	    {field: 'roomNumber', title: '室厅厨卫阳', align: 'center',
			      	    	formatter: function (value, row, index){ 
			      				var html = '';
			      				var roomNumber = row.roomNumber ? row.roomNumber : '0',
			      					livingRoomNumber =row.livingRoomNumber ? row.livingRoomNumber :'0',
			      					kitchenNumber = row .kitchenNumber ? row.kitchenNumber :'0',
			      					toiletNumber = row.toiletNumber ? row.toiletNumber :'0',
			      					balconyNumber =row .balconyNumber ? row.balconyNumber:'0';
			      				html = roomNumber+'-'+livingRoomNumber+'-'+kitchenNumber+'-'+toiletNumber+'-'+balconyNumber  
			      				return html;
							}
			      	    },
			      	    {field: 'coveredArea', title: '建筑面积/平方米',align: 'center'},
			           	{field: 'headingNames', title: '朝向', align: 'center',},
			      	    {field: 'entrustprice', title: '意向租金<br>元/月或元/平方米/天', align: 'center',
			           		formatter: function (value, row, index){ 
								var html="";
								var price=row.price?row.price:'-';
								if(row.priceChangeDirectionId==-1){
									html='<div class="text-right"><span  onclick="checkPrice('+row.houseId+')" style="color:#57CC00;cursor: pointer;">'+price+'&nbsp;<i class="fa fa-long-arrow-down"></i></span></div>'
								}else if(row.priceChangeDirectionId==1){
									html='<div class="text-right"><span onclick="checkPrice('+row.houseId+')" style="color:#FC2C00;cursor: pointer;">'+price+'&nbsp;<i class="fa fa-long-arrow-up"></i></span></div>'
								}else if(row.priceChangeDirectionId==0){
									html='<div class="text-right"><span>'+price+'</span></div>'
								}
								return html; 
							}
			      	    },
			      	    {field: 'rentModeName', title: '出租方式', align: 'center',},
			      	    {field: 'belongUserName', title: '所属人', align: 'center',
			      	    	formatter: function(value ,row, index){
			      	    		var html='';
			      	    		var belongUserName=row.belongUserName? row.belongUserName:'-';
			      	    		if(belongUserName!='-'){
			      	    			html='<a class="belongUser" attr="'+row.belongUserId+'">'+belongUserName+'</a>'
			      	    		}else{
			      	    			html='-';
			      	    		}
			      	    		return html;
			      	    	}
			      	    },
			      	    {field: 'registerDate', title: '录入日期', align: 'center',},
			      	 	{field: 'lastFollowDate', title: '最后跟进日期', align: 'center', }
			      	],

		})
	
	}
	jQuery('#J_dataTable').delegate('.belongUser','click',function(event){
		getUserStaffInfo($(this).attr('attr'));
	})
/*	jQuery('#J_dataTable').delegate('a','click',function(event){
		if(this.type=="belongs"){
			commonContainer.modal(
					"员工信息",
					$("#belongs_layer"),
					function(index, layero){},
					{
						overflow:true,
						area: ['400px','300px'],
						btns: ['确定','取消'],
					}
			)
		}else if(this.type=="price"){
			commonContainer.modal(
					"价格变动详情",
					$("#price_layer"),
					function(index, layero){
						
					},
					{
						overflow:true,
						area: ['650px','300px'],
						btns: ['确定','取消'],
					}
			)
		}
	})*/
})