var res={};
(function(window){
	
	angular.module('detail' , ['base' , 'sign-common'])
	.controller('inquisitionDetailCtrl', ['inquisitionDetailService', 'signUtil',function(inquisitionDetailService, signUtil){
		var $ctrl = this;	
		var inquId = signUtil.getSearchValue('inquId') || '';
		var housesId = signUtil.getSearchValue('housesId') || '';
		var valioptionlist=[];
		$ctrl.inquisitionDetail = function () {	
			inquisitionDetailService.getinquisitionDetailquery({'inquId' :inquId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.detail = result.data;
				var array=$ctrl.detail.housesPicture;
				$ctrl.detail.housesPicture1 = $.grep(array,function(value){
		            return value.pictureType ==1;
		        });
				$ctrl.detail.housesPicture3=$.extend(true , [] , $ctrl.detail.housesPicture1);
				
				$ctrl.detail.housesPicture2 = $.grep(array,function(value){
		            return value.pictureType ==2;
		        });
				$ctrl.detail.housesPicture4=$.extend(true , [] , $ctrl.detail.housesPicture2);
				
				console.log($ctrl.detail);
				$ctrl.houselink = signUtil.getHouseLInk($ctrl.detail.housesInquBase.housesId, $ctrl.detail.housesInquBase.businessType);
			});
			inquisitionDetailService.getpictureInDoorquery({'housesId' :housesId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.optionlist=result.data;
				if($ctrl.optionlist.length>0){
					for(var i=0;i<$ctrl.optionlist.length;i++){
						if($ctrl.optionlist[i].describe.indexOf('室')>-1||$ctrl.optionlist[i].describe.indexOf('厅')>-1){
							valioptionlist.push($ctrl.optionlist[i].pictureKey);
						}
					}
				}
				console.log(valioptionlist);
			})
		};
		$ctrl.inquisitionDetail();
		$ctrl.checkAddress=function(){
			checkAddress($ctrl.detail.housesInquBase.housesId);
		}
		 // 添加图片
        $ctrl.addPicter = function (list,type) {
            signUtil.openLayer('picterLayer', '室内图上传',$ctrl.optionlist,type)
                .then(function (picter) {
                	if(type==1){
                		$ctrl.res.houseProxyMandatorList[index].proxyOwnerList = picter;
                	}else if(type==2){
                		$ctrl.detail.housesPicture2=[].concat($ctrl.detail.housesPicture2, picter);
                	}
                }, $.noop);
        };
        $ctrl.doorAddPicter= function (arr) {
        	$ctrl.detail.housesPicture1=[].concat($ctrl.detail.housesPicture1, arr);
        }
        $ctrl.subimit=function(){
        	if($ctrl.detail.housesPicture1.length==0){
        		return layer.alert('请上传户型图');
        	}
        	if($ctrl.detail.housesPicture1.length>5){
        		return layer.alert('举报的户型图不能多余5张');
        	}
        	if($ctrl.detail.housesPicture2.length<5){
        		return layer.alert('举报的室内图不能少余5张');
        	}
        	var valioptionlistsel=[];
        	if($ctrl.detail.housesPicture2.length>0){
				for(var j=0;j<$ctrl.detail.housesPicture2.length;j++){		
					valioptionlistsel.push($ctrl.detail.housesPicture2[j].pictureKey);
				}
			}
        	var housesLayout= $ctrl.detail.housesInquBase.housesLayout;
        	for(var i=0;i<valioptionlist.length;i++){
        		if($.inArray(valioptionlist[i], valioptionlistsel)==-1){
        			return layer.alert('室内图不符合'+housesLayout.split("室")[0]+"室"+housesLayout.split("室")[1].split("厅")[0]+"厅");
        		} 
        	}
        	if($ctrl.memo==undefined||$ctrl.memo==''){
        		return layer.alert('请填写评论');
        	}
        	if($ctrl.reportReason==undefined||$ctrl.reportReason==''){
        		return layer.alert('请填写举报理由');
        	}
        	commonContainer.confirm(
					'请提醒店经理于当日24点前处理举报，否则举报无效，图片不予审核！',function(index, layero){
	        	for(var i=0;i<$ctrl.detail.housesPicture1.length;i++){
	        		$ctrl.detail.housesPicture1[i].isDoorShape=1;
	        		delete $ctrl.detail.housesPicture1[i].imgDescribe;
	        		delete $ctrl.detail.housesPicture1[i].imgNo;
	        		delete $ctrl.detail.housesPicture1[i].pictureType;
	        	}
	        	for(var i=0;i<$ctrl.detail.housesPicture2.length;i++){
	        		$ctrl.detail.housesPicture2[i].isDoorShape=2;
	        		delete $ctrl.detail.housesPicture2[i].imgDescribe;
	        		delete $ctrl.detail.housesPicture2[i].imgNo;
	        		delete $ctrl.detail.housesPicture2[i].pictureType;
	        	}
	        	var obj={};
	        	
	        	obj.pictureList=[].concat($ctrl.detail.housesPicture1, $ctrl.detail.housesPicture2);
	        	obj.memo=$ctrl.memo;
	        	obj.reportReason=$ctrl.reportReason;
	        	obj.inquId=inquId;
	        	console.log(JSON.stringify(obj));
	        	inquisitionDetailService.postsubmit(obj).then(function(result){
					if(result.code == 1){
						return layer.alert(result.msg);
					}
					window.location.href=basePath + '/house/inquisitionCtf/inqDetailPage?id='+result.data.reportId;
					/*window.open("inqDetailPage.html?id="+result.data.reportId);
					window.opener.location.href = window.opener.location.href;	*/
				})
			})
        	
        }
	}])
	
	.service('inquisitionDetailService' , ['$http' , function($http){
		this.postsubmit= function (data) {
            return $http.post(basePath + '/house/inquisitionCtf/inqInform', data)
            .then(function (response) {
                return response.data;
            });
		};
		this.getinquisitionDetailquery= function(data){
			return $http.get(basePath + '/house/inquisition/inqCheck' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getpictureInDoorquery= function(data){
			return $http.get(basePath + '/house/inquisition/pictureInDoor' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
	}])
	
    .component('picterLayer' , {
		template : '<div class="ibox-content" id="backResults">\n    <form class="form-horizontal">\n    <div class="input-group file-caption-main" style="position: relative;padding: 10px 0;">\n    <div class="input-group-btn">\n    <div class="btn btn-primary btn-file">\n    <span class="hidden-xs">选择上传图片</span>\n    <input type="file" accept="image/jpg, image/jpeg, image/png, image/tif, image/tiff, image/bmp, image/gif" multiple="" id="proxyBook">\n    </div>\n </div>\n</div>\n  <div class="row upFileName" id="enterUpFileName" style="height:63vh"><div ng-repeat="item in $ctrl.$$proxyOwnerList" class="col-md-3 deleImg" data-imgurl="item.path"><div calss="form-group" id="initchosen1" style="padding:15px;">	<img width="100%" height="160px" style="margin-bottom:10px;" src="{{item.picturePath}}"><div class="col-sm-12"><input type="text" placeholder="请输入描述" ng-model="item.describe" class="form-control" id="describ" maxlength="50"></div><div class="col-sm-9" ng-if="$ctrl.type==1"> <select id="photoType" name="photoType" chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="1">代理人身份证</option></select>\n </div><div class="col-sm-9" ng-if="$ctrl.type==2"><select id="photoType" name="photoType" chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option ng-repeat="item in $ctrl.optionlist" ng-value="item.pictureKey">{{item.describe}}</option></select>\n  </div><div class="col-sm-3"> <button type="button" class="btn btn-outline btn-success btn-xs pd5"  style="margin-top: 1px;"  ng-click="$ctrl.delpicter($ctrl.$$proxyOwnerList,item,$index,\'确定删除此图片？\')">删除</button>		</div>		</div>			</div></div>\n    </form>\n    </div>',
		controller : ['$element', 'signUtil' , 'signService','$scope',function($element,signUtil , signService, $scope){
			var $ctrl = this;
			//校验器
			$ctrl.delpicter=function (list,item, index, msg){
				var msg="确定删除此图片？";
				signUtil.confirm(msg).then(function () {
                    list.splice(index, 1);
                    layer.alert('删除成功');
                }, $.noop)
			}
			$ctrl.commonfn=function (files , callback){
				var loaded = 0 , isNoPass = false;
                for (var i = 0; i < files.length; i++) {
                    var upFileObj = files[i];
                    //验证上传文件
                    var strIndex = upFileObj.name.lastIndexOf('.') + 1;
                    var fileSuffixName = upFileObj.name.substring(strIndex);											//文件后缀
                    var isFileType = /^(jpg|jpeg|png|tif|tiff)$/.test(fileSuffixName);						//是否符合文件类型
                    //是否符合文件类型
                    if (!isFileType) {
                        commonContainer.alert('图片格式为jpg、jpeg、png、tif、tiff');
                        isNoPass = true;
                        return callback(false);
                    }
                    //验证上传文件是否大于5MB
                    if (upFileObj.size > 5 * 1024 * 1024) {
                        commonContainer.alert('图片最大不超过5M');
                        isNoPass = true;
                        return callback(false);
                    }
                    var fileData = upFileObj;
                    //读取图片数据
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        //加载图片获取图片真实宽度和高度
                        var image = new Image();
                        image.onload = function () {
                            loaded ++;
                            if (image.width < 800 || image.height < 600 || image.width / image.height != 4 / 3) {
                                commonContainer.alert('请上传图片尺寸≥800*600，比例为4:3');
                                isNoPass = true;
                                return callback(false);
                            }
                            if (loaded === files.length && !isNoPass) {
                                callback(true);
                            }
                        };
                        image.src = data;
                    };
                    reader.readAsDataURL(fileData);
                }
            };
			
			
			$ctrl.$start = function($defer,title,optionlist,type){
				$ctrl.$$proxyOwnerList=[];
				/*$ctrl.data = $.extend(true , {} , data || {});*/
				$ctrl.optionlist=optionlist;
				$ctrl.type=type;
				$element.on('change',"input[type='file']",function(){
					 var files=Array.prototype.slice.call(this.files)
		    			if(files.length){
		    				$ctrl.commonfn(files , function (isTrue) {
                                if (isTrue) {
				    				signService.uploadFiles(files).then(function(result){
				    					if(result.code==0){
				    						if(result.data.length>0){
				    							for(var i=0;i<result.data.length;i++){
				    								result.data[i].picturePath=result.data[i].filepath;
				    								
				    								delete result.data[i]['filepath'];
				    								delete result.data[i]['filename'];
				    								delete result.data[i]['type'];
				    							}
				    						}
				    						$ctrl.$$proxyOwnerList=[].concat($ctrl.$$proxyOwnerList, result.data)
				    						
				    					}
				               		
				    				})
                                }
		    				})
		    			}            	
		                this.value = '';
		                $scope.$digest();
	            });
				commonContainer.modal(title, $element, function (layid) {
					var flag=1;
					var arr=$ctrl.$$proxyOwnerList;
					if(arr.length==0){
						 commonContainer.alert("请上传图片！");
	 					 return; 
					}
                	$.each(arr,function(index,value){
            		  if(arr[index].type==''||arr[index].type==undefined){
            			  flag=0;
            			  commonContainer.alert("请选择类型！");
      					  return; 
            		  }
            		  arr[index].pictureKey=arr[index].type;
            		  delete arr[index].type;
            		});
                	if(flag==0){
                		return; 
                	}
					if(type==1){
						$ctrl.data.proxyOwnerList=$ctrl.$$proxyOwnerList;
						$defer.resolve($ctrl.data.proxyOwnerList);
					}else if(type==2){
						$defer.resolve($ctrl.$$proxyOwnerList);
					}else if(type==3){
						$ctrl.data.proxyOwnerBookList=$ctrl.$$proxyOwnerList;
						$defer.resolve($ctrl.data.proxyOwnerBookList);
					}
					
                    layer.close(layid);
				},{
					overflow:true,
					area : ['900px','90%'],
					success:function(){
						
					}
				})
			}
						
		}]
		
	})
	angular.bootstrap(document , ['detail']);
}(window));