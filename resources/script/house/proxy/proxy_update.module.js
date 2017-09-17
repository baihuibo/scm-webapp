/**
 * Created by wangxiaohong on 2017/7/31.
 */
(function (window) {

    angular.module('proxy-detail', ['base', 'sign-common'])

        .controller('proxyDetailCtrl', ['proxyDetailService', 'signUtil', '$scope', 'signService', function ( proxyDetailService, signUtil, $scope, signService) {
            var $ctrl = this;
            var proxyId = signUtil.getSearchValue('proxyId') || '';
            var proxyStatus = signUtil.getSearchValue('proxyStatus') || '';
            $ctrl.type=signUtil.getSearchValue("type");
            $ctrl.housesid=signUtil.getSearchValue("housesid");
            var reasonList=[];
            $ctrl.res={};
            $ctrl.res.proxyBookList=[];
            $ctrl.res.propertyBookList=[];
            $ctrl.res.bookNoticeList=[];
            $ctrl.res.houseStatusList=[];
            $ctrl.res.otherList=[];
            $ctrl.res.houseProxyMandatorList=[];
            $ctrl.res.proxyId=proxyId;
            $ctrl.data={};
            $ctrl.copy={};
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
    				$ctrl.resdata = result.data;
    				$ctrl.copy= $.extend(true , {} , result.data) ;
    				
    				var houseTypes=result.data.houseType;
    				var bedroom=houseTypes.match(/(\S*)室/)[1];
    				$ctrl.bedroom=bedroom>9?bedroom:"0"+bedroom;
					var livingroom=houseTypes.match(/室(\S*)厅/)[1];
					$ctrl.livingroom=livingroom>9?livingroom:"0"+livingroom;
					var kitchen=houseTypes.match(/厅(\S*)厨/)[1];
					$ctrl.kitchen=kitchen>9?kitchen:"0"+kitchen;
					var toilet=houseTypes.match(/厨(\S*)卫/)[1];
					$ctrl.toilet=toilet>9?toilet:"0"+toilet;
					var balcony=houseTypes.match(/卫(\S*)阳/)[1];
					$ctrl.balcony=balcony>9?balcony:"0"+balcony;
					
    				console.log();
    				$(".layout").trigger("chosen:updated");
    			});
    			proxyDetailService.getselectHouseProxyDetailPicInfo({'proxyId' :proxyId}).then(function(result){
    				if(result.code !== 0){
    					return layer.alert(result.msg);
    				}
    				$ctrl.res = result.data;
    				if($ctrl.res.otherList==undefined){
    					$ctrl.res.otherList=[];
    				}
    				$ctrl.copy= $.extend(true , {} , result.data) ;
    			});
    		};
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
         			if(upFileObj.size>5*1024*1024){
         				commonContainer.alert('图片最大不超过5M');
         				return false;
         			}
             	}
             	
             }
    		 
             // 选择文件
             $("#proxyBookList").on('input change',function(){
                 /*angular.forEach(this.files, function (file) {
                     var f = $ctrl.res.proxyBookList.find(function (item) {
                         return item.filePath === file;
                     });
                     if (!f) {
                         $ctrl.res.proxyBookList.push({filePath: file});
                     }
                 });*/            	
             	var files=Array.prototype.slice.call(this.files)
     			if(files.length){
     				$ctrl.commonfn(files);
     				signService.uploadFiles(files).then(function(result){
     					if(result.code==0){
     						if(result.data.length>0){
     							for(var i=0;i<result.data.length;i++){
     								result.data[i].path=result.data[i].filepath;
     								result.data[i].type='4';
     								delete result.data[i]['filepath'];
     								delete result.data[i]['filename'];
     							}
     						}
     						$ctrl.res.proxyBookList=[].concat($ctrl.res.proxyBookList, result.data)
     					}
                		
                	})
     			}            	
                 this.value = '';
                 $scope.$digest();
             });
             $("#propertyBookList").on('input change',function(){           	
             	var files=Array.prototype.slice.call(this.files)
     			if(files.length){
     				$ctrl.commonfn(files);
     				signService.uploadFiles(files).then(function(result){
     					if(result.code==0){
     						if(result.data.length>0){
     							for(var i=0;i<result.data.length;i++){
     								result.data[i].path=result.data[i].filepath;
     								result.data[i].type='5';
     								delete result.data[i]['filepath'];
     								delete result.data[i]['filename'];
     							}
     						}
     						$ctrl.res.propertyBookList=[].concat($ctrl.res.propertyBookList, result.data)
     					}
                		
                	})
     			}            	
                 this.value = '';
                 $scope.$digest();
             });
             $("#bookNoticeList").on('input change',function(){           	
             	var files=Array.prototype.slice.call(this.files)
     			if(files.length){
     				$ctrl.commonfn(files);
     				signService.uploadFiles(files).then(function(result){
     					if(result.code==0){
     						if(result.data.length>0){
     							for(var i=0;i<result.data.length;i++){
     								result.data[i].path=result.data[i].filepath;
     								result.data[i].type='6';
     								delete result.data[i]['filepath'];
     								delete result.data[i]['filename'];
     							}
     						}
     						$ctrl.res.bookNoticeList=[].concat($ctrl.res.bookNoticeList, result.data)
     					}
                		
                	})
     			}            	
                 this.value = '';
                 $scope.$digest();
             });
             $("#houseStatusList").on('input change',function(){           	
             	var files=Array.prototype.slice.call(this.files)
     			if(files.length){
     				$ctrl.commonfn(files);
     				signService.uploadFiles(files).then(function(result){
     					if(result.code==0){
     						if(result.data.length>0){
     							for(var i=0;i<result.data.length;i++){
     								result.data[i].path=result.data[i].filepath;
     								result.data[i].type='7';
     								delete result.data[i]['filepath'];
     								delete result.data[i]['filename'];
     							}
     						}
     						$ctrl.res.houseStatusList=[].concat($ctrl.res.houseStatusList, result.data)
     					}
                		
                	})
     			}            	
                 this.value = '';
                 $scope.$digest();
             });
             $(document).on('blur','#proxyCode', function(event) {
             	var val=$("#proxyCode").val()
             	proxyDetailService.checkProxyCode({"proxyCode":val}).then(function (result) {
 					if (result.code !== 0) {
                         return layer.alert(result.msg);
                     }
 					
 				});
             })
             $("#otherList").on('input change',function(){           	
             	var files=Array.prototype.slice.call(this.files)
     			if(files.length){
     				$ctrl.commonfn(files);
     				signService.uploadFiles(files).then(function(result){
     					if(result.code==0){
     						if(result.data.length>0){
     							for(var i=0;i<result.data.length;i++){
     								result.data[i].path=result.data[i].filepath;
     								result.data[i].type='8';
     								delete result.data[i]['filepath'];
     								delete result.data[i]['filename'];
     							}
     						}
     						$ctrl.res.otherList=[].concat($ctrl.res.otherList, result.data)
     					}
                		
                	})
     			}            	
                 this.value = '';
                 $scope.$digest();
             });
             // 要远程删除的文件
             var remoteDel = [];
             $ctrl.removeFile = function (index,res) {
                 var obj = res[index];
                 signUtil.confirm('确定删除此附件？').then(function () {
                     /*if (obj.enclosureId) {// 服务器文件
                         remoteDel.push(obj.enclosureId);
                     }*/
                 	res.splice(index, 1);// 直接删除
                 }, $.noop);
             }
             $ctrl.houseSharefn = function (){
             	$ctrl.res.houseProxyMandatorList=[];
             	if($ctrl.resdata.shareType==1){
             		$ctrl.resdata.shareNum=1;
             		var obj={};
             		obj.mandatorName ='';
             		obj.hasProxy ='';
             		obj.proxyOwnerList=[];
             		obj.propertyOwnerList=[];
             		$ctrl.res.houseProxyMandatorList.push(obj);
             	}else{
             		$ctrl.resdata.shareNum='';
             	}
             }
             $ctrl.shareNumfn = function (){
             	$ctrl.res.houseProxyMandatorList=[]; 
             	for(var i=0;i<$ctrl.resdata.shareNum;i++){
             		var obj={};
             		obj.mandatorName ='';
             		obj.hasProxy ='';
             		obj.proxyOwnerList=[];
             		$ctrl.res.houseProxyMandatorList.push(obj);
             	}
             	
             };
             $ctrl.addPeople=function(){
            	var obj={};
         		obj.mandatorName ='';
         		obj.hasProxy ='';
         		obj.proxyOwnerList=[];
         		obj.proxyOwnerBookList=[];
         		obj.propertyOwnerList=[];
         		if($ctrl.res.houseProxyMandatorList.length>=9){
         			return layer.alert("共有人数不能超过9人!");
         		}
         		$ctrl.res.houseProxyMandatorList.push(obj);
         		
         		if($ctrl.res.houseProxyMandatorList.length==1){
         			$ctrl.resdata.shareType=1;
         			$ctrl.resdata.shareNum=$ctrl.res.houseProxyMandatorList.length;
         		}else if($ctrl.res.houseProxyMandatorList.length>1){
         			$ctrl.resdata.shareType=2;
         			$ctrl.resdata.shareNum=$ctrl.res.houseProxyMandatorList.length;
         		}else{
         			$ctrl.resdata.shareType='';
         		}
         		
    		 };
    		 Array.prototype.del=function(index){
		        if(isNaN(index)||index>=this.length){
		            return false;
		        }
		        for(var i=0,n=0;i<this.length;i++){
		            if(this[i]!=this[index]){
		                this[n++]=this[i];
		            }
		        }
		        this.length-=1;
		        if($ctrl.res.houseProxyMandatorList.length==1){
         			$ctrl.resdata.shareType=1;
         			$ctrl.resdata.shareNum=$ctrl.res.houseProxyMandatorList.length;
         		}else if($ctrl.res.houseProxyMandatorList.length>1){
         			$ctrl.resdata.shareType=2;
         			$ctrl.resdata.shareNum=$ctrl.res.houseProxyMandatorList.length;
         		}else{
         			$ctrl.resdata.shareType='';
         		}
		    };
    		 $ctrl.delPeople=function(){
    			 var chk_value =[]; 
    			 $('input[name="people"]:checked').each(function(){ 
    				 chk_value.push($(this).val()); 
    			 }); 
    			 console.log(chk_value);
    			 if(chk_value.length==0){
    				 return layer.alert("请选择要删除的数据!");
    			 }
    			 chk_value.reverse();
    			 for(var j=0;j<chk_value.length;j++){
    				 $ctrl.res.houseProxyMandatorList.del(chk_value[j]);
    			 }
    			 $ctrl.resdata.shareNum=$ctrl.res.houseProxyMandatorList.length;
    		 };
          // 添加图片
             $ctrl.addPicter = function (item,index,type) {
                 signUtil.openLayer('picterLayer', item, '附件上传',$ctrl.res.houseShareValue,type)
                     .then(function (picter) {
                     	if(type==1){
                     		$ctrl.res.houseProxyMandatorList[index].proxyOwnerList = picter;
                     	}else if(type==2){
                     		$ctrl.res.houseProxyMandatorList[index].propertyOwnerList = picter;
                     	}else if(type==3){
                    		$ctrl.res.houseProxyMandatorList[index].proxyOwnerBookList = picter;
                     	}
                     }, $.noop);
             };
             // 编辑图片
             $ctrl.editPicter = function (item,index,type) {
                 signUtil.openLayer('picterLayer', item, '编辑附件',$ctrl.res.houseShareValue,type)
                     .then(function (picter) {
                     	if(type==1){
                     		$ctrl.res.houseProxyMandatorList[index].proxyOwnerList = picter;
                     	}else if(type==2){
                     		$ctrl.res.houseProxyMandatorList[index].propertyOwnerList = picter;
                     	}else if(type==3){
                    		$ctrl.res.houseProxyMandatorList[index].proxyOwnerBookList = picter;
                     	}
                     }, $.noop);
             };
    		$ctrl.auditResultfn = function(){
    			commonContainer.modal("不合格原因", $("#J_result"), function (layid) {
    				reasonList=[];
    				if(!$ctrl.data.blurring&&!$ctrl.data.incomplete&&!$ctrl.data.notsame&&!$ctrl.data.picnotsame&&!$ctrl.data.lackcertificates){
    					return layer.alert("请选择不合格原因!");
    				}
    				if($ctrl.data.blurring){
    					var obj={};
    					obj.resonType=1;
    					obj.resonItems=$ctrl.data.blurring.join('##');
    					obj.resonDetail=$ctrl.data.blurringRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.incomplete){
    					var obj={};
    					obj.resonType=2;
    					obj.resonItems=$ctrl.data.incomplete.join('##');
    					obj.resonDetail=$ctrl.data.incompleteRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.notsame){
    					var obj={};
    					obj.resonType=3;
    					obj.resonItems=$ctrl.data.notsame.join('##');
    					obj.resonDetail=$ctrl.data.notsameRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.picnotsame){
    					var obj={};
    					obj.resonType=4;
    					obj.resonItems=$ctrl.data.picnotsame.join('##');
    					obj.resonDetail=$ctrl.data.picnotsameRe;
    					reasonList.push(obj);
    				}
    				if($ctrl.data.lackcertificates){
    					var obj={};
    					obj.resonType=5;
    					obj.resonItems=$ctrl.data.lackcertificates.join('##');
    					obj.resonDetail=$ctrl.data.lackcertificatesRe;
    					reasonList.push(obj);
    				}
    				$ctrl.auditsubmit();    
		        }, {btns: ['提交', '取消'],area: ['90%' , '90%'] , overflow : 'auto'});
				
    		};
    		if ($.validator) {
            	$.validator.setDefaults({
            		ignore: ":hidden:not(select)",
            		highlight : function(element) {
            			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            		},
            		success : function(label, element) {
            			$(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            		},
            		errorElement : "span",
            		errorPlacement : function(error, element) {
            			// 隐藏错误信息
            			if (element.is(":radio") || element.is(":checkbox")) {
            				error.appendTo(element.parent().parent().parent());
            			} else {
            				error.appendTo(element.parent());
            			}
            		},
            		errorClass : "help-block m-b-none",
            		validClass : "help-block m-b-none"
            	});
            	
                  $.validator.prototype.elements = function () {
                           var validator = this,
                             rulesCache = {};
             
                           // select all valid inputs inside the form (no submit or reset buttons)
                   return $(this.currentForm)
                   .find("input, select, textarea")
                   .not(":submit, :reset, :image, [disabled]")
                   .not(this.settings.ignore)
                   .filter(function () {
                       if (!this.name && validator.settings.debug && window.console) {
                           console.error("%o has no name assigned", this);
                       }
                       //注释这行代码
                       // select only the first element for each name, and only those with rules specified
                       //if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
                       //    return false;
                       //}
                           rulesCache[this.name] = true;
                           return true;
                       });
                   }
               }
            var addProxyValidateRule={
            	proxyCode :{
					required:true					
			    },
			    recordCode:{
			    	alnum:true,
			    },
			    price :{
			    	required: true,
			    	number:true,
			    	min:0,
			    	max:99999999.99,
			    	decimal: true,				
			    },
			    houseShare :{
					required:true					
			    },
			    shareNum :{
					required:true,
					number:true,
			    	min:1,
			    	digits:true
			    },
			    mandatorName :{
					required:true					
			    },
			    hasProxy :{
			    	requiredChosen:true					
			    },
			    proxyName :{
					required:{
						depends: function(element) {
			    			var propertytype = $(element).closest('td').prev().find('select').val();
			    			if(propertytype =='number:1')
			    				return true;
			    		}
					}
			    },
			    houseAddress :{
					required:true					
			    },
			    floor :{
			    	number:true,			    	
					required:true,
					comparemaxPrice: "#allFloor"
			    },
			    allFloor :{
			    	number:true,
					required:true,
			    	min:1,
			    	digits:true,
			    	comparePrice: "#floor"
			    },
			    roomNum :{
			    	number:true,
					required:true,
			    	min:0,
			    	digits:true					
			    },
			    houseArea :{
			    	number:true,
			    	min:0,
			    	max:99999999.99,
					required:true					
			    },
			    /*certNum :{
					required:true					
			    }*/
            };
          //字母数字  
            jQuery.validator.addMethod("alnum", function (value, element) {  
              return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);  
            }, "只能包括英文字母和数字"); 
            //比较价格区间
            jQuery.validator.addMethod("comparePrice", function (value, element, param) {  
            	var ele=$(element).closest('form').find(param);
            	var before = ele.val();
            	var after = value; 	
            	if(before!=''&&after!=''){
            		var decimal = /^-?\d+(\.\d{1,2})?$/;  
            		if(decimal.test(ele.val())){
            			var val=(Number(before) <= Number(after));
            			if(val!=false){
            				$(param).siblings("#"+$(param).attr('name')+"-error").remove();
            			}
            			return val;
            		}else{
            			return true;
            		}
            	}else{
            		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
            		return true;
            	}
            	
            }, $.validator.format("存在不符合规则的数据！")); 
            jQuery.validator.addMethod("comparemaxPrice", function (value, element, param) {  
            	/*console.log($(element).closest('form').find(param).val());*/
            	var ele=$(element).closest('form').find(param);
            	var after = ele.val();
            	var before = value; 	
            	if(before!=''&&after!=''){
            		var decimal = /^-?\d+(\.\d{1,2})?$/;  
            		if(decimal.test(ele.val())){
            			var val=(Number(before) <= Number(after));
            			if(val!=false){
            				$(param).siblings("#"+$(param).attr('name')+"-error").remove();
            			}
            			return val;
            		}else{
            			return true;
            		}
            		
            	}else{
            		$(param).siblings("#"+$(param).attr('name')+"-error").remove();
            		return true;
            	}
            }, $.validator.format("存在不符合规则的数据！")); 
          //验证值小数位数不能超过两位  
			jQuery.validator.addMethod("decimal", function (value, element) {  
			var decimal = /^-?\d+(\.\d{1,2})?$/;  
			return this.optional(element) || (decimal.test(value));  
			}, $.validator.format("小数位数不能超过两位!")); 
			jQuery.validator.addMethod('requiredChosen' , function (value, element) {
                return value !== '?' && value;
            } , $.validator.format("必填"));
    		$ctrl.addProxyValidate= function(){
				$.validator.setDefaults({ ignore: ":hidden:not(select)" });

				validate = $('#form1').validate({
					rules:addProxyValidateRule
				}).form();
				if(!validate) return false;
				return validate;
			};
			$ctrl.cancle = function(){
				/*$ctrl.res= $.extend(true , {} , $ctrl.copy) ;
				var houseTypes=$ctrl.res.houseType;
				var bedroom=houseTypes.match(/(\S*)室/)[1];
				$ctrl.bedroom=bedroom>9?bedroom:"0"+bedroom;
				var livingroom=houseTypes.match(/室(\S*)厅/)[1];
				$ctrl.livingroom=livingroom>9?livingroom:"0"+livingroom;
				var kitchen=houseTypes.match(/厅(\S*)厨/)[1];
				$ctrl.kitchen=kitchen>9?kitchen:"0"+kitchen;
				var toilet=houseTypes.match(/厨(\S*)卫/)[1];
				$ctrl.toilet=toilet>9?toilet:"0"+toilet;
				var balcony=houseTypes.match(/卫(\S*)阳/)[1];
				$ctrl.balcony=balcony>9?balcony:"0"+balcony;
				
				console.log($ctrl.res);
				$("select").trigger("chosen:updated");*/
				window.close();
			};
    		$ctrl.sure = function(){
    			var validate = true;
            	if(!$ctrl.addProxyValidate()){
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				} 
            	var arr=$ctrl.res.houseProxyMandatorList;
            	var flag=1;
            	$.each(arr,function(index,value){
            		if(arr[index].hasProxy==1){
	            		if(arr[index].proxyOwnerList.length==0){
		        			  flag=0;
		        			  commonContainer.alert("请上传代理人身份证附件！");
		  					  return; 
		        		  }
		        		  if(arr[index].proxyOwnerBookList.length==0){
		        			  flag=0;
		        			  commonContainer.alert("请上传代理人授权委托书附件！");
		  					  return; 
		        		  }
            		 }
        		  
        		});
            	if(flag==0){
            		return; 
            	}
            	if($ctrl.res.proxyBookList.length==0){
            		commonContainer.alert("请上传委托书附件！");
					return;
            	}
            	var typeflag=1;
				var list=$ctrl.res.proxyBookList;
            	$.each(list,function(index,value){
        		  if(list[index].type==''||list[index].type==undefined){
        			  typeflag=0;
        			  commonContainer.alert("请选择图片类型！");
  					  return; 
        		  }
        		});
            	if(typeflag==0){
            		return; 
            	}
            	var arr=$ctrl.res.houseProxyMandatorList;
            	$.each(arr,function(index,value){
        		  if(arr[index].propertyOwnerList.length==0){
        			  flag=0;
        			  commonContainer.alert("请上传产权人身份证附件！");
  					  return; 
        		  }
        		});
            	if(flag==0){
            		return; 
            	}
            	if($ctrl.res.propertyBookList.length==0){
            		commonContainer.alert("请上传产权证书附件！");
					return;
            	}
				var list=$ctrl.res.propertyBookList;
            	$.each(list,function(index,value){
        		  if(list[index].type==''||list[index].type==undefined){
        			  typeflag=0;
        			  commonContainer.alert("请选择图片类型！");
  					  return; 
        		  }
        		});
            	if(typeflag==0){
            		return; 
            	}
            	if($ctrl.res.bookNoticeList.length==0){
            		commonContainer.alert("请上传书面告知书附件！");
					return;
            	}
				var list=$ctrl.res.bookNoticeList;
            	$.each(list,function(index,value){
        		  if(list[index].type==''||list[index].type==undefined){
        			  typeflag=0;
        			  commonContainer.alert("请选择图片类型！");
  					  return; 
        		  }
        		});               	
        		if($ctrl.res.houseStatusList.length==0){
            		commonContainer.alert("请上传房屋状况说明书附件！");
					return;
            	}
        		var list1=$ctrl.res.houseStatusList;
            	$.each(list1,function(index,value){
        		  if(list1[index].type==''||list1[index].type==undefined){
        			  typeflag=0;
        			  commonContainer.alert("请选择图片类型！");
  					  return; 
        		  }
        		});
        		if(typeflag==0){
            		return; 
            	}
        		if($("#bedroom").val()==0&&$("#livingroom").val()==0){
            		commonContainer.alert("存在不合规数据，室或厅必须有一项大于1！");
					  return;
            	}
        		$ctrl.resdata.houseType =$("#bedroom option:selected").text()+'室'+$("#livingroom option:selected").text()+'厅'+$("#kitchen option:selected").text()+'厨'+$("#toilet option:selected").text()+'卫'+$("#balcony option:selected").text()+'阳';
        		delete $ctrl.resdata.createByName;
        		delete $ctrl.resdata.businessTypeStr;
        		delete $ctrl.resdata.shareTypeStr;
        		delete $ctrl.resdata.proxyDeptName;
        		delete $ctrl.resdata.createTime;
        		delete $ctrl.resdata.houseProxyLogList;
        		delete $ctrl.resdata.houseProxyAuditList;
        		$ctrl.res.housesid=$ctrl.housesid;
        		var arr=$ctrl.res.houseProxyMandatorList;
        		$.each(arr,function(index,value){
          		  if(arr[index].hasProxy==0){
          			 delete arr[index].proxyName;
          			 delete arr[index].proxyOwnerList;
          			 delete arr[index].proxyOwnerBookList;
          		  }
          		});
        		$ctrl.res = $.extend($ctrl.res, $ctrl.resdata);
        		console.log(JSON.stringify($ctrl.res));
        		
        		commonContainer.showLoading();
    			proxyDetailService.submit($ctrl.res).then(function (result) {
    				commonContainer.hideLoading();
					if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
					commonContainer.alert('操作成功');
					window.location.href=basePath + '/house/proxy/houseProxyDetail?proxyId='+proxyId+'&type='+$ctrl.type;
					//window.location.href=basePath + '/finance/collect/batchList.html';
				});
    		};
    		
    		$ctrl.auditsubmit = function(){
    			
    			var parm={};
				parm.auditResult=$ctrl.auditResult;
				parm.proxyId=proxyId;
				parm.proxyStatus=proxyStatus;
				parm.reasonList=reasonList;
				
				proxyDetailService.postHouseProxyAudit(parm).then(function(result){
    				if(result.code !== 0){
    					return layer.alert(result.msg);
    				}
    				//跳转页面
    				commonContainer.alert('操作成功');
					
					
    			});
    		}
    		$ctrl.audit = function(){
    			if($ctrl.auditResult==undefined){
    				return layer.alert("请填写审核结果!");
    			}else{
    				reasonList=[];
    				$ctrl.auditsubmit();
    				
    			}
    		}
    		$ctrl.selectHouseProxyDetailInfo();
    		[
    		 'yesOrNo',
    		 'houseShare',//共有情况
    		 'blurring',// 房屋校验
    		 'incomplete',// 服务费收取对象
    		 'notsame', // 打折原因
    		 'picnotsame',
    		 'lackcertificates'
    		].forEach(function(keyCode){
    			signService.getTypes(keyCode).then(function(result){
    				$ctrl[keyCode] = result.data;	
    			});
    		})
    		
        }])
    	.directive("house",function(){ 
			 return{ 
			 //通过设置项来定义 
				 template : '<select class="J_chosen form-control" chosen data-placeholder="请选择" ><option value="00">0</option><option value="01">1</option><option value="02">2</option><option value="03">3</option><option value="04">4</option><option value="05">5</option><option value="06">6</option><option value="07">7</option><option value="08">8</option><option value="09">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option></select>',
				 replace:true
			 }; 
		})
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
    		this.submit = function (paramsData) {
                return $http.post(basePath + '/house/proxy/updateProxyInfo',  paramsData).then(function (response) {
                    return response.data;
                })
            };
    		this.postHouseProxyAudit= function(postData){
    			return $http.post(basePath + '/house/proxy/HouseProxyAudit' , postData).then(function(response){
    				console.log(response);
    				return response.data;
    			});
    		}
        }])
	.component('picterLayer' , {
		template : '<div class="ibox-content" id="backResults">\n    <form class="form-horizontal">\n    <div class="input-group file-caption-main" style="position: relative;padding: 10px 0;">\n    <div class="input-group-btn">\n    <div class="btn btn-primary btn-file">\n    <span class="hidden-xs">选择上传图片</span>\n    <input type="file" accept="image/jpg, image/jpeg, image/png, image/tif, image/tiff, image/bmp, image/gif" multiple="" id="proxyBook">\n    </div>\n </div>\n <div ng-if="$ctrl.houseShare==2" class="checkbox checkbox-primary checkbox-inline ml-40"><input type="checkbox" ng-model="$ctrl.$$ifchecked" id="freeTimeIds1" name="freeTimeIds" value="1"><label for="freeTimeIds1">同一代理人</label></div></div>\n  <div class="row upFileName" id="enterUpFileName" style="height:60vh"><div ng-repeat="item in $ctrl.$$proxyOwnerList" class="col-md-3 deleImg" data-imgurl="item.path"><div calss="form-group" id="initchosen1" style="padding:15px;">	<img width="100%" height="160px" style="margin-bottom:10px;" src="{{item.path}}"><div class="col-sm-9" ng-if="$ctrl.type==1"> <select id="photoType" name="photoType" chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="1">代理人身份证</option></select>\n </div><div class="col-sm-9" ng-if="$ctrl.type==3"> <select id="photoType" name="photoType" chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="2">代理人授权委托书</option></select>\n </div><div class="col-sm-9" ng-if="$ctrl.type==2"><select id="photoType" name="photoType" chosen class="form-control layout" ng-model="item.type" data-placeholder="请选择">\n   <option value="">请选择</option><option value="3">产权人身份证</option></select>\n  </div><div class="col-sm-3"> <button type="button" class="btn btn-outline btn-success btn-xs pd5"  style="margin-top: 1px;"  ng-click="$ctrl.delpicter($ctrl.$$proxyOwnerList,item,$index,\'确定删除此图片？\')">删除</button>		</div>		</div>			</div></div>\n    <div>\n <p  style="padding:10px;color:#ff0000;position: absolute;bottom: 0px;">备注：建议上传图片尺寸为3508×2480px,图片最大不超过5M,图片格式为jpg、jpeg、png、tif、tiff、bmp、gif</p>\n    </div>\n    </form>\n    </div>',
		controller : ['$element', 'signUtil' , 'signService','proxyDetailService','$scope',function($element ,signUtil, signService, proxyDetailService , $scope){
			var $ctrl = this;
			//校验器
			$ctrl.delpicter=function (list,item, index, msg){
				var msg="确定删除此附件？";
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
        			if(upFileObj.size>5*1024*1024){
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
				$element.on('change',"input[type='file']",function(){
					 var files=Array.prototype.slice.call(this.files)
		    			if(files.length){
		    				$ctrl.commonfn(files);
		    				signService.uploadFiles(files).then(function(result){
		    					if(result.code==0){
		    						if(result.data.length>0){
		    							for(var i=0;i<result.data.length;i++){
		    								result.data[i].path=result.data[i].filepath;
		    								if(type==1){
		    									result.data[i].type='1';
		    								}else if(type==2){
		    									result.data[i].type='3';
		    								}else if(type==3){
		    									result.data[i].type='2';
		    								}
		    								delete result.data[i]['filepath'];
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
		    							$ctrl.$$proxyOwnerList=$ctrl.data.propertyOwnerList;
		    						}else if(type==3){
		    							$ctrl.data.proxyOwnerBookList=$ctrl.data.proxyOwnerBookList||[];
		    							$ctrl.data.proxyOwnerBookList=[].concat($ctrl.data.proxyOwnerBookList, result.data)
		    							$ctrl.$$proxyOwnerList=$ctrl.data.proxyOwnerBookList;
		    						}
		    						
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
						 commonContainer.alert("请上传附件！");
	 					  return; 
					}
                	$.each(arr,function(index,value){
            		  if(arr[index].type==''||arr[index].type==undefined){
            			  flag=0;
            			  commonContainer.alert("请选择类型！");
      					  return; 
            		  }
            		});
                	if(flag==0){
                		return; 
                	}
					if(type==1){
						$ctrl.data.proxyOwnerList=$ctrl.$$proxyOwnerList;
						$defer.resolve($ctrl.data.proxyOwnerList);
					}else if(type==2){
						$ctrl.data.propertyOwnerList=$ctrl.$$proxyOwnerList;
						$defer.resolve($ctrl.data.propertyOwnerList);
					}else if(type==3){
						$ctrl.data.propertyOwnerList=$ctrl.$$proxyOwnerList;
						$defer.resolve($ctrl.data.proxyOwnerBookList);
					}
					
                    layer.close(layid);
				},{
					overflow:true,
					area : ['900px','95%'],
					success:function(){
						
					}
				})
			}
						
		}]
		
	})
    angular.bootstrap(document, ['proxy-detail']);
}(window));