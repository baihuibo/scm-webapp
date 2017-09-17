(function () {
    var treeObj = null;
    var deptUrl = basePath + '/custom/common/getBasOrganization.htm';
    var deptAllUrl = basePath + '/custom/common/getBasOrganizationAll.htm';
    window.showDeptTree = showDeptTree; // exports

    /**
     * 显示部门组织结构树
     * @param $deptNameContainer 选择输入框
     * @param $deptLevelContainer 级别隐藏域
     * @param $deptTypeContainer
     * @param powerAll? 是否忽略权限使任何角色可以选择除北京公司外任何项(新需求所有人都可以选择任意节点)
     */
    function showDeptTree($deptNameContainer, $deptLevelContainer, $deptTypeContainer, powerAll) {
        if (!$('#J_dept_dialog').length) {// 防止多次创建 dom
            var deptDialog = '<div id="J_dept_dialog" class="ibox-content" style="display: none;">' +
                '<div class="form-group">' +
                '<div class="col-sm-8">' +
                '<ul id="J_deptTree" class="ztree"></ul>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(document.body).append(deptDialog);
        }

        layer.open({
            type: 1,
            shift: 5,
            title: '选择部门',
            area: ['300px', '450px'],
            skin: 'layui-layer-lan',
            content: $('#J_dept_dialog'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var selectedNodes = treeObj.getSelectedNodes();
	  		if (selectedNodes.length == 0 )
	  			return layer.msg('请选择部门');

                if (selectedNodes.length > 0) {
                    $deptNameContainer.val(selectedNodes[0].name); // 组织结构名称
                    $deptNameContainer.attr('data-id', selectedNodes[0].id); // 组织结构ID
                    $deptLevelContainer.val(selectedNodes[0].level); // 组织结构等级

                    var deptLevel = selectedNodes[0].level;
                    if ($deptTypeContainer) {
                        switch (deptLevel) {
                            case 0:
                                $deptTypeContainer.val('大区公客');
                                $deptTypeContainer.attr('data-id', '4');
                                break;

                            case 1:
                                $deptTypeContainer.val('大区公客');
                                $deptTypeContainer.attr('data-id', '4');
                                break;

                            case 2:
                                $deptTypeContainer.val('组团公客');
                                $deptTypeContainer.attr('data-id', '3');
                                break;

                            case 3:
                                $deptTypeContainer.val('店组公客');
                                $deptTypeContainer.attr('data-id', '2');
                                break;
                        }
                    }

                    $deptNameContainer.trigger('onSetSelectValue', selectedNodes);
                }

                layer.close(index);
            },
            success: function () {
                // 加载组织结构数据
                deptInit(function () {
                    // treeObj.powerAll = powerAll; // 不再限制权限
                    // 将输入框中的数据初始化到组织结构树中
                    var id = $deptNameContainer.attr('data-id');
                    if (id) {
                        var node = treeObj.getNodeByParam("id", id);
                        treeObj.selectNode(node);
                        treeObj.expandNode(node, true, false, true); // 展开 / 折叠 指定的节点
                    }
                } , powerAll);
            }
        });
    }

    var cacheData = {};
    function deptInit(cb , powerAll) {
        if (!treeObj || !cacheData[cacheData]) {
            var setting = {
                view: {selectedMulti: false},
                data: {simpleData: {enable: true}},
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        // if (treeObj.powerAll === true && treeNode.level !== 0) {
                        //     // 可以选择除公司级外任意节点
                        //     return true;
                        // }
                        // if (treeObj.currentLevel === false) {
                        //     return false;
                        // }
                        // if (treeObj.currentLevel > treeNode.level) {
                        //     return false;
                        // }
                        // 新需求调整，取消权限限制，可以点击任意节点
                    }
                }
            };

            // 加载数据
            var index = layer.load(2, {shade: [0.5, '#fff']});
            jsonGetAjax(powerAll ? deptAllUrl : deptUrl, {dataType: "3"}, function (result) {
                cacheData[cacheData] = 1;
                layer.close(index);
                $.fn.zTree.init($("#J_deptTree"), setting, result.data);
                loadTreeData();
            // }).then(function () {
            //     return commonContainer.getCurrentUserLevel();
            // }).then(function (level) {
                // 公司0，大区1，组团2，组店3
                // 当前登录用户 => 对应级别
                // 30 区总监 => 1
                // 40 区经理 => 2
                // 50 店经理 => 3
                // 10 经纪人 => false
                // 99 其他 => false
                // var levelMapper = {
                //     30: 1,
                //     40: 2,
                //     50: 3,
                //     10: false,
                //     99: false
                // };
                // treeObj.currentLevel = levelMapper[level];
                // 不做级别权限限制
                cb();
            })
        } else {
            loadTreeData();
            cb();
        }
    }

    function loadTreeData() {
        treeObj = $.fn.zTree.getZTreeObj("J_deptTree");
        var nodes = treeObj.getSelectedNodes();
        nodes.forEach(function (node) {
            treeObj.cancelSelectedNode(node);
        });
    }
}());