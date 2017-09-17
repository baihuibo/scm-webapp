var arr=[];//合同的
window.customArr=[];//客户的
window.validArr=[];//选中的
window.buyDetail=[];// 买卖意向
var sletarr=[];
//window.onload=function(){
//	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType","");
//	/*dimContainer.buildDimChosenSelector($("#J_financePayType"), "financePayType","1");*/
//}
var isInit=true;
$(function(){
	$('select').chosen({
		width : '100%' , 
		no_results_text: '未找到此选项!'
	});
	//业务类型
	dimContainer.buildDimChosenSelector($('#J_businessType'), 'businessType','');
//	$(document).delegate('#checkboxAll' , 'click' , function(){
//	    $('#J_funddataTable input[name="checkboxItem"]').prop("checked",this.checked); 
//	});
	var $subBox = $("#J_funddataTable input[name='checkboxItem']");
	$(document).delegate("#J_funddataTable input[name='checkboxItem']" , 'click' , function(){
	    $("#checkboxAll").prop("checked",$("#J_funddataTable input[name='checkboxItem']").length == $("#J_funddataTable input[name='checkboxItem']:checked").length ? true : false);
	});
	$(document).delegate('#addplan','click',function(event){
		var $ctrl = $('#ibox').controller();
    	var $scope = $('#ibox').scope();
		commonContainer.modal('计划添加',$('#add_layer'),function(index, layero){
				if($('#contractCent').hasClass('active')){
					var selectedDatas=$('#J_contractdataTable').bootstrapTable('getSelections');	//选中的合同数据
					if(selectedDatas.length==0){
						return layer.alert("请选择合同列表");
					}
					
					//var flag=1;
//					var tempArr=[];//当前弹框攒中的列表人员id
//					$("#J_contractdataTable input[name=btSelectItem]:checked").each(function(){
//						var temp=$(this).next().attr('data-customerCode');
//						tempArr.push(temp);
//					});
//					var totaltempArr=[];
//					totaltempArr=tempArr.concat(customArr);
//					if(totaltempArr.length>1){
//						for(var i=0;i<totaltempArr.length-1;i++){  					  
//							if (totaltempArr[i]!=totaltempArr[i+1]){  					  
//								layer.alert("客户姓名不一致");
//								return false;					  
//							}  					  
//						}
//					}
					//判断客户是否一致
					var customerIdCardList='';
					var customerIdCard='';
					var shareCustomerIdCardList=[];
					var isxd=false;
					//sletarr.concat(selectedDatas);
					$.each(sletarr.concat(selectedDatas),function(i,n){
						customerIdCard=JSON.stringify(n.customerIdCardList.sort(sortByProps));
						shareCustomerIdCardList.push(JSON.stringify(n.shareCustomerIdCardList.sort(sortByProps)));
						if(i>0){
							if(customerIdCardList!==customerIdCard){
								isxd=true;
								return false;
							}
						}else{
							customerIdCardList=customerIdCard;
						}
					});
					if(isxd){
						return layer.alert('客户不一致');
					}else{
						var sharefalg=false;
						$.each(shareCustomerIdCardList,function(index,cont){
							if(index>0){
								if(shareCustomerIdCardList[0]!==cont){
									sharefalg=true;
									return false;
								}
							}
						});
						if(sharefalg){
							return layer.alert('客户不一致');
						}
					}
					var ArrTemp=[];
					var validArrTemp=[];
					var customArrTemp=[];
//					$("#J_contractdataTable input[name=btSelectItem]:checked").each(function(){						
//						var obj={};
//						obj.contractId=$(this).next().attr('data-contractId');
//						obj.contractCode=$(this).next().attr('data-contractCode')
//						obj.businessType=$(this).next().attr('data-contractType')
//						obj.customerName=$(this).next().attr('data-customerName')
//						obj.ownerName=$(this).next().attr('data-ownerName')
//						obj.customerCode=$(this).next().attr('data-customerCode')
//						validArrTemp.push(obj)
//						ArrTemp.push(obj.contractId);
//						var customId=$(this).next().attr('data-customerCode')
//						customArrTemp.push(customId);
//						
//					})
					sletarr=sletarr.concat(selectedDatas);
					$.each(sletarr,function(i,n){
						validArr.push({
							contractId:n.contractId,
							contractCode:n.contractCode,
							businessType:n.contractType,
							customerName:n.customerName,
							ownerName:n.ownerName,
							customerCode:n.customerCode
						});
						//customArrTemp.push(n.customerCode);
					});
//					if(!checkArr(arr,ArrTemp)){
//						arr=arr.concat(ArrTemp);
//						validArr=validArr.concat(validArrTemp);
//						customArr=customArr.concat(customArrTemp);
//					}else{
//						layer.alert("存在重复添加的数据，请重新选择！");
//						return false;	
//					}
					validArr=cwunique(validArr);
					$ctrl.planinfo();
					$scope.$digest();
					//layer.msg("成功");
					layer.close(index);
				}else{
					var intentionDatas=$("#J_intentiondataTable").bootstrapTable('getSelections');
					//var maiyxFalg=false;
					if(intentionDatas.length==0){
						return layer.alert('请选择买卖意向列表');
					}
					if(buyDetail.length>0){
						if(buyDetail[0].clientId!=intentionDatas[0].clientId){
							return layer.alert('客户不一致');
						}
					}
					//if(buyDetail.length>0){
						//var firstclientId = buyDetail[0].clientId;
						
						//console.log(firstclientId);
//						$.each(buyDetail,function(i,n){
//							if(firstclientId!==n.clientId){
//								maiyxFalg=true;
//								return false;
//							}
//						});
					//}
//					if(maiyxFalg){
//						return layer.alert('客户不一致');
//					}
					//buyDetail=[];
					$("#J_intentiondataTable input[name=btSelectItem]:checked").each(function(){
						buyDetail.push({
							clientId:$(this).closest('tr').find('td').eq(2).text(),
							clientName:$(this).closest('tr').find('td').eq(4).text(),
							businessType:'买卖意向',
							collectionSource:3,
							houseId:$(this).closest('tr').find('td').eq(1).text(),
							customerSid:$(this).next().attr("attr")
						});					
					});
					buyDetail=cwunique(buyDetail);
					$ctrl.buyplan();
					$scope.$digest();
					layer.close(index);
				}
			},
			{
				overflow:true,
				area: ['90%','90%'],
				btns: ['确 认','取 消'],
				success:function(){
					$("#J_contractform")[0].reset();
					$("#J_intentionform")[0].reset();
					$('#J_businessType').trigger('chosen:updated');
					searchContract();
					if(isInit){
						$('#J_contractsearch').off().on('click',searchContract);	
						$('#J_intentionsearch').off().on('click',searchClient);
						isInit=false;
					}
				}
			}
		);
	});
});




