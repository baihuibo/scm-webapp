/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name signAgreementPreviewLayer  补充协议预览
     * @description 通过此组件可以方便的预览合同样子和打印合同
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signAgreementPreviewLayer', data, agrtType , paymentType, canPrintPromise , '预览合同')
     *        }
     *     </file>
     * </example>
     */
        .component('signAgreementPreviewLayer', {
            templateUrl: basePath + '/resources/script/sign/component/sign-agreement-preview.component.html',
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;
                $ctrl.$start = function ($defer, codes, agrtType, paymentType, canPrintFn, title, formal) {
                    $ctrl.codes = codes;
                    $ctrl.formal = formal;
                    $ctrl.agrtType = agrtType;
                    $ctrl.paymentType = paymentType;
                    // 载入预览样式
                    signUtil.disableSelection($element);// 禁止文本选中
                    commonContainer.modal(title, $element, function (layerId) {
                        canPrintFn().then(function (result) {
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            if (!result.data) {
                                throw layer.alert(result.msg);
                            }
                        }).then(function () {
                            var jatoolsPrinter = signUtil.printerTools.createPrinter();
                            if (typeof jatoolsPrinter.print !== 'undefined' && typeof jatoolsPrinter.printPreview !== 'undefined') {
                                var myDoc = {
                                    documents: document,
                                    copyrights: '杰创软件拥有版权  www.jatools.com',  // 版权声明,必须
                                    // autoBreakPage: true,// 自动分页打印区域内容,免费版不支持。。
                                    importedStyle: [basePath + '/resources/css/agreement-print.css'],
                                    settings: {
                                        copies: 1, // 打印几份
                                    },
                                    onPagePrinted: function (currentPage, totalPage) {
                                        if (currentPage === totalPage - 1) {
                                            // 要打印的数据已经推送到打印队列
                                            layer.alert('内容已经添加到打印队列');
                                            $defer.notify(true);// 添加打印队列成功
                                        }
                                        // 每一页打印完后的回调函数,打印进度
                                        console.log('onPagePrinted', 'currentPage->', currentPage, 'totalPage->', totalPage);
                                    }
                                };
                                var defaultPrinter = jatoolsPrinter.getDefaultPrinter();// 获取默认打印机
                                if (/pdf/i.test(defaultPrinter)) {
                                    layer.alert('默认打印机不能是 PDF 打印机,请重新设置默认打印机');
                                } else {
                                    jatoolsPrinter.print(myDoc);  // 直接打印
                                    // jatoolsPrinter.printPreview(myDoc);  // 预览
                                }
                            } else {
                                layer.alert('无法打印，请在`小房子`浏览器中使用此功能，如果已经在`小房子`浏览器中，请安装打印控件后重启浏览器在试');
                            }
                        }).catch($.noop);
                    }, {
                        cancel: $defer.reject,
                        btn2: $defer.reject,
                        overflow: 'auto',
                        btns: ['打印', '关闭'],
                        area: ['1024px', '90%'],
                    });
                };
            }]
        });
}());