$(function () {
    proxyNewlyObj.init();
});
//委托书录入
var proxyNewlyObj = {
    //计数器
    index: 0,
    //防止保存重复提交
    savelock: false,
    //存储附件信息
    attachVoList: [],
    init: function () {
        //登记日期
//		laydate({
//			elem:'#registrationDate',
//		    format:'YYYY-MM-DD',
//		    istime:false,
//		    istoday:true
//	    });
        //searchContainer.searchUserListByComp($('#signClient'), true, 'left');	//签委托人自动搜索
        //图片上传
        this.upImgFile();
    },
    /*
    * 委托书录入
    * @param customerid 客源id
    * @param sucssFn 	成功回调
    * @param isModify	1为修改
    * @param proxyid 	委托书id
    */
    proxyNewlyAdded: function (customerid, sucssFn, isModify, proxyid) {
        var _this = this;
        commonContainer.modal(isModify ? '修改委托书' : '委托书录入', $('#backResults'), function (i) {
            return _this.saveEntry(customerid, i, sucssFn, isModify, proxyid);
        }, {
            area: '900px',
            btns: ['保存', '取消'],
            overflow: true,
            success: function () {
                var attorneyNumberInput = $('#attorneyNumber').prop('readonly' , false);
                var upFileName = $('#enterUpFileName');
                upFileName.html('');
                if (isModify == 1) {
                    _this.getProxyData(proxyid).then(function () {
                        attorneyNumberInput.val(_this.proxyInfo.proxynum).prop('readonly', true);
                        //附件列表
                        if (_this.proxyInfo.piceures && _this.proxyInfo.piceures.length > 0) {
                            //var html='';
                            $.each(_this.proxyInfo.piceures, function (i, n) {
                                _this.imgList(n.path, upFileName, n.type, n.spid);
                            });
                        }
                    });
                } else {
                    attorneyNumberInput.val('');								//委托书编号
                }
            }
        });
    },
    //图片上传至图片服务器
    upImgFile: function () {
        var _this = this;
        var upImglock = false;
        $('#selectFile').off().on('click', function () {
            $('#upFile').click();
            _this.fileChangeEvt(upImglock);
        });
        _this.fileChangeEvt(upImglock);
    },
    fileChangeEvt: function (lock) {
        var _this = this;
        $('#upFile').off().on('input change', function () {
            var upFileObj = this.files[0];
            //验证上传文件
            var strIndex = upFileObj.name.lastIndexOf('.') + 1;
            var fileSuffixName = upFileObj.name.substring(strIndex);											//文件后缀
            var isFileType = /^(jpg|jpeg|png|tif|tiff|bmp|gif)$/.test(fileSuffixName);						//是否符合文件类型
            //是否符合文件类型
            if (!isFileType) {
                commonContainer.alert('图片格式为jpg、jpeg、png、tif、tiff、bmp、gif');
                return false;
            }
            //验证上传文件是否大于5MB
            if (upFileObj.size > 5 * 1024 * 1024) {
                commonContainer.alert('图片最大不超过5M');
                return false;
            }
            if (lock) {
                return false;
            } else {
                lock = true;
            }
            var formData = new FormData();
            formData.append('files', upFileObj);
            $.ajax({
                url: basePath + '/custom/common/multiFileUpload.htm',
                type: 'POST',
                async: true,
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (result) {
                    lock = false;
                    if (result.code == 0) {
                        _this.imgList(result.data[0].filepath, $('#enterUpFileName'), '');
                    } else {
                        commonContainer.alert(result.msg);
                    }
                },
                error: function () {
                    lock = false;
                    layer.alert(errorMsg);
                }
            });
            this.value = '';//重置上传文件控件
        });
    },
    //删除上传图片文件
    deleteImgFile: function (that) {
        if ($('#enterUpFileName').children().length === 1) {
            commonContainer.confirm('委托书附件最少需要一个，确认删除最后一个附件吗？', function (layerno) {
                layer.close(layerno);
                remove();
            });
        }else{
            remove();
        }

        function remove() {
            $(that).closest('.deleImg').hide('600' , function () {
                $(this).remove();
            });
        }
    },
    /*
    *保存委托书内容
    */
    saveEntry: function (customerid, i, sucssFn, isModify, proxyid) {
        var _this = this;
        //验证委托书编号
        var attorneyNumber = $('#attorneyNumber').val();
        if (!attorneyNumber) {
            commonContainer.alert('请输入委托书编号');
            return false;
        }
        var signClient = $('#signClient').val();
        var files = $('#enterUpFileName').children();
        if (!files.length) {
            commonContainer.alert('您至少要上传一张图片');
            return false;
        }
        //判断所传图片是否选择类型
        _this.attachVoList = [];	//图片信息集合
        var isflag = false;
        files.each(function (i) {
            if (!$(this).attr('id') == '') {
                var imgType = $(this).find('select').val();
                if (imgType == '') {
                    commonContainer.alert('您有图片未选择类型');
                    isflag = true;
                    return false;
                } else {
                    var imgSpid = $(this).data('spid');
                    _this.attachVoList.push({
                        path: $(this).data('imgurl'),		//附件存在文件服务器的路径
                        type: imgType,						//附件类型：（待定参数值）
                        spid: imgSpid ? imgSpid : ''				//附件id  (修改时用到，录入时对此字段不作处理)
                    });
                }
            }
        });
        if (isflag) {
            return false;
        }
        //防止重复提交
        if (_this.savelock) {
            return false;
        } else {
            _this.savelock = true;
        }
        //调用接口
        var url = '';
        var parameter = {
            customerid: customerid,						//客源编号
        };
        if (isModify == 1) {
            //修改委托书
            url = '/customer/proxy/update.htm';
            parameter.id = proxyid;						//委托书主键id
            parameter.piceures = _this.attachVoList;		//附件列表（修改）
            parameter.proxynum = attorneyNumber;			//委托书编号（修改）
        } else {
            //录入委托书
            url = '/customer/proxy/entry.htm';
            parameter.picturelist = _this.attachVoList;	//附件列表
            parameter.wtinfono = attorneyNumber;			//委托书编号
        }
        layer.close(i);
        jsonPostAjax(basePath + url, parameter, function () {
            commonContainer.alert('操作成功');
            if (sucssFn) {
                sucssFn();
            }
            //在列表页修改刷新列表
//			if(isModify==1 && PowerAttorney){
//				PowerAttorney.queryList();
//			}else{
//				
//			}
        }, {
            completeCallBack: function () {
                _this.savelock = false;
            }
        });
    },
    //创建上传图片列表    type：图片类型 ; spid:图片id(修改时需传此字段)
    imgList: function (imgUrl, content, type, spid) {
        ++this.index;
        var html = '\
			<div class="col-md-3 deleImg" style="display:none;" id="' + this.index + '" data-imgname="" data-spid="' + (spid == undefined ? '' : spid) + '" data-imgurl="' + imgUrl + '">\
				<div calss="form-group" id="initchosen' + this.index + '" style="height:200px;padding:15px;">\
					<img width="100%" height="80%" style="margin-bottom:10px;" src="' + imgUrl + '">\
					<select name="guidstatus" class="J_chosen form-control" style="width:75%;display:inline-block">\
						<option value="">请选择</option>\
					</select>\
					<button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" data-index="' + this.index + '" onclick="proxyNewlyObj.deleteImgFile(this)">删除</button>\
				</div>\
			</div>';
        content.append(html);
        $('#' + this.index).show('600');
        var initchosen = $('#initchosen' + this.index + ' select');
        dimContainer.buildDimChosenSelector(initchosen, 'proxyPictureType', type);			//委托书图片类型
        initchosen.chosen('destroy');
    },
    /*
     * 委托书详情
     * @param proxyid:委托书主键id
     * @param customerid 客源id
     * @param isList  是否是列表页查看详情     1：是
     * */
    proxyShowInfor: function (proxyid, customerid) {
        var _this = this;

        _this.getProxyData(proxyid).then(function (result) {
            var data = result.data || {};
            layer.open({
                title: '委托书查看',
                type: 1,
                shift: 5,
                skin: 'layui-layer-lan',
                content: $('#proxyShowInfor'),
                area: '800px',
                btn: window.PowerAttorney ? ['作废', '修改'] : ['关闭'],
                success: function () {
                    $('#effectiveState').html('');
                    $('#enclosureList').html('');
                    $('.layui-layer-btn0').hide();
                    $('.layui-layer-btn1').hide();
                    //$('.layui-layer-btn2').hide();
                    //录入人及其领导，可点击查看委托书信息
                    //if(result.data.issuperior==1 || result.data.isself==1){
                    $('#jurisdictionNo').hide();
                    $('#jurisdiction').show();
                    $('#proxyNumber').html('委托书编号：<span>' + data.proxynum + '</span>');								//委托书编号
                    $('#proxyPersonal').html('签委托人：<span>' + data.username + '</span>');								//签委托人
                    $('#proxyDepartment').html('签委托部门：<span>' + data.deptname + '</span>')								//签委托部门
                    $('#proxyDate').html('委托时间：<span>' + data.createtime + '</span>');									//委托时间
                    $('#effectiveState').html('是否有效：<span id="isyxi">' + data.state + '</span>');						//是否有效
                    if (data.state == '有效') {
                        $('#isyxi').css({color: '#1ab394'});
                    }
                    var length = (data.piceures || []).length;
                    //附件列表
                    if (length > 0) {
                        var html = '';
                        var type = '';
                        $.each(data.piceures, function (i, n) {
                            if (n.type == 101) {
                                type = '身份证';
                            } else if (n.type == 102) {
                                type = '委托书';
                            } else if (n.type == 103) {
                                type = '产权证';
                            }
                            html += '\
									<div class="col-md-3"  style="height:140px;text-align: center;">\
									<img src="' + n.path + '" width="80%" height="80%">\
									<div style="padding-top: 10px;">' + type + '</div>\
								</div>';
                        });
                        $('#enclosureList').html(html);
                    }
                    if (customerid == undefined) {
                        $('.layui-layer-btn').hide();
                        return false;
                    }
                    //是否有效
                    if (data.state == '有效') {
                        //是否为创建人 0 否  1是
                        //if(result.data.isself==1){
                        $('.layui-layer-btn1').show().attr('class', 'layui-layer-btn0');
                        //}
                        //是否为直属领导  0 否  1是
                        //if(result.data.issuperior==1){
                        $('.layui-layer-btn0').show();
                        //}
                    } else {
                        $('.layui-layer-btn').hide();
                    }
//
                },
                //作废回调
                yes: function (i) {
                    if (window.PowerAttorney) {
                        commonContainer.modal('委托作废', '<div style="padding: 20px;font-size: 14px;">请确认是否作废</div>', function (j) {
                            layer.close(j);
                            jsonGetAjax(basePath + '/customer/proxy/invalid.htm', {
                                proxyid: proxyid,
                                customerid: customerid
                            }, function () {
                                commonContainer.alert('作废成功');
                                PowerAttorney.queryList();
                            });
                        }, {
                            area: '300px',
                            btns: ['确定', '取消']
                        });
                        return false;
                    }else{
                        layer.close(i);
                    }
                },
                //修改回调
                btn2: function (i) {
                    layer.close(i);
                    _this.proxyNewlyAdded(customerid, PowerAttorney.queryList, 1, proxyid);
                    return false;
                },
                cancel: function () {
                }
            });
        },$.noop);
    },

    //调用委托书详情接口
    getProxyData : function (proxyid) {
        var _this = this;
        return jsonGetAjax(basePath + '/customer/proxy/queryOne.htm', {
            proxyid: proxyid		//委托书主键id
        }, $.noop).then(function (result) {
            if (result.code !== 0) {
                layer.alert(result.msg);
                var d = $.Deferred();
                d.reject(result.msg);
                return d.promise();
            }
            _this.proxyInfo = result.data;
            return result;
        });
    }
};