/*合同查询*/
function searchContract(){
	$('#J_contractdataTable').bootstrapTable('destroy').bootstrapTable({ 
		url:basePath + '/finance/collect/searchContract.htm',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = jQuery('#J_contractform').serializeObject();
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { 
					'rows': result.data.list,
					'total': result.data.totalcount
				}
			}
			return { 
				'rows': [], 
				'total': 0
			} 
		},
		columns:[
           	{
           		checkbox:true, 
           		align: 'center',
           		formatter: function(value, row, index){
      				return '<input type="hidden" name="inputcheckbox" data-customerCode='+row.customerCode+' data-contractId='+row.contractId+' data-contractType='+row.contractType+' data-customerName='+row.customerName+' data-customerCode='+row.customerCode+' data-ownerName='+row.ownerName+'  data-contractCode='+row.contractCode+'>';
      	    	}
           	},
           	{
           		field:'contractCode',
           		title :'合同编号',
           		align: 'center'
           	},
           	{
           		field:'contractTypeStr',
           		title :'业务类型',
           		align: 'center'
           	},
           	{
           		field:'customerName',
           		title :'客户姓名',
           		align: 'center'
           	},
           	{
           		field:'ownerName',
           		title :'业主姓名',
           		align: 'center'
           	},
           	{
           		field:'inputTime',
           		title :'录入日期',
           		align: 'center'
           	},
           	{
           		field:'belongUserName',
           		title :'成交人',
           		align: 'center',
           		formatter: function(value ,row, index){
      	    		return '<a onclick="getUserStaffInfo('+row.belongUserId+')">'+row.belongUserName+'</a>';
      	    	}
           	},
           	{
           		field:'belongDeptName',
           		title :'所属部门',
           		align: 'center'
           	}
      	]
	});
}
//买卖意向查询
function searchClient(){
	$('#J_intentiondataTable').bootstrapTable('destroy').bootstrapTable({ 
		url:basePath + '/finance/collect/searchClient.htm',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = jQuery('#J_intentionform').serializeObject();
			o.timestamp = new Date().getTime();
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { 
					'rows': result.data.list, 
					'total': result.data.totalcount 
				}
			}
			return { 
				'rows': [], 
				'total': 0
			} 
		},
		columns:[
	       	{
	       		radio:true, 
	       		align: 'center',
	       		formatter: function(value, row, index){
	  				return '<input type="hidden" name="inputradio" attr="'+row.customerSid+'"/>';
	  	    	}
	       	},
	       	{
	       		field: 'houseId',
	       		title :'房源编号',
	       		align: 'center'
	       	},
	       	{
	       		field: 'clientId',
	       		title :'客户编号',
	       		align: 'center'
	       	},
	       	{
	       		field: 'showingsid',
	       		title :'带看单号',
	       		align: 'center'
	       	},
	       	{
	       		field: 'customerName',
	       		title :'客户姓名',
	       		align: 'center'
	       	},
	       	{
	       		field: 'sex',
	       		title :'性别',
	       		align: 'center'
	       	},
	       	{
	       		field: 'countryName',
	       		title :'国籍',
	       		align: 'center'
	       	}
	  	]
	});
}

