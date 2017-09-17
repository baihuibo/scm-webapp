var res={};
(function(window){
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('PlanCtrl', ['PlanService', 'signUtil', 'signService','$scope',function(PlanService, signUtil, signService,$scope){
		var $ctrl = this;	
		var contractId = signUtil.getSearchValue('contractId') || '';//来自合同
		var clientId=signUtil.getSearchValue('clientId') || '';//来自买卖意向
		var chargebackId=signUtil.getSearchValue('chargebackId') || '';//来自退单
		/*var validArr=[];
		var buyDetail={};*/
		var obj={};
		$ctrl.clientType;		
		$ctrl.ifbuyDetail=false;
		$ctrl.contract=false;
		$ctrl.client=false;
		$ctrl.contractNumber=null;
		$ctrl.skzje=0;
		$ctrl.sjzje=0;
		var selectedCons=[];
		$ctrl.planinfo = function () {	
			PlanService.getSubsidiaryquery(validArr).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				console.log($ctrl.detail);
			});
		};
		$ctrl.buyplan=function () {	
			$ctrl.ifbuyDetail=true;
			$ctrl.buyDetail=buyDetail;
		};
		$ctrl.payList = [];
		$scope.$watch('$ctrl.payList',function(oldval,newval){
			console.log(oldval);
			if(oldval!=newval){
				$ctrl.payList.forEach(function(val){
					console.log(val);
					$ctrl.skzje+=val.amount*1;
				});
			}
		});
		if(contractId!=''){
			$ctrl.contract=true;							
			var obj={};
			obj.contractId=signUtil.getSearchValue('contractId') || '';
			
			PlanService.getInfo({'contractId' :obj.contractId}).then(function (result) {
				if (result.code !== 0) {
                    return layer.alert(result.msg);
                }
				obj.contractCode=result.data.contractNumber;
				obj.businessType=result.data.businessType;
				if(result.data.businessType==1){
					obj.collectionSource="租赁合同";
				}else if(result.data.businessType==2){
					obj.collectionSource="买卖合同";
				}			
				obj.customerName=result.data.clientName;
				obj.ownerName=result.data.ownerName;
				obj.customerCode=result.data.clientId;
				validArr.push(obj)			
				$ctrl.planinfo();
			});
			
		}
		if(clientId!=''){
			$ctrl.client=true;
			buyDetail={};
			buyDetail.clientId=signUtil.getSearchValue('clientId') || '';
			buyDetail.clientName=signUtil.getSearchValue('clientName') || '';
			buyDetail.businessType='买卖意向';
			buyDetail.collectionSource=3;
			buyDetail.houseId=signUtil.getSearchValue('houseId') || '';
			console.log(buyDetail);
			$ctrl.buyplan();
			var collectPlanList=[];
			collectPlanList=collectPlanList.concat($ctrl.buyDetail);
			obj.collectPlanList=collectPlanList;
		}
		
		$ctrl.addgathering = function(){
			signUtil.openLayer('addgatheringLayer' , null , '添加收款', PlanService,selectedCons)
				.then(function(data){
					$ctrl.payList.push(data);
					$ctrl.skzje=0;
					$ctrl.payList.forEach(function(val){
						console.log(val);
						$ctrl.skzje+=(val.amount*1);
					});
				} , $.noop);
		};
		
		$ctrl.modifyPay = function(item , index){
			signUtil.openLayer('addgatheringLayer' , item , '修改收款', PlanService,selectedCons)
				.then(function(data){
					$ctrl.payList[index] = data;
					$ctrl.skzje=0;
					$ctrl.payList.forEach(function(val){
						console.log(val);
						$ctrl.skzje+=(val.amount*1);
					});
				} , $.noop);
		};
		$ctrl.removePay= function(item , index){
			var msg="确定要删除吗？";
			signUtil.confirm(msg).then(function () {
				$ctrl.payList.splice(index, 1);
				$ctrl.skzje=0;
				$ctrl.payList.forEach(function(val){
					console.log(val);
					$ctrl.skzje+=(val.amount*1);
				});
            }, $.noop)
		}; 
        $ctrl.receiptList = [];
		$ctrl.addreceipt = function(){
			signUtil.openLayer('addreceiptLayer' , null , '添加新收据', PlanService,selectedCons,$ctrl.buyDetail,$ctrl.clientType)
				.then(function(data){
					$ctrl.receiptList.push(data);
					$ctrl.sjzje=0;
					$ctrl.receiptList.forEach(function(val){
						console.log(val);
						$ctrl.sjzje+=(val.amount*1);
					});
				} , $.noop);
		};
		
		$ctrl.modifyReceipt = function(item , index){
			signUtil.openLayer('addreceiptLayer' , item , '修改收据', PlanService,selectedCons,$ctrl.buyDetail,$ctrl.clientType)
				.then(function(data){
					$ctrl.receiptList[index] = data;
					$ctrl.sjzje=0;
					$ctrl.receiptList.forEach(function(val){
						console.log(val);
						$ctrl.sjzje+=(val.amount*1);
					});
				} , $.noop);
		};
		$ctrl.removeReceipt= function(item , index){
			var msg="确定要删除吗？";
			signUtil.confirm(msg).then(function () {
				$ctrl.receiptList.splice(index, 1);
				$ctrl.sjzje=0;
				$ctrl.receiptList.forEach(function(val){
					console.log(val);
					$ctrl.sjzje+=(val.amount*1);
				});
            }, $.noop); 
		};
		//设置全选
		$ctrl.allquxz=function(list){
			list.planList.forEach(function(val){
				val.$$checked=list.allCheked;
			});
		};
		var money=0;
		$ctrl.tab=function(num){
			
			if(num==0){
				if((!$ctrl.detail || !$ctrl.detail.length) && buyDetail.length==0){
					return layer.alert('请选择合同');
				}
				var data = $.extend(true , [] , $ctrl.detail);	
				var clientType='';
				selectedCons = data.filter(function(item){
					/*if(!item.planList || !item.planList.length){
						return false;
					}*/					
					var selecteds = item.planList.filter(function(plan){
						return plan.$$checked;
					});
					
					/*if(!selecteds.length){
						return false;
					}*/					
					item.planList = selecteds;					
					return true;
				});				
				if(!selectedCons.length&&!$ctrl.ifbuyDetail){
					return layer.alert('请选择收款计划');
				}				
				console.log('selectedCons' , selectedCons);
				var arr = angular.fromJson(angular.toJson(selectedCons));
				
				console.log('arr' , arr);
				console.log('$ctrl.buyDetail' , $ctrl.buyDetail);
				if($ctrl.ifbuyDetail){
					for(var i=0;i<selectedCons.length;i++){
						for(var j=0;j<selectedCons[i].planList.length;j++){
							if(selectedCons[i].planList[j].payerStr=='业主'){
								return layer.alert('请选择同一类型付款方');;
							}
							
						}
//						if(selectedCons[i].clientId!=$ctrl.buyDetail.customerSid){
//							return layer.alert('客户不一致请重新选择');;
//						}
					}
					
				}else{
					for(var i=0;i<selectedCons.length;i++){
						for(var j=0;j<selectedCons[i].planList.length;j++){
							clientType=selectedCons[i].planList[j].payerStr;
							if(selectedCons[i].planList[j].payerStr!=selectedCons[0].planList[0].payerStr){
								return layer.alert('请选择同一类型付款方');
							}
							
						}
					}
					
//					for(var i=0;i<selectedCons.length-1;i++){
//						if(selectedCons[i].clientId!=selectedCons[i+1].clientId){
//							return layer.alert('客户不一致请重新选择');
//						}
//					}
				}
				if($ctrl.ifbuyDetail){
					$ctrl.clientType='客户';
				}else{					
					$ctrl.clientType=clientType;					
				}
				var collectPlanList=[];
				if(selectedCons.length!=0){
					collectPlanList=collectPlanList.concat(selectedCons);
				}
				if($ctrl.buyDetail!=undefined){
					delete $ctrl.buyDetail.businessType;
					collectPlanList=collectPlanList.concat($ctrl.buyDetail);
				}
				
				obj.collectPlanList=collectPlanList;
				console.log(obj);
				$(".nav-tabs li").eq(1).children(".taba").attr({"data-toggle":"tab"});
				$(".nav-tabs li").eq(1).children(".taba").attr({"href":"#tab-2"});
				$('#lease-add li:eq(1) a').tab('show');
				$(".nav-tabs li").each(function(){
					if($(this).index()<1){
						$(this).children(".taba").removeAttr("data-toggle");
						$(this).children(".taba").removeAttr("href");
					}
				});
			}else if(num==1){ 
				console.log($ctrl.payList);
				if($ctrl.payList.length==0){
					return layer.alert('请添加收款！');
				}
				for(var i=0;i<$ctrl.payList.length;i++){
					money=Number(money)+Number($ctrl.payList[i].amount);
				}
				obj.collectList=$ctrl.payList;
				$(".nav-tabs li").eq(2).children(".taba").attr({"data-toggle":"tab"});
				$(".nav-tabs li").eq(2).children(".taba").attr({"href":"#tab-3"});
				$('#lease-add li:eq(2) a').tab('show');
				$(".nav-tabs li").each(function(){
					if($(this).index()<2){
						$(this).children(".taba").removeAttr("data-toggle");
						$(this).children(".taba").removeAttr("href");
					}
				});
			}else if(num==2){
				//$ctrl.isPayeexd=false;
				var data={};
				var list=$.extend(true , [] , selectedCons);				
				var selectedList = list.filter(function(item){					
					var selecteds = item.planList.filter(function(plan){
						console.log(plan.fundCode)
					    data[plan.contractCode + plan.fundName] = plan.contractCode + "," +plan.fundCode+","+plan.payee;
						/*data[plan.fundCode] = plan.fundCode;*/
					});										
				});
				console.log(data);
				var fundlist=[];
				for(var key in data){
					fundlist.push(data[key]);
				}
				console.log("fundlist"+fundlist);
				var datafundlist={};
				var selectedfundlist = $ctrl.receiptList.filter(function(receipt){
					console.log(receipt.fundCode)
				    datafundlist[receipt.contractCode + receipt.fundName] = receipt.contractCode + "," +receipt.fundCode+","+receipt.payee;
				});
				if($ctrl.receiptList.length==0){
					return layer.alert('请添加收据！');
				}
				var fundlists=[];
				for(var key in datafundlist){
					fundlists.push(datafundlist[key]);
				}
				console.log("fundlists"+fundlists);
				for(var i=0;i<fundlist.length;i++){
					if($.inArray(fundlist[i], fundlists)==-1){
						return layer.alert('收据票据不全，请添加！');
					}		
				}
				var temmoney=0;
				for(j=0;j<$ctrl.receiptList.length;j++){
					temmoney=Number(temmoney)+Number($ctrl.receiptList[j].amount);
				}
				if(temmoney!=money){
					return layer.alert('收据金额不等于收款金额，请确认！');
				}
//				angular.forEach($ctrl.receiptList,function(data){
//					if($ctrl.receiptList[0].payer!==data.payer){
//						$ctrl.isPayeexd=true;
//						return false;
//					}
//				});
//				if($ctrl.isPayeexd){
//					layer.alert('请选择相同的付款方');
//					return false;
//				}
				obj.receiptList=$ctrl.receiptList;
				if(chargebackId!=''){
					obj.chargebackId=chargebackId;
				}
				console.log(JSON.stringify(obj));
				
				PlanService.submit(obj).then(function (result) {
					if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
					commonContainer.alert('操作成功');
					
					window.location.href=basePath + '/finance/collect/batchList.html';
				});
				
				
			}
		};
		// 删除证件
        $ctrl.removecontract = function (contract, list) {
        	console.log(contract);
        	console.log(list);
        	console.log(contract.contractOwnerName);
        	console.log(contract.contractCode);
            signUtil.confirm('确定删除此数据？')
                .then(function () {
                    // 删除数据
                	arr.splice(arr.indexOf(contract.contractCode), 1);
                	customArr.splice(customArr.indexOf(customArr.clientId), 1);//换成客户的id
                	validArr.splice(validArr.indexOf(contract.contractCode), 1);
                	sletarr.splice(validArr.indexOf(contract.contractCode), 1);		//??
                    list.splice(list.indexOf(contract), 1);
                }, $.noop);
        };
        //删除买卖意向
        $ctrl.removeMyx=function(value){
        	signUtil.confirm('确定删除此数据？').then(function(){
        		buyDetail.splice(buyDetail.indexOf(value),1);
        	},$.noop);
        };
     // 统一获取所有的keyCode 列表，并且绑定到 $ctrl
		[
		 'financePayType',// 房屋校验
		].forEach(function(keyCode){
			signService.getTypes(keyCode).then(function(result){
				$ctrl[keyCode] = result.data;	
			});
		})
	}])
	
	.service('PlanService' , ['$http' , function($http){
		this.getSubsidiaryquery= function(data){
			return $http.post(basePath + '/finance/collect/selectContractCollectPlan' , data).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		this.getpaymenthond= function(data){
			return $http.get(basePath + '/finance/collect/selectBankByPayType' , {params: data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		this.getchangsourceId= function(data){
			return $http.get(basePath + '/finance/collect/selectPaymentByContractNum' , {params: data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		this.getfundName= function(data){
			return $http.get(basePath + '/finance/collect/collectFundList' , {params: data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		this.submit = function (paramsData) {
            return $http.post(basePath + '/finance/collect/submitCollectBatch',  paramsData).then(function (response) {
                return response.data;
            })
        };
        this.getInfo= function(data){
			return $http.get(basePath + '/finance/choose/info' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		//支付方式账号验重
		this.isaccountRepeat=function(data){
			return $http.get(basePath+'/finance/collect/CollectBatchConfirm.htm',{params:data}).then(function(response){
				return response.data;
			});
		};
	}])
	.component('addgatheringLayer' , {
		template : '<div class="ibox-content">\n    <form class="form-horizontal" role="form" id="J_addPlanform">\n    <div class="row">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label">支付方式：</label>\n    <div class="col-sm-8">\n    <select chosen name="paymenyType"  required style="width:515px" ng-model="$ctrl.data.paymenyType" ng-options="item.valueCode as item.valueName for item in $ctrl.filterfn($ctrl.financePayType)" ng-change="$ctrl.changepayMethond()"></select>\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 支票 -->\n    <div class="row" ng-if="$ctrl.data.paymenyType==6">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支票号：</label>\n    <div class="col-sm-8">	\n    <input type="text" class="form-control"  ng-model="$ctrl.data.payerAccountNo" name="payerAccountNo">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>出票单位：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.payerName" name="payerName">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 支付宝 -->\n    <div class="row" ng-if="$ctrl.data.paymenyType==1">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>存入日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>存入金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control"  name="amount" ng-model="$ctrl.data.amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付宝账户名称：</label>\n    <div class="col-sm-8">\n    <select name="payeeAccountCode" chosen class="J_chosen form-control" ng-model="$ctrl.data.$$payAccountItem" ng-options="item as item.bankName for item in $ctrl.payAccountList"></select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payeeAccountNo" ng-model="$ctrl.data.$$payAccountItem.account" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>交易号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="transNumber" ng-model="$ctrl.data.transNumber">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>付款人全称：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payerName" ng-model="$ctrl.data.payerName">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付宝账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payerAccountNo" ng-model="$ctrl.data.payerAccountNo">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 转账 -->\n    <div class="row" ng-if="$ctrl.data.paymenyType==3">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付金额：</label>\n    <div class="col-sm-8">	\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款银行：</label>\n    <div class="col-sm-8">	\n    <select name="payeeAccountCode" class="J_chosen form-control" ng-model="$ctrl.data.$$payAccountItem" ng-options="item as item.bankName for item in $ctrl.payAccountList"></select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payeeAccountNo" ng-model="$ctrl.data.$$payAccountItem.account" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>付款人全称：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.payerName" name="payerName">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>付款人账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.payerAccountNo" name="payerAccountNo">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- pos刷卡 -->\n    <div class="row"  ng-if="$ctrl.data.paymenyType==4">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>刷卡日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>刷卡金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>刷卡方式：</label>\n    <div class="col-sm-8">\n    <select name="payeeAccountCode" class="J_chosen form-control" ng-model="$ctrl.data.$$payAccountItem" ng-options="item as item.bankName for item in $ctrl.payAccountList">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payeeAccountNo" ng-model="$ctrl.data.$$payAccountItem.account" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>卡号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payerAccountNo" ng-model="$ctrl.data.payerAccountNo">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>12位参考号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.transNumber" name="transNumber">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>终端号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.terminalNumber" name="terminalNumber">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 现金 -->\n    <div class="row"  ng-if="$ctrl.data.paymenyType==7">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 银行存款 -->\n    <div class="row"  ng-if="$ctrl.data.paymenyType==2">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>存入日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>存入金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>银行名称：</label>\n    <div class="col-sm-8">\n    <select name="payeeAccountCode" class="J_chosen form-control" ng-model="$ctrl.data.$$payAccountItem" ng-options="item as item.bankName for item in $ctrl.payAccountList">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payeeAccountNo" ng-model="$ctrl.data.$$payAccountItem.account" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>营业网点：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payerName" ng-model="$ctrl.data.payerName">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 结算卡 -->\n    <div class="row"  ng-if="$ctrl.data.paymenyType==5">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control"  ng-model="$ctrl.data.paymentTime" name="paymentTime"  istime="true" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.amount" name="amount">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款银行：</label>\n    <div class="col-sm-8">\n    <select name="payeeAccountCode" class="J_chosen form-control" ng-model="$ctrl.data.$$payAccountItem" ng-options="item as item.bankName for item in $ctrl.payAccountList">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款账号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payeeAccountNo" ng-model="$ctrl.data.$$payAccountItem.account" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>交易号：</label>\n    <div class="col-sm-8">	\n    <input type="text" class="form-control"  name="transNumber" ng-model="$ctrl.data.transNumber" >\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>结算卡号：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="terminalNumber" ng-model="$ctrl.data.terminalNumber">\n    </div>\n    </div>\n    </div>\n    </div>\n    <!-- 退款余额 -->\n    <div class="row"  ng-if="$ctrl.data.paymenyType==8">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付日期：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control"  ng-model="$ctrl.data.paymentTime" name="paymentTime" ng-click="$ctrl.paymentTimelayer()" sign-laydate fixed="true">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>转入合同编号：</label>\n    <div class="col-sm-8">\n    <select name="sourceId" class="J_chosen form-control" ng-model="$ctrl.data.$$sourceCon" ng-change="$ctrl.queryRefund($ctrl.data.$$sourceCon)" ng-options="item as item.contractCode for item in $ctrl.selectedCons">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>转款单号：</label>\n    <div class="col-sm-8">\n    <select name="refundId" class="J_chosen form-control" ng-model="$ctrl.data.$$refund" ng-options="item as item.applyNumber for item in $ctrl.refundIds">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>支付金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" ng-model="$ctrl.data.$$refund.paidTotalAmount" name="amount" readonly>\n    </div>\n    </div>\n    </div>\n    </div>\n    <div class="row">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label">是否需查账：</label>\n    <div class="col-sm-8" id="">\n    <div class="checkbox checkbox-primary checkbox-inline">\n    <input type="checkbox" name="isAudit" ng-checked="$ctrl.data.paymenyType==1||$ctrl.data.paymenyType==3||$ctrl.data.paymenyType==6"  ng-model="$ctrl.data.isAudit" ng-disabled="$ctrl.data.paymenyType==1||$ctrl.data.paymenyType==6||$ctrl.data.paymenyType==3||$ctrl.data.paymenyType==7||$ctrl.data.paymenyType==8">\n    <label for=""></label>\n    </div>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label">查账原因：</label>\n    <div class="col-sm-8">\n    <textarea class="form-control" id="auditReason" name="auditReason" ng-model="$ctrl.data.auditReason" maxlength="50"  ng-disabled="$ctrl.data.isAudit!=true"></textarea>\n    </div>\n    </div>\n    </div>\n    </div>\n    </form>\n    </div>',
		controller : ['$element' , 'signService','PlanService','$scope',function($element , signService,PlanService , $scope){
			var $ctrl = this;
			//校验器
			var addPlanValidateRule = {
				paymentTime :{
					required:true					
			    },
			    amount :{
			    	required: true,
			    	number:true,
			    	min:0,
			    	decimal: true,
			    },
			    payeeAccountCode :{
					required:true					
			    },
			    payeeAccountName :{
					required:true					
			    },
			    payeeAccountNo :{
					required:true					
			    },
			    payerAccountNo :{
					required:true					
			    },
			    payerName :{
					required:true					
			    },
			    paymenyType :{
					required:true					
			    },
			    refundId :{
					required:true					
			    },
			    sourceId :{
					required:true					
			    },
			    terminalNumber :{
					required:true					
			    },
			    auditReason :{
			    	required:{
						depends: function(element) { 
							if($ctrl.data.isAudit == true&&($ctrl.data.paymenyType==2||$ctrl.data.paymenyType==4||$ctrl.data.paymenyType==5)){
								return true;
							}
						}
					}
			    },
			    transNumber :{
					required:true,
					translength:{
						depends: function(element) { 
							if($ctrl.data.paymenyType == 4){
								return true;
							}
						}
					}
			    },
			    
			};	
			//验证值小数位数不能超过两位  
			jQuery.validator.addMethod("decimal", function (value, element) {  
			var decimal = /^-?\d+(\.\d{1,2})?$/;  
			return this.optional(element) || (decimal.test(value));  
			}, $.validator.format("小数位数不能超过两位!"));  
			jQuery.validator.addMethod("translength", function (value, element) {  
				var reg = /^\d{12}$/;  
				return this.optional(element) || (reg.test(value));  
				}, $.validator.format("请输入12位号码!"));
			
			$ctrl.$start = function($defer, data ,title, PlanService,selectedCons){
			
				$ctrl.data = $.extend(true , {} , data || {});
				$ctrl.selectedCons= $.extend(true , [] , selectedCons || []);
				if(data==null){
					$ctrl.data.paymenyType=1;
					if(selectedCons.length!=0){
						$ctrl.data.$$sourceCon= selectedCons[0];
						$ctrl.queryRefund($ctrl.data.$$sourceCon).then(function(refundList){
							$ctrl.data.$$refund = (refundList || []).find(function(item){
								return item.refundId == $ctrl.data.refundId;
							});
						});
					}		
				}else{
					if($ctrl.data.isAudit!=undefined){
						if($ctrl.data.isAudit==1){
							$ctrl.data.isAudit=true;
						}else{
							$ctrl.data.isAudit=false;
						}
					}
					if($ctrl.data.contractCode && selectedCons && selectedCons.length){
						$ctrl.data.$$sourceCon = selectedCons.find(function(con){
							return con.contractCode == $ctrl.data.contractCode;
						});
						
						if($ctrl.data.$$sourceCon){
							$ctrl.queryRefund($ctrl.data.$$sourceCon).then(function(refundList){
								$ctrl.data.$$refund = (refundList || []).find(function(item){
									return item.applyNumber == $ctrl.data.applyNumber;
								});
							});
						}
					}
				}
				
				$scope.$watch('$ctrl.data.paymenyType' , function(val , oldVal){
					if(oldVal != val){
						for(var key in $ctrl.data){
							if(key != 'paymenyType'){
								$ctrl.data[key] = void 0;
							}							
						}
						angular.element(document.getElementById('auditReason')).closest('.form-group').removeClass("has-error");
						if(angular.element(document.getElementById('auditReason-error'))){
							angular.element(document.getElementById('auditReason-error')).remove();
						}
					}
					if($ctrl.data.paymenyType==1||$ctrl.data.paymenyType==3||$ctrl.data.paymenyType==6){
	                	$ctrl.data.isAudit=true;
	                	
	                }
				});
				$scope.$watch('$ctrl.data.isAudit' , function(val , oldVal){
					if($ctrl.data.isAudit!=true){
						$ctrl.data.auditReason='';
					}
				});
				$ctrl.saveInfo=function(layid){
					if($ctrl.data.$$payAccountItem){
						var account = $ctrl.data.$$payAccountItem;
						delete $ctrl.data.$$payAccountItem;
						/*$ctrl.data.payAccountId = account.accountId;*/
						$ctrl.data.payeeAccountNo = account.account;
						$ctrl.data.payeeAccountCode = account.accountId;
						$ctrl.data.payeeAccountName = account.bankName;
					}
					if($ctrl.data.$$sourceCon){
						var sourceCon = $ctrl.data.$$sourceCon;
						delete $ctrl.data.$$sourceCon;
						$ctrl.data.sourceId = sourceCon.contractId;
						$ctrl.data.contractCode = sourceCon.contractCode;
					}
					if($ctrl.data.$$refund){
						var refund = $ctrl.data.$$refund;
						delete $ctrl.data.$$refund;
						$ctrl.data.applyNumber = refund.applyNumber;
						if($ctrl.data.paymenyType==8){
							$ctrl.data.refundId = refund.applyId;
							$ctrl.data.amount = refund.paidTotalAmount;
						}
						
					}
					if($ctrl.data.isAudit!=undefined){
						if($ctrl.data.isAudit==true){
							$ctrl.data.isAudit=1;
						}else{
							$ctrl.data.isAudit=0;
						}
					}
					console.log($ctrl.data);
                    $defer.resolve($ctrl.data);
                    $ctrl.skzje+=$ctrl.data.amount;
                    layer.close(layid);
				};
				$ctrl.changepayMethond();
				commonContainer.modal(title, $element, function (layid) {
					var validate = true;
					if(!$ctrl.addPlanValidate()){
						console.log("校验失败");
						commonContainer.alert("存在不符合规则的数据！");
						return;
					} 
					//验证账号是否重复
					if($ctrl.data.paymenyType==1 || $ctrl.data.paymenyType==4){
						PlanService.isaccountRepeat({
							paymenyType:$ctrl.data.paymenyType,	//收款支付方式
							transNumber:$ctrl.data.transNumber	//交易号/POS参考号
						}).then(function(result){
							if(result.code !== 0){
								return layer.alert(result.msg);
							}
							$ctrl.saveInfo(layid);
						});
					}else{
						$ctrl.saveInfo(layid);
					}
                }, {cancel: $defer.reject, btn2: $defer.reject, btns: ['保存', '取消'],area: ['800px' , '90%'] , overflow : 'auto'});
			};
			function isEmptyObject(e) {  
			    var t;  
			    for (t in e)  
			        return !1;  
			    return !0  
			}  
			
			$ctrl.queryRefund = function($$sourceCon){
				return PlanService.getchangsourceId({"contractNum":$$sourceCon.contractCode}).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.refundIds = result.data;
					return result.data;
				});
			};
			$ctrl.filterfn=function(list){
				if(list && isEmptyObject($ctrl.selectedCons)){
					return list.slice(0, -1);
				}
				return list;
			};
			$ctrl.changepayMethond=function(){
				PlanService.getpaymenthond({"payType":$ctrl.data.paymenyType}).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.payAccountList = result.data;
					
					if($ctrl.data.payeeAccountCode){
						$ctrl.data.$$payAccountItem = $ctrl.payAccountList.find(function(item){
							return item.accountId === $ctrl.data.payeeAccountCode;
						});
					}else{
						$ctrl.data.$$payAccountItem = $ctrl.payAccountList[0];	
					}
					
				});
			};
			$ctrl.addPlanValidate = function(){
				$.validator.setDefaults({ ignore: ":hidden:not(select)" });

				validate = $('#J_addPlanform').validate({
					rules:addPlanValidateRule
				}).form();
				if(!validate) return false;
				return validate;
			};
			
			[
			 'financePayType',// 房屋校验
			].forEach(function(keyCode){
				signService.getTypes(keyCode).then(function(result){
					$ctrl[keyCode] = result.data;	
				});
			});
		}]
		
	})
	
	.component('addreceiptLayer' , {
		template :'<div id="receipt_layer" class="ibox-content">\n    <form class="form-horizontal" role="form" id="J_addReceiptform">\n    <div class="row">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款来源：</label>\n    <div class="col-sm-8">\n    <select name="collectionSource" chosen class="J_chosen form-control" ng-model="$ctrl.data.$$collectionSource"  ng-change="$ctrl.collectionSourceChange($ctrl.data.$$collectionSource.valueCode)" ng-options="item as item.valueName for item in $ctrl.collectionSource">\n    </select>\n    </div>\n    </div>\n    </div>\n    </div>\n   <div class="row" ng-if="$ctrl.data.$$collectionSource.valueCode==3">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>客户编号：</label>\n    <div class="col-sm-8">\n    <select name="refundId" chosen class="J_chosen form-control" ng-model="$ctrl.data.$$clientId" ng-options="item as item.valueName for item in $ctrl.clientIds">\n    </select>\n    </div>\n    </div>\n    </div>\n    </div>\n    <div class="row" ng-if="$ctrl.data.$$collectionSource.valueCode==1||$ctrl.data.$$collectionSource.valueCode==2">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>合同编号：</label>\n    <div class="col-sm-8">\n    <select name="contractId" chosen class="J_chosen form-control" ng-model="$ctrl.data.$$sourceCon" ng-change="$ctrl.queryRefund($ctrl.data.$$sourceCon)" ng-options="item as item.contractCode for item in $ctrl.contractselectList">\n    </select>\n    </div>\n    </div>\n    </div>\n    </div>\n    <div class="row">\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>款项名称：</label>\n    <div class="col-sm-8">\n  <select chosen class="J_chosen form-control" ng-model="$ctrl.data.$$fundName" name="fundName" data-placeholder="请选择" ng-options="item as (item.fundName+\'-\'+item.companyShortName) for item in $ctrl.fundNames"><option value="">请选择</option></select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>收款单位：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control"  name="companyShortName" ng-model="$ctrl.data.$$fundName.companyShortName" readonly>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>付款方：</label>\n    <div class="col-sm-8">\n    <select name="refundId" chosen class="J_chosen form-control" ng-model="$ctrl.data.payer" name="payer" ng-options="item.valueCode as item.valueName for item in $ctrl.clientType">\n    </select>\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>付款单位/个人：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="payerName" ng-model="$ctrl.data.payerName">\n    </div>\n    </div>\n    </div>\n    <div class="col-md-12">\n    <div class="form-group">\n    <label class="col-sm-3 control-label"><span class="text-danger">*</span>金额：</label>\n    <div class="col-sm-8">\n    <input type="text" class="form-control" name="amount" ng-model="$ctrl.data.amount">\n    </div>\n    </div>\n    </div>\n    </div>\n    </form>\n    </div>',
		controller : ['$element' , 'signService','PlanService',function($element , signService,PlanService){
			var $ctrl = this;
			//校验器
			var addreceiptValidateRule = {
				clientId :{
					required:true					
			    },
			    amount :{
			    	required: true,
			    	number:true,
			    	min:0,
			    	decimal: true,
			    },
			    collectionSource :{
					required:true					
			    },
			    contractId :{
					required:true					
			    },
			    fundCode :{
					required:true					
			    },
			    payee :{
					required:true					
			    },
			    payer :{
					required:true					
			    },
			    payerName :{
					required:true					
			    },
			    companyShortName :{
					required:true					
			    },
			    fundName :{
					required:true					
			    },
			    refundId:{
			    	requiredChosen:true					
			    },
			};	
			//验证值小数位数不能超过两位  
			jQuery.validator.addMethod("decimal", function (value, element) {  
			var decimal = /^-?\d+(\.\d{1,2})?$/;  
			return this.optional(element) || (decimal.test(value));  
			}, $.validator.format("小数位数不能超过两位!"));  
			jQuery.validator.addMethod('requiredChosen' , function (value, element) {
                return value !== 'string:' && value;
            } , $.validator.format("必填"));
			$ctrl.$start = function($defer, data ,title, PlanService,selectedCons,buyDetail,clientType){
				$ctrl.collectionSource=[];
				$ctrl.clientIds=[];
				$ctrl.clientType=[];
				$ctrl.data = $.extend(true , {} , data || {});
				$ctrl.selectedCons= $.extend(true , [] , selectedCons || []);
				if(clientType=="客户"){
					$ctrl.clientType.push({"valueCode":1,"valueName":"客户"});
				}else if(clientType=="业主"){
					$ctrl.clientType.push({"valueCode":2,"valueName":"业主"});
				}else{
					$ctrl.clientType.push({"valueCode":'',"valueName":"请选择"});
					$ctrl.clientType.push({"valueCode":1,"valueName":"客户"});
					$ctrl.clientType.push({"valueCode":2,"valueName":"业主"});
				}
				if(buyDetail!==undefined && buyDetail.length!==0){	//buyDetail!=undefined
					$ctrl.collectionSource.push({"valueCode":3,"valueName":"买卖意向"});
					if(buyDetail.length) {
						$ctrl.clientIds.push({"valueCode":buyDetail[0].clientId,"valueName":buyDetail[0].clientId});
					} else {
						$ctrl.clientIds.push({"valueCode":buyDetail.clientId,"valueName":buyDetail.clientId});
					}
				}
				var buyList=[];
				var leaseList=[];
				$ctrl.contractselectList;
				if(selectedCons.length!=0){
					$ctrl.sleval={"valueCode":1,"valueName":"租赁合同"};
					$ctrl.sleval2={"valueCode":2,"valueName":"买卖合同"};
					for(var i=0;i<selectedCons.length;i++){
						if(selectedCons[i].collectionSource==1){
							if($.inArray($ctrl.sleval,$ctrl.collectionSource)==-1){
								$ctrl.collectionSource.push($ctrl.sleval);
							}
							leaseList.push(selectedCons[i]);
						}else if(selectedCons[i].collectionSource==2){
							if($.inArray($ctrl.sleval2,$ctrl.collectionSource)==-1){
								$ctrl.collectionSource.push($ctrl.sleval2);
							}
							buyList.push(selectedCons[i]);
						}
					}
					$ctrl.collectionSource=$.unique($ctrl.collectionSource);
					
				}
				
				if(data==null){
					if(clientType==''){
						$ctrl.data.payer='';
					}else{
						$ctrl.data.payer=$ctrl.clientType[0].valueCode;
					}
					if(buyDetail!==undefined && buyDetail.length!==0){	//buyDetail!=undefined
						$ctrl.data.$$clientId=$ctrl.clientIds[0];
						
					}
					if(selectedCons.length!=0){
						//$ctrl.data.$$collectionSource=$ctrl.collectionSource[0];	//??
						$ctrl.data.$$sourceCon=selectedCons[0];
						if($ctrl.data.$$sourceCon.planList.length!=0) {
							$ctrl.data.payerName = $ctrl.data.$$sourceCon.planList[0].payerName;
						}
					}
					$ctrl.data.$$collectionSource=$ctrl.collectionSource[0];	//??
				}else{
					$ctrl.data.$$collectionSource = ($ctrl.collectionSource || []).find(function(con){
						return con.valueCode == $ctrl.data.collectionSource;
					});
					$ctrl.data.$$sourceCon = ($ctrl.selectedCons || []).find(function(con){
						return con.contractCode == $ctrl.data.contractCode;
					});
					$ctrl.data.$$clientId = ($ctrl.clientIds || []).find(function(con){
						return con.valueCode == $ctrl.data.clientId;
					});
					
				}
				$ctrl.collectionSourceChange=function(val){
					if(val==1){
						$ctrl.contractselectList=leaseList;
					}else if(val==2){
						$ctrl.contractselectList=buyList;
					}
					$ctrl.data.$$sourceCon = $ctrl.contractselectList[0];
					$ctrl.collectionFundChange();
				}
				
				$ctrl.collectionFundChange=function(){
					//获取款项名称：合同传合同编号 ，买卖意向传空null
					var parmcontractNumber=$ctrl.contractNumber;
					if($ctrl.data.$$collectionSource.valueCode==3){
						parmcontractNumber='';
					}
					$ctrl.fundName({"contractNumber":parmcontractNumber}).then(function(fundNameList){					
						if($ctrl.data.fundName){
							$ctrl.data.$$fundName = (fundNameList || []).find(function(item){
								var companyShortName='';
								if($ctrl.data.payee==1){
									companyShortName='我爱我家';
								}else if($ctrl.data.payee==2){
									companyShortName='伟嘉安捷';
								}
								if($ctrl.data.fundName==item.fundName&&companyShortName==item.companyShortName){
									return item;
								}
							});
						}else{
							$ctrl.data.$$fundName = '';	
						}
					});
				}
				if($ctrl.data.$$collectionSource.valueCode==1||$ctrl.data.$$collectionSource.valueCode==2){
					$ctrl.collectionSourceChange($ctrl.data.$$collectionSource.valueCode);
				}	
				
				if($ctrl.data.$$sourceCon && $ctrl.data.$$sourceCon.contractCode){
					$ctrl.contractNumber = $ctrl.data.$$sourceCon.contractCode;
				}
				//获取款项名称：合同传合同编号 ，买卖意向传空null
				$ctrl.collectionFundChange();
				commonContainer.modal(title, $element, function (layid) {
					var validate = true;
					if(!$ctrl.addreceiptValidate()){
						console.log("校验失败");
						commonContainer.alert("存在不符合规则的数据！");
						return;
					} 
					if($ctrl.data.$$collectionSource){
						var collectionSource = $ctrl.data.$$collectionSource;
						delete $ctrl.data.$$collectionSource;
						$ctrl.data.collectionSource = collectionSource.valueCode;
					}
					if($ctrl.data.$$clientId && $ctrl.data.collectionSource==3){
						var clientId = $ctrl.data.$$clientId;
						delete $ctrl.data.$$clientId;
						$ctrl.data.clientId = clientId.valueCode;
						$ctrl.data.contractId = '';
					}
					if($ctrl.data.$$sourceCon  && $ctrl.data.collectionSource!=3){
						var sourceCon = $ctrl.data.$$sourceCon;
						delete $ctrl.data.$$sourceCon;
						$ctrl.data.contractCode = sourceCon.contractCode;
						$ctrl.data.contractId = sourceCon.contractId;
						$ctrl.data.clientId = '';
					}
					if($ctrl.data.$$fundName){
						var fundName = $ctrl.data.$$fundName;
						/*delete $ctrl.data.$$fundName;*/
						if(fundName.companyShortName=='我爱我家'){
							$ctrl.data.payee =1 ;
						}else if(fundName.companyShortName=='伟嘉安捷'){
							$ctrl.data.payee =2 ;
						}
						
						$ctrl.data.fundName = fundName.fundName;
						$ctrl.data.fundCode = fundName.fundCode;
						$ctrl.data.companyName = fundName.companyShortName;
					}
					
					console.log($ctrl.data);
                    $defer.resolve($ctrl.data);
                    layer.close(layid);
                }, {cancel: $defer.reject, btn2: $defer.reject, btns: ['保存', '取消'],area: ['800px' , '90%'] , overflow : 'auto'});
			};
			function isEmptyObject(e) {  
			    var t;  
			    for (t in e)  
			        return !1;  
			    return !0  
			}  
			$ctrl.fundName=function(data){
				return PlanService.getfundName(data).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.fundNames=result.data;
					return result.data;
				});
			};
			$ctrl.queryRefund = function($$sourceCon){
				$ctrl.fundNames=[];
				$ctrl.fundName({"contractNumber":$$sourceCon.contractCode}).then(function(fundNameList){					
					if($ctrl.data.fundName){
						$ctrl.data.$$fundName = (fundNameList || []).find(function(item){
							item.companyShortName = $ctrl.data.$$fundName.companyShortName;
							item.fundName = $ctrl.data.$$fundName.fundName;
							return item;
						});
					}else{
						$ctrl.data.$$fundName = '';	
					}
				});
				/*return PlanService.getchangsourceId({"contractNum":$$sourceCon.contractCode}).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.refundIds = result.data;
					return result.data;
				});*/
			};
			$ctrl.filterfn=function(list){
				if(list && isEmptyObject($ctrl.selectedCons)){
					return list.slice(0, -1);
				}
				return list;
			};
			$ctrl.addreceiptValidate = function(){
				$.validator.setDefaults({ ignore: ":hidden:not(select)" });

				validate = $('#J_addReceiptform').validate({
					rules:addreceiptValidateRule
				}).form();
				if(!validate) return false;
				return validate;
			};
			
		}]
		
	});
	
	angular.bootstrap(document , ['detail']);
}(window));