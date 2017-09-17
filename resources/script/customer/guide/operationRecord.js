/*cijiangbo-2017-3-15	
 * customerid 需求编号   
 * isShow是否显示过往需求
 * customerId录入客户id */
function operationLog(customerid,isShow,clientId){
	$('select').chosen({
		width : "100%"
	});
	//跟进类型基础数据
	dimContainer.buildDimChosenSelector($('#followType'),'followType','');
	dimContainer.buildDimChosenSelector($('#importantOptType'),'importantOptType','');
	dimContainer.buildDimChosenSelector($('#normalOptType'),'normalOptType','');
	//跟进
	$('#followType').chosen().change(function(){
		var followType=$(this).val();
		followUp(followType,customerid);
	});
	//关键信息操作
	$('#importantOptType').chosen().change(function(){
		var type=$(this).val();
		if(type==1){
			type=8;	//关键信息修改
		}else if(type==2){
			type=9	//关键信息查看
		}
		Journal(customerid,1,type);
	});
	//常规信息操作
	$('#normalOptType').chosen().change(function(){
		Journal(customerid,2,$(this).val());
	});
	//初始加载跟进记录	
	followUp('',customerid);
	//跟进记录查询（点击抬头）
	$('#followRecord').off().on('click',function(){
		getInitbeasdata('#followType','');
		followUp('',customerid);
	});
	//操作日志  inforType信息类型 1=关键信息 2=常规信息 3=规则日志信息 
	//操作日志（点击抬头）
	$('#Journal').off().on('click',function(){
		$('#operationLog li').eq(0).addClass('active').siblings().removeClass('active');
		$('#cijiangboTab-111').show();
		$('#cijiangboTab-121').hide();
		getInitbeasdata('#importantOptType','');
		Journal(customerid,1,'');
	});
	//关键信息操作（点击抬头）
	$('#keyInformation').off().on('click',function(){
		$('#cijiangboTab-111').show();
		$('#cijiangboTab-121').hide();
		getInitbeasdata('#importantOptType','');
		Journal(customerid,1,'');
	});
	//常规操作（点击抬头）
	$('#generalContent').off().on('click',function(){
		$('#cijiangboTab-111').hide();
		$('#cijiangboTab-121').show();
		getInitbeasdata('#normalOptType','');
		Journal(customerid,2,'');
	});
	//过往需求
	if(isShow==true){
		$('#pastDemand').show().off().on('click',function(){
			$('#cijiangboDataTable3').bootstrapTable('destroy');		//清除之前的数据
			$('#cijiangboDataTable3').bootstrapTable({
				url: basePath+'/customer/detail/findDemandHistoriesPaging.htm',
				method:'get',
				sidePagination: 'server',
				dataType: 'json',
				pagination: true,
				striped: true,
				pageSize: 10,
				pageList: [10, 20, 50],
				queryParams: function (params) {
					return {
						userid:currUserId,
						customerId:customerid || '',			//录入客户id
						currentPageIndex:params.offset / params.limit+ 1,
						pageSize:params.limit
					};
				},
				responseHandler: function(result) {
					history.pushState({},'',location.href.split('#')[0]);			//替换url为初始url
					if (result.code == 0 && result.data && result.data.totalCount > 0){
						return {
							'rows': result.data.list, 
							'total': result.data.totalCount
						}
					}
					return {
						'rows': [], 
						'total': 0
					}	
				},
				columns:[
					{
						field : 'customerName',
						title : '客户姓名（客户编号）',
						align : 'center',
						formatter:function(value,row,index){

						    var link = '<a href="{0}/customer/main/findbuyerclientbycustomerid.htm?customerId={1}" target="_blank">{1}</a>';
						    link = link.format(basePath, row.customerId);

							return value+'（'+link+'）';
						}
					},
					{
						field : 'registerUserName',
						title : '登记人',
						align : 'center'
					},
					{
						field : 'belongsToUserName',
						title : '所属人',
						align : 'center'
					},
					{
						field : 'finalStatusName',
						title : '合并前销售阶段',
						align : 'center'
					},
					{
						field : 'lastFollowTime',
						title : '最后跟进时间',
						align : 'center'
					}
				]
			});
		});
	}
}
//调用跟进记录接口
function followUp(followType,customerid){
	$('#cijiangboDataTable1').bootstrapTable('destroy');	//清除之前的数据
	$('#cijiangboDataTable1').bootstrapTable({
		url: basePath+'/customer/follow/listview.htm',
		method:'post',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			return {
				//userid:currUserId,
				customerid:customerid,
				clientid:'',
				createbyname:'',
				createtimebegin:'',
				createtimeend:'',
				customername:'',
				customertype:'',
				shopgroupid:'',
				type:followType,
				pagesize:params.limit,
				pageindex:params.offset / params.limit+ 1,
			};
		},
		responseHandler: function(result) {
			history.pushState({},'',location.href.split('#')[0]);			//替换url为初始url
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
				field : 'shopgroup',
				title : '跟进部门',
				align : 'center',
				formatter:function(value){
					return '<div style="text-align:left;padding-left:10px;">'+value+'</div>';
				}
			},
			{
				field : 'createbyname',
				title : '跟进人',
				align : 'center'
			},
			{
				field : 'type',
				title : '跟进类型',
				align : 'center'
			},
			{
				field : 'createtime',
				title : '跟进时间',
				align : 'center'
			},
			{
				field : 'content',
				title : '跟进内容',
				align : 'center',
				formatter:function(value , row , index){
                    if (row.type === '带看') {
                        return '<div style="text-align:left;padding-left:10px;"><a href="javascript:showShowingSourceDetail(\'' + row.sourceid + '\', ' + index + ')">'+value+'</a></div>';
                    }
                    return '<div style="text-align:left;padding-left:10px;">'+(value || '').encodeHTML()+'</div>';
				}
			}
		]
	});
}

