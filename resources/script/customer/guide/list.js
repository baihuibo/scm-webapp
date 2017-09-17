$(function(){
	tapeManagViseView.init();
});
var tapeManagViseView={
	cancelSeeLock:false,
	//带看id
	showingsId:'',
	init:function(){
		this.dateSlot();
		this.querylist();
		this.basicsData();
		//带看人
		searchContainer.searchUserListByComp($('#leadusersname'), true, 'right');
		//陪看人
		searchContainer.searchUserListByComp($('#organVal'), true, 'left');

        window.lease_show_edit = $('#LEASE_SHOW_EDIT').val(); // 带看修改
        window.lease_show_cancel = $('#LEASE_SHOW_CANCEL').val(); // 带看取消
        window.lease_show_feedback = $('#LEASE_SHOW_FEEDBACK').val(); // 带看反馈
        window.lease_show_view = $('#LEASE_SHOW_VIEW').val(); // 带看详情查看

        window.buy_show_edit = $('#BUY_SHOW_EDIT').val();// 带看修改
        window.buy_show_cancel = $('#BUY_SHOW_CANCEL').val();// 带看取消
        window.buy_show_feedback = $('#BUY_SHOW_FEEDBACK').val();// 带看反馈
        window.buy_show_view = $('#BUY_SHOW_VIEW').val();// 带看详情查看

        window.lease_show_guide_add = $('#LEASE_SHOW_GUIDE_ADD').val(); // 带看指导录入
        window.lease_show_guide_view = $('#LEASE_SHOW_GUIDE_VIEW').val(); // 带看指导查看
        window.buy_show_guide_add = $('#BUY_SHOW_GUIDE_ADD').val();// 带看指导录入
        window.buy_show_guide_view = $('#BUY_SHOW_GUIDE_VIEW').val();// 带看指导查看
	},
	//基础数据
	basicsData:function(){
		//初始化chosen
		$('select').chosen({
			width : "100%"
		});
		//带看状态
		//dimContainer.buildDimChosenSelector($('#seeState'),'guideStatus','');
		//业务类型
		dimContainer.buildDimRadio($('#businessType'), 'businesstype','businessType','1');
		//看房指导
        dimContainer.buildDimChosenSelector($('#guidsTatus'), 'guide', '');
	},
	//查询时间
	dateSlot:function(){
		//预计带看时间
		var seeBeginDate={
			elem:'#seeBeginDate',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#seeEndDate',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
		//返回店面时间
		var backBeginDate={
			elem:'#backBeginDate',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	backEndDate.min=datas;
		    	backEndDate.start=datas;
		    }
		}
		var backEndDate={
			elem:'#backEndDate',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	backBeginDate.max=datas;
		    }
	    }
		laydate(backBeginDate);
		laydate(backEndDate);
	},
	//查询列表
	querylist:function(){
		var _this=this;
		$('#J_search').on('click',function(){
			_this.querySeeList();
		});
	},
	//创建指导意见弹窗
	creatGuioPop:function(target){
		var _this=this;
		_this.showingsId=$(target).data('id');		//带看Id
		var businesstypeid = +$(target).data('businesstypeid'); //类型
		var insertguideLock=false;					//防止重复提交

		var btns = ['关闭'];
        if ((businesstypeid === 1 && lease_show_guide_add) || (businesstypeid === 2 && buy_show_guide_add)) {
            btns = ['保存' , '取消'];
        }

        commonContainer.modal('指导意见',$('#guidingOpinions'),function(i){
            if (btns.length === 1) {// 如果没有指导意见保存按钮，则直接关闭对话框
                layer.close(i);
                return;
            }
			var guideContent=$('#opinionContent').val();
            if (guideContent == '') {
				commonContainer.alert('请输入指导意见');
				return false;
			}
			if(insertguideLock){
				return false;
			}else{
				insertguideLock=true;
			}
			//调用新增指导意见接口
			jsonPostAjax(basePath+'/customer/showings/insertguide.htm',{
				content:guideContent,				//指导意见内容
				showingsid:_this.showingsId			//带看id
			},function(){
				commonContainer.alert('保存成功');
				_this.querySeeList();
				layer.close(i);
			},{
				completeCallBack:function(){
					insertguideLock=false;
				}
			});
		},{area:'600px' , btns : btns});
        $('#opinionContent').val('');

        var opinionForm = $('#opinionForm,#opinionTitle');
        if (btns.length === 1) {
            opinionForm.hide();
        }else{
            opinionForm.show();
		}

		//查询指导意见列表
		var table = $('#guidingOpinionsTab');
        if ((businesstypeid === 1 && lease_show_guide_view) || (businesstypeid === 2 && buy_show_guide_view)) { // 看房指导查看
            jsonGetAjax(basePath + '/customer/showings/showingsguide/list.htm', {
                showings_id: _this.showingsId			//带看id
            }, function (result) {
                if (result.data) {
                    table.show();
                    table.bootstrapTable('destroy');
                    table.bootstrapTable({
                        data: result.data.rows,
                        columns: [
                            {field: 'username', title: '指导人', align: 'center'},
							{field: 'inputdate', title: '指导时间', align: 'center'},
							{field: 'content', title: '指导意见', align: 'center' , formatter : function (value, row) {
								return (value || '').encodeHTML();
                            }}
                        ]
                    });
                }
            });
        } else {
            table.hide();
        }
	},
	//创建反馈弹窗  type=0 反馈  1详情  2修改
	creatFeedbackPop:function(target,type){
		var _this=this;
		_this.showingsId=$(target).data('id');						//带看id
        var clientid = $(target).data('clientid');						//客户 ID
		var customername=$(target).data('customername')				//客户姓名
		$('#returnTime').css({border:'1px solid #CBD5DD'});
		var housType='';
		//房源类型1租赁2买卖
		if($(target).data('businesstype')=='租赁'){
			housType='1';
		}else{
			housType='2';
		}
		$('#seeListings').html('');
		$('#J_guide_dataTable').html('');
		//调用房源编号列表
		jsonGetAjax(basePath+'/customer/showings/showingshouse/list.htm',{
			showings_id:_this.showingsId	//点看id
		},function(result){
			if(result.data && result.data.rows.length>0){
				var columns=[
					{
						field : 'houseid',
						title : '房源编号',
						align : 'center',
						formatter:function(value, row, index){
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
//					{
//						field : 'customername',
//						title : '业主姓名',
//						align : 'center'
//					},
					{
						field : 'address',
						title : '楼盘',
						align : 'center'
					},
					{
						field : 'housetype',
						title : '户型',
						align : 'center'
					},
					{
						field : 'housesize',
						title : '建筑面积',
						align : 'center'
					},
					{
						field : 'floor',
						title : '层数',
						align : 'center',
						formatter:function(value,row,index){
							return value+'/'+row.totalfloor;
						}
					},
					{
						field : 'price',
						title : '价格',
						align : 'center',
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
						field : 'orientation',
						title : '朝向',
						align : 'center'
					}
				]
				if(type==0||type==1){
					columns.push({
						field : 'leadresult',
						title : '带看结果',
						align : 'center',
						formatter:function(value,row,index){
							var isval='';
							var contet='';
							if(value){
								isval='1';
								contet=value;
							}else{
								isval='2';
								contet='-';
							}
							return '<span class="isevaluate" data-isevaluate='+isval+'>'+contet+'</span>';
						}
					});
				}
				if(type==0 || type==2){
					columns.push({
						field : '',
						title : '操作',
						align : 'center',
						formatter:function(value,row,index){
                            var customersid = $(target).data('customersid');
                            var clientid = $(target).data('clientid');
							if(type==0){
								var html='';
								if(row.leadresult!=='已成交'){
									//反馈信息
									var feedbackInfo='';
									if(row.leadresult){
										var feedbacktype='';
										if(row.leadresult=='有意向'){
											feedbacktype='1';
										}else if(row.leadresult=='无意向'){
											feedbacktype='2';
										}else if(row.leadresult=='未看'){
											feedbacktype='3';
										}
										feedbackInfo=JSON.stringify({
											feedbacktype:feedbacktype,							//结果类型
											houseid:row.houseid,								//房源id
											reasons:row.reasons==undefined?'':row.reasons.encodeHTML(),		//无意向、未看原因
											showingshouseid:row.showingshouseid,				//带看房源id
											showingsid:_this.showingsId							//带看编号
										});
									}
                                    var btn = $('<button type="button" class="btn btn-outline btn-success btn-xs mt-3" onclick="tapeManagViseView.creatResultsPop(this)">反馈</button>');
                                    btn.attr({
                                        'data-showingshouseid': row.showingshouseid,
                                        'data-customername': customername,
                                        'data-clientid': clientid,
                                        'data-houseid': row.houseid,
                                        'data-feedbackdata': feedbackInfo
                                    })
                                    html += btn[0].outerHTML;
								}
								if(row.leadresult=='有意向'|| row.leadresult=='无意向'){
									var urlht=''

                                    //租赁
                                    if ($(target).data('businesstypeid') == 1) {
                                        var housecode = $(target).data('housecode');
//										if(housecode=='undefined'){
//											housecode='';
//										}
                                        urlht = basePath + '/sign/lease-retrieve.htm?houseid=' + row.houseid + '&customerid=' + customersid + '&clientid=' + clientid + '&buildingNo=' + housecode + '&showingsId=' + _this.showingsId;
                                    } else {
                                        urlht = basePath + '/sign/contractSales/salesRetrieve.htm?clientId=' + clientid + '&customerId=' + customersid + '&houseId=' + row.houseid + '&showingsId=' + _this.showingsId;
                                    }
									html+='&nbsp;&nbsp;<a type="button" href='+urlht+' class="btn btn-outline btn-success btn-xs mt-3">报成交</a>';
								}
								return html;//row.leadresult=='已成交'?'':'<button type="button" data-showingshouseid='+row.showingshouseid+' data-houseid='+row.houseid+' class="btn btn-outline btn-success btn-xs mt-3" onclick="tapeManagViseView.creatResultsPop(this)">反馈</button>';
							}
							return '<a data-id="'+row.houseid+'" id="J_house_del" class="btn-green btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a>';
						}
					});
				}
				var dataTab=null;
				if(type==2){
					dataTab=$('#J_guide_dataTable');
				}else{
					dataTab=$('#seeListings');
					dataTab.html('<tbody></tbody>');
				}
				dataTab.bootstrapTable('destroy');	//清除之前的数据
				dataTab.bootstrapTable({
					striped:false,	//是否隔行显示
					data:result.data.rows,
					columns:columns
				});
				dataTab.find('thead').remove();
				dataTab.removeClass('table-hover');
			}
		});
		if(type==2){
			$('#J_cusId').html(clientid);												//带看id（客户编码）
			$('#J_cusName').html(customername);													//客户姓名
			$('#estimatedTime').val($(target).data('begintime').replace('A',' '));				//预计带看时间
			var lookName=$(target).data('accompanyname')
			$('#J_lendusername').val(lookName=='undefined'?'':lookName);						//陪看人
			$('#J_guide_dataTable tbody').html('');												//清空添加的房源
			var addHouseLock=false;
			commonContainer.modal('带看修改',$('#J_add_guide_dialog'),function(i){
				//验证预计带看时间是否为空
				var estimatedTime=$('#estimatedTime').val();
				if(estimatedTime==0){
					commonContainer.alert('请输入预计带看时间');
					return false;
				}

                if(!houseListTab.find('tr').length){
                    commonContainer.alert('至少保留一条房源信息');
                    return false;
                }

				if(addHouseLock){
					return false;
				}else{
					addHouseLock=true;
				}
				var showingsHouseArr=[];	//房源id集合
				$('#J_guide_dataTable a').each(function(i){
					if($(this).data('id')){
						showingsHouseArr.push({houseid:$(this).data('id')});
					}
				});
				//调用带看信息修改接口
				var lendusername=$('#J_lendusername');
				var accompanyId='';		//陪看人id
				if(lendusername.val()==lookName){
					accompanyId=$(target).data('accompanyid');
				}else{
					accompanyId=lendusername.data('id');
				}
				jsonPostAjax(basePath+'/customer/showings/updateshowings.htm',{
					accompany_id:accompanyId, 											//陪看人
					begintime:estimatedTime, 											//预计带看时间
                    businesstypeid: $(target).data('businesstype') == '租赁' ? '1' : '2', 		//业务类型 1：租赁 2：买卖
                    showingsHouseSaveVoList: showingsHouseArr,							//房源信息集合
                    showings_id: _this.showingsId										//带看编号
				},function(){
					commonContainer.alert('保存成功');
					layer.close(i);
                    _this.querySeeList();
				},{
					completeCallBack:function(){
						addHouseLock=false;
					}
				});
			},{area:'700px'});
			//查看电话
			$('#J_checkPhone').off().on('click',function(event){
                showPhone(clientid, housType);
			});
			//陪看人
			searchContainer.searchUserListByComp($('#J_lendusername'), true, 'left');
			//添加房源
			$('#J_add_house').off().on('click',function(){
				addHouse(housType);
			});
			//预计带看时间
			$('#estimatedTime').on('click',function(){
				laydate({
					elem:'#estimatedTime',
				    format:'YYYY-MM-DD hh:mm',
				    min: laydate.now(),
				    istime:true
				});
			});
            //删除房源
			var houseListTab=$('#J_guide_dataTable');
			houseListTab.on('click','#J_house_del',function(){
				$(this).parents('tr').remove();
				// 重置J_guide_houses的值
				var guideHouseIds = $('#J_guide_houses').val();
				guideHouseIds = guideHouseIds.substring(0, guideHouseIds.length-1);
				var guideHouseIdArr = guideHouseIds.split(',');
				guideHouseIdArr.splice($.inArray($(this).attr('data-id'), guideHouseIdArr), 1);
				$('#J_guide_houses').val(guideHouseIdArr.join(','));
			});
			return false;
		}
        $('#CustomerInfor').html((clientid || '') + '（' + customername + '）');
		$('#returnTime').val($(target).data('endtime').replace('A',' ').replace('B',''));
		$('#upFileList').html('');
		if($(target).data('seeing')){
			//添加房源（反馈）
			$('#addHouse').show();
			var guideFavoriteTr=[];
			$('#addHouse').off().on('click',function(){
				addHouse(housType,1); //修改添加房源弹框
			});
		}else{
			$('#addHouse').hide();
		}
		if(type==0){
			//调用附件列表接口
			jsonGetAjax(basePath+'/customer/showings/showingsattach/list.htm',{
				showings_id:_this.showingsId
			},function(result){
				if(result.data){
					var rows=result.data.rows;
					var length=rows.length;
					var html='';
					if(length>0){
						for(var i=0;i<length;i++){
							html+='<a data-attachname='+rows[i].attach_name+' data-attachurl="'+rows[i].attach_url+'" href="'+rows[i].attach_url+'" target="_blank"><span class="btn btn-green btn-bitbucket" onclick="tapeManagViseView.deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>'+rows[i].attach_name+'</a>';
						}
						$('#upFileList').html(html);
					}
				}
			});
			var seeLock=false;
			commonContainer.modal('带看反馈',$('#feedback'),function(i){
				var seeTime=$('#returnTime').val();
				if(seeTime==''){
					commonContainer.alert('返回店面时间不能为空');
					return false;
				}
                //判断房源是否都已反馈
				var showHousList=[];
				var isAllback=false;
				$('#seeListings button').each(function(){
					if($(this).data('feedbackdata')==undefined){
						isAllback=true;
						return false;
					}else{
						showHousList.push($(this).data('feedbackdata'));
                    }
				});
				if(isAllback){
					commonContainer.alert('您还有未反馈房源');
					return false;
				}
//				var isevaluate=false;
//				$('.isevaluate').each(function(){
//					if($(this).data('isevaluate')==2){
//						commonContainer.alert('您还有未反馈房源');
//						isevaluate=true;
//						return false;
//					}
//				});
//				if(isevaluate){
//					return false;
//				}
				if(seeLock){
					return false;
				}else{
					seeLock=true;
				}
				var attachVoList=[];	//附件信息
				$('#upFileList > a').each(function(){
					attachVoList.push({
		    			attachurl:$(this).data('attachurl'),		//文件路径
		    			attachname:$(this).data('attachname')		//文件名
					});
				});
				//带看反馈表单保存
				jsonPostAjax(basePath+'/customer/showings/insertshowingsfeedback.htm',{
					endtime:seeTime,						//返回店面时间
					attachVoList:attachVoList,				//附件信息集合
					showingsid:_this.showingsId,			//带看id
					showingsHouseVoList:showHousList		//房源反馈集合
				},function(){
					commonContainer.alert('保存成功');
					layer.close(i);
					_this.querySeeList();
				},{
					completeCallBack:function(){
						seeLock=false;
					}
                });
			},{area:'700px'});
			$('#returnTime').on('click',function(){
				laydate({
					elem:'#returnTime',
				    format:'YYYY-MM-DD hh:mm',
				    max:laydate.now(),
				    istime:true
				});
			});
			$('#upLoadLile').show();
			$('#fileList').hide();
			$('#upFileName').show();
			//文件上传
			$('#selectFile').off().on('click',function(){
				var upFile=$('#upFile');
				upFile.off().click();
				upFile.off().on('input change',function(){
					var upFileObj=this.files[0];
					//验证上传文件
					var strIndex=upFileObj.name.lastIndexOf('.')+1;
					var fileSuffixName=upFileObj.name.substring(strIndex);											//文件后缀
					var isFileType=/^(xlsx|xls|doc|docx|pdf|pptx|txt|bmp|jpg|svg|psd|rar)$/.test(fileSuffixName);		//是否符合文件类型
					//是否符合文件类型
					if(!isFileType){
						commonContainer.alert('上传文件格式为：xlsx、doc、docx、pdf、pptx、txt、bmp、jpg、svg、psd、rar');
						return false;
					}
					//判断文件是否超过5MB,
                    if (upFileObj.size > 5 * 1024 * 1024) {
						commonContainer.alert('请上传小于5MB文件');
						return false;
					}
					//上传至文件服务器（获取文件路径）
					var formData=new FormData();
					formData.append('file',upFileObj);
					$.ajax({
						url: basePath+'/customer/showings/singleFileUpload.htm',
					    type: 'POST',
					    async:false,
					    cache: false,
					    data: formData,
					    processData: false,
					    contentType: false,
					    dataType:'json',
					    success:function(result){
					    	if(result.code == '0'){
					    		var html='<a data-attachname='+result.data.filename+' href="javascript:" data-attachurl="'+result.data.filepath+'"><span class="btn btn-green btn-bitbucket" onclick="tapeManagViseView.deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>'+result.data.filename+'</a>';
					    		$('#upFileList').append(html);
								$('#fileHidden').html('<input type="file" id="upFile">');	//重置上传文件
					    	}else{
					    		layer.alert(result.msg);
					    	}
					    },
					    error:function(){
					    	layer.alert(errorMsg);
				    	}
					});
				});
			});
		}
		if(type==1){
			$('#returnTime').css({border:'none'});
			commonContainer.modal('带看详情',$('#feedback'),function(i){
				layer.close(i);
			},{
				area:'700px',
				btns:['关闭']
			});
			$('#returnTime').off();
			$('#upLoadLile').hide();
			$('#fileList').show();
			$('#upFileName').hide();
			//调用附件列表接口
			jsonGetAjax(basePath+'/customer/showings/showingsattach/list.htm',{
				showings_id:_this.showingsId
			},function(result){
				if(result.data){
					var rows=result.data.rows;
					var length=rows.length;
					var html='';
					if(length>0){
						for(var i=0;i<length;i++){
							html+='<a class="font-blue" data-attachname="'+rows[i].attach_name+'" data-attachurl="'+rows[i].attach_url+'" href="'+rows[i].attach_url+'" target="_blank" style="padding:0 0 6px 10px;cursor:pointer;">'+rows[i].attach_name+'</a>';
						}
					}
					$('#fileListContet').html(html);
				}
			});
		}
	},
	//创建反馈结果弹窗
	creatResultsPop:function(target){
		$('#inlineRadio').prop('checked',true);
		$('#reason').hide();
		//带看房源id
		var $el = $(target);
		var showHouseid=$el.data('addhous')==1?'':$el.data('showingshouseid');
		//查看房源带看反馈
//		jsonGetAjax(basePath+'/customer/showings/viewhouse.htm',{
//			showingshouseid:showHouseid
//		},function(result){
//			var resultBack=result.data.feedbacktype;
//			//指导意见 1：有意向 2：无意向 3：未看
//			if(resultBack==1){
//				$('#inlineRadio').prop('checked',true);
//			}else if(resultBack==2){
//				$('#inlineRadio1').prop('checked',true);
//				$('#reason').show();
//			}else if(resultBack==3){
//				$('#inlineRadio2').prop('checked',true);
//				$('#reason').show();
//			}
//			//无意向、未看原因
//			$('#noSeeReason').val(result.data.reasons);
//		});
		var _this=this;
        var rbackData = $(target).data('feedbackdata') || {};
		//var resultsLock=false;					//防止重复提交
        commonContainer.modal('带看反馈结果', $('#backResults'),function (layerId) {
            return save(layerId , true);
        } ,{
			area:'600px',
			btns : ['收取意向金并保存' , '保存'],
			btn2 : function (layerid) {
				return save(layerid);
            },
			success:function($layer){
                var group = $('#inlineRadio').closest('.form-group');
                var collectBtn = $layer.find('.layui-layer-btn0');// 意向金按钮
                group.off().on('change' , ':radio' , function () {
                    if (+this.value === 1) { // 有意向
                        collectBtn.show()
                    }else{// 其他情况
                        collectBtn.hide();
                    }
                });
                //回显反馈结果
                if (rbackData.feedbacktype == 1) { // 有意向
                    $('#inlineRadio').click();
                } else if (rbackData.feedbacktype == 2) { // 无意向
                    $('#inlineRadio1').click();
                    $('#reason').show();
                } else if (rbackData.feedbacktype == 3) { // 未看
                    $('#inlineRadio2').click();
                    $('#reason').show();
                }

                //无意向、未看原因
                $('#noSeeReason').val(rbackData.reasons || '');
			}
		});

        function save(layerId , collect) {
            var seeResult=$("input[name='takeResults']:checked").val();
            var noSeeReason=$('#noSeeReason').val();
            if(seeResult==2||seeResult==3){
                if(noSeeReason==''){
                    commonContainer.alert('请输入原因');
                    return false;
                }
            }
            var seeData='';
            if(seeResult==1){
                seeData='有意向';
            }else if(seeResult==2){
                seeData='无意向';
            }else if(seeResult==3){
                seeData='未看';
            }
            $(target).parent().prev().html('<span class="isevaluate" data-isevaluate="1">'+seeData+'</span>');
            var feedbackdata={
                feedbacktype:seeResult,								//结果类型
                houseid:$(target).data('houseid'),					//房源id
                reasons:noSeeReason,								//无意向、未看原因
                showingshouseid:showHouseid,						//带看房源id
                showingsid:_this.showingsId							//带看编号
            };
            $(target).data('feedbackdata',feedbackdata);
            layer.close(layerId);
            if (collect) { // 收取意向金
				var data = $el.data();
                var url = basePath + '/finance/collect/collectPlan.html?clientId={0}&clientName={1}&houseId={2}';

                url = url.format(data.clientid , encodeURIComponent(data.customername) , data.houseid);
                window.open(url);
            }
        }

		$('#inlineRadio').on('click',function(){
			$('#reason').hide();
			$('#noSeeReason').val('');
		});
		$('#inlineRadio1,#inlineRadio2').on('click',function(){
			$('#reason').show();
            if (this.value == 2 && rbackData.feedbacktype == 2) {// 无意向
                $('#noSeeReason').val(rbackData.reasons || '');
            } else if (this.value == 3 && rbackData.feedbacktype == 3) {// 有意向
                $('#noSeeReason').val(rbackData.reasons || '');
            } else {
                $('#noSeeReason').val('');
            }
		});
	},
	//查询带看列表
	querySeeList:function(){
		$('#seeQueryResult').bootstrapTable('destroy');	//清除之前的数据
		$('#seeQueryResult').bootstrapTable({
			url: basePath+'/customer/showings/listview.htm',
			method:'post',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_seeQuery').serializeObject();
				data.userid = currUserId;
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount > 0){
					return {
                        'rows': result.data.rows,
						'total': result.data.totalcount
					}
				}
				return {
                    'rows': [],
					'total': 0
                }
			},
			columns:[
				{
					field : 'id',
					title : '带看单号',
					align : 'center'
				},
				{
					field : 'businesstype',
					title : '业务类型',
					align : 'center'
				},
//				{
//					field : '',
//					title : '客户类型',
//					align : 'center'
//				},
				{
					field : 'customername',
					title : '客户姓名<br />客户编号',
					align : 'center',
					formatter:function(value,row){
						var html = value?value:'-';
						var url='';
						if (row.businesstypeid==1 && lease_view_permission) {	//租赁
	      					url = basePath+"/customer/main/findleaseclientbycustomerid.htm?customerId="+row.customersid;	//	需求id
	      				} else if (row.businesstypeid==2 && buy_view_permission) {	//买卖
	      					url = basePath+"/customer/main/findbuyerclientbycustomerid.htm?customerId="+row.customersid;
	      				}
	      				html += '<br />';
                        if (row.client_id) {
                            if (url) {
								html += '<a href="'+url+'" target="_blank">'+row.client_id+'</a>';
                            }else{
                            	html += row.client_id;
							}
                        }else{
                        	html += '-';
						}
						return html;
					}
				},
				{
					field : 'leadusersname',
					title : '带看人',
					align : 'center'
				},
				{
					field : 'accompany_name',
					title : '陪看人',
					align : 'center'
				},
				{
					field : 'begin_time',
					title : '预计带看时间<br />返回店面时间',
					align : 'center',
					formatter:function(value,row){
						return (value?value:'-') +'<br />'+ (row.end_time?row.end_time:'-');
                    }
				},
				{
					field : 'showingsnum',
					title : '看房量',
					align : 'center'
				},
				{
					field : 'leadresult',
					title : '带看状态',
					align : 'center'
				},
//				{
//					field : 'leadresult',
//					title : '带看结果',
//					align : 'center'
//				},
				{
					field : 'guidstatus',
					title : '看房指导',
					align : 'center',
					formatter:function(value,row,index){
						var html = '<button type="button" data-index="'+index+'" data-businesstypeid="'+row.businesstypeid+'" data-id="'+row.id+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="tapeManagViseView.creatGuioPop(this)">'+value+'</button>';
                        if (row.businesstypeid == 1) {// 租赁
                            if (lease_show_guide_view || lease_show_guide_add) {
                                return html;
                            }
                        }else if(row.businesstypeid == 2){ // 买卖
                            if (buy_show_guide_view || buy_show_guide_add) {
                                return html;
                            }
						}
					}
				},
				{
					field : '',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
                        var leadresult=row.leadresult;
                        var clientid = row.client_id || '';
                        var customername = row.customername || '';
                        var endtime=row.end_time?row.end_time.replace(' ','A'):'B';
                        var html='<div class="text-left">';

                        var feedback = '<button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-id="' + row.id + '" data-endtime="' + endtime + '" data-customername="' + customername + '" data-seeing="true" data-businesstype="' + row.businesstype + '" data-businesstypeid="' + row.businesstypeid + '" data-clientid="' + clientid + '" data-customersid="' + row.customersid + '" data-housecode="' + row.housecode + '" onclick="tapeManagViseView.creatFeedbackPop(this,0)">反馈</button>&nbsp;&nbsp;'
                        var detail = '<button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-id="' + row.id + '" data-endtime="' + endtime + '" data-customername="' + customername + '" data-clientid="' + clientid + '" onclick="tapeManagViseView.creatFeedbackPop(this,1)">详情</button>&nbsp;&nbsp;'
                        var edit = '<button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-id="' + row.id + '" data-accompanyid="' + row.accompany_id + '" data-begintime="' + row.begin_time.replace(' ', 'A') + '" data-accompanyname="' + row.accompany_name + '" data-customername="' + customername + '" data-clientid="' + clientid + '" data-businesstype="' + row.businesstype + '" onclick="tapeManagViseView.creatFeedbackPop(this,2,this)">修改</button>&nbsp;&nbsp;'
                        var cancel = '<button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-id="' + row.id + '" data-clientid="' + clientid + '" onclick="tapeManagViseView.cancelSee(this)">取消</button>';

                        if (row.businesstypeid == 1) { // 租赁
                            if(leadresult=='带看中'){
                                if (lease_show_feedback) {
                                    html += feedback;
                                }
                                if (lease_show_view) {
                                    html += detail;
                                }
                                if (lease_show_edit) {
                                    html += edit;
                                }
                                if (lease_show_cancel) {
                                    html += cancel;
                                }
                            }else if(/^(有意向|无意向|未看)$/.test(leadresult)){
                                if (lease_show_feedback) {
                                    html += feedback;
                                }
                                if (lease_show_view) {
                                    html += detail;
                                }
                            }else if(/^(已超期|已成交|已取消)$/.test(leadresult)){
                                if (lease_show_view) {
                                    html += detail;
                                }
                            }
                        }else if(row.businesstypeid== 2){ // 带看
                            if(leadresult=='带看中'){
                                if (buy_show_feedback) {
                                    html += feedback;
                                }
                                if (buy_show_view) {
                                    html += detail;
                                }
                                if (buy_show_edit) {
                                    html += edit;
                                }
                                if (buy_show_cancel) {
                                    html += cancel;
                                }
                            }else if(/^(有意向|无意向|未看)$/.test(leadresult)){
                                if (buy_show_feedback) {
                                    html += feedback;
                                }
                                if (buy_show_view) {
                                    html += detail;
                                }
                            }else if(/^(已超期|已成交|已取消)$/.test(leadresult)){
                                if (buy_show_view) {
                                    html += detail;
                                }
                            }
						}

						html+='</div>';
						return html;
					}
				}
			]
		});
	},
	//删除上传文件
	deleteUpFile:function(_this){
		$(_this).parent().remove();
	},
	//取消带看
	cancelSee:function(target){
		var _this=this;
		commonContainer.modal('信息','<div style="padding: 20px;font-size: 14px;">是否要取消</div>',function(i){
			if(_this.cancelSeeLock){
				return false;
			}else{
				_this.cancelSeeLock=true;
			}
			jsonGetAjax(basePath+'/customer/showings/cancleshowings.htm',{
				showings_id:$(target).data('id')
			},function(){
				layer.close(i);
				commonContainer.alert('操作成功');
				_this.querySeeList();
			},{
				completeCallBack:function(){
					_this.cancelSeeLock=false;
				}
			});
		},{
			btns:['确定','取消'],
			area:'300px'
		});
	}
}