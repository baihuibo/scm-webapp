/**
 * Created by wangxiaohong on 2017/6/15.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name signPreviewLayer  买卖合同预览
     * @description 通过此组件可以方便的预览合同样子和打印合同
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signPreviewLayer', {} , '预览合同')
     *                 .then(function(result) {
     *                   // TODO 打印操作
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('signBuyPreviewLayer', {
        	/*templateUrl: basePath + '/resources/script/sign/component/sign-preview.component.html',*/
            template: '<iframe style="width:100%;height:100%;"></iframe>',
            controller: ['$element', 'signUtil','$http', function ($element, signUtil,$http) {
                var $ctrl = this;
                var conId=signUtil.getSearchValue('conId');
                $ctrl.$start = function ($defer, conId, title) {
                	var iframe = $element.find('iframe');
                	iframe.prop('src' , basePath + '/sign/print?conId=' + conId);

                    commonContainer.modal(title, $element, function (id) {
                    	var jatoolsPrinter = signUtil.printerTools.createPrinter();

                        if (typeof jatoolsPrinter.print !== 'undefined' && typeof jatoolsPrinter.printPreview !== 'undefined') {
                            var myDoc = {autoBreakPage:true,
                                documents: iframe.get(0).contentWindow.document,
                                importedStyle: [basePath + '/resources/css/buy-contract-print.css'],
                                copyrights: '杰创软件拥有版权  www.jatools.com',  // 版权声明,必须
                                settings: {
                                    copies: 1, // 打印几份
                                },
                                onPagePrinted: function (current, total) {
                                    // 每一页打印完后的回调函数
                                	if(current == total - 1){
                                		$http.get(basePath + '/sign/contractPrint' , {params : {conId : conId}}).then(function (response) {
                                			if (result.code !== 0) {
                                                throw layer.alert(result.msg);
                                            }
                                            layer.alert('打印完成');
                                        });
                                        $defer.resolve({});
                                	}
                                }
                            };
                            var defaultPrinter = jatoolsPrinter.getDefaultPrinter();// 获取默认打印机
                            if (/pdf/i.test(defaultPrinter)) {
                                layer.alert('默认打印机不能是 PDF 打印机,请重新设置默认打印机');
                            }
                            // jatoolsPrinter.print(myDoc);  // 直接打印
                            jatoolsPrinter.printPreview(myDoc);  // 预览
                        } else {
                            layer.alert('无法打印，请在`小房子`浏览器中使用此功能，如果已经在`小房子`浏览器中，请安装打印控件后重启浏览器在试');
                            $defer.resolve({});
                            layer.close(id);
                        }
                    }, {
                        cancel: $defer.reject,
                        btn2: $defer.reject,
                        btns: ['打印', '关闭'],
                        area: ['1024px', '90%'],
                    });
                };
            }]
        });
}());