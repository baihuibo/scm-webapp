/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name agreementCode  补充协议模板组件
     * @description 通过此组件可以方便的显示并且修改模板内变量
     * @example
     * <example>
     *     <file name="test.html">
     *          <sign-slider
     *              list="$ctrl.imgList"></sign-slider>
     *     </file>
     * </example>
     */
        .component('signSlider', {
            templateUrl: basePath + '/resources/script/sign/component/slider.component.html',
            bindings: {
                list : '<',
                phototype:"@",
                ifuplpad:"@",
                name:"@",
                alt:"@",
                type : "@",
                describe : "@",
                optionlist : "<"
            },
            controller: ['$scope', '$element' , 'signUtil', function ($scope, $element , signUtil) {
                var $ctrl = this;
                $ctrl.delfn=function(list,item , index){
                	signUtil.confirm('确定删除此图片？').then(function () {
                	list.splice(index, 1);
                	})
                };
                var uid = signUtil.uuid('slider_');
                var img_outer , slider , viewer , sliderIsInit;
                $element.attr('id' , uid);
                
                $scope.$watch(function(){
                	return $element.find('img').length;
                } , function(){
                	if(sliderIsInit){
                		slider.destroySlider();
                	}
                	
                	sliderIsInit = true;
            		slider.bxSlider({
		            	slideWidth: 200,
		            	minSlides: 0,
		            	maxSlides: 100,
		            	infiniteLoop:false,
		     			moveSlides: 1,
		     			pager:false,
		                slideMargin: 10
		            });
            		
            		console.log('viewer' , viewer);
            		
            		viewer.init();
                });
                
                $ctrl.$onInit = function(){
                	slider = $element.find('.slider');
                	img_outer = $element.find('.img_outer');
                	img_outer.viewer({
                		url : 'src',
    	            	scalable:false,
    	            	title:false,
    	            	fullscreen:false
    	            });
                	viewer = img_outer.data('viewer');
                	
                };
            }]
        })
        .directive('radioFirstChecked' , function(){
        	var cache = {};
        	return function(scope , el , attr){
        		if(!cache[attr.name]){
        			setTimeout(function(){
        				el.click();
        			},1);
        			cache[attr.name] = true;
        		}
        	}
        });
}());