var res={};
(function(window){
	angular.module('between_detail' , ['base' , 'sign-common'])
	
	.controller('betweenDetailCtrl' , ['betweenDetailService', 'signUtil',function(betweenDetailService, signUtil){
		var $ctrl = this;	
		var subsidiaryContractId = signUtil.getSearchValue('subsidiaryContractId') || '';
		var conId = signUtil.getSearchValue('conId') || '';
		//合同信息
		{
			$ctrl.subsidiarylist=function(){
				betweenDetailService.getSubsidiaryquery({'subsidiaryContractId' :subsidiaryContractId,"subsidiaryContractType":2}).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.detail = result.data;
					console.log($ctrl.detail);
					$ctrl.houseLink = signUtil.getHouseLInk($ctrl.detail.basiclist.housesCode,2);
					$ctrl.customerLink = signUtil.getCustomerLink($ctrl.detail.basiclist.customerCode,2);
					$ctrl.contractLink = this.getContractLink($ctrl.detail.basiclist.conId,2);
				});
			};
			$ctrl.subsidiarylist();
		}
		//审批流程
		 {
			 $ctrl.contractApprovalList=function(){
				 betweenDetailService.getcontractApproval(conId).then(function(result){
						if(result.code !== 0){
							return layer.alert(result.msg);
						}else{
							$ctrl.contractApproval=result.data;
						}
				 })
			 };
		 }
		 
		 //打印历史
		 {
			 $ctrl.printhistory=function(){
				 betweenDetailService.getprinthistory(conId).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					$ctrl.printhistoryList=result.data;
				})
			} ;
		 }
	}])
	
	.service('betweenDetailService' , ['$http' , function($http){
		this.getSubsidiaryquery= function(data){
			return $http.get(basePath + '/sign/signthecontract/subsidiarylist' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		};
		
		this.getcontractApproval=function (conId) {
            return $http.get(basePath + '/sign/contractSales/ContractApprovalAllHistory' , {params : {conId : conId,viewType:1}}).then(function (response) {
                return response.data;
            });
        };
        this.getprinthistory=function(conId){
       	 return $http.get(basePath + '/sign/signthecontract/printhistory' , {params : {conId : conId,type:4}}).then(function (response) {
                return response.data;
            });
       }
        
	}]);
	
	 // 获取查看客源地址
	this.getContractLink = function (conId, kind) {
        return basePath + '/sign/signthecontract/contractdetail.htm?conId=' + conId;

    };
	angular.bootstrap(document , ['between_detail']);
}(window));