function showShowingSourceDetail(sourceId , rowId) {
    var data = $('#cijiangboDataTable1').bootstrapTable('getData')[rowId];
    if (data) {
        $('#CustomerInfor').text((data.customerid || '') + '(' + (data.customername || '') + ')');// 返回时间
        $('#returnTime').text(data.createtime);// 返回时间
    }

    // 查询带看数据
    var promise = jsonGetAjax(basePath+'/customer/showings/showingshouse/list.htm',{
        showings_id:sourceId	//点看id
    },function(result) {
        var dataTab=$('#seeListings');
        dataTab.bootstrapTable('destroy');	//清除之前的数据
        dataTab.bootstrapTable({
            striped:false,	//是否隔行显示
            data:result.data.rows,
            columns:[
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
        });
    });

    //调用附件列表接口
    var promise2 = jsonGetAjax(basePath+'/customer/showings/showingsattach/list.htm',{
        showings_id:sourceId
    },function(result){
        if(result.data){
            var rows=result.data.rows;
            var length=rows.length;
            var html='';
			for(var i=0;i<length;i++){
				html+='<a class="font-blue" data-attachname="'+rows[i].attach_name+'" data-attachurl="'+rows[i].attach_url+'" href="'+rows[i].attach_url+'" target="_blank" style="padding:0 0 6px 10px;cursor:pointer;">'+rows[i].attach_name+'</a>';
			}
            $('#fileListContet').html(html);
        }
    });

    commonContainer.showLoading();

    $.when(promise , promise2).always(function () {
        commonContainer.hideLoading();
        commonContainer.modal('带看反馈',$('#feedback'),function(i){
            layer.close(i);
        },{
            area:'700px',
            btns:['关闭']
        });
    });
}
//调用操作日志接口
//customerid 	需求编号
//inforType 	信息类型
//cType  		操作类型
function Journal(customerid,inforType,cType){
	$('#cijiangboDataTable11').bootstrapTable('destroy');	//清除之前的数据
	$('#cijiangboDataTable11').bootstrapTable({
		url: basePath+'/customer/log/listview.htm',
		method:'post',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			return {
				userid:currUserId,
				category:inforType,  										//信息类型 1=关键信息 2=常规信息 3=规则日志信息 ,
				customerid:customerid,										//需求编号 
				pagesize:params.limit,
				pageindex:params.offset / params.limit+ 1,
				type:cType													//操作类型 1=修改 2=带看 3=跟进 4=调配 5=转介 6=黑名单 7=查看详情 8=关键信息修改 9=关键信息查看10=租赁转介功能设置11=租赁带看超期设置12=买卖转介功能设置13=买卖带看超期
			};
		},
		responseHandler: function(result) {
			history.pushState({},'',location.href.split('#')[0]);			//替换url为初始url
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
				field : 'shopgroup',
				title : '操作部门',
				align : 'center',
				formatter:function(value){
					return '<div style="text-align:left;padding-left:10px;">'+value+'</div>';
				}
			},
			{
				field : 'username',
				title : '操作人',
				align : 'center'
			},
			{
				field : 'type',
				title : '操作类型',
				align : 'center'
			},
			{
				field : 'content',
				title : '操作内容',
				align : 'center',
				formatter:function(value){
					return '<div style="text-align:left;padding-left:10px;">'+(value || '').encodeHTML()+'</div>';
				}
			},
			{
				field : 'createtime',
				title : '操作时间',
				align : 'center'
			}
		]
	});
}

//还原基础数据初始状态
function getInitbeasdata(dom,type){
	$(dom).val(type);
	$(dom).trigger('chosen:updated');
}