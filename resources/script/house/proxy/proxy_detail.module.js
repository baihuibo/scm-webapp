/**
 * Created by wangxiaohong on 2017/7/31.
 */
(function (window) {

    angular.module('proxy-detail', ['base', 'sign-common'])

        .controller('proxyDetailCtrl', ['proxyDetailService', 'signUtil', '$scope', 'signService', function ( proxyDetailService, signUtil, $scope, signService) {
            var $ctrl = this;
            $ctrl.type=signUtil.getSearchValue("type");
            var proxyId = signUtil.getSearchValue('proxyId') || '';
            var proxyStatus = signUtil.getSearchValue('proxyStatus') || '';
            var proxyDo = signUtil.getSearchValue('proxyDo') || '';
            var reasonList=[];
            
            $ctrl.data={};
            $ctrl.ifuplpad=false;
            if(proxyStatus!=''){
            	$ctrl.proxyStatus=true;
            }else{
            	$ctrl.proxyStatus=false;
            }
    		$ctrl.selectHouseProxyDetailInfo = function () {	
    			proxyDetailService.getselectHouseProxyDetailDataInfo({'proxyId' :proxyId}).then(function(result){
    				if(result.code !== 0){
    					return layer.alert(result.msg);
    				}
    				$ctrl.detaildata = result.data;
    				console.log($ctrl.detaildata);
    			});
    			proxyDetailService.getselectHouseProxyDetailPicInfo({'proxyId' :proxyId}).then(function(result){
    				if(result.code !== 0){
    					return layer.alert(result.msg);
    				}
    				$ctrl.detail = result.data;
    				if($ctrl.detail.otherList==undefined){
    					$ctrl.detail.otherList=[];
    				}
    				console.log($ctrl.detail);
    				if($("#temp_picture").val()!=undefined){
    					$ctrl.ifuplpad=true;
    				}
    			});
    		};
    		$ctrl.user=function(userid){
    			getUserStaffInfo(userid);
    		}
    		$ctrl.auditResultfn = function(){
    			commonContainer.modal("不合格原因", $("#J_result"), function (layid) {
    				reasonList=[];
    				
    				if($ctrl.data.blurring!=undefined&&$ctrl.data.blurring.length!=0){
    					var obj={};
    					obj.resonType=1;
    					obj.resonItems=$ctrl.data.blurring.join('##');
    					obj.resonDetail=$ctrl.data.blurringRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.incomplete!=undefined&&$ctrl.data.incomplete.length!=0){
    					var obj={};
    					obj.resonType=2;
    					obj.resonItems=$ctrl.data.incomplete.join('##');
    					obj.resonDetail=$ctrl.data.incompleteRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.notsame!=undefined&&$ctrl.data.notsame.length!=0){
    					var obj={};
    					obj.resonType=3;
    					obj.resonItems=$ctrl.data.notsame.join('##');
    					obj.resonDetail=$ctrl.data.notsameRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.picnotsame!=undefined&&$ctrl.data.picnotsame.length!=0){
    					var obj={};
    					obj.resonType=4;
    					obj.resonItems=$ctrl.data.picnotsame.join('##');
    					obj.resonDetail=$ctrl.data.picnotsameRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.lackcertificates!=undefined&&$ctrl.data.lackcertificates.length!=0){
    					var obj={};
    					obj.resonType=5;
    					obj.resonItems=$ctrl.data.lackcertificates.join('##');
    					obj.resonDetail=$ctrl.data.lackcertificatesRe;
    					reasonList.push(obj);
    				}
    				if(reasonList.length==0){
    					return layer.alert("请选择不合格原因!");
    				}
    				$ctrl.submit(layid);    
		        }, {btns: ['提交', '取消'],area: ['80%' , '80%'] , overflow : 'auto'});
				
    		};
    		$ctrl.submit = function(layid){
    			if($ctrl.auditResult==2){
    				if(!$ctrl.data.blurring&&!$ctrl.data.incomplete&&!$ctrl.data.notsame&&!$ctrl.data.picnotsame&&!$ctrl.data.lackcertificates){
    					return layer.alert("请选择不合格原因!");
    				}
    			}
    			var parm={};
				parm.auditResult=$ctrl.auditResult;
				parm.proxyId=proxyId;
				parm.proxyStatus=proxyStatus;
				parm.reasonList=reasonList;
				parm.proxyDo=proxyDo;
    			if(proxyDo==1){
    				signUtil.confirm('审核合格/不合格，提交后无法修改，审核有误将产生处罚，确认提交？').then(function () {
    					proxyDetailService.postHouseProxyAudit(parm).then(function(result){
    	    				if(result.code !== 0){
    	    					return layer.alert(result.msg);
    	    				}
    	    				commonContainer.alert('操作成功');
    						
    						window.location.href=basePath + '/house/proxy/houseProxyList.html';
    	    				//跳转页面
    	    				
    	    			});
                    }, $.noop);
    			}else{	    			
					proxyDetailService.postHouseProxyAudit(parm).then(function(result){
	    				if(result.code !== 0){
	    					return layer.alert(result.msg);
	    				}
	    				commonContainer.alert('操作成功');
						
						window.location.href=basePath + '/house/proxy/houseProxyList.html';
	    				//跳转页面
	    				
	    			});
    			}
    		}
    		$ctrl.audit = function(){
    			if($ctrl.auditResult==undefined){
    				return layer.alert("请填写审核结果!");
    			}else{
    				reasonList=[];
    				$ctrl.submit();
    				
    			}
    		}
    		$ctrl.selectHouseProxyDetailInfo();
    		 // 编辑图片
            $ctrl.lookPicter = function (item,index,type) {
                signUtil.openLayer('picterLayer', item, '查看附件',$ctrl.detail.houseShareValue,type)
                    .then(function (picter) {
                    	
                    }, $.noop);
            };
    		[
    		 'blurring',// 房屋校验
    		 'incomplete',// 服务费收取对象
    		 'notsame', // 打折原因
    		 'picnotsame',
    		 'lackcertificates'
    		].forEach(function(keyCode){
    			signService.getTypes(keyCode).then(function(result){
    				$ctrl[keyCode] = result.data;	
    			});
    		});
        }])
    	
        ////////////////// service
        .service('proxyDetailService', ['$http', function ($http) {
        	this.getselectHouseProxyDetailDataInfo= function(data){
    			return $http.get(basePath + '/house/proxy/selectHouseProxyDetailDataInfo' , {params :data}).then(function(response){
    				console.log(response);
    				return response.data;
    			});
    		};
    		this.getselectHouseProxyDetailPicInfo= function(data){
    			return $http.get(basePath + '/house/proxy/selectHouseProxyDetailPicInfo' , {params :data}).then(function(response){
    				console.log(response);
    				return response.data;
    			});
    		};
    		this.postHouseProxyAudit= function(postData){
    			return $http.post(basePath + '/house/proxy/HouseProxyAudit' , postData).then(function(response){
    				console.log(response);
    				return response.data;
    			});
    		}
        }])
		 .component('picterLayer' , {
		template : '<div class="ibox-content" id="backResults">\n    <form class="form-horizontal">\n    <div class="input-group file-caption-main" style="position: relative;padding: 10px 0;">\n    <div class="input-group-btn">\n    </div>\n <div ng-if="$ctrl.houseShare==2" class="checkbox checkbox-primary checkbox-inline ml-40"><input type="checkbox" ng-model="$ctrl.$$ifchecked" id="freeTimeIds1" name="freeTimeIds" value="1"><label for="freeTimeIds1">同一代理人</label></div></div>\n    </div>\n   <div class="row upFileName" id="enterUpFileName" style="height:60vh"><div ng-repeat="item in $ctrl.$$proxyOwnerList" class="col-md-3 animated pulse deleImg" data-imgurl="item.path"><div style="padding:15px;">					<img width="100%" height="160px" style="margin-bottom:10px;" ng-src="{{item.path}}" layer-src="{{item.path}}"><div class="col-sm-12" ng-if="$ctrl.type==1"> <select id="photoType" name="photoType" disabled chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="1">代理人身份证</option></select>\n </div><div class="col-sm-12" ng-if="$ctrl.type==2"><select id="photoType" name="photoType" chosen disabled class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="3">产权人身份证</option></select>\n  </div><div class="col-sm-12" ng-if="$ctrl.type==3"><select id="photoType" name="photoType" chosen disabled class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="2">代理人授权委托书</option></select>\n  </div></div>			</div></div>\n    <div>\n <p  style="padding:10px;color:#ff0000;position: absolute;bottom: 0px;">备注：建议上传图片尺寸为3508×2480px,图片最大不超过5M,图片格式为jpg、jpeg、png、tif、tiff、bmp、gif</p>\n    </div>\n    </form>\n    </div>',
		controller : ['$element' , 'signService','proxyDetailService','$scope','signUtil',function($element , signService, proxyDetailService , $scope,signUtil){
			var $ctrl = this;
			var uid = signUtil.uuid('slider_');
            $element.attr('id', uid);
             setTimeout(function () {
                 layer.photos({
                     photos: '#' + uid + ' .deleImg',
                     anim: 0
                 });
             }, 100);
			//校验器
			$ctrl.delpicter=function (list, index, msg){
				var msg="确定删除此图片？";
				signUtil.confirm(msg).then(function () {
                    list.splice(index, 1);
                    layer.alert('删除成功');
                }, $.noop)
			}
			$ctrl.commonfn=function (files){
            	for(var i=0;i<files.length;i++){
            		var upFileObj=files[i];
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
        			if(upFileObj.size>3508*2480){
        				commonContainer.alert('图片最大不超过5M');
        				return false;
        			}
            	}
            	
            }
			
			
			$ctrl.$start = function($defer, data ,title,houseShare,type){
				
				$ctrl.data = $.extend(true , {} , data || {});
				$ctrl.houseShare=houseShare;
				$ctrl.type=type;
				if(type==1){
					$ctrl.$$proxyOwnerList=$ctrl.data.proxyOwnerList;
				}else if(type==2){
					$ctrl.$$proxyOwnerList=$ctrl.data.propertyOwnerList;
				}else if(type==3){
					$ctrl.$$proxyOwnerList=$ctrl.data.proxyOwnerBookList;
				}
				/*$("#proxyBook").on('input change',function(){
					 var files=Array.prototype.slice.call(this.files)
		    			if(files.length){
		    				$ctrl.commonfn(files);
		    				signService.uploadFiles(files).then(function(result){
		    					if(result.code==0){
		    						if(result.data.length>0){
		    							for(var i=0;i<result.data.length;i++){
		    								result.data[i].path=result.data[i].filepath;
		    								delete result.data[i]['filepath'];
		    								delete result.data[i]['type'];
		    								delete result.data[i]['filename'];
		    							}
		    						}
		    						if(type==1){
		    							$ctrl.data.proxyOwnerList=$ctrl.data.proxyOwnerList||[];
		    							$ctrl.data.proxyOwnerList=[].concat($ctrl.data.proxyOwnerList, result.data)
		    							$ctrl.$$proxyOwnerList=$ctrl.data.proxyOwnerList;
		    						}else if(type==2){
		    							$ctrl.data.propertyOwnerList=$ctrl.data.propertyOwnerList||[];
		    							$ctrl.data.propertyOwnerList=[].concat($ctrl.data.propertyOwnerList, result.data)
		    							$ctrl.$$propertyOwnerList=$ctrl.data.propertyOwnerList;
		    						}
		    						
		    					}
		               		
		               	})
		    			}            	
		                this.value = '';
		                $scope.$digest();
	            });*/
				commonContainer.modal(title, $element, function (layid) {
									
                    layer.close(layid);
				},{
					overflow:true,
					area : ['900px','95%'],
					btn:['关闭'],
					success:function(){
						
					}
				})
			}
						
		}]
		
	})
    angular.bootstrap(document, ['proxy-detail']);
}(window));