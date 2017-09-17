var checkPhoneUrl = basePath + '/custom/common/checkcustomertel.htm'

function showPhone(clientid, businessType) {

    var promise = phoneInit(clientid, businessType);
    if (promise) {
        promise.then(function (result) {
            if (result.code == 1) {
                return layer.alert(result.msg);
            }else if (result.data !== null) {
                var div = jQuery('#J_phone_dialog');
                if (!div.length) {
                    $(document.body).append('<div id="J_phone_dialog" class="ibox-content" style="display: none;">' +
                        '<form class="form-horizontal">' +
                        '<div class="form-group">' +
                        '<label class="col-sm-3 control-label">客户姓名：</label>' +
                        '<div id="J_customerName" class="col-sm-8 ptb7"></div>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label class="col-sm-3 control-label">电话：</label>' +
                        '<div id="J_customerPhone" class="col-sm-8 ptb7"></div>' +
                        '</div>' +
                        '</form>' +
                        '</div>');
                    div = jQuery('#J_phone_dialog');
                }

                layer.open({
                    type: 1,
                    shift: 5,
                    title: '客户电话',
                    area: ['500px', '200px'],
                    skin: 'layui-layer-lan',
                    content: div,
                    btn: ['关闭'],
                    yes: function (index, layero) {
                        layer.close(index);
                    },
                    success: function () {
                        $('#J_customerName').html(result.data.customername);
                        var phones = formatToComma(result.data.phones)
                        $('#J_customerPhone').html(phones);
                    }
                });
            } else {
                layer.alert('查看电话次数已达上限', {icon: 2});
            }
        });
    }
}

function phoneInit(clientid, businessType) {
    if (clientid) {
        // 加载数据
        return jsonGetAjax(checkPhoneUrl, {clientid: clientid, businessType: businessType}, $.noop);
    } else {
        layer.alert('请先选择客户，然后进行电话查看！');
        return false;
    }
}