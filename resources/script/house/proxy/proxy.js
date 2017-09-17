$(function(){
	proxyNewlyObj.init();
});
//委托书录入
var proxyNewlyObj={
	//计数器
	index:0,
	//防止保存重复提交
	savelock:false,
	//存储附件信息
	attachVoList:[],
	init:function(){
		//登记日期 
		laydate({
			elem:'#registrationDate',
		    format:'YYYY-MM-DD',
		    istime:false,
		    istoday:true
	    });
		searchContainer.searchUserListByComp($('#signClient'), true, 'left');	//签委托人自动搜索
		//图片上传
		this.upImgFile('#selectFile','#upFile',$('#enterUpFileName'),$('#fileHidden'),'upFile',true);
	},
	/*
	* 委托书录入弹窗
	* @param businesstype 委托类型：1租赁房源2买卖房源
	* @param houseid 房源id
	* @param userid 签委托部门
	* @param username 签委托人
	* @param isModify	1为修改 
	* @param proxyid 委托书id
	*/ 
	proxyNewlyAdded:function(businesstype,houseid,userid,username,isModify,proxyid){
		var _this=this;
		commonContainer.modal('委托书录入',$('#backResults'),function(i){
			_this.saveEntry(businesstype,houseid,i,isModify,proxyid);
		},{
			area:'900px',
			btns:['保存','取消'],
			overflow :true,
			success:function(){
				$('#enterUpFileName').html('');
				if(isModify==1){
					$('#attorneyNumber').val(_this.proxyInfo.proxynum);
					//$('#signClient').val(_this.proxyInfo.username);
					//附件列表
					if(_this.proxyInfo.piceures && _this.proxyInfo.piceures.length>0){
						//var html='';
						$.each(_this.proxyInfo.piceures,function(i,n){
//							html+='\
//								<div class="col-md-3"  style="height:140px;text-align: center;">\
//								<img src="'+n.path+'" width="80%" height="80%">\
//								<div style="padding-top: 10px;">'+n.type+'</div>\
//							</div>';
							_this.imgList(n.path,$('#enterUpFileName'),1,n.type,n.spid);
						});
					}
				}else{
					$('#attorneyNumber').val('');								//委托书编号
				}
				$('#signClient').val(username).attr('data-id',userid);			//签委托人
			}
		});
	},
	/*证件录入弹窗
	 * @param houseid 房源编号
	 * @param isXg   是否修改 1:是
	 */
	documentEntry:function(houseid,isXg){
		var _this=this;
		commonContainer.modal('证件录入',$('#documentEntry'),function(i){
			_this.addHousInfor(houseid,i,isXg);
		},{
			btns:['下一步','取消'],
			area:'900px',
			success:function(){
				_this.verification(true);
				$('#informationForm')[0].reset();		//清空表单
				//$('#registrationDate').val('');		//清空登记日期 
				var totalDom=$('#totalPersons');    	//共有人数Dom
				//修改状态
				var houseownType='';					//产权性质
				var plannedUsesType='';					//规划用途
				var houseShareType='';					//共有情况
				if(isXg==1){
					houseownType=_this.certificatesInfor.propertytype;
					plannedUsesType=_this.certificatesInfor.houseapplication;
					houseShareType=_this.certificatesInfor.ownertype;
					$('#houseaddress').val(_this.certificatesInfor.houseaddress)										//房屋坐落
					$('#registrationDate').val(_this.certificatesInfor.inputdate.split(' ')[0])							//登记日期
					$('#totalFloor').val(_this.certificatesInfor.totalfloor)											//总层数
					$('#currentfloor').val(_this.certificatesInfor.currentfloor)										//当前楼层
					$('#builtupArea').val(_this.certificatesInfor.housearea)											//建筑面积
					$('#nonMandatory').val(_this.certificatesInfor.realarea?_this.certificatesInfor.realarea:' ')		//套内建筑面积
					$('#totalPersons').val(_this.certificatesInfor.ownernum)											//共有人数
					
					//判断共有情况  1:独有  2：共有
					if(houseShareType==1){
						totalDom.attr('readonly',true);
					}else if(houseShareType==2){
						totalDom.attr('readonly',false);
					}
				}
				$('#informationForm select').chosen({
					width:'100%'
				});
					//清空基础数据
					$('#propertytype,#houseapplicationLuru,#commonSituation').html('<option value="">请选择</option>');
					//产权性质
					dimContainer.buildDimChosenSelector($('#propertytype'),'houseown',houseownType);
					//规划用途
					dimContainer.buildDimChosenSelector($('#houseapplicationLuru'),'plannedUses',plannedUsesType);
					//共有情况
					dimContainer.buildDimChosenSelector($('#commonSituation'),'houseShare',houseShareType);
				$('#commonSituation').on('input change',function(){
					//判断共有情况
					var val=$(this).val();
					var next=totalDom.next();
					if(val===''){
						totalDom.val('');
						totalDom.attr('readonly',true);
						if(next.length>0){
							next.show();
						}
					}else if(val==='1'){
						totalDom.val('1');
						totalDom.attr('readonly',true);
						if(next.length>0){
							next.hide();
						}
					}else if(val==='2'){
						totalDom.val('');
						totalDom.attr('readonly',false);
						if(next.length>0){
							next.show();
						}
					}
				});
			}
		});
	},
	//图片上传至图片服务器
	upImgFile:function(clickBtn,fileObj,content,fileHidden,fileId,isProxy){
		var _this=this;
		var upImglock=false;
		$(clickBtn).off().on('click',function(){
			$(fileObj).click();
			$(fileObj).off().on('input change',function(){
				var upFileObj=this.files[0];
				//验证上传文件
				var strIndex=upFileObj.name.lastIndexOf('.')+1;
				var fileSuffixName=upFileObj.name.substring(strIndex);											//文件后缀
				var isFileType=/^(jpg|jpeg|png|tif|tiff|bmp|gif)$/.test(fileSuffixName);						//是否符合文件类型
				//是否符合文件类型
				if(!isFileType){
					commonContainer.alert('图片格式为jpg、jpeg、png、tif、tiff、bmp、gif');
					return false;
				}
				//验证上传文件是否大于5MB
				if(upFileObj.size>5*1024*1024){
					commonContainer.alert('图片最大不超过5M');
					return false;
				}
				if(upImglock){
					return false;
				}else{
					upImglock=true;
				}
				var that=this;
				var formData=new FormData();
				formData.append('files',this.files[0]);
				$.ajax({
					url: basePath+'/custom/common/multiFileUpload.htm',
				    type: 'POST',
				    async:true,
				    cache: false,
				    data: formData,
				    processData: false,
				    contentType: false,
				    dataType:'json',
				    success:function(result){
				    	upImglock=false;
				    	if(result.code==0){
				    		_this.imgList(result.data[0].filepath,content,isProxy,'');
				    	}else{
				    		commonContainer.alert(result.msg);
				    	}
				    },
				    error:function(){
				    	upImglock=false;
				    	layer.alert(errorMsg);
			    	}
				});
				//重置上传文件控件
				fileHidden.html('<input type="file" accept="image/jpg, image/jpeg, image/png, image/tif, image/tiff, image/bmp, image/gif" id="'+fileId+'">');
			});
		});
	},
	//删除上传图片文件
	deleteImgFile:function(that){
		$(that).parents('.deleImg').attr('id','').hide('600');
	},
	/*
	*保存委托书内容
	*/
	saveEntry:function(businesstype,houseid,i,isModify,proxyid){
		var _this=this;
		//验证委托书编号
		var attorneyNumber=$('#attorneyNumber').val();
		if(attorneyNumber==''){
			commonContainer.alert('请输入委托书编号');
			return false;
		}
		var signClient=$('#signClient').val();
		//验证签委托人
		if(signClient==''){
			commonContainer.alert('请输入委托人');
			return false;
		}
		if($('#enterUpFileName >div').length<1){
			commonContainer.alert('您至少要上传一张图片');
			return false;
		}
		//判断所传图片是否选择类型
		_this.attachVoList=[];	//图片信息集合
		var isflag=false;
		$('#enterUpFileName>div').each(function(i){
		    if(!$(this).attr('id')==''){
		    	var imgType=$(this).find('select').val();
		    	if(imgType==''){
		    		commonContainer.alert('您有图片未选择类型');
		    		isflag=true;
		    		return false;
		    	}else{
		    		var imgSpid=$(this).data('spid');
		    		_this.attachVoList.push({
						path:$(this).data('imgurl'),		//附件存在文件服务器的路径
						type:imgType,						//附件类型：（待定参数值）
						spid:imgSpid?imgSpid:''				//附件id  (修改时用到，录入时对此字段不作处理)
		    		});
		    	}
		    }
		});
		if(isflag){
			return false;
		}
		//防止重复提交
		if(_this.savelock){
			return false;
		}else{
			_this.savelock=true;
		}
		//调用接口
		var url='';
		var parameter={
			businesstype:businesstype, 					//委托类型：1租赁房源2租赁客户3买卖房源4买卖客户 ,
			houseid:houseid,							//房源编号
			userid:$('#signClient').attr('data-id'),	//签委托人
		};
		if(isModify==1){
			//修改委托书
			url='/house/proxy/update.htm';
			parameter.id=proxyid;						//委托书主键id
			parameter.piceures=_this.attachVoList;		//附件列表（修改）
			parameter.proxynum=attorneyNumber;			//委托书编号（修改）
		}else{
			//录入委托书
			url='/house/proxy/entry.htm';
			parameter.picturelist=_this.attachVoList;	//附件列表
			parameter.wtinfono=attorneyNumber;			//委托书编号
		}
		jsonPostAjax(basePath+url,parameter,function(){
			layer.close(i);
			commonContainer.alert('操作成功');
			//在列表页修改刷新列表
			if(isModify==1 && PowerAttorney){
				PowerAttorney.queryList();
			}else{
				location.reload();
			}
		},{
			completeCallBack:function(){
				_this.savelock=false;
			}
		});
	},
	//保留两位小数
	clearNoNum:function(obj){
		obj.value=obj.value.replace(/[^\d.]/g,''); //清除"数字"和"."以外的字符
		obj.value = obj.value.replace(/^\./g,''); //验证第一个字符是数字而不是"."
		obj.value = obj.value.replace(/\.{2,}/g,'.'); //只保留第一个. 清除多余的
		obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
		obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
		return obj.value;
	},
	//表单验证
	verification:function(isInit){
		var isfalg=true;
		//.chosen-search > input （搜索框）
		$('#informationForm :input').not('#nonMandatory,.chosen-search > input').each(function(){
			var textVal=$(this).val();
			var prompt=null;
			if($(this).hasClass('J_chosen')){
				prompt=$(this).next().next();
			}else{
				prompt=$(this).next();
			}
			if(isInit){
				if(prompt.length>0){
					prompt.hide();
				}
				//获取焦点
				$(this).on('focus',function(){
					var focusPrompt=$(this).next();
					if(focusPrompt.length>0){
						focusPrompt.hide();
					}
				});
			}else{
				if(textVal==''){
					if(isfalg){
						isfalg=false;
					}
					if(prompt.length==0){
						$(this).parent().append('<div style="padding-top: 8px;color: #a94442;">必填</div>');
					}else{
						prompt.show();
					}
				}
			}
		});
		$('.chosen-container').on('click',function(){
			if($(this).next().length>0){
				$(this).next().hide();
			}
		});
		if(!isfalg){
			commonContainer.alert('您还有必填项未填写');
			return isfalg;
		}
		//当前楼层不能大于总楼层
		if($('#currentfloor').val()*1>$('#totalFloor').val()*1){
			commonContainer.alert('当前楼层不能大于总楼层');
			return false;
		}
		//套内建筑面积不能大于建筑面积
		if($('#nonMandatory').val()*1>$('#builtupArea').val()*1){
			commonContainer.alert('套内建筑面积不能大于建筑面积');
			return false;
		}
		return isfalg;
	},
	//创建业主证件信息录入框
	popOwnerinfor:function(ownerinfor){
		//录入框	
		var totalPersons=$('#totalPersons').val();	//共有人数	
		var html='';
		var content=[];
		if(!(ownerinfor=='')){
			var ownerContent='';				//业主姓名
			var homeowneridCard='';				//证件号码
			var housecardinFono='';				//房产证号
			var perCent=''						//百分比
			var fujianLen='';					//附件数量	
		}
		for(var i=0;i<totalPersons;i++){
			var index=i+1;			
			var ownerinforIndex=ownerinfor[i];			
			if(ownerinforIndex){
				if(ownerinforIndex.homeownername){
					ownerContent=ownerinforIndex.homeownername;
				}
				if(ownerinforIndex.homeowneridcard){
					homeowneridCard=ownerinforIndex.homeowneridcard;
				}
				if(ownerinforIndex.housecardinfono){
					housecardinFono=ownerinforIndex.housecardinfono;
				}
				if(ownerinforIndex.percent){
					perCent=ownerinforIndex.percent;
				}
				if(ownerinforIndex.picturelist && ownerinforIndex.picturelist.length>0){
					fujianLen=ownerinforIndex.picturelist.length;
				}
			}else{
				ownerContent='';
				homeowneridCard='';
				housecardinFono='';
				perCent='';
				fujianLen='';
			}
			html='\
				<tr>\
					<td style="width:5%; text-align: center;">'+index+'</td>\
					<td style="width:15%; text-align: center; padding:8px;"><input type="text" placeholder="请输入姓名" value="'+ownerContent+'" name="" class="form-control"></td>\
					<td style="width:10%; text-align: center; padding:8px;">\
						<select name="guidstatus" class="J_chosen form-control isIdshenfenz">\
							<option value="">请选择</option>\
						</select>\
					</td>\
					<td class="zhengiancard" style="width:25%; text-align: center; padding:8px;"><input type="text" placeholder="请输入证件号码" value="'+homeowneridCard+'" name="" class="form-control shengfenzCard"></td>\
					<td style="width:35%;text-align: center; padding:8px;"><input type="text" placeholder="请输入房产证件号" value="'+housecardinFono+'" name="" class="form-control"></td>\
					<td style="width:13%;text-align: center; padding:8px;"><input type="text" maxlength="3" name="" value="'+perCent+'" class="form-control baiFpercent"></td>\
					<td style="width:5%; text-align: center; padding:8px;cursor:pointer;">\
						<div class="btn btn-outline btn-success btn-xs mt-3 upFileBtn" onclick="proxyNewlyObj.documentUpload(this)"><input type="text" value="'+fujianLen+'" readonly="readonly" placeholder="0" style="width:15px;text-align:center;border:none;background:none;"><span>上传</span></div>\
					</td>\
				</tr>';
			content.push(html);
		}
		$('#ownerInfor tbody').html(content.join(''));
		$('.shengfenzCard').off().on('click',function(){
			if($(this).next()){
				$(this).next().hide();
			}
		});
		$('.baiFpercent').on('input change',function(){
			$(this).val($(this).val().replace(/[^0-9]/g,''));
		});
		if(!(ownerinfor=='')){
			$('#ownerInfor tbody tr').each(function(n){
				if(ownerinfor[n]){
					$(this).find('.upFileBtn').data('list',ownerinfor[n].picturelist);
				}
			});
		}
		$('#certificateInformation select').chosen({
			width:'100%'
		});
		if(ownerinfor!==''){
			for(var j=0;j<totalPersons;j++){
				var zhenType=ownerinfor[j]!==undefined?ownerinfor[j].homeownertype:'';		//证件类型
				dimContainer.buildDimChosenSelector($('#certificateInformation select').eq(j),'cardType',zhenType);
			}
		}else{
			dimContainer.buildDimChosenSelector($('#certificateInformation select'),'cardType','');
		}
	},
	//证件图片上传弹窗
	documentUpload:function(target){
		var _this=this;
		commonContainer.modal('上传图片',$('#documentUpload'),function(i){
			//判断图片是否选择类型
			var isflag=false;
			var picturelist=[];
			var length=0;
			$('#documentContent>div').each(function(i){
			    if(!$(this).attr('id')==''){
			    	++length;
			    	var imgType=$(this).find('select').val();
			    	if(imgType==''){
			    		commonContainer.alert('您有图片未选择类型');
			    		isflag=true;
			    		return false;
			    	}else{
			    		picturelist.push({
							path:$(this).data('imgurl'),		//附件存在文件服务器的路径
							type:imgType						//附件类型：（待定参数值）
			    		});
			    	}
			    }
			});
			if(isflag){
				return false;
			}
			$(target).data('list',picturelist);
			if(length>0){
				$(target).find('input').val(length);
				$(target).find('span').html('修改');
			}else{
				$(target).find('input').val('0');
				$(target).find('span').html('上传');
			}
			layer.close(i);
		},{
			btns:['保存','取消'],
			area:'900px',
			overflow :true,
			success:function(){
				$('#documentContent').html('');
				var imgList=$(target).data('list');
				if(imgList && imgList.length>0){
					$.each(imgList,function(i,n){
						_this.imgList(n.path,$('#documentContent'),2,n.type);
					});
				}
				_this.upImgFile('#documentFile','#documentUpFile',$('#documentContent'),$('#documentHidden'),'documentUpFile',false);
			}
		});
	},
	//添加房屋信息（下一步）isXg:是否修改  1:是
	addHousInfor:function(houseid,i,isXg){
		var _this=this;
		if(_this.verification()){
			var housInfor=$('#informationForm').serializeObject();
			housInfor.houseid=houseid;
			var addHouseUrl='/house/credentials/insertbasicinfo.htm';
			if(isXg==1){
				addHouseUrl='/house/credentials/updateHouseInfo.htm';
			}
			jsonPostAjax(basePath+addHouseUrl,housInfor,function(){
				layer.close(i);
				//判断共有人情况
				//如果共有情况为共有且共有人数小于之前共有人数 
				if(isXg==1 && _this.certificatesInfor.ownertype==2 && _this.certificatesInfor.ownernum>$('#totalPersons').val()){
					commonContainer.modal('选择共有人',$('#xuanzgonY'),function(y){
						if($('#choiceCoowner :input:checked').not(':first').length>$('#totalPersons').val()){
							commonContainer.alert('您所选的业主信息数量大于共有人数');
							return false;
						}
						layer.close(y);
						var xuanZgy=[];
						$('#choiceCoowner :input').not(':first').each(function(i){
							if($(this).is(':checked')){
								xuanZgy.push(_this.certificatesInfor.owners[i]);
							}
						});
						//创建业主证件信息
						commonContainer.modal('证件修改',$('#ownerCertificate'),function(j){
							_this.saveOwnerCerti(houseid,j,isXg);
						},{
							btns:['保存','取消'],
							area:'900px',
							success:function(){
								_this.popOwnerinfor(xuanZgy);
							}
						});
					},{
						btns:['保存'],
						area:'900px',
						overflow :true,
						success:function(){
							//业主证件信息列表
							$('#choiceCoowner').bootstrapTable('destroy');
							$('#choiceCoowner').bootstrapTable({
								data:_this.certificatesInfor.owners,
								columns:[
									{
										field: '', 
										title :'序号', 
										checkbox:true, 
										align: 'center',
									},
									{
										field : 'homeownername',
										title : '业主',
										align : 'center'
									},
									{
										field : 'homeownertype',
										title : '有效证件类型',
										align : 'center',
										formatter:function(value,row){
											return _this.homeownerType(row.homeownertype);
										}
									},
									{
										field : 'homeowneridcard',
										title : '证件号码',
										align : 'center'
									},
									{
										field : 'housecardinfono',
										title : '房产证件号',
										align : 'center'
									},
									{
										field : 'xxx',
										title : '附件',
										align : 'center',
										formatter:function(value,row){
											return row.picturelist?row.picturelist.length:'-';
										}	
									},
									{
										field : 'percent',
										title : '百分比',
										align : 'center'
									}
								]
							});
						}
					});
				}else{
					//创建业主证件信息
					commonContainer.modal('证件修改',$('#ownerCertificate'),function(j){
						_this.saveOwnerCerti(houseid,j,isXg);
					},{
						btns:['保存','取消'],
						area:'900px',
						success:function(){
							_this.popOwnerinfor(isXg==1?_this.certificatesInfor.owners:'');
						}
					});
				}
			});
		}
	},
	//创建上传图片列表    type：图片类型 ; spid:图片id(修改时需传此字段)
	imgList:function(imgUrl,content,isProxy,type,spid){
		++this.index;
    	//var imgUrl2=getObjectURL(that.files[0]);
		var html='';
//		if(!(isProxy==1)){
//			html='<option value="101">身份证</option><option value="103">产权证</option>';
//		}
		var html='\
			<div class="col-md-3 deleImg" style="display:none;" id="'+this.index+'" data-imgname="" data-spid="'+(spid?spid:'')+'" data-imgurl="'+imgUrl+'">\
				<div calss="form-group" id="initchosen'+this.index+'" style="height:200px;padding:15px;">\
					<img width="100%" height="80%" style="margin-bottom:10px;" src="'+imgUrl+'">\
					<select name="guidstatus" class="J_chosen form-control" style="width:80%;height:20%;">\
						<option value="">请选择</option>'+html+'\
					</select>\
					<button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" data-index="'+this.index+'" onclick="proxyNewlyObj.deleteImgFile(this)">删除</button>\
				</div>\
			</div>';
			content.append(html);
		$('#'+this.index).show('600');
		var initchosen='#initchosen'+this.index+' select';
		$(initchosen).chosen({
			width : '78%'
		});
		if(isProxy==1){
			dimContainer.buildDimChosenSelector($(initchosen),'proxyPictureType',type);			//委托书图片类型		
		}else{
			dimContainer.buildDimChosenSelector($(initchosen),'credentialsPictureType',type);	//证件图片类型
//			$(initchosen).val(type.split(','));
//    		$(initchosen).trigger("chosen:updated");
		}
	},
	//保存业主证件信息
	saveOwnerCerti:function(houseid,j,isXg){
		var _this=this;
		var isfalg=false;
		var isIdcardsf=false;
		var percent100=0;
		$('#ownerInforForm :input').not('#ownerInforForm .chosen-search > input').each(function(){
			if($(this).val().replace(/(^\s*)|(\s*$)/g, '')==''){
				commonContainer.alert('您有未填信息或未上传附件');
				isfalg=true;
				return false;
			}
			if($(this).hasClass('baiFpercent')){
				percent100+=$(this).val()*1;
			}
		});
		if(isfalg){
			return false;
		}
		//身份证验证
		$('.isIdshenfenz').each(function(i){
			if($(this).val()==1){
				if(isIDCardNum($('.shengfenzCard').eq(i).val())!==true){
					isIdcardsf=true;
					var zhengiancard=$('.zhengiancard').eq(i);
					if(zhengiancard.children().length==1){
						zhengiancard.append('<div style="padding-top:5px;color:#a94442;">请输入正确的身份证号</div>');
					}else{
						$('.zhengiancard >div').show();
					}
				}
			}
		});
		if(isIdcardsf){
			return false;
		}
		if(percent100!==100){
			commonContainer.alert('共有人所占百分比之和不等于100%');
			return false;
		}
		var ownerInforList=[];		//业主证件信息集合
		$('#ownerInfor tbody tr').each(function(n){
			var $input=$(this).find(':input');
			var listData=$(this).find('.upFileBtn').data('list');
			var picturelist=[];
			for(var i=0;i<listData.length;i++){
				var fuJianObj={
					path:listData[i].path,				//附件存储在文件服务器的路径
					type:listData[i].type				//附件类型：10=身份证，6=委托书（待定参数值）
				}
				if(isXg==1){
					fuJianObj.spid=listData[i].spid?listData[i].spid:'';
				}
				picturelist.push(fuJianObj);
			}
			var yezhuInfor={
				houseid:houseid, 						//房源编号
				homeownername:$input.eq(0).val(),		//业主姓名
				homeownertype:$input.eq(1).val(),		//业主有效证件类型
				homeowneridcard:$input.eq(3).val(),		//业主有效证件号码
				housecardinfono:$input.eq(4).val(),		//房产证号
				percent:$input.eq(5).val(),				//百分比
				picturelist:picturelist
			}
			if(isXg==1){
				var certInforIndex=_this.certificatesInfor.owners[n];
				if(certInforIndex){
					yezhuInfor.id=certInforIndex.id;
				}else{
					yezhuInfor.id='';
				}
			}
			ownerInforList.push(yezhuInfor);
		});	
		var CredentiaUrl='';
		if(isXg==1){
			CredentiaUrl='/house/credentials/updateCredentialsInfo.htm';
		}else{
			CredentiaUrl='/house/credentials/insertcredentialsinfo.html';
		}
		jsonPostAjax(basePath+CredentiaUrl,ownerInforList,function(){
			layer.close(j);
			commonContainer.alert('保存成功');
			if(isXg==1 && certificate){
				certificate.queryList();
			}else{
				location.reload();
			}
			//layer.closeAll();
		});
	},
	/*
	 * 委托书详情  
	 * @param proxyid:委托书主键id
	 * @param businesstype 委托类型：1租赁房源2买卖房源
	 * @param houseid 房源id
	 * @param isList  是否是列表页查看详情     1：是
	 * */
	proxyShowInfor:function(proxyid,businesstype,houseid,isList,target){
		var _this=this;
		//调用委托书详情接口
		var proxyidWt=$(target).data('id');		//委托书id
		jsonGetAjax(basePath+'/house/proxy/queryOne.htm',{
			proxyid:isList==1?proxyidWt:proxyid
		},function(result){
			_this.proxyInfo=result.data;
			layer.open({
				title : '委托书查看',
				type : 1,
				shift: 5,
				skin : 'layui-layer-lan',
				content : $('#proxyShowInfor'),
				area : '800px',
				btn : ['撤销','作废','修改'],
				success:function(){
					$('#effectiveState').html('');
					$('#enclosureList').html('');
					$('.layui-layer-btn0').hide();
					$('.layui-layer-btn1').hide();
					$('.layui-layer-btn2').hide();
					//录入人及其领导，可点击查看委托书信息
					if(result.data.issuperior==1 || result.data.isself==1){
						$('#jurisdictionNo').hide();
						$('#jurisdiction').show();
						$('#proxyNumber').html('委托书编号：<span>'+result.data.proxynum+'</span>');								//委托书编号
						$('#proxyPersonal').html('签委托人：<span>'+result.data.username+'</span>');								//签委托人
						$('#proxyDepartment').html('签委托部门：<span>'+result.data.deptname+'</span>')								//签委托部门
						$('#proxyDate').html('委托时间：<span>'+result.data.createtime+'</span>');									//委托时间
						$('#effectiveState').html('是否有效：<span id="isyxi">'+result.data.state+'</span>');									//是否有效
						if(result.data.state=='有效'){
							$('#isyxi').css({color:'#1ab394'});
						}
						var length=result.data.piceures.length;
						//附件列表
						if(length>0){
							var html='';
							var type='';
							$.each(result.data.piceures,function(i,n){
								if(n.type==101){
									type='身份证';
								}else if(n.type==102){
									type='委托书';
								}else if(n.type==103){
									type='产权证';
								}
								html+='\
									<div class="col-md-3"  style="height:140px;text-align: center;">\
									<img src="'+n.path+'" width="80%" height="80%">\
									<div style="padding-top: 10px;">'+type+'</div>\
								</div>';
							});
							$('#enclosureList').html(html);
						}
						//是否有效
						if(result.data.state=='有效'){
							//是否为创建人 0 否  1是
							if(result.data.isself==1){
								$('.layui-layer-btn0').show();
								$('.layui-layer-btn2').show().attr('class','layui-layer-btn0');
							}
							//是否为直属领导  0 否  1是
							if(result.data.issuperior==1){
								$('.layui-layer-btn1').show().attr('class','layui-layer-btn0');
							}
						}else{
							$('.layui-layer-btn').hide();
						}
					}else{
						$('#jurisdictionNo').show();
						$('#jurisdiction').hide();
						$('.layui-layer-btn').hide();
						$('#suoshuPersonal').html('录入人：<span>'+result.data.username+'</span>');									//所属人
						$('#suoshuDepartment').html('录入部门：<span>'+result.data.deptname+'</span>');									//所属部门
						$('#suoshuDate').html('委托时间：<span>'+result.data.createtime+'</span>');										//委托时间
						$('#proxyNumberXq').html('委托书编号：<span>'+result.data.proxynum+'</span>');									//委托书编号
					}
				},
				//撤销回调
				yes : function(i){
					commonContainer.modal('委托撤销','<div style="padding: 20px;font-size: 14px;">请确认是否撤销</div>',function(j){
						jsonGetAjax(basePath+'/house/proxy/remove.htm',{
							proxyid:isList==1?$(target).data('id'):proxyid,
							houseid:isList==1?$(target).data('houseid'):houseid
						},function(){
							commonContainer.alert('撤销成功');
							layer.close(i);
							layer.close(j);
							if(isList==1){
								PowerAttorney.queryList();
							}
						});
					},{
						area:'300px',
						btns:['确定','取消']
					});
				},
				//作废回调
				btn2:function(i){
					commonContainer.modal('委托作废','<div style="padding: 20px;font-size: 14px;">请确认是否作废</div>',function(j){
						jsonGetAjax(basePath+'/house/proxy/invalid.htm',{
							proxyid:isList==1?$(target).data('id'):proxyid,
							houseid:isList==1?$(target).data('houseid'):houseid
						},function(){
							commonContainer.alert('作废成功');
							layer.close(j);
							layer.close(i);
							if(isList==1){
								PowerAttorney.queryList();
							}
						});
					},{
						area:'300px',
						btns:['确定','取消']
					});
					return false;
				},
				//修改回调
				btn3:function(i){
					//commonContainer.alert('修改');
					layer.close(i);
					if(isList==1){
						_this.proxyNewlyAdded($(target).data('businesstype'),$(target).data('houseid'),_this.proxyInfo.userid,_this.proxyInfo.username,1,proxyidWt);
					}else{
						_this.proxyNewlyAdded(businesstype,houseid,_this.proxyInfo.userid,_this.proxyInfo.username,1,proxyid);
					}
					return false;
				},
				cancel : function(){}
			});
		});
	},
	/*  证件详情
	 *  @param  houseid  房源id
	 *  @param isXug  是否修改证件    1:是
	 *  @param isList  是否是列表页查看详情     1：是
	 * */
	certificatesDetail:function(houseid,isXug,isList,target){
		var _this=this;
		//调用证件详情接口
		var fhouseId='';
		if(isList==1){
			fhouseId=$(target).data('houseid');
		}else{
			fhouseId=houseid;
		}
		jsonGetAjax(basePath+'/house/credentials/credentialsdetails',{
			houseId:fhouseId
		},function(result){
			_this.certificatesInfor=result.data;
			commonContainer.modal('证件查看',$('#certificatesInfor'),function(m){
				layer.close(m);
				//证件修改
				_this.documentEntry(fhouseId,isXug);
			},{
				area:'800px',
				btns:['修改'],
				overflow :true,
				success:function(){
					$('#buildingArea').html('');
					//录入人及其领导，可点击查看委托书信息
					if(result.data.issuperior==1 || result.data.isself==1){
						$('#xiangQingY').show();
						$('#xiangQingN').hide();
						//房屋信息
						var propertytypeConte='';				//产权性质
						var houseappliConte='';					//规划用途
						if(result.data.propertytype==1){
							propertytypeConte='商品房';
						}else if(result.data.propertytype==2){
							propertytypeConte='已购公房';
						}else if(result.data.propertytype==3){
							propertytypeConte='已购公房（央产）';
						}else if(result.data.propertytype==4){
							propertytypeConte='经济适用房';
						}else if(result.data.propertytype==5){
							propertytypeConte='使用权';
						}else if(result.data.propertytype==6){
							propertytypeConte='按经济适用房管理';
						}else if(result.data.propertytype==7){
							propertytypeConte='按商品房管理';
						}
						if(result.data.houseapplication==1){
							houseappliConte='住宅';
						}else if(result.data.houseapplication==2){
							houseappliConte='公寓';
						}else if(result.data.houseapplication==3){
							houseappliConte='别墅';
						}else if(result.data.houseapplication==4){
							houseappliConte='商业';
						}else if(result.data.houseapplication==5){
							houseappliConte='写字楼';
						}else if(result.data.houseapplication==6){
							houseappliConte='工业厂房';
						}else if(result.data.houseapplication==7){
							houseappliConte='车库';
						}else if(result.data.houseapplication==21){
							houseappliConte='综合';
						}else if(result.data.houseapplication==10){
							houseappliConte='其他';
						}
						$('#houseLocated').html('房屋坐落：<span>'+result.data.houseaddress+'</span>');									//房屋坐落
						$('#registerdate').html('登记日期：<span>'+(result.data.inputdate.split(' ')[0])+'</span>');					//证件登记日期
						$('#commonSituationxq').html('共有情况：<span>'+(result.data.ownertype==1?'独有':'共有')+'</span>');				//共有情况
						$('#totalPersonsxq').html('共有人数：<span>'+result.data.ownernum+'</span>');									//共有人数
						$('#propertyRight').html('产权性质：<span>'+propertytypeConte+'</span>');										//产权性质
						$('#planningUses').html('规划用途：<span>'+houseappliConte+'</span>');											//规划用途
						$('#totalFloorxq').html('总楼层：<span>'+result.data.totalfloor+'</span>');									//总楼层
						$('#builtArea').html('建筑面积：<span>'+result.data.housearea+'平方米</span>');									//建筑面积
						$('#buildingArea').html('套内建筑面积：<span>'+result.data.realarea+'平方米</span>');								//套内建筑面积
						$('#dangQianLouc').html('当前楼层：<span>'+result.data.currentfloor+'</span>');									//当前楼层
						//证件信息
						if(result.data.owners.length>0){
							var enclosureArr=[];
							var html='';
							var pictureHtmlWd='';
							$.each(result.data.owners,function(i,n){
								if(n.picturelist){
									var pictureLen=n.picturelist.length;
								}
								var index=i+1;
								var zhengjType=_this.homeownerType(n.homeownertype);
								html='\
								<tr>\
									<td>'+index+'</td>\
									<td>'+n.homeownername+'</td>\
									<td>'+zhengjType+'</td>\
									<td>'+n.homeowneridcard+'</td>\
									<td>'+n.housecardinfono+'</td>\
									<td>'+(pictureLen?pictureLen:'')+'</td>\
									<td>'+n.percent+'</td>\
								</tr>';
								//证件信息（附件）
								if(pictureLen && pictureLen>0){
									var picType='';
									var pictureHtml='';
									$.each(n.picturelist,function(i,cont){
										if(cont.type==101){
											picType='身份证';
										}else if(cont.type==103){
											picType='产权证';
										}
//										pictureHtml+='\
//											<div style="width:25% height:100px;text-align: center;">\
//											<img src="'+n.path+'" width="50%" height="50%">\
//											<div style="padding-top: 10px;">'+picType+'</div>\
//										</div>';
										pictureHtml+='\
											<div class="col-md-3" style="height:120px;text-align:center">\
												<img width="80%" height="80%" src="'+cont.path+'">\
												<div style="padding-top:10px;">'+picType+'</div>\
											</div>';
									});
									//pictureHtmlWd='<tr><td colspan="7">'+pictureHtml+'</td></tr>'
								}
								var list=html+'<tr><td colspan="7">'+pictureHtml+'</td></tr>';
								enclosureArr.push(list);
							});
							$('#ownerInforXq tbody').html(enclosureArr.join(''));
						}else{
							$('#ownerInforXq tbody').html('');
						}
					}else{
						$('#xiangQingY').hide();
						$('#xiangQingN').show();
						$('.layui-layer-btn').hide();
						$('#chjPeople').html('录入人：<span>'+result.data.createbyname+'</span>');
						$('#chjDate').html('录入时间：<span>'+result.data.inputdate+'</span>');
						$('#chjDepartment').html('创建部门：<span>'+result.data.deptname+'</span>');
					}
				}
			});
		});
	},
	//业主有效证件类型
	homeownerType:function(homeownertype){
		if(homeownertype==1){
			return '居民身份证';
		}
		if(homeownertype==2){
			return '军（警）身份证';
		}
		if(homeownertype==3){
			return '香港居民身份证';
		}
		if(homeownertype==4){
			return '澳门居民身份证';
		}
		if(homeownertype==5){
			return '台湾居民身份证';
		}
		if(homeownertype==6){
			return '护照';
		}
		if(homeownertype==7){
			return '来往大陆通行证';
		}
		if(homeownertype==8){
			return '军官证';
		}
	}
};
/*
 * 判断身份证号码
 * num：身份证号码
 * isNew:是不是新的标准 true，默认为false
 */
