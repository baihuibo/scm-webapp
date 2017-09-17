function getQueryString(name) { // js获取url地址以及 取得后面的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var hrShopName;
var userName;
$(function () {
    $("select").chosen({
        width: "100%",
        no_results_text: "未找到此选项!"
    });

    $('#retrievalform').on('keydown', 'input.form-control', function (e) {
        if (e.key && e.key.length === 1 && !/\w/.test(e.key) || e.key === '_') {// 不允许输入字母数字之外的字符
            return false;
        }
    }).on('change blur', 'input.form-control', function (e) {
        this.value = this.value.replace(/[\W_]/g, ''); // 移除非数字字母
    }).find('input.form-control').css({'ime-mode': 'disabled'});

    $("#t_houseId").click(function () {
        window.open(basePath + "/house/main/buydetail.htm?houseid=" + getQueryString('houseId'))
    })

    $("#t_clientId").click(function () {
        window.open(basePath + "/customer/main/findbuyerclientbycustomerid.htm?customerId=" + getQueryString('customerId'))
    })
    $("#houseId").val(getQueryString('houseId'));
    $("#clientId").val(getQueryString('customerId'));
    $("#customerId").val(getQueryString('clientId'));
    $("#showingsId").val(getQueryString('showingsId'));
    $("#t_houseId").text(getQueryString('houseId'));
    $("#t_clientId").text(getQueryString('clientId'));
    dimContainer.buildDimChosenSelector($("#J_houseCardType"), "HousecertificateType", "1")
    var cardTypePromise = dimContainer.buildDimChosenSelector($(".J_cardType"), "cardType", "1");
    var numMath = 1;
    $(document).delegate('a', 'click', function (event) {
        var _this = $(this);
        var title = '';
        var papersTitle = '';
        var Hclass = "";
        var nverifyname = '';
        if ($(this).attr('type') == 'newly1' || $(this).attr('type') == 'newly2' || $(this).attr('type') == 'newly3' || $(this).attr('type') == 'newly4') {
            if ($(this).attr('type') == 'newly1') {
                title = '<span class="text-danger">*</span>业主有效证件类型：';
                papersTitle = '<span class="text-danger">*</span>证件编号：';
                nverifyname = 'idCard'
            } else if ($(this).attr('type') == 'newly2') {
                title = '业主共有人有效证件类型：';
                papersTitle = '证件编号：';
                nverifyname = 'NidCard';
            } else if ($(this).attr('type') == 'newly3') {
                title = '<span class="text-danger">*</span>客户有效证件类型：';
                papersTitle = '<span class="text-danger">*</span>证件编号：';
                nverifyname = 'idCard'
            } else if ($(this).attr('type') == 'newly4') {
                title = '客户共有人有效证件类型：';
                papersTitle = '证件编号：';
                nverifyname = 'NidCard';
            }
            numMath++;
            srt = '<tr>'
                + '<th class="col-md-3">' + title + '</th>'
                + '<td class="col-md-3">'
                + '<div class="col-sm-10 col-sm-offset-1">'
                + '<div class="form-group">'
                + '<select class="J_cardTypenew J_chosen form-control" id="name' + numMath + '" name="idCardTypeId">'
                + '</select></div></div></td>'
                + '<th class="col-md-2">' + papersTitle + '</th>'
                + '<td class="col-md-3">'
                + ' <div class="col-sm-10 col-sm-offset-1">'
                + ' <div class="form-group">'
                + '<input type="text" class="form-control input-sm" id="nameinput' + numMath + '" name=' + nverifyname + '></div></td>'
                + '</div>'
                + '<td><a type="del_owner"><i class="glyphicon glyphicon-remove text-danger"></i></a></td></tr>',
                _this.closest('.row').find('table').append(srt);
            dimContainer.buildDimChosenSelector(_this.closest('.row').find('table select').eq(_this.closest('.row').find('table select').length - 1), "cardType", "1");
            _this.closest('.row').find('table select').trigger("chosen:updated");
        } else if ($(this).attr('type') == 'del_owner') {
            commonContainer.confirm(
                '请确认是否删除该信息',
                function (index, layero) {
                    _this.closest('tr').remove();
                    layer.msg("删除成功");
                }
            )


        }
    })

    $("#J_retrieval").on("click", function () {
        // 数据初始化
        var cookieresult = {};
        cookieresult.houseId = $('#houseId').val();
        cookieresult.clientId = $('#clientId').val();
        cookieresult.customerId = $('#customerId').val();
        cookieresult.showingsId = $('#showingsId').val();
        var owner = [];
        $('#J_table1 tr').each(function () {
            var obj = {};
            obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
            obj.idCard = $(this).find('td').eq(1).find('input').val();
            obj.idCardTypeName = $(this).find('td').eq(0).find('select option:selected').text();
            owner.push(obj);
        })
        cookieresult.owner = owner;
        var ownerAll = [];
        $('#J_table2 tr').each(function () {
            if ($(this).find('td').eq(1).find('input').val() != '') {
                var obj = {};
                obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
                obj.idCard = $(this).find('td').eq(1).find('input').val();
                obj.idCardTypeName = $(this).find('td').eq(0).find('select option:selected').text();
                ownerAll.push(obj);
            }

        })
        cookieresult.ownerAll = ownerAll;
        var customer = [];
        $('#J_table3 tr').each(function () {
            var obj = {};
            obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
            obj.idCard = $(this).find('td').eq(1).find('input').val();
            obj.idCardTypeName = $(this).find('td').eq(0).find('select option:selected').text();
            customer.push(obj);
        })
        cookieresult.customer = customer;
        var customerAll = [];
        $('#J_table4 tr').each(function () {
            if ($(this).find('td').eq(1).find('input').val() != '') {
                var obj = {};
                obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
                obj.idCard = $(this).find('td').eq(1).find('input').val();
                obj.idCardTypeName = $(this).find('td').eq(0).find('select option:selected').text();
                customerAll.push(obj);
            }

        })
        cookieresult.customerAll = customerAll;
        var cookieresult = JSON.stringify(cookieresult);
        if (window.localStorage) {
            localStorage.setItem("cookieresult", cookieresult);
        } else {
            Cookie.write("cookieresult", cookieresult);
        }
        var result = {};
        result.buildingNo = $('#buildingNo').val();
        result.houseCardTypeId = $('#J_houseCardType').val();
        result.businessTypeId = 2;
        var customers = [];
        $('#J_table3 tr,#J_table4 tr').each(function () {
            if ($(this).find('td').eq(1).find('input').val() != '') {
                var obj = {};
                obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
                obj.idCard = $(this).find('td').eq(1).find('input').val();
                obj.$$type = '乙方信息';
                customers.push(obj);
            }
        })
        result.customers = customers;
        var owners = [];
        $('#J_table1 tr,#J_table2 tr').each(function () {
            if ($(this).find('td').eq(1).find('input').val() != '') {
                var obj = {};
                obj.idCardTypeId = $(this).find('td').eq(0).find('select').val();
                obj.idCard = $(this).find('td').eq(1).find('input').val();
                obj.$$type = '甲方信息';
                owners.push(obj);
            }
        })
        result.owners = owners;


        if (!housedetailValidate()) {
            commonContainer.alert("存在不符合规则的数据");
            return;
        } else if (validRepeatCard(result)) {// 是否有证件和编码重复
            var data = validRepeatCard.data;
            cardTypePromise.then(function (result) {
                return result.data || [];
            }).then(function (list) {
                var type = list.find(function (item) {
                    return item.valueCode == data.idCardTypeId;
                });

                if (type) {
                    layer.alert('{0} 与 {1} 的 "{2}" 编码一致，请检查证件信息无误后，进行限制性检索！'.format(data.key1, data.key2, type.valueName));
                }
            });
        } else {
        	jsonPostAjax(basePath + '/restrictive/validaterestrictive', result, function (result) {
                    if (result.data.validate==true) {
                    	commonContainer.modal('确定报成交人信息 ', $('#clinch_layer'), function (index, layero) {
                    		//commonContainer.alert(result.data.message)
                            window.location.href = "../contractSales/contractSalesAdd.htm";
                    	}, {
        	                'btns': ['确认', '取消'],
        	                'success': function () {
        	                    jsonGetAjax(basePath + '/sign/lease/getCurrentUser', result, function (result) {
        	                        hrShopName = result.data.hrShopName;
        	                        userName = result.data.userName;
        	                        userId = result.data.userId;
        	                        $("#areaName").text(result.data.areaName);
        	                        $("#shopGroupName").text(result.data.shopGroupName);
        	                        $("#hrShopName").text(hrShopName);
        	                        $("#userName").text(userName);
        	                        $("#userName").on('click', function () {
        	                            getUserStaffInfo(userId);
        	                        })
        	                    })
        	                }
        	            });
                        
                    } else {
                        layer.alert(result.data.message, {icon: 2});
                        return false;
                    }
	            
            });
        }
    });

    function validRepeatCard(result) {
        var list = [].concat(result.owners, result.customers);
        var onceCard = {};
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            var key = card.idCardTypeId + '@' + card.idCard;
            var card1 = onceCard[key];
            if (card1) {
                validRepeatCard.data = {
                    idCardTypeId: card.idCardTypeId,
                    key1: card1.$$type,
                    key2: card.$$type,
                };
                return card;
            }
            onceCard[key] = card;
        }
        return false;
    }
})

/*$(function(){
 $(".retrievalform").validate();
 $(":input").each(function(){
 $(this).rules("add", {
 required: true,
 }); 
 });
});*/


/*$(function () {
if ($.validator) {
 //fix: when several input elements shares the same name, but has different id-ies....
 $.validator.prototype.elements = function () {
 var validator = this,
  rulesCache = {};
 // select all valid inputs inside the form (no submit or reset buttons)
 // workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
 return $([]).add(this.currentForm.elements)
 .filter(":input")
 .not(":submit, :reset, :image, [disabled]")
 .not(this.settings.ignore)
 .filter(function () {
  var elementIdentification = this.id || this.name;
  !elementIdentification && validator.settings.debug && window.console && console.error("%o has no id nor name assigned", this);
  // select only the first element for each name, and only those with rules specified
  if (elementIdentification in rulesCache || !validator.objectLength($(this).rules()))
  return false;
  rulesCache[elementIdentification] = true;
  return true;
 });
 };
}
});*/



