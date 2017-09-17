var res={};
(function(window){
	
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('receiptPlanCtrl', ['receiptPlanService', 'signUtil',function(receiptPlanService, signUtil){
		var $ctrl = this;	
		var batchId = signUtil.getSearchValue('batchId') || '';
		$ctrl.receiptPlan = function () {	
			receiptPlanService.getSubsidiaryquery({'batchId' :batchId,}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				console.log($ctrl.detail);
			});
		};
		receiptPlanService.getApprovalStatus({'batchId' :batchId}).then(function(result){
			if(result.code !== 0){
				layer.alert(result.msg);
			}else{
				$ctrl.approvalStatus=result.data;
			}
			
		});
	}])
	
	.service('receiptPlanService' , ['$http' , function($http){

		this.getSubsidiaryquery= function(data){
			return $http.get(basePath + '/finance/collect/selectPlanListByBatchId' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		//获取收款批次审核状态
		this.getApprovalStatus=function(data){
			return $http.get(basePath+'/finance/collect/getCollectionAuditStatus.htm',{params:data}).then(function(response){
				return response.data;
			})
		};
	}]);
	
	
	angular.bootstrap(document , ['detail']);
}(window));