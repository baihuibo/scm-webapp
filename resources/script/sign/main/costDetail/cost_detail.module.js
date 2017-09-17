var res={};
(function(window){
	angular.module('cost_detail' , ['base' , 'sign-common'])
	
	.controller('draftDetailCtrl' , ['draftDetailService', 'signUtil',function(draftDetailService, signUtil){
		var $ctrl = this;
		var formId = signUtil.getSearchValue('conId');
		var cost = signUtil.getSearchValue('cost');
		$ctrl.formId=formId;
		var conId = signUtil.getSearchValue('conId') || '';
		var other = signUtil.getSearchValue('other') || '';
		var parameterOne;
		var parameterTwo;
		if (cost && other) {
            var names = cost.split('-');
            formId = $ctrl.formId = names[1];
            $ctrl.cost = cost;
            $ctrl.other = other;
        }

		//費用明細
		 $ctrl.costdetail=function(){
			 draftDetailService.getcostdetails(conId).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}else{
						$ctrl.costdetail=result.data.details;
						parameterOne=signUtil.formatParam(result.data.parameterOne);
						parameterTwo=result.data.parameterTwo;
						//console.log(parameterOne)
						$("#collectPlan").attr("href",basePath +'/finance/collect/collectPlan.htm?'+signUtil.formatParam(parameterOne))
						$("#paymentadd").attr("href",basePath +"/finance/payment/apply/payment/add.htm?"+signUtil.formatParam(parameterTwo))     
					}
			 })
		 };
		 
		$ctrl.costdetail();
	 //录入收款
     /* $ctrl.collectPlan = function(){
    	  window.location.href=basePath +"/finance/collect/collectPlan.htm?"+signUtil.formatParam(parameterOne)
        };*/
        
      //录入付款
        /*$ctrl.paymentadd = function(){
          	window.open(basePath +"/finance/payment/apply/payment/add.htm?"+parameterTwo)
          };*/
         
	}])
	
	
	
	
	.service('draftDetailService' , ['$http' , function($http){
		this.getcostdetails =function (conId) {
            return $http.get(basePath + '/finance/cost/detail' , {params : {contractId : conId}}).then(function (response) {
                return response.data;
            });
        };
	}]);
	
	
	angular.bootstrap(document , ['cost_detail']);
}(window));