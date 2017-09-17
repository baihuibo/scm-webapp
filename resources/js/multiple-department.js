var treeObj = null;
var deptUrl = basePath + '/custom/common/getBasOrganization.htm';
var $deptContainer = "";
var $deptJsonContainer = "";

function showDeptTree($deptNameContainer, $deptJson) {
    $deptContainer = $deptNameContainer;
    $deptJsonContainer = $deptJson;
    deptInit().then(function () {
        // 初始化select下拉框的选中数据
        selectDeptInit();
        // 更新组织结构树的选中数据
        deptTreeChange();
        zTreeOnCheck();
        // 组织结构树中选中项的实时更新
        $deptContainer.off('change', deptTreeChange).on("change", deptTreeChange);
    });
}

// 初始化select下拉框的选中数据
function selectDeptInit() {
    var selectedDeptJsonStr = $deptJsonContainer.val();
    var options = [];
    var validIdArr = [];
    clearVal();
    if (selectedDeptJsonStr) {
        $.each(JSON.parse(selectedDeptJsonStr), function (n, v) { // 获取有效的已选中的节点
            // 拼接下拉框选项
            options.push('<option value="' + v.id + '">' + v.name + '</option>');
            validIdArr.push(v.id);
        });

        $deptContainer.html(options);
        $deptContainer.val(validIdArr);
        $deptContainer.trigger("chosen:updated");
    }
}

// 更新组织结构树的选中数据
function deptTreeChange() {
    var val = $deptContainer.val();
    treeObj.checkAllNodes(false);
    if (val && val.length) {
        $.each(val, function (index, value) {
            var node = treeObj.getNodeByParam("id", value);
            if (node) {
                node.chosen_ = true;
                treeObj.checkNode(node, true, true); // 勾选 / 取消勾选 单个节点 （可选择是否包含父子节点）
            }
        });
    }
}

// 加载组织结构树
function deptInit() {
    var setting = {
        view: {selectedMulti: false},
        check: {enable: true},
        data: {simpleData: {enable: true}},
        callback: {
            beforeCheck: function (treeId, treeNode) {
                // if (treeNode.level === 0 && treeObj.currentLevel < 51) {
                //     return false;
                // }
            },
            onCheck: zTreeOnCheck
        }
    };
    if (treeObj) {
        treeObj.destroy();// 销毁
    }

    return jsonGetAjax( // 加载数据
        deptUrl,
        {dataType: "3"},
        function (result) {
            treeObj = $.fn.zTree.init($("#J_deptTree"), setting, result.data);
            treeObj.expandAll(true);
        }
    ).then(function () {
        return commonContainer.getCurrentUserLevel();
    }).then(function (level) {
        treeObj.currentLevel = level || 0;
    })
}

// 清除数据项
function clearVal() {
    treeObj.checkAllNodes(false);
    $deptContainer.val('');
    $deptContainer.trigger("chosen:updated");
    $deptJsonContainer.val('');
}

// 选中 / 取消checkbox的回调函数
function zTreeOnCheck(ztree, ztreeId, node) {
    if (node) {
        node.chosen_ = node.checked;
    }

    // 获取已选中的所有节点
    var selectedNodes = treeObj.getNodesByParam('chosen_', true);
    selectedNodes = selectedNodes.filter(function (node) {
        if (!node.checked) {
            node.chosen_ = false;
            return false;
        }
        return node;
    });
    if (!selectedNodes.length) {
        clearVal();
        return;
    }

    var options = [];
    var deptJson = [];
    var validIds = [];

    $.each(selectedNodes, function (n, node) { // 获取有效的已选中的节点
        validIds.push(node.id);
        // 拼接下拉框选项
        options.push('<option value="' + node.id + '">' + node.name + '</option>');
        // 拼接组织结构json串，用以传至后台
        deptJson.push({
            'id': node.id,
            'level': node.level,
            'name': node.name
        });
    });

    $deptContainer.html('');
    $deptContainer.append(options);
    $deptContainer.val(validIds);
    $deptContainer.trigger("chosen:updated");
    $deptContainer.parent().find('.chosen-drop').remove();
    $deptJsonContainer.val(JSON.stringify(deptJson));
}