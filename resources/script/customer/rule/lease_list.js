$(function () {
    $("select").chosen({
        width: "100%"
    });

    // 初始化规则设置列表
    initoverdue();
})

function initoverdue() {
    jsonGetAjax(
        basePath + '/customer/rule/rulelist',
        {type: 1},
        function (result) {
            var content = '';
            $.each(result.data.rulelist, function (n, v) {
                var isChecked = '';
                if (v.isvalid == '1') { // 已启用
                    isChecked = 'checked';
                }
//					$('.valRule').text(result.data.rulelist[1].rulevalue);
                // 转义rulevalue,将\"改为&quot;
                var rulevalue = v.rulevalue ? v.rulevalue.replace(/\"/g, '&quot;') : '';

                // 在列表页面回写设置值
                var guideRulevalue = '';
                if (v.ruleid == '11') {
                    if (v.rulevalue) {
                        var guideRulevalueStr = v.rulevalue.replace(/\"/g, '');
                        var guideRulevalueArr = eval('(' + guideRulevalueStr + ')');

                        rulevalue = guideRulevalueArr.expire;
                        guideRulevalue = '<label><span id="J_ruleValue' + v.id + '">' + guideRulevalueArr.expire + '</span>天未反馈</label>';
                    } else {
                        guideRulevalue = '<label><span id="J_ruleValue' + v.id + '"></span></label>';
                    }
                }
                content += '<div id="J_rule' + v.id + '" class="row tabs-setborder pd5">' +
                    '<div class="col-md-2">' +
                    '<div class="form-group">' +
                    '<label class="control-label">' +
                    '<div class="checkbox checkbox-primary checkbox-inline checkbox-top">' +
                    '<input type="checkbox" id="J_checkRule" data-type="' + v.ruleid + '" data-ruleValue="' + rulevalue + '" name="ruleid" value="' + v.id + '"' + isChecked + '><label for=""></label>' + v.rulename +
                    '</div>' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-8">' +
                    '<div class="form-group mt6">' +
                    guideRulevalue +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-2" style="padding-bottom:5px">' +
                    '<div class="form-group">' +
                    getButton(v, rulevalue) +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            $('#ruleListContent').html(content);
        });

    function getButton(v, rulevalue) {
        if (v.rulename === '转介功能' && !lease_cooperation_permission) {
            return '';
        } else if (v.rulename === '带看超期' && !lease_showtimeout_permission) { // 带看超期
            return '';
        }
        return '<button id="J_setRule" data-id="' + v.id + '" data-type="' + v.ruleid + '" data-rulename="' + v.rulename + '" data-ruleValue="' + rulevalue + '" class="btn btn-sm btn-success sh">设置</button>';
    }
}

$('#J_ruleList').delegate('#J_checkRule', 'click', function (event) {
    var $el = $(this);
    if ($el.attr('data-rulename') === '转介功能') { // 转介
        setRule($el);
    } else if ($el.attr('data-rulename') === '带看超期') { // 带看
        setRule($el);
    }
})

/**
 * 启用/关闭规则设置
 *
 * @param type：规则设置的类型（10,转介；11,带看）
 * @param curId：规则设置的主键id
 * @param curChecked：当前选中状态
 */
function setRule($this_) {
    var curId = $this_.val();
    var curChecked = $this_.prop('checked');
    var type = $this_.attr('data-type');
    var ruleValue = $this_.attr('data-ruleValue');
    var flag = true;

    if (curChecked == true) { // 选中状态
        if (type == '11' && (ruleValue == '' || ruleValue == "null")) {
            setGuide(curId, ruleValue); //带看
        }

        // 启用规则设置
        if (type == '10' || (type == '11' && ruleValue != '')) {
            jsonGetAjax(
                basePath + '/customer/rule/rulesetting',
                {
                    id: curId,
                    isvalid: 1,
                    flag: true
                },
                function (result) {

                }
            );
        }
    } else { // 未选中状态
        // 关闭规则设置
        jsonGetAjax(
            basePath + '/customer/rule/rulesetting',
            {
                id: curId,
                isvalid: 0,
                flag: true
            },
            function (result) {

            }
        );
    }
}


$('#J_ruleList').delegate('#J_setRule', 'click', function (event) {
    var curId = $(this).attr('data-id');
    var curRuleValue = $(this).attr('data-ruleValue');
    var rulename = $(this).attr('data-rulename');
    var type = $(this).attr('data-type');

    if (rulename === '转介功能') { // 转介设置
        setCooperation(curId, curRuleValue);
    } else if (rulename === '带看超期') { // 带看超期设置
        setGuide(curId, curRuleValue);
    }
})

// 转介设置
function setCooperation(curId, curRuleValue) {
    isvalid = $('#J_rule' + curId).find(':checkbox').prop('checked') == true ? 1 : 0;
    commonContainer.modal('转介功能设置', $('#demo_layer1'), function (index) {
        jsonGetAjax(basePath + '/customer/rule/rulesetting', {
            id: curId,
            rulevalue: encodeURI($('#J_deptJson').val()),
            isvalid: isvalid
        }, function (result) {
            layer.msg("操作成功");
            layer.close(index);
            initoverdue();
        })
    }, {
        area: ['500px', '500px'],
        btn: ['确定'],
        overflow: 'auto',
        success: function () {
            $('#J_id').val(curId);

//			curRuleValue = '[{"id":42,"name":"12.01.南大区","level":1},{"id":41,"name":"11.01.东大区","level":1}]';
            $('#J_deptJson').val(curRuleValue);

            $('#J_dept_dialog').css({
                margin: '10px 0 0',
                minHeight: '297px'
            });
            // 加载并初始化组织结构
            showDeptTree($('#J_deptName'), $('#J_deptJson'));
        }
    })
}

// 带看超期设置
function setGuide(curId, curRuleValue) {
    $("#inputtext").val($("#J_ruleValue" + curId).text());
    isvalid = $('#J_rule' + curId).find(':checkbox').prop('checked') == true ? 1 : 0;
    flag = true;
    layer.open({
        title: '带看超期',
        type: 1,
        shift: 1,
        skin: 'layui-layer-lan layui-layer-no-overflow',
        content: $('#demo_layer2'),
        area: ['500px'],
        btn: ['保存', '取消'],
        yes: function (index, layero) {
            var inputRuleValue = $("#inputtext").val();
            if (inputRuleValue > 0) {
                jsonGetAjax(
                    basePath + '/customer/rule/rulesetting',
                    {
                        id: curId,
                        rulevalue: JSON.stringify({"expire": inputRuleValue}),
                        isvalid: isvalid,
                        flag: flag

                    },
                    function (result) {
                        $('#J_ruleValue' + curId).html(inputRuleValue);
                        $('#J_rule' + curId).find('#J_checkRule').attr('data-rulevalue', inputRuleValue);
                        $('#J_rule' + curId).find('#J_setRule').attr('data-rulevalue', inputRuleValue);

                        if (curRuleValue == '')
                            $('#J_ruleValue' + curId).parent().append('天未反馈');
                        layer.msg("操作成功");
                        layer.close(index);
                    }
                );
            } else {
                layer.alert("请输入大于0的数字");
            }
        },
        btn2: function (index, layero) {
            if ($('#J_rule' + curId).find(':checkbox').prop('checked') == true) {
                $('#J_rule' + curId).find(':checkbox').prop('checked', false)
            }
        }
    });
}