function  checkArr(arr1,arr2){
    var rs=false;
    for (var i=0; i<arr1.length; i++){
        for (var j=0;j<arr2.length;j++){
	        if( arr1[i]== arr2[j]){
		        rs=true;
		        break;
	        }
        }
    }
    return rs;
}
//数组去重
function cwunique(arr){
	if(arr){
		var res = [];
		var json = {};
		var cont='';
		for(var i = 0; i < arr.length; i++){
			cont=JSON.stringify(arr[i]);
			if(!json[cont]){
				res.push(arr[i]);
				console.log(cont);
				json[cont] = 1;
			}
		}
		return res;
	}
}
//数组排序规则（多属性）
function sortByProps(item1, item2) {
    var props = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        props[_i - 2] = arguments[_i];
    } 
    var cps = []; // 存储排序属性比较结果。
    // 如果未指定排序属性，则按照全属性升序排序。    
    var asc = true;
    if (props.length < 1) {
        for (var p in item1) {
            if (item1[p] > item2[p]) {
                cps.push(1);
                break; // 大于时跳出循环。
            } else if (item1[p] === item2[p]) {
                cps.push(0);
            } else {
                cps.push(-1);
                break; // 小于时跳出循环。
            }
        }
    } else {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            for (var o in prop) {
                asc = prop[o] === "asc";
                if (item1[o] > item2[o]) {
                    cps.push(asc ? 1 : -1);
                    break; // 大于时跳出循环。
                } else if (item1[o] === item2[o]) {
                    cps.push(0);
                } else {
                    cps.push(asc ? -1 : 1);
                    break; // 小于时跳出循环。
                }
            }
        }
    }        
         
    for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
            return cps[j];
        }
    }
    return 0;          
}