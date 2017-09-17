/**
 * Created by wangxiaohong on 2017/7/31.
 */
(function (window) {

    angular.module('proxy-brief', ['base', 'sign-common'])

        .controller('proxyBriefCtrl', ['proxyBriefService', 'signUtil', '$scope', 'signService', function ( proxyBriefService, signUtil, $scope, signService) {
            var $ctrl = this;
            var proxyId = signUtil.getSearchValue('proxyId') || '';
    		$ctrl.selectHouseProxyBriefInfo = function () {	
    			proxyBriefService.getselectHouseProxyBriefInfo({'proxyId' :proxyId,}).then(function(result){
    				if(result.code !== 0){
    					return layer.alert(result.msg);
    				}
    				$ctrl.detail = result.data;
    				console.log($ctrl.detail);
    				
    			});
    		};
    		$ctrl.user=function(userid){
    			getUserStaffInfo(userid);
    		}
    		$ctrl.selectHouseProxyBriefInfo();
            
        }])

        ////////////////// service
        .service('proxyBriefService', ['$http', function ($http) {
        	this.getselectHouseProxyBriefInfo= function(data){
    			return $http.get(basePath + '/house/proxy/selectHouseProxyBriefInfo' , {params :data}).then(function(response){
    				console.log(response);
    				return response.data;
    			});
    		}
        }])
 

    angular.bootstrap(document, ['proxy-brief']);
}(window));