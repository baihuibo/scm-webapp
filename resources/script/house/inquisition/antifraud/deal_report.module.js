var res={};
(function(window){
	
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('inquisitionDetailCtrl', ['inquisitionDetailService', 'signUtil',function(inquisitionDetailService, signUtil){
		var $ctrl = this;	
		var id = signUtil.getSearchValue('id') || '';
		$ctrl.inquisitionDetail = function () {	
			inquisitionDetailService.getinquisitionDetailquery({'id' :id}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				var array=$ctrl.detail.housesPicture;
				$ctrl.detail.housesPicture1 = $.grep(array,function(value){
		            return value.pictureType ==1;
		        });
				$ctrl.detail.housesPicture2 = $.grep(array,function(value){
		            return value.pictureType ==2;
		        });
				var arrayReport=$ctrl.detail.housesPictureReport;
				$ctrl.detail.housesPicture3 = $.grep(arrayReport,function(value){
		            return value.pictureType ==1;
		        });
				$ctrl.detail.housesPicture4 = $.grep(arrayReport,function(value){
		            return value.pictureType ==2;
		        });
				console.log($ctrl.detail);
				$ctrl.houselink = signUtil.getHouseLInk($ctrl.detail.housesInquBase.housesId, $ctrl.detail.housesInquBase.businessType);
			});
		};
		$ctrl.inquisitionDetail();
		$ctrl.checkAddress=function(){
			checkAddress($ctrl.detail.housesInquBase.housesId);
		}
	}])
	
	.service('inquisitionDetailService' , ['$http' , function($http){

		this.getinquisitionDetailquery= function(data){
			return $http.get(basePath + '/house/inquisitionCtf/inqDetail' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
	}]);
	
	
	angular.bootstrap(document , ['detail']);
}(window));