function isIDCardNum(num,isNew){
	if(isNew){
		if(num.length != 18){
			return '输入的身份证号长度不对，或者号码不符合规定！<br>18位号码末位可以为数字或X。';
		}
	}
	num = num.toUpperCase();
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
	{
		return '输入的身份证号长度不对，或者号码不符合规定！<br>15位号码应全为数字，18位号码末位可以为数字或X。';
	}
	//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	//下面分别分析出生日期和校验位
	var len, re;
	len = num.length;
	if (len == 15)
	{
		re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		var arrSplit = num.match(re);
		
		//检查生日日期是否正确
		var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay)
		{
			return '输入的身份证号里出生日期不对！';
		}
		else
		{
			//将15位身份证转成18位
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0, i;
			num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
			for(i = 0; i < 17; i ++)
			{
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			num += arrCh[nTemp % 11];
			return true;
		}
	}
	if (len == 18)
	{
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		var arrSplit = num.match(re);
		
		//检查生日日期是否正确
		var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay)
		{
			return '输入的身份证号里出生日期不对！';
		}
		else
		{
			//检验18位身份证的校验码是否正确。
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var valnum;
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0, i;
			for(i = 0; i < 17; i ++)
			{
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if (valnum != num.substr(17, 1))
			{
				//$("#tip").html('18位身份证的校验码不正确！应该为：' + valnum);
				return '18位身份证的校验码不正确！';
			}
			return true;
		}
	}
	return '18位身份证的校验码不正确！';
}