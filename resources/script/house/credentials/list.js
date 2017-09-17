$(function(){
	certificate.init();
});
var certificate={
	init:function(){
		var _this=this;
		_this.proxyDate();
		$('#J_search').off().on('click',function(){
			_this.queryList();
		});
		//业务类型
		dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		//规划用途复选
		dimContainer.buildDimCheckBoxHasAll($('#houseapplication'), 'plannedUses', 'plannedUses','all', '全部');
		searchContainer.searchUserListByComp($("#J_user"), true, 'left');
		// 显示部门树状结构
		$('#J_deptSelect').on('click', function() {
			showDeptTree($('#J_deptName'), $('#J_deptLevel'));
		});
		//清空收件部门，收件人
		$('#J_reset').on('click',function(){
			 $('#J_user').attr('data-id',''); 				//收件人id
			 $('#J_deptName').attr('data-id','');			//收件部门id
		});
		//判断全选状态
//		var guihType=$('#houseapplication :input:not(:last)');
//		var guihTypeLen=guihType.length;
//		var index=0;
//		guihType.off().on('click',function(){
//			index=0;
//			guihType.each(function(){
//				if(!$(this).prop('checked')){
//					return false;
//				}else{
//					index++;
//				}
//			});
//			if(guihTypeLen==index){
//				$('.J_selectAll').prop('checked',true);
//			}else{
//				$('.J_selectAll').prop('checked',false);
//			}
//		});
	},
	//委托时间
	proxyDate:function(){
		var seeBeginDate={
			elem:'#createstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#createendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//列表查询
	queryList:function(){
		$('#proxyQueryResult').bootstrapTable('destroy');	//清除之前的数据
		$('#proxyQueryResult').bootstrapTable({
			url: basePath+'/house/credentials/list.htm',
			method:'post',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_seeQuery').serializeObject();
				data.shopid =$('#J_deptName').attr('data-id');			//收件部门
				data.createby= $('#J_user').attr('data-id');			//收件人
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list,
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
					field : 'houseid',
					title : '房源编号',
					align : 'center',
					formatter:function(value,row){
						var url='';
						if (row.businesstype=='租赁') {
	      					url = basePath+'/house/main/leasedetail.htm?houseid='+value;		//房源id
	      				} else if (row.businesstype=='买卖') {
	      					url = basePath+'/house/main/buydetail.htm?houseid='+value;
	      				}
						return value?'<a href='+url+' target="_blank">'+value+'</a>':'-';
					}
				},
				{
					field : 'businesstype',
					title : '业务类型',
					align : 'center',
				},
				{
					field : 'planneduses',
					title : '规划用途',
					align : 'center'
				},
				{
					field : 'deptname',
					title : '收件部门',
					align : 'center',
					formatter:function(value){
						return '<div style="text-align:left;padding-left:10px;">'+value+'</div>';
					}
				},
				{
					field : 'createbyname',
					title : '收件人',
					align : 'center',
					formatter:function(value,row){
						return value?'<a href="javascript:;" onclick="getUserStaffInfo('+row.createby+')">'+value+'</a>':'-';
					}
				},
				{
					field : 'signdate',
					title : '证件登记日期',
					align : 'center'
				},
				{
					field : 'ownernum',
					title : '共有人数',
					align : 'center'
				},
				{
					field : 'inputownernum',
					title : '已登记共有人数',
					align : 'center'
				},
				{
					field : '',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
						return '<div style="text-align:left;padding-left:10px;"><button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-customername='+row.customername+' data-houseid='+row.houseid+' onclick="proxyNewlyObj.certificatesDetail(0,1,1,this)">查看</button></div>';
					}
				}
			]
		});
	},
	//查看详情
	seePop:function(target){
		commonContainer.modal('证件查看',$('#proxyShowInfor'),function(){
		},{
			area:'800px',
			btns:['修改'],
			success:function(){
				jsonGetAjax(basePath+'/house/credentials/credentialsdetails',{
					houseId:$(target).data('houseid')
				},function(result){
					//证件信息
					if(result.data.owners.length>0){
						var enclosureArr=[];
						var html='';
						var pictureHtml='';
						$.each(result.data.owners,function(i,n){
							html='\
							<tr>\
								<td>1</td>\
								<td>'+n.homeownername+'</td>\
								<td>'+n.homeownertype+'</td>\
								<td>'+n.homeowneridcard+'</td>\
								<td>'+n.housecardinfono+'</td>\
								<td>5</td>\
								<td>'+n.percent+'</td>\
							</tr>';
							//证件信息（附件）
//							if(n.picturelist.length>0){
//								$.each(n.picturelist,function(i,n){
//									pictureHtml+='<img src="+n.path+">';
//								});
//							}
							var list=html+'tr'+pictureHtml+'tr';
							enclosureArr.push(list);
						});
						$('#ownerInfor tbody').html(enclosureArr.join(''));
					}
				});
			}
		});
	}
}