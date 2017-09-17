/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name selectAgreementLayer 选择补充协议
     * @description 通过此组件可以方便的新增或者修改人的信息
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('selectAgreementLayer', treeNode, [])
     *                 .then(function(selecteds) {
     *
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('selectAgreementLayer', {
            template: '<div class="ibox-content"> <ul class="ztree"></ul> </div>',
            controller: ['$element', function ($element) {
                var $ctrl = this;

                if (!$.fn.zTree) {
                    throw new Error('selectAgreementLayer 组件需要加载  #set($plugins = ["ztree"]) ');
                }

                var setting = {
                    view: {
                        selectedMulti: false
                    },
                    check: {
                        enable: true
                    },
                    data: {
                        key: {
                            children: "children"
                        }
                    },
                    callback: {
                        beforeCheck: function (treeId, treeNode) {
                            if (treeNode.id) {
                                var id = +treeNode.id;
                                var other, msg;
                                if (id === 20 || id === 21) {
                                    other = id === 20 ? 21 : 20;// 找出互斥 id
                                    msg = '出售方代理人条款只能选择唯一的一个条款，不能同时选中；';
                                } else if (id === 22 || id === 23) {
                                    other = id === 22 ? 23 : 22;
                                    msg = '买方代理人条款只能选择唯一的一个条款，不能同时选中；';
                                }
                                if (other && cache[other]) {
                                    commonContainer.alert(msg);
                                    return false; // 禁止选择
                                }
                            }
                        },
                        onCheck: function (treeId, _, treeNode) {
                            if (treeNode.id) {
                                var id = +treeNode.id;
                                if (cache[id]) {
                                    delete cache[id];
                                } else {
                                    cache[id] = 1;
                                }
                            } else if (treeNode.isParent) {// 当全选的时候
                                var _20 = treeObj.getNodeByParam('id', 20, treeNode);
                                var _21 = treeObj.getNodeByParam('id', 21, treeNode);
                                var _22 = treeObj.getNodeByParam('id', 22, treeNode);
                                var _23 = treeObj.getNodeByParam('id', 23, treeNode);
                                if (_20 && _21 && _22 && _23) {
                                    if (treeNode.checked) {// 全选
                                        cache[20] = true;
                                        cache[22] = true;
                                        delete cache[21];
                                        delete cache[23];
                                        unchecked(_21);
                                        unchecked(_23);
                                    } else { //全取消
                                        delete cache[20];
                                        delete cache[21];
                                        delete cache[22];
                                        delete cache[23];
                                    }
                                }
                            }
                        }
                    }
                };

                function unchecked(node) {
                    treeObj.checkNode(node, false, false);
                }

                var cache = {}, treeObj; // 20 , 21 ; 22 , 23 之间互斥

                $ctrl.$start = function ($defer, treeNode, selecteds, agrtType) {
                    var ul = $element.find('ul');
                    treeObj = $.fn.zTree.init(ul, setting, treeNode);
                    treeObj.expandAll(true);// 展开全部
                    if (selecteds.length) {// 如果是修改
                        // 选中之前选中的
                        selecteds.forEach(function (id) {
                            var node = treeObj.getNodeByParam("id", id, null);
                            node && treeObj.checkNode(node, true, true);
                        });
                    } else if (+agrtType !== 2) {
                        // 选中全部，对于买卖不适用
                        treeObj.checkAllNodes(true);
                    }

                    commonContainer.modal('选择补充协议条款', $element, function (id) {
                        var nodes = treeObj.getCheckedNodes(true);
                        nodes = nodes.filter(function (node) {
                            return !node.isParent;
                        }).map(function (node) {
                            return node.id;
                        });
                        if (!nodes.length) {
                            return layer.alert('请选择补充协议条款');
                        }
                        $defer.resolve(nodes);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px', '90%'], overflow: 'auto'});
                };
            }]
        });
}());