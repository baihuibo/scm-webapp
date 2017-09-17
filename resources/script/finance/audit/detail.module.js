var res={};
(function(window){
	
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('detailCtrl', ['detailService', 'signUtil','signService',function(detailService, signUtil,signService){
		var $ctrl = this;	
		var collectionId = signUtil.getSearchValue('collectionId') || '';
		
		$ctrl.gatherinfo = function () {	
			detailService.getSubsidiaryquery({'collectionId' :collectionId,}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				if($ctrl.detail.chequeReceiveTime!==undefined){
					$ctrl.detail.chequeReceiveTime=$ctrl.detail.chequeReceiveTime.substring(0,10);
				}
				if($ctrl.detail.chequeCheckinTime!==undefined){
					$ctrl.detail.chequeCheckinTime=$ctrl.detail.chequeCheckinTime.substring(0,10);
				}
				if($ctrl.detail.chequeConfirmTime!==undefined){
					$ctrl.detail.chequeConfirmTime=$ctrl.detail.chequeConfirmTime.substring(0,10);
				}
				//$ctrl.detail.chequeReceiveTime=$ctrl.detail.chequeReceiveTime.substring(0,10);
				//$ctrl.detail.chequeCheckinTime=$ctrl.detail.chequeCheckinTime.substring(0,10);
				//$ctrl.detail.chequeConfirmTime=$ctrl.detail.chequeConfirmTime.substring(0,10);
				//console.log($ctrl.detail);
			});
		};
		$ctrl.gatherinfo();
        $ctrl.bankArrival = function(bankArrival){
        	var chequeCheckinTime=$("#chequeCheckinTime").val();
        	var chequeConfirmTime=$("#chequeConfirmTime").val();
        	commonContainer.confirm(
    			'请确认是否到账？',
    			function(index, layero){
    				var paramsData;
    				if(bankArrival==1){
        				if($ctrl.detail.paymenyType==1){
        					paramsData={
        						paymenyType:$ctrl.detail.paymenyType,
        						collectionId:collectionId,
        						auditStatus:"1",
        						chequeCheckinTime:chequeCheckinTime,
        					}
        				}else if($ctrl.detail.paymenyType==2){
        					paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"1",
    							chequeCheckinTime:chequeCheckinTime,
        					}
        				}else if($ctrl.detail.paymenyType==3){
        					paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"1",
        					}
        				}else if($ctrl.detail.paymenyType==4){
        					paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"1",
        					}
        				}else if($ctrl.detail.paymenyType==5){
        					paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"1"
        					}
        				}else if($ctrl.detail.paymenyType==6){
        					if(chequeConfirmTime==''){
        						return layer.alert('请输入到账日');
        					}
        					paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"1",
    							chequeConfirmTime:chequeConfirmTime,
        					}
        				}
    				}else if(bankArrival==0){
    					if($ctrl.detail.paymenyType==1){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
    						}
    					}else if($ctrl.detail.paymenyType==2){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
        					}
    					}else if($ctrl.detail.paymenyType==3){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
        					}
        				}else if($ctrl.detail.paymenyType==4){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
        					}
    					}else if($ctrl.detail.paymenyType==5){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
        					}
    					}else if($ctrl.detail.paymenyType==6){
    						paramsData={
    							paymenyType:$ctrl.detail.paymenyType,
    							collectionId:collectionId,
    							auditStatus:"0",	
        					}
    					}
    				}
    				detailService.bankArrival(paramsData).then(function(result){
    					if(result.code==1){
    						layer.alert(result.msg)
    					}else{
    						window.location.reload();
    					}
    					
    					/*layer.close(index);
    					if(result.code != 0){
    						return layer.alert(result.msg);
    					}
    					$ctrl.detail.auditStatusName = '已到账';
    					$ctrl.detail.auditStatus = bankArrival;// 到账状态
*/    				});
    			}
        	);
        }
        
        $ctrl.receiveAndSaveBank=function(type){
        	var chequeReceiveTime=$("#chequeReceiveTime").val();
        	var chequeCheckinTime=$("#chequeCheckinTime").val();
        	var chequeCheckinName=$("#chequeCheckinName").val();
        	var chequeCheckinNo=$("#chequeCheckinNo").val();
        	commonContainer.confirm(
        		'请确认是否保存？',
        		function(index, layero){
        			var receiveData;
        			/*if(type=='1'){
        				if($ctrl.detail.paymenyType==1){
        					receiveData={
            					collectionId:collectionId,
            					chequeCheckinTime:chequeCheckinTime
            				}
        				}else if($ctrl.detail.paymenyType==1){
        					
        				}
        			}*/
        			if(type=='2'){
        				//验证接收日期
        				if(chequeReceiveTime==''){
        					return layer.alert('请输入接收日期');
        				}
        				receiveData={
    						collectionId:collectionId,
    						chequeReceiveTime:chequeReceiveTime
        				}
        			}
        			if(type=='3'){
        				if(chequeCheckinTime==''){
        					return layer.alert('请输入银行日');
        				}
        				if(chequeCheckinName==''){
        					return layer.alert('请输入银行');
        				}
        				if(chequeCheckinNo==''){
        					return layer.alert('请输入银行账户');
        				}
        				receiveData={
        					collectionId:collectionId,
        					chequeCheckinTime:chequeCheckinTime,
        					chequeCheckinName:chequeCheckinName,
        					chequeCheckinNo:chequeCheckinNo,
        				}
        			}
/*        			detailService.receiveAndSaveBank(receiveData)
        			window.location.reload();*/
        			
        			detailService.receiveAndSaveBank(receiveData).then(function(result){
        				if(result.code==1){
        					layer.alert(result.msg)
        				}else{
        					window.location.reload();
        				}
    					
        			});
        		}
        	)
        }
	}])
	
	.service('detailService' , ['$http' , function($http){
		this.getSubsidiaryquery= function(data){
			return $http.get(basePath + '/finance/audit/searchAuditByCollectionId' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.bankArrival=function(paramsData){
			return $http.post(basePath + '/finance/audit/bankArrival',paramsData).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.receiveAndSaveBank=function(receiveData){
			return $http.post(basePath + '/finance/audit/receiveAndSaveBank',receiveData).then(function(response){
				console.log(response);
				return response.data;
			});
		}
	}]);
	angular.bootstrap(document , ['detail']);
}(window));