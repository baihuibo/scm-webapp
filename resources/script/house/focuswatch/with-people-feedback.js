/**
 * Created by baihuibo on 2017/4/18.
 */


(function (window) {
    var showingsid;

    /**
     * @example
     *   doWithPeopleFeedback(focusid)
     *
     * @param focusid 集中看房id
     * @public
     */
    window.doWithPeopleFeedback = doWithPeopleFeedback;
    function doWithPeopleFeedback(focusid) {
        var houseid, begintime, housekind;
        commonContainer.modal('客户搜索', $('#J_customer_list_layer'), function (index, layero) {
            var customersval = $('input:radio[name="customerlist"]:checked').val();
            if (customersval != null) {
                var customerslist = $('input:radio[name="customerlist"]:checked');
                var customersid = customerslist.attr('data-customersid');
                var customerno = customerslist.attr('data-customerno');


                //判断是否已存在带看记录
                jsonGetAjax(basePath + '/customer/showings/isshowing', {
                    houseid: houseid,
                    client_id: customerno,
                    customersid: customersid
                }, function (result) {

                    if (result.data.house_flag == false) {
                        var params = {
                            accompany_id: '',
                            begintime: begintime,
                            businesstype: housekind,
                            client_id: customerno,
                            customersid: customersid,
                            showings_id: result.data.showingsid,
                            showingsHouseSaveVoList: [
                                {
                                    houseid: houseid
                                }
                            ]
                        };

                        jsonPostAjax(basePath + '/customer/showings/insertshowings', params, function (result) {
                            if (result.code == '0') {
                                showingsid = result.data;

                                //修改带看次数
                                jsonGetAjax(basePath + '/house/focuswatch/updateshownum', {
                                    focusid: focusid,
                                    showingsid: showingsid
                                }, function () {
                                    $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/focuswatch/listview'});
                                });
                                layer.close(index);
                                //--------------------------------------begin---------------------------------------------------------
                                commonContainer.modal('带看反馈', $('#feedback'), function (index, layero) {

                                    //-----------------------begin------------------------------------------------
                                    //确定的事件
                                    //判断返回店面时间
                                    var seeTime = $('#returnTime').val();
                                    if (seeTime == '') {
                                        commonContainer.alert('返回店面时间不能为空');
                                        return false;
                                    }

                                    //判断房源是否都已反馈
                                    var isevaluate = false;
                                    $('.isevaluate').each(function () {
                                        if ($(this).data('isevaluate') == 2) {
                                            commonContainer.alert('您还有未反馈房源');
                                            isevaluate = true;
                                            return false;
                                        }
                                    });
                                    if (isevaluate) {
                                        return false;
                                    }

                                    //获取附件列表
                                    var attachVoList = [];	//附件信息
                                    $('#upFileList > div').each(function () {
                                        attachVoList.push({
                                            attachurl: $(this).data('attachurl'),		//文件路径
                                            attachname: $(this).data('attachname')		//文件名
                                        });
                                    });

                                    //带看反馈表单保存
                                    jsonPostAjax(basePath + '/customer/showings/insertshowingsfeedback.htm', {
                                        endtime: seeTime,						//返回店面时间
                                        attachVoList: attachVoList,				//附件信息集合
                                        showingsid: showingsid				//带看id
                                    }, function () {
                                        layer.msg('保存带看单信息成功');
                                        layer.close(index);
                                        $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/focuswatch/listview'});
                                    }, {});
                                    //-----------------------------end-------------------------------------------
                                }, {
                                    overflow: 'auto',
                                    area: ['80%', '80%'],
                                    btns: ['确定', '取消'],
                                    cancel: function (index, layerno) {
                                        layer.close(index);
                                    },
                                    success: function (layero, index) {

                                        //调用附件列表接口
                                        jsonGetAjax(basePath + '/customer/showings/showingsattach/list.htm', {
                                            showings_id: showingsid
                                        }, function (result) {
                                            if (result.data) {
                                                var rows = result.data.rows;
                                                var length = rows.length;
                                                var html = '';
                                                if (length > 0) {
                                                    for (var i = 0; i < length; i++) {
                                                        html += '<div data-attachname=' + rows[i].attach_name + ' data-attachurl="' + rows[i].attach_url + '"><span class="btn btn-green btn-bitbucket" onclick="tapeManagViseView.deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>' + rows[i].attach_name + '</div>';
                                                    }
                                                    $('#upFileList').html(html);
                                                }
                                            }
                                        });

                                        //调用房源编号列表
                                        jsonGetAjax(basePath + '/customer/showings/showingshouse/list.htm', {
                                            showings_id: showingsid	//带看id
                                        }, function (result) {
                                            if (result.data && result.data.rows.length > 0) {
                                                var columns = [
                                                    {
                                                        field: 'houseid',
                                                        title: '房源编号',
                                                        align: 'center',
                                                        formatter: function (value, row, index) {
                                                            var houseHref = '';
                                                            if (row.housekind == 1) {
                                                                houseHref = basePath + "/house/main/leasedetail.htm?houseid=" + value;
                                                            }else if (row.housekind == 2) {
                                                                houseHref = basePath + "/house/main/buydetail.htm?houseid=" + value;
                                                            }

                                                            var ownername = [];
                                                            if (row.ownername) {
                                                                ownername = ['(', row.ownername, ')'];
                                                            }
                                                            var html = '<a href="' + houseHref + '" target="_black">' + value + '</a>' + ownername.join('');
                                                            return html;
                                                        }
                                                    },
                                                    {
                                                        field: 'address',
                                                        title: '商圈',
                                                        align: 'center'
                                                    },
                                                    {
                                                        field: 'housetype',
                                                        title: '户型',
                                                        align: 'center'
                                                    },
                                                    {
                                                        field: 'housesize',
                                                        title: '面积',
                                                        align: 'center'
                                                    },
                                                    {
                                                        field: 'floor',
                                                        title: '层数',
                                                        align: 'center',
                                                        formatter: function (value, row, index) {
                                                            return value + '/' + row.totalfloor;
                                                        }
                                                    },
                                                    {
                                                        field: 'orientation',
                                                        title: '朝向',
                                                        align: 'center'
                                                    },
                                                    {
                                                        field: 'price',
                                                        title: '价格',
                                                        align: 'center',
                                                        formatter : function (value , row) {
                                                            if (row.housekind == 1) {// 租赁
                                                                return value + '元/每月';
                                                            }else if(row.housekind == 2){ // 买卖
                                                                return value + '万元';
                                                            }
                                                            return value;
                                                        }
                                                    },
                                                    {
                                                        field: 'leadresult',
                                                        title: '带看结果',
                                                        align: 'center',
                                                        formatter: function (value, row, index) {
                                                            var isval = '';
                                                            var contet = '';
                                                            if (value) {
                                                                isval = '1';
                                                                contet = value;
                                                            } else {
                                                                isval = '2';
                                                                contet = '-';
                                                            }
                                                            return '<span class="isevaluate" data-isevaluate=' + isval + '>' + contet + '</span>';
                                                        }
                                                    },
                                                    {
                                                        field: 'opt',
                                                        title: '操作',
                                                        align: 'center',
                                                        formatter: function (value, row, index) {
                                                            return '<button type="button" data-showingshouseid=' + row.showingshouseid + ' data-houseid=' + row.houseid + ' class="btn btn-outline btn-success btn-xs mt-3" onclick="creatResultsPop(this)">反馈</button>';
                                                        }
                                                    }
                                                ]
                                                $('#seeListings').bootstrapTable('destroy');	//清除之前的数据
                                                $('#seeListings').bootstrapTable({
                                                    striped: false,	//是否隔行显示
                                                    data: result.data.rows,
                                                    columns: columns
                                                });
                                            }
                                        });
                                        //文件上传
                                        $('#selectFile').off().on('click', function () {
                                            var upFile = $('#upFile');
                                            upFile.off().click();
                                            upFile.off().on('input change', function () {
                                                var upFileObj = this.files[0];
                                                //验证上传文件
                                                var strIndex = upFileObj.name.lastIndexOf('.') + 1;
                                                var fileSuffixName = upFileObj.name.substring(strIndex);											//文件后缀
                                                var isFileType = /^(xlsx|doc|docx|pdf|pptx|txt|bmp|jpg|svg|psd|rar)$/.test(fileSuffixName);		//是否符合文件类型
                                                //是否符合文件类型
                                                if (!isFileType) {
                                                    commonContainer.alert('上传文件格式为：xlsx、doc、docx、pdf、pptx、txt、bmp、jpg、svg、psd、rar');
                                                    return false;
                                                }
                                                //判断文件是否超过5MB,
                                                if (upFileObj.size > 5 * 1024 * 1024) {
                                                    commonContainer.alert('请上传小于5MB文件');
                                                    return false;
                                                }
                                                //上传至文件服务器（获取文件路径）
                                                var formData = new FormData();
                                                formData.append('file', upFileObj);
                                                $.ajax({
                                                    url: basePath + '/customer/showings/singleFileUpload.htm',
                                                    type: 'POST',
                                                    async: false,
                                                    cache: false,
                                                    data: formData,
                                                    processData: false,
                                                    contentType: false,
                                                    dataType: 'json',
                                                    success: function (result) {
                                                        if (result.code == '0') {
                                                            var html = '<div data-attachname=' + result.data.filename + ' data-attachurl="' + result.data.filepath + '"><span class="btn btn-green btn-bitbucket" onclick="deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>' + result.data.filename + '</div>';
                                                            $('#upFileList').append(html);
                                                            $('#fileHidden').html('<input type="file" id="upFile">');	//重置上传文件
                                                        } else {
                                                            layer.alert(result.msg);
                                                        }
                                                    },
                                                    error: function () {
                                                        layer.alert(errorMsg);
                                                    }
                                                });
                                            });
                                        });
                                        var guideFavoriteTr = [];
                                        //添加房源
                                        $('#addHouse').off().on('click', function () {
                                            layer.open({
                                                type: 1,
                                                shift: 5,
                                                title: '选择房源',
                                                area: ['800px', '90%'],
                                                skin: 'layui-layer-lan',
                                                content: $('#J_add_house_dialog'),
                                                btn: ['确定', '取消'],
                                                yes: function (index, layero) {
                                                    //删除之前添加的房源
                                                    var addHousLength = guideFavoriteTr.length;
                                                    if (addHousLength > 0) {
                                                        var seeListings = $('#seeListings tbody tr').length;
                                                        var gtLength = seeListings - addHousLength - 1;
                                                        $('#seeListings tbody tr:gt(' + gtLength + ')').remove();
                                                    }
                                                    $('input[name="housesid"]:checked', $('#J_favorite_dataTable')).each(function () {
                                                        var houseidContent = $(this).parents('td').next().html();
                                                        var houseidIndex = houseidContent.indexOf('（');
                                                        houseidContent = houseidContent.substring(0, houseidIndex);
                                                        var choosHous = '\
				  					   <tr>' + $(this).parents('tr').html() + '\
					  				        <td style="text-align: center;">\
					  				    		<span class="isevaluate" data-isevaluate="2">-</span>\
				  					   		</td>\
					  					    <td style="text-align: center;"><button type="button" data-addhous="1" data-houseid=' + houseidContent + ' class="btn btn-outline btn-success btn-xs mt-3" onclick="creatResultsPop(this)">反馈</button></td>\
				  					   </tr>';
                                                        if ($.inArray(choosHous, guideFavoriteTr) == -1) {
                                                            guideFavoriteTr.push(choosHous);
                                                        }
                                                    });
                                                    $('#seeListings tbody').append(guideFavoriteTr.join(''));
                                                    $('input[name="housesid"]', $('#seeListings tbody')).parents('td').hide();
                                                    layer.close(index);
                                                },
                                                success: function () {
                                                    // 清空选中项
                                                    $(':checkbox', $favorite_dataTable).prop('checked', false);
                                                    searchBuild($("#J_build"), true, 'left'); 			// 楼盘
                                                    searchBusiness($("#J_business"), true, 'right'); 	// 商圈
                                                    // 加载表格数据
                                                    addHouse(housekind);	////房源类型1租赁2买卖
                                                }
                                            });

                                        });

                                    }
                                });
                                //---------------------------------end--------------------------------
                            } else {
                                commonContainer.alert(result.msg);
                            }
                        });
                    } else {
                        commonContainer.alert('已添加过该房源，请重新选择');
                    }
                });

            } else {
                commonContainer.alert('请选择一条客源');
            }
        }, {
            overflow: 'auto',
            area: ['80%', '80%'],
            btns: ['确定'],
            cancel: function (index, layerno) {
                layer.close(index);
            },
            success: function () {
                jsonGetAjax(basePath + '/house/focuswatch/getfocusbyid', {focusid: focusid}, $.noop).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    if (!result.data) {
                        return layer.alert('未查询到数据');
                    }

                    houseid = result.data.houseid;
                    begintime = result.data.begintime;
                    housekind = result.data.housekind;

                    queryTable(true);
                });
            }
        });

        // 点击查询按钮时，重新触发querytable
        $('#show_back_requery')
            .off('*.requery')
            .on('click.requery', function () {
                queryTable();
            });

        function queryTable(clearForm) {
            var $input = $('#show_back_type_value');
            var $type = $('#show_back_type');
            if (clearForm) {// 清除表单内容
                $input.val('');
                $type.val('customername');
            }
            $('#J_showTable')
                .bootstrapTable('destroy') // 此处需要先销毁之前创建的表格，否则会导致初始化无效的bug
                .bootstrapTable({
                    url: basePath + '/customer/main/listview',
                    sidePagination: 'server',
                    dataType: 'json',
                    method: 'post',
                    pagination: true,
                    striped: true,
                    pageSize: 5,
                    pageList: [5, 10, 20],
                    queryParams: function (params) {
                        var o = {};

                        o.timestamp = new Date().getTime();
                        o.pageindex = params.offset / params.limit + 1,
                            o.pagesize = params.limit;

                        o.businessType = housekind;

                        var inputVal = $input.val(),
                            type = $type.val();
                        if (inputVal && type) {
                            o[type] = inputVal;
                        }
                        return o;
                    },
                    responseHandler: function (result) {
                        if (result.code == 0 && result.data && result.data.totalcount > 0) {
                            return {"rows": result.data.list, "total": result.data.totalcount}
                        }
                        return {"rows": [], "total": 0}
                    },

                    columns: [
                        {
                            field: 'option', title: '选择', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '<input type="radio" name="customerlist" value=' + index + ' data-customersid=' + row.customersid + ' data-customerno=' + row.customerno + ' data-status=' + row.status + '>';
                                return html;
                            }
                        },
                        {
                            field: 'remarktype', title: '评价', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                if (row.remarktype == 'A') {
                                    html = '<span class="remarka">' + row.remarktype + '</span>';
                                } else if (row.remarktype == 'B') {
                                    html = '<span class="remarkb">' + row.remarktype + '</span>';
                                } else if (row.remarktype == 'C') {
                                    html = '<span class="remarkc">' + row.remarktype + '</span>';
                                }
                                return html;
                            }
                        },
                        {
                            field: 'customerno', title: '客户姓名</br>客户编号', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                var customername = row.customername ? row.customername : '-'
                                html = customername + '</br><a target="_blank" href="../main/findleaseclientbycustomerid.htm?customerId=' + row.customersid + '">' + row.customerno + '</a>';
                                return html;
                            }
                        },
                        {field: 'customertype', title: '客户类型', align: 'center'},
                        {field: 'status', title: '销售阶段', align: 'center'},
                        {
                            field: 'guideresult', title: '带看状态', align: 'center',
                            formatter: function (value, row, index) {
                                var html;
                                if (row.statusid == 2 || row.statusid == 4) {
                                    html = row.status;
                                } else {
                                    html = row.guideresult ? row.guideresult : '-'
                                }
                                return html;
                            }
                        },
                        {field: 'lookhousetime', title: '方便看房时间', align: 'center'},
                        {
                            field: 'lastfollowtime', title: '录入时间</br>最后跟进时间', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                var lastfollowtime = row.lastfollowtime ? row.lastfollowtime : '-';
                                var inputtime = row.inputtime ? row.inputtime : '-';
                                html = inputtime + '</br>' + lastfollowtime;
                                return html;
                            }
                        },
                        {
                            field: 'belonguser', title: '所属部门</br>所属人', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                var belonguser = row.belonguser ? row.belonguser : '-'
                                html = row.belonggroup + '</br>' + belonguser;
                                return html;
                            }
                        },
                        {
                            field: 'guidetimes', title: '带看次数', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                if (row.guidetimes == 0) {
                                    html = '-';
                                } else {
                                    html = row.guidetimes + '次';
                                }

                                return html;
                            }
                        }
                    ],
                });
        }
    }

    //删除上传文件
    window.deleteUpFile = deleteUpFile;
    function deleteUpFile(_this) {
        $(_this).parent().remove();
    }

    //创建反馈结果弹窗
    window.creatResultsPop = creatResultsPop;
    function creatResultsPop(target) {
        $('#inlineRadio').prop('checked', true);
        $('#reason').hide();
        //带看房源id
        var showHouseid = $(target).data('addhous') == 1 ? '' : $(target).data('showingshouseid');
        //查看房源带看反馈
        //回显反馈结果
        jsonGetAjax(basePath + '/customer/showings/viewhouse.htm', {
            showingshouseid: showHouseid
        }, function (result) {
            var resultBack = result.data.feedbacktype;
            //指导意见 1：有意向 2：无意向 3：未看
            if (resultBack == 1) {
                $('#inlineRadio').prop('checked', true);
            } else if (resultBack == 2) {
                $('#inlineRadio1').prop('checked', true);
                $('#reason').show();
            } else if (resultBack == 3) {
                $('#inlineRadio2').prop('checked', true);
                $('#reason').show();
            }
            //无意向、未看原因
            $('#noSeeReason').val(result.data.reasons);
        });
        var resultsLock = false;					//防止重复提交
        commonContainer.modal('带看反馈结果', $('#backResults'), function (i) {
            var seeResult = $("input[name='takeResults']:checked").val();
            var noSeeReason = $('#noSeeReason').val();
            if (seeResult == 2 || seeResult == 3) {
                if (noSeeReason == '') {
                    commonContainer.alert('请输入原因');
                    return false;
                }
            }
            if (resultsLock) {
                return false;
            } else {
                resultsLock = true;
            }
            jsonPostAjax(basePath + '/customer/showings/updatehouse.htm', {
                feedbacktype: seeResult,																			//指导意见 1：有意向 2：无意向 3：未看 ,
                houseid: $(target).data('houseid'),																//房源id
                showingshouseid: showHouseid,																	//带看房源id
                showingsid: showingsid, 																	//带看id
                reasons: noSeeReason																				//无意向、未看原因
            }, function () {
                commonContainer.alert('保存成功');
                layer.close(i);
                var seeData = '';
                if (seeResult == 1) {
                    seeData = '有意向';
                } else if (seeResult == 2) {
                    seeData = '无意向';
                } else if (seeResult == 3) {
                    seeData = '未看';
                }
                $(target).parent().prev().html('<span class="isevaluate" data-isevaluate="1">' + seeData + '</span>');								//重置带看结果
            }, {
                completeCallBack: function () {
                    resultsLock = false;
                }
            });
        }, {area: '600px'});
        $('#noSeeReason').val('');
        $('#inlineRadio').on('click', function () {
            $('#reason').hide();
            $('#noSeeReason').val('');
        });
        $('#inlineRadio1,#inlineRadio2').on('click', function () {
            $('#reason').show();
            $('#noSeeReason').val('');
        });
    }
}(window));