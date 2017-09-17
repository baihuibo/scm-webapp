var res={};
(function(window){
	
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('inquisitionCheckCtrl', ['inquisitionCheckService', 'signUtil',function(inquisitionCheckService, signUtil){
		var $ctrl = this;	
		var inquId = signUtil.getSearchValue('inquId') || '';
		$ctrl.inquisitionDetail = function () {	
			inquisitionCheckService.getinquisitionDetailquery({'inquId' :inquId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				var array=$ctrl.detail.housesPicture
				$ctrl.detail.housesPicture1 = $.grep(array,function(value){
		            return value.pictureType ==1;
		        });
				$ctrl.detail.housesPicture2 = $.grep(array,function(value){
		            return value.pictureType ==2;
		        });
				console.log($ctrl.detail);
				$ctrl.houselink = signUtil.getHouseLInk($ctrl.detail.housesInquBase.housesId, $ctrl.detail.housesInquBase.businessType);
				init(inquId,result.data.housesInquBase.housesId);
			});
		};
		$ctrl.housestates=function(){
			commonContainer.alert("该房源已报成交，无法操作！");	
		}
		$ctrl.inquisitionDetail();
		$ctrl.checkAddress=function(){
			checkAddress($ctrl.detail.housesInquBase.housesId);
		}
	}])
	
	.service('inquisitionCheckService' , ['$http' , function($http){

		this.getinquisitionDetailquery= function(data){
			return $http.get(basePath + '/house/inquisition/inqCheck' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
	}]);
	
	
	angular.bootstrap(document , ['detail']);
}(window));