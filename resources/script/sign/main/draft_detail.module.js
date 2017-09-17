var res={};
window.userid;
window.companysId;
window.dealt;
var cost;
(function(window){
	angular.module('draft_detail' , ['base' , 'sign-common'])
	
	.controller('draftDetailCtrl' , ['draftDetailService', 'signUtil', 'signService' , '$q','$filter',function(draftDetailService, signUtil ,signService , $q , $filter){
		var $ctrl = this;
		var formId = signUtil.getSearchValue('conId');
		$ctrl.formId=formId;
		var docbizkey = signUtil.getSearchValue('docbizkey');
		var t = signUtil.getSearchValue('t');
        var taskId = signUtil.getSearchValue('taskId');
        var isEnd = !!signUtil.getSearchValue('isEnd');
        var tempId = signUtil.getSearchValue('templateId');
        var conId = signUtil.getSearchValue('conId') || '';
        var pageType=signUtil.getSearchValue('pageType');
        var other = signUtil.getSearchValue('other');
        var attachmentBefore = signUtil.getSearchValue('attachment');

        var enclosureIds='';
        /*var approveTypeflag='';*/
        var ifannexLogs=0;
        var userType=signUtil.getSearchValue('userType');
        var contractno;
        var customerCode;
        var customerName;
		$ctrl.edit=1;
		$ctrl.agent=1;
		$ctrl.basic=1;
		$ctrl.ownership=1;
		$ctrl.intermediary=1;
		$ctrl.capital=1;
		$ctrl.serviceCharge=1;
		$ctrl.unpritable=1;
		$ctrl.houseDelivery=1;
		$ctrl.detailbtn=true;
		$ctrl.agentbtn=true;
		$ctrl.basicbtn=true;
		$ctrl.ownershipbtn=true;
		$ctrl.intermediarybtn=true;
		$ctrl.capitalbtn=true;
		$ctrl.serviceChargebtn=true;
		$ctrl.unpritablebtn=true;
		$ctrl.houseDeliverybtn=true;
		$ctrl.editStates = true;// 当前编辑的区域
		$ctrl.btnStates = true;//按钮状态
		$ctrl.currentUser=false;//判定是否是当前用户
		$ctrl.servicebtn=true;
		$ctrl.noservicebtn=true;
		$ctrl.discount_res=true;
		$ctrl.discount_resc=true;
		dealt=true;
		$ctrl.discount_resfun=function(){
			if($ctrl.serveObj.indexOf(1)>-1&&$ctrl.serveObj.indexOf(2)>-1){
				if(($("#ownBrokerageDiscount").val()>=10.00 || $("#ownBrokerageDiscount").val()==undefined)&&$("#ownPerformanceDiscount").val()>=10.00&&($("#cusBrokerageDiscount").val()>=10.00 || $("#cusBrokerageDiscount").val()==undefined)&&$("#cusPerformanceDiscount").val()>=10.00){
					$ctrl.discount_resc=false;
				}else{
					$ctrl.discount_resc=true;
				}
			}
			if($ctrl.serveObj.indexOf(1)>-1&&$ctrl.serveObj.indexOf(2)==-1){
				if(($("#ownBrokerageDiscount").val()>=10.00 || $("#ownBrokerageDiscount").val()==undefined)&&$("#ownPerformanceDiscount").val()>=10.00){
					$ctrl.discount_resc=false;
				}else{
					$ctrl.discount_resc=true;
				}
			}
			if($ctrl.serveObj.indexOf(2)>-1&&$ctrl.serveObj.indexOf(1)==-1){
				if(($("#cusBrokerageDiscount").val()>=10.00 || $("#cusBrokerageDiscount").val()==undefined)&&$("#cusPerformanceDiscount").val()>=10.00){
					$ctrl.discount_resc=false;
				}else{
					$ctrl.discount_resc=true;
				}
			}
		}
		
		 if (docbizkey) {
             var names = docbizkey.split('-');
             formId = $ctrl.formId = names[1];
             $ctrl.docbizkey = docbizkey;
         }
		 
		 if (other) {
             var names = other.split('-');
             formId = $ctrl.formId = names[1];
             $ctrl.other = other;
         }
		 $ctrl.annexLogs=function(){
				var url=window.location.href;
				var name;
				var approveType=signUtil.getSearchValue('approveType');
				var userType=signUtil.getSearchValue('userType');
				
				//alert(approveType)
				if(url.indexOf("/contractdetail") >= 0){
					processRole=0;
					name="contract";
					$("#J_audit").show();
				}else if(url.indexOf("/draftdetail") >= 0){
					processRole=0;
					name="draft";
					$("#J_audit").show();
				}else if(url.indexOf("/riskcontractdetail") >= 0){
					//processRole=1;
					if(approveType==3){
						processRole=3;
					}else if(approveType == null || approveType == undefined || approveType == ''){
						processRole=0;
					}else{
						processRole=1;
					}
					name="risk";
					$("#J_audit").hide();
				}else if(url.indexOf("/financecontractdetail") >= 0){
					//processRole=2;
					if(approveType==3){
						processRole=3;
					}else if(approveType == null || approveType == undefined || approveType == ''){
						processRole=0;
					}else{
						processRole=2;
					}
					name="finance";//财务
					$("#J_audit").hide();
				}
				if(processRole==0){
					$("#oper_annex_btn").show();
				}else{
					$("#oper_annex_btn").hide();
				}
				if(ifannexLogs==0){	
			 	$('#J_annexdataTable').bootstrapTable({ 
			 		url:basePath + '/sign/listEnclosure',
			 		sidePagination: 'server',
			 		dataType: 'json',
			 		pagination: true,
			 		striped: true,
			 	//pagination: false,
			 		pageSize: 100,
			 		pageList: [100],
			 		
			 		queryParams : function(params) {
			 			var o = {};
			 			o.timestamp = new Date().getTime();
			 			o.contractId = conId;
			 			o.pageIndex = params.offset / params.limit+ 1,
			 			o.pageSize = params.limit;
			 			o.contractType=2; 			
			 			o.processRole=processRole;
			 			return  o;
			 		},
			 		responseHandler: function(result) {
			 			isEnclosure=result.data.isEnclosure;
			 			var isPrintcertify=result.data.isPrintcertify ;
			 			if(isPrintcertify==1){
			 				$('#print').hide();
			 			}
			 			if(result.data.dynamicLabel==undefined){
								$('#dynamicLabel').hide();
							}
							$('#dynamicLabel').text(result.data.dynamicLabel);
			 			if(result.code == 0 && result.data && result.data.totalcount > 0) {
			 				$ctrl.annexLogs=result.data.list;
			 				return { "rows": result.data.list, "total": result.data.totalcount }
			 			}
			 			return { "rows": [], "total": 0 } 
			 		},
			 		columns:[{field: 'id',title :'序号',
						 			checkbox:true,
						 			align: 'center',
									formatter: function(value, row, index){
					  				var html='';
					  				/*if((row.uploadState==1||row.uploadState==4)&&row.isOwnerUser){*/
					  					html='<input type="hidden" approveType="'+row.approveType+'" enclosureId="'+row.enclosureId+'" uploadState ="'+row.uploadState+'"/>';
					  				/*}*/					  				
					  				return html;
									}
					         	},		         
					      	    {field: 'enclosureTypeValue', title: '附件类型', align: 'center'},
					      	    {field: 'uploadDate', title: '上传日期', align: 'center'},
					      	    {field: 'uploadUserName', title: '上传人', align: 'center',
					      	    	formatter: function(value ,row, index){
					      	    		var html='';
					      	    		html='<a onclick="getUserStaffInfo('+row.uploadUserId+')">'+row.uploadUserName+'</a>'
					      	    		return html;
					      	    	}
					      	    },
					      	    
					      	    {field: 'uploadState', title: '状态', align: 'center',
					      	    	formatter: function(value, row, index) {
				      	    		var html = '';
				      	    		if (value == '1') {
				      	    			html = '上传';
				      	    		} else if(value=='2'){
				      	    			html = '已提交';
				      	    		}else if(value=='3'){
				      	    			html = '签收';
				      	    		}else if(value=='4'){
				      	    			html = '驳回';
				      	    		}
				      				return html;
				      	    	}
					      	    },
					      	    {field: 'auditTypeLabel', title: '审核角色', align: 'center'},
					      	    {field: 'memo', title: '备注', align: 'center',
					      	    	formatter:function(value,row,index){
				           			var html = '';
				           			var memo = row.memo? row.memo : '';
				           			html+='<div class="remark_all text-left" >'+memo+'</div>'
				           			return html;
				           		}
					      	    },
					      	    {field: 'riskSignAdvice', title: '风控签收意见', align: 'center',
					      	    	formatter:function(value,row,index){
					           			var html = '';
					           			var riskSignAdvice = row.riskSignAdvice? row.riskSignAdvice : '';
					           			if(value=='驳回原因'){
					           				html = '<a type="reject" data-operateTimes="'+row.operateTime+'" data-operateUserNames="'+row.operateUserName+'" data-rejectReasons="'+row.rejectReason+'" data-enclosureIds="'+row.enclosureId+'" data-rejectTypeValue="'+row.rejectTypeValue+'">'+riskSignAdvice+'<a>';
					           			}else{
					           				html='<div>'+riskSignAdvice+'</div>'
					           			}
					           			
					           			return html;
					           		}
					      	    },
					      	    {field: 'financeSignAdvice', title: '财务签收意见', align: 'center',
					      	    	formatter:function(value,row,index){
					           			var html = '';
					           			var financeSignAdvice = row.financeSignAdvice? row.financeSignAdvice : '';
					           			if(value=='驳回原因'){
					           				html = '<a type="reject" data-operateTimes="'+row.operateTime+'" data-operateUserNames="'+row.operateUserName+'" data-rejectReasons="'+row.rejectReason+'" data-enclosureIds="'+row.enclosureId+'" data-rejectTypeValue="'+row.rejectTypeValue+'">'+financeSignAdvice+'<a>';
					           			}else{
					           				html='<div>'+financeSignAdvice+'</div>'
					           			}
					           			
					           			return html;
					           		}
					      	    },
					      	    {field: 'opt', title: '操作', align: 'center',
					      	    	formatter: function(value, row, index) {
				      		    	var html = '';
				      		    	var memo = row.memo? row.memo : '';
				      		    	html +='<div class="text-left">';
				      		    	if(processRole==0){
				      		    		var enclosuremodify=$("#enclosuremodify").length;
				      		    		if(enclosuremodify=='1'){
				      		    			if((row.uploadState==1||row.uploadState==4)&&$ctrl.currentUser){
					      		    			html += '<a type=\"amend\" class=\"btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'" data-memo="'+memo+'" data-enclosureType="'+row.enclosureType+'">修改</a>&nbsp;&nbsp;'	
					      		    		}
				      		    		}	
				      		    	}
				      		    	html += '<a type=\"examine\" class=\"btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'">查看</a>&nbsp;&nbsp;'
				      		    	if(processRole==0){
				      		    		if(row.uploadState==1&&$ctrl.currentUser){
				      		    			html += '<a type=\"del\" class=\"btn btn-outline btn-danger btn-xs\" data-enclosureId="'+row.enclosureId+'">删除</a>&nbsp;&nbsp;'		
				      		    		}
				      		    	}
				      					
				      	    		if(processRole==1 || processRole==2){
				      	    			if(row.uploadState==2){
				      	    				html += '<a type=\"sign\"  class=\"sign btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'" data-approveType="'+row.approveType+'"  data-operateUserName ="'+row.operateUserName +'"  data-operateTime ="'+row.operateTime +'">签收</a>&nbsp;&nbsp;'
				      	    			}
				      	    		}else if(processRole==3){
				      	    			if(row.uploadState==2 && processRole==3 && row.financeSignAdvice == undefined && row.riskSignAdvice == undefined){
				      	    				html += '<a type=\"sign\"  class=\"sign btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'" data-approveType="'+row.approveType+'"  data-operateUserName ="'+row.operateUserName +'"  data-operateTime ="'+row.operateTime +'">签收</a>&nbsp;&nbsp;'
				      	    			}else if(row.uploadState==2 && processRole==3 && row.riskSignAdvice == undefined && userType == 1 && row.financeSignAdvice!='驳回原因'){
				      	    				html += '<a type=\"sign\"  class=\"sign btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'" data-approveType="'+row.approveType+'"  data-operateUserName ="'+row.operateUserName +'"  data-operateTime ="'+row.operateTime +'">签收</a>&nbsp;&nbsp;'
				      	    			}else if(row.uploadState==2 && processRole==3 && row.financeSignAdvice == undefined && userType == 2 && row.riskSignAdvice !='驳回原因'){
				      	    				html += '<a type=\"sign\"  class=\"sign btn btn-outline btn-success btn-xs\" data-enclosureId="'+row.enclosureId+'" data-approveType="'+row.approveType+'"  data-operateUserName ="'+row.operateUserName +'"  data-operateTime ="'+row.operateTime +'">签收</a>&nbsp;&nbsp;'
				      	    			}
				      	    		}
				      	    		html += '</div>';
				      	    		return html;
				      	    	}
					      	    },
			 		 ],
			 	})
			 	ifannexLogs=1;
				}else{
					$('#J_annexdataTable').bootstrapTable('refresh',{ url: basePath + '/sign/listEnclosure' });
				}
		 }
        if (attachmentBefore) {
            $("#tab-12").click(); // 显示到附件审核面板
        }
		 if (docbizkey) {
			 dealt=false;
			 var idx = docbizkey.indexOf('-');
             formId = docbizkey.substr(idx + 1);
             conId=formId;
             $ctrl.showAllEditBtn = false; // 在流程中，隐藏它们
			 if(pageType==2){
				 $('.tabs-container ul li').eq(1).addClass('active');
				 $('.tabs-container ul li').eq(0).removeClass('active');
				 $("#tab-12").addClass('active');
				 $("#tab-11").removeClass('active');
				 $ctrl.annexLogs();
				 if(dealt==false){
						$('#J_annexdataTable').bootstrapTable('hideColumn', 'id');
					}
			 }             
             if(t=='done'){
            	 $ctrl.btnStates=false;
             }else{
	             draftDetailService.queryWorkFlowButton(tempId,pageType)
	                 .then(function (result) {
	                     if (result.code !== 0) {
	                         return layer.alert(result.msg);
	                     }
	                     if(pageType==1||pageType==3||pageType==4){
	                    	 $ctrl.workFlowButtons = result.data;
	                     }else if(pageType==2){
	                    	 $ctrl.workFlowTypeButtons = result.data;
	                     }
	                     
	                 });
             }
         }
		 //审批流程
		 
		 $ctrl.contractApproval=function(){
			 draftDetailService.getcontractApproval(conId).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}else{
						$ctrl.contractApproval=result.data;
					}
			 })
		 };
		 
		 //合同费用执行明细
         $ctrl.costDetail=function(){
        	 $("#iframeId").attr({"src":"/sales/finance/cost/costDetail.htm?conId="+conId+"&cost="+true+"&other="+other});
         };
        
		 
		 //  补充协议
         
             $ctrl.initSupplAgrtList = function () {
                 return draftDetailService.getSupplAgrtListByConId(conId).then(function (result) {
                     if (result.code !== 0) {
                         return layer.alert(result.msg);
                     }
                     return $ctrl.supplAgrtList = result.data;
                 });
             };
         
         
         $ctrl.agreement=function(){
        	 commonContainer.modal('新增补充协议',$('#addBucXy'),function(index){
        		 	var paymentType=$("#paymentType").val();
					if($("#paymentType").val()==''){
						commonContainer.alert('请选择适用场景');
					}else{
						window.open(basePath+'/sign/agreement/agreement-edit.html?conId='+conId+'&business_type=2&paymentType='+paymentType);
						layer.close(index);
					}
				},{
					area:['500px','400px'],
					btn:['确定','取消'],
					success:function(){
						$("#paymentType").val("");
						$("#paymentType").trigger("chosen:updated");
					}
			})
         };
         
         
		 /*//審批流程
		 $ctrl.process=function(){
			 paramsData = {
                modelName: 'BUY_CONTRACT,BUT_CLINECH_DEAL',
                methodName: 'getHistorysByBusiness'
            };
        	postData= {
                formId: conId,
            };
        	draftDetailService.workFlowDoJob(postData, paramsData).then(function (result) {                
             if (result.code !== 0) {
                 throw layer.alert(result.msg);
             }
            return result.data;
         	}).then(function (result) {
         		console.log(1);
             })
		 };*/
		 //費用明細
		 /*$ctrl.costdetails=function(){
			 draftDetailService.getcostdetails(conId).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}else{
						$ctrl.costdetail=result.data.details;
					}
			 })
		 };*/
		
		 
		 $ctrl.init = function () {	
			draftDetailService.getContractStatus({'contractId' :conId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				//result='{"code":0,"data":{"auditStatus":"3","conId":68,"contractStatus":"1","reportedAuditStatus":"3"},"msg":"success"}';
				//result=$.parseJSON(result);
				$ctrl.Status=result.data;
				if($ctrl.Status.contractStatus==2||$ctrl.Status.contractStatus==4||$ctrl.Status.contractStatus==5||$ctrl.Status.contractStatus==6){
					$ctrl.editStates=false;
					if($ctrl.Status.contractStatus!=2){
						$ctrl.btnStates=false;
					}
					
				}else if($ctrl.Status.contractStatus==3){
					$ctrl.editStates=false;
					$ctrl.btnStates=true;
				}else if($ctrl.Status.contractStatus==1&&$ctrl.Status.auditStatus==2){
					$ctrl.editStates=true;
					$ctrl.btnStates=true;
					$ctrl.servicebtn=false;
					if($ctrl.Status.reportedAuditStatus==2){
						$ctrl.noservicebtn=false;
					}
				}else{
					$ctrl.editStates=true;
					$ctrl.btnStates=true;
					if($ctrl.Status.reportedAuditStatus==2){
						$ctrl.noservicebtn=false;
						$ctrl.servicebtn=true;
					}
				}
				console.log($ctrl.noservicebtn);
			});
			$ctrl.getServiceChage =function(){
				
				draftDetailService.getServiceChage({'conId':conId}).then(function(result){
					if(result.code !== 0){
						return layer.alert(result.msg);
					}
					/*$ctrl.buyInfoContract.salesCompanyServiceChargeVo=result.data;*/
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.cusBrokerageReceivable=result.data.cusBrokerageReceivable;
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.cusBrokerageReceivable=result.data.cusBrokerageReceivable;
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.cusPerformanceReceivable=result.data.cusPerformanceReceivable;
					
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.ownPerformanceReceivable=result.data.ownPerformanceReceivable;
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.ownBrokerageReceivable=result.data.ownBrokerageReceivable;
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.ownTotalReceivable = result.data.ownBrokerageReceivable + result.data.ownPerformanceReceivable;
					$ctrl.buyInfoContract.salesCompanyServiceChargeVo.cusTotalReceivable = result.data.cusBrokerageReceivable+result.data.cusPerformanceReceivable
					console.log($ctrl.ownTotalReceivable);
					console.log($ctrl.cusTotalReceivable);
				});
			};
			draftDetailService.getBaseContract({'conId' :conId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				/*result='{"code":0,"data":{"auditStatus":"3","auditStatusValue":"签约中-折扣审核通过","belonguserName":"tom4","conId":68,"contCreateTime":"2017-06-07 14:27:33","contractCode":"E1706130001","contractStatus":"1","contractStatusValue":"签约中","contractType":"2","contractTypeValue":"买卖","currentUserId":533239,"customerCode":39423242,"housesCode":36822493,"inputUserId":20,"inputUserName":"tom4","perfContractNum":"L1706130001","rejectReason":"yunayin"},"msg":"success"}';
				result=$.parseJSON(result);*/
				$ctrl.detailC=result.data;
				$ctrl.detail = result.data;
				$ctrl.houseLink = signUtil.getHouseLInk($ctrl.detail.housesCode, 2);
	            $ctrl.customerLink = signUtil.getCustomerLink($ctrl.detail.customerCode,2);
	            if(result.data.currentUserId==result.data.inputUserId){
	            	$ctrl.currentUser=true;
	            }
	            companysId=result.data.companysId;
				console.log($ctrl.detail);
				contractno=$ctrl.detailC.contractCode;
				customerCode=$ctrl.detail.customerCode;
				
			});
			draftDetailService.getBuyInfoContract({'conId' :conId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				
				$ctrl.buyInfoContract = result.data;//$ctrl.salesCompanyServiceChargeVo.chargeObject
				$ctrl.buyInfoContractC=result.data;
				
				if($ctrl.buyInfoContract.salesCompanyServiceChargeVo.discountReason==undefined){
					$ctrl.discount_resc=false;
					$ctrl.discount_res=false;
				}
				if($ctrl.buyInfoContract.salesCompanyServiceChargeVo.chargeObject == 1){
					$ctrl.serveObj = [1,2];
				}else if($ctrl.buyInfoContract.salesCompanyServiceChargeVo.chargeObject == 2){
					$ctrl.serveObj = [2];
				}else if($ctrl.buyInfoContract.salesCompanyServiceChargeVo.chargeObject == 3){
					$ctrl.serveObj = [1]; //业主
				}
				if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject == 1){
					$ctrl.serveObjC = [1,2];
				}else if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject == 2){
					$ctrl.serveObjC = [2];
				}else if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject == 3){
					$ctrl.serveObjC = [1];
				}
				$ctrl.discount_reason=Number($ctrl.buyInfoContract.salesCompanyServiceChargeVo.discountReason);
				$ctrl.continuousOrder=$ctrl.buyInfoContract.salesNoPrintContractVo.continuousOrder;
				console.log($ctrl.buyInfoContract.salesNoPrintContractVo.houseCheckKey);
				var strings=$ctrl.buyInfoContract.salesNoPrintContractVo.houseCheckKey.split('');
				$ctrl.buildingCheckValue=[];
				for(var i=0;i<strings.length;i++){
					$ctrl.buildingCheckValue.push(Number(strings[i]));
				}
				console.log($ctrl.buildingCheckValue);
				res=result.data;
	/*			res=$ctrl.buyInfoContract;*/
				console.log($ctrl.buyInfoContract);
				
			});
		};
		 
		 $ctrl.init();
		 /**
         * 工作流按钮动作
         * @param item
         */
		$ctrl.workFlowAction = function (item) {
		/*
		 * 工作流按钮限制
		 */
		var tableArr=[];
		var stop =false;
		$("#J_annexdataTable tbody tr").each(function(){
			if($(this).find(".sign").length==1){
				commonContainer.alert('请签收附件后再做此操作');
				stop =true;
				 return false;
			}
		})
		if(stop){
			return false;
		}
		 
			
			
            var labelId = item.labelId, promise;
            var postData;
            var paramsData;
            if(pageType==1){
            	paramsData = {
                    modelName: 'BUY_CONTRACT',
                    methodName: labelId
                };
            	postData= {
                        taskId: taskId,
                        formId: formId,
                        isEnd: isEnd,
                        basePath: basePath,
                    };
            }else if(pageType==3){
            	paramsData = {
                        modelName: 'BUY_REPORTED_AUDIT',
                        methodName: labelId
                    };
                	postData= {
                            taskId: taskId,
                            formId: formId,
                            isEnd: isEnd,
                            basePath: basePath,
                        };
            }else if(pageType==4){
            	paramsData = {
                        modelName: 'BUT_CLINECH_DEAL',
                        methodName: labelId
                    };
                	postData= {
                            taskId: taskId,
                            formId: formId,
                            isEnd: isEnd,
                            basePath: basePath,
                            userType: userType
                        };
            }else if(pageType==2){
            	var approveTypeflag='';
            	var state=1;
            	enclosureIds='';
            	/*if($("input[name='btSelectItem']:checked").length==0){
            		layer.msg("请选择审批信息！");
					return false;
            	}
            	$("input[name='btSelectItem']:checked").each(function(){
            		approveTypeflag=$(this).next().attr('approvetype')
        			enclosureIds+=$(this).next().attr('enclosureId')+',';
        			var uploadState=$(this).next().attr('uploadState');
        			if(uploadState!=2){
        				layer.alert('所有必须选择已提交状态！');
        				state=0;
            			return;
        			}
        		})
        		if(state==0){
        			return false;
        		}*/
        		enclosureIds=enclosureIds.substring(0,enclosureIds.length - 1);
            	paramsData = {
                        modelName: 'ENCLOSURE_CONTRACT',
                        methodName: labelId
                    };
            	postData= {
                        taskId: taskId,
                        formId: formId,
                        isEnd: isEnd,
                        basePath: basePath,
                        enclosureIds: enclosureIds,
                        approveType:approveTypeflag,
                        userType:userType,
                        contractType:2
                    };
            }
            
            commonContainer.showLoading();

            if (labelId === 'toPass' && !isEnd) {// 流程通过到下一步
            	var parmName;
            	if(pageType==1){
            		parmName = {
                        modelName: 'BUY_CONTRACT',
                        methodName: "findUserOnTask"
                    };
            	}else if(pageType==3){
            		parmName = {
                            modelName: 'BUY_REPORTED_AUDIT',
                            methodName: "findUserOnTask"
                        };
            	}else if(pageType==4){
            		parmName = {
                            modelName: 'BUT_CLINECH_DEAL',
                            methodName: "findUserOnTask"
                        };
                }else if(pageType==2){
                	parmName = {
                            modelName: 'ENCLOSURE_CONTRACT',
                            methodName: "findUserOnTask"
                        };
                }
                promise = draftDetailService.workFlowDoJob(postData, parmName).then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    var list = result.data || [];
                    var first = list[0] || {};
                    return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                }).then(function (userId) {
                    commonContainer.showLoading();
                    postData['nextUser'] = userId;// 这里指定下一个处理人
                    return draftDetailService.workFlowDoJob(postData, paramsData);
                });
            } else if(labelId === 'toReject'){// 其他流程
            	if(pageType==1||pageType==3||pageType==4){
            		var defer = $q.defer();
                	promise = defer.promise;
                	
                	commonContainer.modal('驳回原因', $('#con_reasons_rejection_layer'), function btn1(index, layero){
    					var rejectType =$("#creasonsRrejection").val(); 
    					var rejectReason =$("#cmemo").val().trim();
    					if(rejectType==''){
    						layer.msg("请填写驳回原因");
    						return false;
    					}
    					if(rejectType==3){
    						if(rejectReason==''){
    							layer.msg("请填写驳回原因备注");
        						return false;
    						}
    					}
    					/*postData.rejectType=rejectType;*/
    					postData.comment=rejectType+':'+rejectReason;
    					/*postData.rejectReason=rejectReason;*/
    	                draftDetailService.workFlowDoJob(postData, paramsData).then(function(result){
    	                	defer.resolve(result);
    	                } , function(error){
    	                	defer.reject(error);
    	                });
    				},{
    					overflow:true,
    					area: ['1000px','80%'],
    					btns: ['确认','取消'],
    					btn2 : function(){
    						defer.reject();
    					},
    					cancel : function(){
    						defer.reject();
    					},
    					success:function(){	
    					}
    				});
                }else if(pageType==2){
                	var defer = $q.defer();
                	promise = defer.promise;
                	
                	commonContainer.modal('驳回原因', $('#reasons_rejection_layer'), function(index, layero){
    					var rejectType =$("#reasonsRrejection").val(); 
    					var rejectReason =$("#memo").val();
    					if(rejectType==''){
    						layer.msg("请填写驳回原因");
    						return false;
    					}
    					postData.rejectType=rejectType;
    					postData.rejectReason=rejectReason;
    	                draftDetailService.workFlowDoJob(postData, paramsData).then(function(result){
    	                	defer.resolve(result);
    	                } , function(error){
    	                	defer.reject(error);
    	                });
    				},{
    					overflow:true,
    					area: ['1000px','80%'],
    					btns: ['确认','取消'],
    					btn2 : function(){
    						defer.reject();
    					},
    					cancel : function(){
    						defer.reject();
    					},
    					success:function(){	
    					}
    				});
                }
            	
            } else {// 其他流程
                promise = draftDetailService.workFlowDoJob(postData, paramsData);
            }

            promise.then(function (result) {
                commonContainer.hideLoading();
                if (result.code !== 0) {
                    throw layer.alert(result.msg);
                }
                var MSG = {
            		 'toPass-true': '审批完成',
                     'toPass': '已提交审批',
                    'toJumpFirstNode': '驳回起草人成功',
                    'any': '操作完成'
                };
                //layer.alert(MSG[labelId] || MSG.any, {cancel: closeBack}, closeBack);
                layer.alert(MSG[labelId + '-' + String(isEnd)] || MSG[labelId] || MSG.any, {cancel: closeBack}, closeBack);
            }).catch(function () {
                commonContainer.hideLoading();
            });

            function closeBack() {// 回到上一步
                history.back();
            }
        };
        //交易接口设置一表一书
        $ctrl.setYibiaoyishu=function(){
        	draftDetailService.setYibiaoyishuquery({'conId':conId}).then(function(result){
        		if(result.resultCode==1){
        			window.open('/tms/addition/toPrintEdit.htm?contractno='+contractno);
        		}else{
        			layer.alert(result.comment);
        		}
        		
        	})
        };
      
        //报成交
        $ctrl.submitClinchDeal = function(){
        	commonContainer.showLoading();
            draftDetailService.workFlowDoJob({formId: formId}, {
                modelName: 'BUT_CLINECH_DEAL',
                methodName: 'findUserOnStart'
            })
                .then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    return result.data || [];
                })
                .then(function (list) {
                    commonContainer.hideLoading();
                    var first = list[0] || {};
                    return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                })
                .then(function (nextUser) {
                    commonContainer.showLoading();
                    return draftDetailService.workFlowDoJob({formId: formId, nextUser: nextUser}, {
                        modelName: 'BUT_CLINECH_DEAL',
                        methodName: 'createWorkflow'
                    });
                })
                .then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    return draftDetailService.callOutInterface(conId);
                   
                }).then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    layer.alert('已报成交', {cancel: close}, close);

                    function close() {
                        location.reload(true);
                    }
                })
                .catch(function () {
                    commonContainer.hideLoading();
                });
        }
        $ctrl.preview = function () {
        	signUtil.openLayer('signBuyPreviewLayer', conId, '买卖合同预览');
        };
	
       
      //作废
        $ctrl.submitInvalid = function(){
        	commonContainer.confirm(
        			'确定作废此合同？',
        			function(index, layero){
        				draftDetailService.getInvalid(conId);
        				/*location.href = basePath + 'signthecontract/draftlist.htm';//买卖合同列表页
*/     
        				window.location.reload();
        			}
        		);
        }
      //取消作废
        $ctrl.submitCancellations = function(){
        	commonContainer.confirm(
        			'确定取消作废此合同？',
        			function(index, layero){
        				draftDetailService.getCancellations(conId);
        				/*location.href = basePath + 'signthecontract/draftlist.htm';//买卖合同列表页*/
        				 window.location.reload();
        			}
        		);
        }
        // 提交打印审核（触发工作流）
        $ctrl.flowUsers = function () {
        	console.log($ctrl.buyInfoContractC.salesTradeBothSidesInfoVo.entrustedTransfer);
        	if($ctrl.buyInfoContractC.salesTradeBothSidesInfoVo.entrustedTransfer==0){
        		//客户
           	 if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject==2&&$ctrl.buyInfoContractC.salesCompanyServiceChargeVo.cusBrokerageReceived==0){
                	layer.alert('居间佣金为0，请输入正确佣金金额！', {
                		  icon: 2,
                		  end:function(){
                			  location.href= "#company-service";
                		  }
                		})
                		return false;
                }
           	 //业主
           	 if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject==3&&$ctrl.buyInfoContractC.salesCompanyServiceChargeVo.ownBrokerageReceived==0){
                 	layer.alert('居间佣金为0，请输入正确佣金金额！', {
                 		  icon: 2,
                 		  end:function(){
                 			 location.href = "#company-service";
                 		  }
                 		})
                 		return false;
                 }
           	 //客户和业主
           	 if($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObject==1&&($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.ownBrokerageReceived==0||$ctrl.buyInfoContractC.salesCompanyServiceChargeVo.cusBrokerageReceived==0)){
                 	layer.alert('居间佣金为0，请输入正确佣金金额！', {
                 		  icon: 2,
                 		  end:function(){
                 			 location.href = "#company-service";
                 		  }
                 		})
                 		return false;
                 }
        	}
            commonContainer.showLoading();
            console.log($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.chargeObjectValue)
            console.log($ctrl.buyInfoContractC.salesCompanyServiceChargeVo.ownBrokerageReceived)
            draftDetailService.workFlowDoJob({formId: formId}, {
                modelName: 'BUY_CONTRACT',
                methodName: 'findUserOnStart'
            })
                .then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    return result.data || [];
                })
                .then(function (list) {
                    commonContainer.hideLoading();
                    var first = list[0] || {};
                    return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                })
                .then(function (nextUser) {
                    commonContainer.showLoading();
                    return draftDetailService.workFlowDoJob({formId: formId, nextUser: nextUser}, {
                        modelName: 'BUY_CONTRACT',
                        methodName: 'createWorkflow'
                    });
                })
                .then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    layer.alert('已提交审批', {cancel: close}, close);

                    function close() {
                        //location.href = basePath + '/sign/signthecontract/draftlist';
                    	window.location.reload();
                    }
                })
                .catch(function () {
                    commonContainer.hideLoading();
                });
        };
     // 提交报备（触发工作流）
        $ctrl.flowUsersReport = function () {
            commonContainer.showLoading();
            draftDetailService.workFlowDoJob({formId: formId}, {
                modelName: 'BUY_REPORTED_AUDIT',
                methodName: 'findUserOnStart'
            })
                .then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    return result.data || [];
                })
                .then(function (list) {
                    commonContainer.hideLoading();
                    var first = list[0] || {};
                    return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                })
                .then(function (nextUser) {
                    commonContainer.showLoading();
                    return draftDetailService.workFlowDoJob({formId: formId, nextUser: nextUser}, {
                        modelName: 'BUY_REPORTED_AUDIT',
                        methodName: 'createWorkflow'
                    });
                })
                .then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    layer.alert('已提交审批', {cancel: close}, close);

                    function close() {
                        //location.href = basePath + '/sign/signthecontract/draftlist';
                    	window.location.reload();
                    }
                })
                .catch(function () {
                    commonContainer.hideLoading();
                });
        };
     // 附件管理提交审核（触发工作流）
        $ctrl.audit = function () {   
        	var approveTypeflag='';
    		if($("input[name='btSelectItem']:checked").length==0){
    			layer.msg("请选择");
    			return;
    		}
    		var approveTypeArr=[];
    		var state=1;
    		
    		var approve=1;
    		$("input[name='btSelectItem']:checked").each(function(){
    			approveTypetem=$(this).next().attr('approveType');
    			if(approveTypetem!=approveTypeflag&&approveTypeflag!=''){
    				approve=0;
    				return;
    			}
    			approveTypeflag=approveTypetem;
    			approveTypeArr.push(approveTypeflag);
    			enclosureIds+=$(this).next().attr('enclosureId')+',';
    			var uploadState=$(this).next().attr('uploadState');
    			if(uploadState!=1){
    				layer.alert('必须是上传状态才可提交审核！');
    				state=0;
        			return;
    			}
    		})
    		if(state==0){
    			return false;
    		}
    		enclosureIds=enclosureIds.substring(0,enclosureIds.length - 1)
    		if(approve==0){
    			layer.alert('请选择审核角色为一致的附件进行提交审核!');
    			return;
    		}
    		 /*var promise;
             var postData = {
                 taskId: taskId,
                 formId: formId,
                 isEnd: isEnd,
                 basePath: basePath,
                 enclosureIds: enclosureIds,
                 approveType:approveType
             };*/
            commonContainer.showLoading();
            draftDetailService.workFlowDoJob({formId: formId,enclosureIds: enclosureIds,approveType:approveTypeflag}, {
                modelName: 'ENCLOSURE_CONTRACT',
                methodName: 'findUserOnStart'
            })
                .then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    return result.data || [];
                })
                .then(function (list) {
                    commonContainer.hideLoading();
                    var first = list[0] || {};
                    return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                })
                .then(function (nextUser) {
                    commonContainer.showLoading();
                    return draftDetailService.workFlowDoJob({formId: formId,enclosureIds: enclosureIds,approveType:approveTypeflag, nextUser: nextUser,contractType:2}, {
                        modelName: 'ENCLOSURE_CONTRACT',
                        methodName: 'createWorkflow'
                    });
                })
                .then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    layer.alert('已提交审批', {cancel: close}, close);

                    function close() {
                        // location.href = basePath + '/sign/signthecontract/draftlist';
                        location.href = location.pathname + location.search + '&attachment=1';// 刷新当前页，并且保持附件面板显示
                    }
                })
                .catch(function () {
                    commonContainer.hideLoading();
                });
        };
		$ctrl.getBrokerageDiscount = function(start , end){
			if(!start){
				return 0;
			}
			return (start / end*10).toFixed(2);
		}
		$ctrl.getPlus=function(start , end){
			if(start===""||end===""){
				return 0;
			}
			return Number(start) + Number(end);
		};
		// 统一获取所有的keyCode 列表，并且绑定到 $ctrl
		[
		 'buildingCheck',// 房屋校验
		 'clientType',// 服务费收取对象
		 'discountReason', // 打折原因
		 'cardType',//证件类型
		].forEach(function(keyCode){
			signService.getTypes(keyCode).then(function(result){
				$ctrl[keyCode] = result.data;	
			});
		});
		/*var detailflag=0;
		var agentflag=0;
		var basicflag=0;
		var ownershipflag=0;
		var capitalflag=0;
		var serviceChargeflag=0;
		var unpritableflag=0;*/
		// 开始编辑
        $ctrl.startEdit = function (editType) {
           var id=editType;
           if(id=='detail'){
        	   	$ctrl.detail= $.extend(true , {} , $ctrl.detailC) ;
				$ctrl.edit=2;
				searchContainer.searchUserListByComp($("#belonguserid"), true, 'left');// 所属人自动补全查询
				detailflag=1;
			}else if(id=='agent'){
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				cardIdToNum($ctrl.buyInfoContract.salesTradeBothSidesInfoVo.ownerList);//业主信息（甲方）下拉框编辑的时候赋值
				cardIdToNum($ctrl.buyInfoContract.salesTradeBothSidesInfoVo.ownerCommonList);//业主共有人（甲方）下拉框编辑的时候赋值
				cardIdToNum($ctrl.buyInfoContract.salesTradeBothSidesInfoVo.clientList);//客户信息（甲方）下拉框编辑的时候赋值
				cardIdToNum($ctrl.buyInfoContract.salesTradeBothSidesInfoVo.clientCommonList);//客户共有人信息（甲方）下拉框编辑的时候赋值
				$ctrl.agent=2;//为什么不是立刻唤起
				/*$(document).scope().$apply();*/
				setTimeout(function(){
					dimContainer.buildDimRadio($("#entrustedTransfer"), "entrustedTransfer", "yesOrNo",
						res.salesTradeBothSidesInfoVo.entrustedTransfer);// 单独委托过户
					dimContainer.buildDimRadio($("#ownerType"), "ownerType", "ownerType", 
							res.salesTradeBothSidesInfoVo.ownerType);// 业主类型
					dimContainer.buildDimRadio($("#firstPurchase"), "firstPurchase", "yesOrNo",
							res.salesTradeBothSidesInfoVo.firstPurchase);// 是否首次购房
					/*dimContainer.buildDimChosenSelector($(".J_cardType"), "cardType",
							'');*/
				});
			}else if(id=='basic'){
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				$ctrl.basic=2;
				setTimeout(function(){
					var designUsesId=res.salesHouseBaseInfoVo.designUsesId;
					new linkageContainer.regionSelector($("#housingDistrictId"),$("#housingTownId"), 
							res.salesHouseBaseInfoVo.housingDistrictId,
							res.salesHouseBaseInfoVo.housingTownId);
					dimContainer.buildDimRadio($("#housingType"), "housingType",
							"houseingType", res.salesHouseBaseInfoVo.housingType);// 房屋类型
					dimContainer.buildDimRadio($("#restrictedPurchase"), "restrictedPurchase",
							"yesOrNo", res.salesHouseBaseInfoVo.restrictedPurchase);// 限购房产
					dimContainer.buildDimRadio($("#ownerOnlyHousing"), "ownerOnlyHousing",
							"yesOrNo", res.salesHouseBaseInfoVo.ownerOnlyHousing);// 业主唯一住房
					dimContainer.buildDimRadio($("#fullFiveYears"), "fullFiveYears", 
							"yesOrNo",res.salesHouseBaseInfoVo.fullFiveYears);// 是否满五年
					if(res.salesHouseBaseInfoVo.fullFiveYears==0){
						$('#fullFiveGist').prop('disabled','disabled');
						$("select").trigger("chosen:updated");
						dimContainer.buildDimChosenSelector($("#fullFiveGist"), "fullfiveGist", 
								'');// 满五年依据
					}else{
					dimContainer.buildDimChosenSelector($("#fullFiveGist"), "fullfiveGist", 
							res.salesHouseBaseInfoVo.fullFiveGist);// 满五年依据
					}
					dimContainer.buildDimChosenSelector($("#designUsesId"), "plannedUses",
							designUsesId.toString());// 房屋设计用途
					dimContainer.buildDimRadio($("#carPort"), "carPort", "yesOrNo", 
							res.salesHouseBaseInfoVo.carPort);// 是否带车位	
					
				})
			}else if(id=='ownership'){
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				$ctrl.ownership=2;
				var useingMode=res.salesHouseCertificateVo.useingMode;
				setTimeout(function(){
					/*dimContainer.buildDimChosenSelector($("#useingMode"), "useingMode",
							"useingMode",useingMode);*/// 房屋性质
					dimContainer.buildDimChosenSelector($("#houseProperty"), "houseProperty",
							res.salesHouseCertificateVo.houseNature);// 房屋性质
					dimContainer.buildDimRadio($("#isHouseLease"), "isHouseLease",
							"houseLease", res.salesHouseCertificateVo.isHouseLease);// 是否房屋出租
					dimContainer.buildDimChosenSelector($("#useingMode"), "useingMode",
							useingMode.toString());// 土地使用权获得方式
					dimContainer.buildDimRadio($("#isLandCertificate"), "isLandCertificate",
							"yesOrNo", res.salesHouseCertificateVo.isLandCertificate);// 是否土地使用权证				
					dimContainer.buildDimRadio($("#houseCharge"), "isHouseCharge", "houseCharge",
							res.salesHouseCertificateVo.isHouseCharge);// 房屋抵押				
				})
			}else if(id=='intermediary'){
				$ctrl.intermediary=2;
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
			}else if(id=='capital'){
				
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				$ctrl.capital=2;
				setTimeout(function(){
					dimContainer.buildDimChosenSelector($("#deliveryConditions"), "deliveryConditions", 
							res.salesTradeFundTransferVo.depositType.toString());// 定金交付方式
					
					dimContainer.buildDimChosenSelector($("#payType"), "payTypeSign", 
							res.salesTradeFundTransferVo.payType.toString());// 付款方式
					
					dimContainer.buildDimChosenSelector($("#liabilityShift"), "liabilityShift",
							res.salesTradeFundTransferVo.liabilityShift.toString());// 风险责任转移日期
					dimContainer.buildDimChosenSelector($("#taxes"), "taxes", 
							res.salesTradeFundTransferVo.taxes.toString());// 税费承担方
					
					dimContainer.buildDimChosenSelector($("#taxPayingParty"), "taxPayingParty",
							res.salesTradeFundTransferVo.taxPayingParty.toString());// 增加新税费缴纳方
					
					if(res.salesTradeFundTransferVo.payType==1){
						dimContainer.buildDimChosenSelector($("#noBatchLoan"), "noBatchLoan", 
								'');
						$('#noBatchLoan').attr({
							'disabled' : 'disabled'
						});
						$('#loanAmount').attr({
							'readonly' : 'readonly'
						});
					}else{
						dimContainer.buildDimChosenSelector($("#noBatchLoan"), "noBatchLoan", 
								res.salesTradeFundTransferVo.noBatchLoan);// 未批贷款解决方式
						
					}
					$("#loanNum").val(res.salesTradeFundTransferVo.loanNum);
					$("#loanNum").trigger("chosen:updated");
					$("select").chosen({
						width : "100%" , 
						no_results_text: "未找到此选项!" 
					});
				})
			}else if(id=='serviceCharge'){
				$ctrl.getServiceChage();
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				$ctrl.serviceCharge=2;
				setTimeout(function(){
					var chargeObject=res.salesCompanyServiceChargeVo.chargeObject;
					if(chargeObject==1){
						dimContainer.buildDimCheckBox($("#chargeObject"), "chargeObject",
								"clientType", "1,2");// 服务费收取对象
					}else if(chargeObject==2){
						dimContainer.buildDimCheckBox($("#chargeObject"), "chargeObject",
								"clientType", "2");// 服务费收取对象 客户
					}else if(chargeObject==3){
						dimContainer.buildDimCheckBox($("#chargeObject"), "chargeObject",
								"clientType", "1");// 服务费收取对象 业主
					}
					searchContainer.searchUserListByComp($("#discountEmployeesId"), true, 'left');// 所属人自动补全查询
					/*dimContainer.buildDimChosenSelector($("#discountReason"), "discountReason", 
					res.salesCompanyServiceChargeVo.discountReason);// 打折原因
	*/			//var houseCheckKey=res.salesNoPrintContractVo.houseCheckKey;
					//var houseCheckKey='1,2';
					//dimContainer.buildDimCheckBox($("#buildingCheck"), "buildingCheck","buildingCheck",houseCheckKey);// 房屋校验
					

				})

			}else if(id=='unpritable'){
				
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC) ;
				$ctrl.unpritable=2;
				setTimeout(function(){
					/*dimContainer.buildDimRadio($("#continuousOrder"), "continuousOrder",
							"yesOrNo", res.salesNoPrintContractVo.continuousOrder);// 是否连环订单
	*/				dimContainer.buildDimRadio($("#mortgage"), "mortgage", "yesOrNo", 
							res.salesNoPrintContractVo.mortgage);// 是否按揭
					if(res.salesNoPrintContractVo.mortgagePayments){
						dimContainer.buildDimChosenSelector($("#mortgagePayments"),
								"mortgagePayments",res.salesNoPrintContractVo.mortgagePayments.toString());// 抵押还款人
					}else{
						dimContainer.buildDimChosenSelector($("#mortgagePayments"),
								"mortgagePayments",'');// 抵押还款人
					}
					if(res.salesNoPrintContractVo.integratedPayment){
						dimContainer.buildDimChosenSelector($("#integratedPayment"),
								"integratedPayment",res.salesNoPrintContractVo.integratedPayment.toString());// 综合地价款
					}else{
						dimContainer.buildDimChosenSelector($("#integratedPayment"),
								"integratedPayment",'');// 综合地价款
					}					
					dimContainer.buildDimRadio($("#valueAddedTax"), "valueAddedTax", "yesOrNo",
							res.salesNoPrintContractVo.valueAddedTax);// 是否增值税
					dimContainer.buildDimRadio($("#incomeTax"), "incomeTax", "yesOrNo",
							res.salesNoPrintContractVo.incomeTax);// 个人所得税
					if(res.salesNoPrintContractVo.buyHouseQualification){
						dimContainer.buildDimChosenSelector($("#buyHouseQualification"),
								"buyHouseQualification",res.salesNoPrintContractVo.buyHouseQualification.toString());// 购房资质							
					}else{
						dimContainer.buildDimChosenSelector($("#buyHouseQualification"),
								"buyHouseQualification",'');// 购房资质
					}
					if(res.salesNoPrintContractVo.sellersHouseReason){
						dimContainer.buildDimChosenSelector($("#sellersHouseReason"),
								"houseReason", res.salesNoPrintContractVo.sellersHouseReason.toString());// 售房原因	
					}else{
						dimContainer.buildDimChosenSelector($("#sellersHouseReason"),
								"houseReason", '');// 售房原因	
					}
					if(res.salesNoPrintContractVo.buyHouseReason){
						dimContainer.buildDimChosenSelector($("#buyHouseReason"), "buyReason",
								res.salesNoPrintContractVo.buyHouseReason.toString());// 买房原因	
					}else{
						dimContainer.buildDimChosenSelector($("#buyHouseReason"), "buyReason",
								'');// 买房原因	
					}				
					searchContainer.searchUserListByComp($("#trackingPeople"), true, 'left');// 跟单人					
					searchContainer.searchUserListByComp($("#financialRisk"), true, 'left');// 金融风险师
					searchContainer.searchManagerListByComp($("#areaContractor"), true, 'left');// 大区助理
					searchContainer.searchStoreManagerListByComp($("#storeManager"), true, 'left');// 大区助理
					searchContainer.searchShopAssistantListByComp($("#storeContractor"), true, 'left');// 店面助理
					$("#areaContractor").attr({"data-id":res.salesNoPrintContractVo.areaContractor});
					$("#storeManager").attr({"data-id":res.salesNoPrintContractVo.storeManager});
					$("#storeContractor").attr({"data-id":res.salesNoPrintContractVo.storeContractor});
					if(res.salesNoPrintContractVo.collectingDeposit){
						dimContainer.buildDimRadio($("#collectingDeposit"), "collectingDeposit",
								"yesOrNo", res.salesNoPrintContractVo.collectingDeposit.toString());// 业主代理人代收定金及房款	
					}else{
						dimContainer.buildDimRadio($("#collectingDeposit"), "collectingDeposit",
								"yesOrNo", '');// 业主代理人代收定金及房款	
					}
					if(res.salesNoPrintContractVo.entrustNotarialDeed){
						dimContainer.buildDimRadio($("#entrustNotarialDeed"), "entrustNotarialDeed",
								"yesOrNo", res.salesNoPrintContractVo.entrustNotarialDeed.toString());// 委托公证书	
					}else{
						dimContainer.buildDimRadio($("#entrustNotarialDeed"), "entrustNotarialDeed",
								"yesOrNo", '');// 委托公证书	
					}
					if(res.salesNoPrintContractVo.principalCollectiongDeposit){
						dimContainer.buildDimRadio($("#principalCollectiongDeposit"), "principalCollectiongDeposit",
								"yesOrNo", res.salesNoPrintContractVo.principalCollectiongDeposit.toString());// 委托公证书是否注明委托人代收定金或房款	
					}else{
						dimContainer.buildDimRadio($("#principalCollectiongDeposit"), "principalCollectiongDeposit",
								"yesOrNo", '');
					}
					
					$.when(
							searchContainer.searchUserListByComp($("#trackingPeople"), true, 'left')// 所属人自动补全查询
							).then(function(){
								$.ajax({
									url : basePath + '/custom/common/getcuruserinfo',
									type : 'get',
									dataType : 'json',
									cache : false,
									success : function(result) {	
										userid=result.data.userId;
										$("#trackingPeople").val(result.data.userName);
										$("#trackingPeople").attr({"data-id":result.data.userId});
										$("#spoorerAreaId").val(result.data.shopArea.deptName);
										$("#spoorerAreaId").attr({"data-id":result.data.shopArea.deptId});
										$("#spoorerGroupId").val(result.data.shopGroup.deptName);
										$("#spoorerGroupId").attr({"data-id":result.data.shopGroup.deptId});
										$("#spoorerId").val(result.data.shop.deptName);
										$("#spoorerId").attr({"data-id":result.data.shop.deptId});
									}
								});
							})
					
				})
			}else if(id=="houseDelivery"){
				$ctrl.buyInfoContract= $.extend(true , {} , $ctrl.buyInfoContractC);
				$ctrl.houseDelivery=2;
			}
        };
        
        function cardIdToNum(list){
        	(list || []).forEach(function(item){
        		item.idcardType = +item.idcardType;
        	});
        }
        
        $ctrl.aa=function(saveEdit){
        	var id=saveEdit;
        	if(id=='detail'){
				var validate = true;
				if (!detailValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				if($("#belonguserid").attr('data-id')&&$("#belonguserid").attr('data-id')==''){
					commonContainer.alert("合同所属人不存在！");
					return;
				}
				$ctrl.detailbtn=false;
				val = {};
				//val = $("#form1").serializeJson();
				val.conId=conId;
				val.belonguserid=$('#belonguserid').attr('data-id');
				val.operationMark=1;
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.detailbtn=true;
						layer.alert(result.msg);
					}else{		
						jsonPostAjax(basePath + '/sign/contractSales/saveSalesTwoSidesInformation', val, function(result) {
							$ctrl.detailbtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
						},{
							errorCallBack:function(){
								$ctrl.detailbtn=true;
								layer.alert(errorMsg);
							}
						});
					}
				})
			}else if(id=='agent'){
				var validate = true;
				if (!agentValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				$ctrl.agentbtn=false;
				/*that.attr({"disabled":"disabled"});*/
				val = {};
				val.conId=conId;
				val.entrustedTransfer =$('input[name="entrustedTransfer"]:checked').val(); 
				val.ownerType =$('input[name="ownerType"]:checked').val();
				val.firstPurchase=$('input[name="firstPurchase"]:checked').val();
				var contractUserList =[];
				$("#dataTableBuy tbody tr").each(function(){
					if($(this).find('input[name="name"]').val()){
						var obj={};
						obj.proxyType=1;
						obj.fullname =$(this).find('input[name="name"]').val();
						obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
						obj.idcardNo =$(this).find('input[name="idcardNum"]').val();
						obj.addr =$(this).find('input[name="adress"]').val();
						obj.phoneNumber =$(this).find('input[name="phone"]').val();
						contractUserList.push(obj);
					}
				})
				
				$("#dataTableBuyAll tbody tr").each(function(){
					if($(this).find('input[name="name"]').val()){
					var obj={};
					obj.proxyType=2;
					obj.fullname =$(this).find('input[name="name"]').val();
					obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
					obj.idcardNo =$(this).find('input[name="idcardNum"]').val();
					obj.jointOwnershipNum =$(this).find('input[name="warrantNumber"]').val();
					obj.phoneNumber =$(this).find('input[name="phone"]').val();
					contractUserList.push(obj);
					}
				})
				$("#dataTableownerAgent tbody tr").each(function(){
					if($(this).find('td').eq(0).text()){
					var obj={};
					obj.proxyType=3;
					obj.fullname =$(this).find('td').eq(0).text();
					obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
					obj.idcardNo =$(this).find('td').eq(2).text();
					obj.phoneNumber =$(this).find('td').eq(3).text();
					contractUserList.push(obj);
					}
				})
				$("#dataTableClient tbody tr").each(function(){
					if($(this).find('input[name="name"]').val()){
					var obj={};
					obj.proxyType=4;
					obj.fullname =$(this).find('input[name="name"]').val();
					obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
					obj.idcardNo =$(this).find('input[name="idcardNum"]').val();
					obj.addr =$(this).find('input[name="adress"]').val();
					obj.phoneNumber =$(this).find('input[name="phone"]').val();
					contractUserList.push(obj);
					}
				})
				$("#dataTableClientAll tbody tr").each(function(){
					if($(this).find('input[name="name"]').val()){
					var obj={};
					obj.proxyType=5;
					obj.fullname =$(this).find('input[name="name"]').val();
					obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
					obj.idcardNo =$(this).find('input[name="idcardNum"]').val();
					obj.phoneNumber =$(this).find('input[name="phone"]').val();
					contractUserList.push(obj);
					}
				})
				$("#dataTableFloor tbody tr").each(function(){
					if($(this).find('td').eq(0).text()){
					var obj={};
					obj.proxyType=6;
					obj.fullname =$(this).find('td').eq(0).text();
					obj.idcardTypeCd =$(this).find('td').eq(1).attr('attr');
					obj.idcardNo =$(this).find('td').eq(2).text();
					obj.phoneNumber =$(this).find('td').eq(3).text();
					contractUserList.push(obj);
					}
				})
				val.contractUserList=contractUserList;
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus',  {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.agentbtn=true;
						layer.alert(result.msg);
					}else{		
						jsonPostAjax(basePath + '/sign/contractSales/saveSalesTwoSidesInformation', val, function(result) {
							$ctrl.agentbtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
						},{
							errorCallBack:function(){
								$ctrl.agentbtn=true;
								layer.alert(errorMsg);
							}
						});
					}
				})
			}else if(id=='basic'){
				var validate = true;
				if (!basicValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				$ctrl.basicbtn=false;
				val = {};
				val = $("#basic_form").serializeJson();
				val.conId=conId;
				val.housingDistrictName =$(
				"#housingDistrictId option:selected")
				.text()
				val.housingTownName =$(
				"#housingTownId option:selected")
				.text()
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus',  {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.basicbtn=true;
						layer.alert(result.msg);
					}else{
						jsonPostAjax(basePath + '/sign/contractSales/saveHouseOwnershipInformation', val, function(result) {
							$ctrl.basicbtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
						},{
							errorCallBack:function(){
								$ctrl.basicbtn=true;
								layer.alert(errorMsg);
							}
						});
					}
				})
			}else if(id=='ownership'){	
				var validate = true;
				if (!ownershipValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				if ($('input[name="isHouseCharge"]:checked').val() == 2) {
					if ($('#dataTableMortgage tbody tr').length == 0) {
						commonContainer.alert("房屋抵押为已设定，请新增抵押人信息！");
						return;
					}
					if($('#dataTableMortgage tbody tr').length >2){
						commonContainer.alert("抵押权人不得多于两条！");
						return;
					}
				}
				$ctrl.ownershipbtn=false;
				val = {};
				val = $("#ownership_form").serializeJson();
				val.conId=conId;
				var mortgageList =[];
				if ($('input[name="isHouseCharge"]:checked').val() == 2) {
					$('#dataTableMortgage tbody tr').each(function(){
						var obj={};
						obj.mortgageName =$(this).find('td').eq(0).text();
						obj.pawnamount =$(this).find('td').eq(1).text();
						obj.cancellationConditions =$(this).find('td').eq(2).text();
						obj.transactDate =$(this).find('td').eq(3).text();
						obj.memo =$(this).find('td').eq(4).text();
						mortgageList.push(obj);				
					})
					val.mortgageList=mortgageList;
				}
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus',  {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.ownershipbtn=true;
						layer.alert(result.msg);
					}else{
						jsonPostAjax(basePath + '/sign/contractSales/saveHouseOwnershipInformation', val, function(result) {
							$ctrl.ownershipbtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
						},{
							errorCallBack:function(){
								$ctrl.ownershipbtn=true;
								layer.alert(errorMsg);
							}
						});
					}
				})
			}else if(id=='intermediary'){
				var validate = true;
				if (!intermediaryValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				
				$ctrl.intermediarybtn=false;
				val = {};
				val = $("#intermediary_form").serializeJson();
				val.conId=conId;
				val.operationMark=1;
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.intermediarybtn=true;
						layer.alert(result.msg);
					}else{				
						jsonPostAjax(basePath + '/sign/contractSales/saveServiceChage', val, function(result) {
							$ctrl.intermediarybtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
							
						})
					}
				})
			}else if(id=='capital'){
				var validate = true;
				if (!capitalValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				var compensationPrice_val=$("#compensationPrice").val();
				if(compensationPrice_val!=''){
					if((Number(compensationPrice_val)+Number($("#mainPrice").val()))!=Number($("#transactionPrice").val())){
						commonContainer.alert("成交价应为主体价和装修补偿价的和！");
						return;
					}
				}else{
					var transactionPrice=$("#transactionPrice").val();
					if(transactionPrice==''){
						transactionPrice=0;
					}
					if(Number($("#mainPrice").val())!=Number(transactionPrice)){
						commonContainer.alert("成交价应为主体价和装修补偿价的和！");
						return;
					}
				}
				$ctrl.capitalbtn=false;
				val = {};
				val = $("#capital_form").serializeJson();
				val.conId=conId;
				var paymentMethod=[];
				$('.dataTableMoney').each(function(){
					var obj={};
					obj.paymentMode =$('select[name="payType"]').val();
					obj.paymentClause =$(this).find('tbody tr').eq(0).find('td').eq(1).find('select').val();
					obj.condition =$(this).find('tbody tr').eq(0).find('td').eq(2).find('.condition').val();
					obj.paymenAmount =$(this).find('tbody tr').eq(0).find('td').eq(3).find('.J_priceCover').val();
					obj.transferWay =$(this).find('tbody tr').eq(0).find('td').eq(4).find('select').val();
					obj.memo =$(this).find('tbody tr').eq(0).find('td').eq(5).find('.memo').val();
					paymentMethod.push(obj);				
				})
				val.paymentMethod=paymentMethod;
				delete val.paymentClause;
				delete val.paymenAmount;
				delete val.transferWay;
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.capitalbtn=true;
						layer.alert(result.msg);
					}else{				
						jsonPostAjax(basePath + '/sign/contractSales/savePaymentMethod', val, function(result) {
							$ctrl.capitalbtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
							
						})
					}
				})
			}else if(id=='serviceCharge'){
				var validate = true;
				if (!serviceChargeValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				
				$ctrl.serviceChargebtn=false;
				var val={};
				val = $("#serviceCharge_form").serializeJson();
				val.conId=conId;
				val.discountEmployeesId=$("input[name='discountEmployeesId']").attr('data-id');
				var chargeObject=val.chargeObject;
				if(chargeObject.toString().indexOf(1)>-1&&chargeObject.toString().indexOf(2)>-1){
					val.chargeObject=1;
				}else if(chargeObject.indexOf(2)>-1){
					val.chargeObject=2;
				}else if(chargeObject.indexOf(1)>-1){
					val.chargeObject=3;
				}
				if(val.discountReason!=undefined){
					val.discountReason=val.discountReason.substring(7);
				}
									
				var buildingCheck='';
				if(val.buildingCheck!=undefined){
					for(var i=0;i<val.buildingCheck.length;i++){
						buildingCheck+="##"+ val.buildingCheck[i];
					}
					val.houseCheck=buildingCheck+"##";
				}else{
					val.houseCheck=buildingCheck;
				}
				delete val.buildingCheck;
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.serviceChargebtn=true;
						layer.alert(result.msg);
					}else{				
						jsonPostAjax(basePath + '/sign/contractSales/saveServiceChage', val, function(result) {
							$ctrl.serviceChargebtn=true;
							commonContainer.alert("操作成功！");
							window.location.reload();
							
						})
					}
				})
			}else if(id=='unpritable'){
				var validate = true;
				if (!unpritableValidate()) {
					console.log("校验失败");
					commonContainer.alert("存在不符合规则的数据！");
					return;
				}
				$ctrl.unpritablebtn=false;
				val = {};
				val = $("#unpritable_form").serializeJson();
				val.conId=conId;
				val.dealAreaId=$("#dealAreaId").attr("data-id");
				val.dealGroupId=$("#dealGroupId").attr("data-id");
				val.dealShopId=$("#dealShopId").attr("data-id");
				val.spoorerAreaId=$("#spoorerAreaId").attr("data-id");
				val.spoorerGroupId=$("#spoorerGroupId").attr("data-id");
				val.spoorerId=$("#spoorerId").attr("data-id");
				if($("#trackingPeople").attr("data-id")!='undefined'){
					val.trackingPeople=$("#trackingPeople").attr("data-id");
				}else{
					val.trackingPeople='';
				}
				if($("#financialRisk").attr("data-id")!='undefined'){
					val.financialRisk=$("#financialRisk").attr("data-id");
				}else{
					val.financialRisk='';
				}
				if($("#areaContractor").attr("data-id")!='undefined'){
					val.areaContractor=$("#areaContractor").attr("data-id");
				}else{
					val.areaContractor='';
				}
				if($("#storeManager").attr("data-id")!='undefined'){
					val.storeManager=$("#storeManager").attr("data-id");
				}else{
					val.storeManager='';
				}
				if($("#storeContractor").attr("data-id")!='undefined'){
					val.storeContractor=$("#storeContractor").attr("data-id");
				}else{
					val.storeContractor='';
				}
				val.operationMark=1;
				console.log(JSON.stringify(val));
				jsonGetAjax(basePath + '/sign/contractSales/getContractTransactionStatus', {"contractId":conId}, function(result) {
					if(result.data==-1){
						$ctrl.unpritablebtn=true;
						layer.alert(result.msg);
					}else{	
						jsonPostAjax(basePath + '/sign/contractSales/saveNotPriont', val, function(result) {
							commonContainer.alert("操作成功！");
							window.location.reload();
						});
					}
				})
			}
        };
        $ctrl.saveEdit = function (saveEdit) {
        	 
        	 if($ctrl.Status.auditStatus==6){
        		 commonContainer.confirm("修改后需要重新提交折扣以及报备审核",function(index, layero){
        			 $ctrl.aa(saveEdit) 
        		 })
        	 }else{
        		 $ctrl.aa(saveEdit)
        	 } 
        };
        $ctrl.cancelEdit =function (cancelEdit) {
        	 var id=cancelEdit;
        	if(id=='detail'){
				$ctrl.edit=1;
				$ctrl.detail=$ctrl.detailC;
			}else if(id=='agent'){
				$ctrl.agent=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}else if(id=='basic'){
				$ctrl.basic=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}else if(id=='ownership'){
				$ctrl.ownership=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}else if(id=='intermediary'){
				$ctrl.intermediary=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}else if(id=='capital'){
				$ctrl.capital=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}else if(id=='serviceCharge'){
				$ctrl.serviceCharge=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
				$ctrl.serveObj=$ctrl.serveObjC;
			}else if(id=='unpritable'){
				$ctrl.unpritable=1;
				$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
			}
        }
		$(document).delegate('a', 'click', function(event) {
			var _this = this;
			if (_this.type == 'edit') {
				
				$(_this).next().show();
				$(_this).hide();
				var id=$(_this).closest('.customer_info_content').find('.edit').attr("id");
				/*$("#"+id+"_layer").show();
				$("#"+id).before($("#"+id+"_layer"));
				$("#"+id).hide();*/
				
			}else if(_this.type == 'save'||_this.type == 'cancel'){	
				var that=$(this);
				
				if(_this.type == 'save'){
					var id=$(_this).closest('.customer_info_content').find('.editlayer').attr("idlayer");
					
				}else if(_this.type == 'cancel'){
					var id=$(_this).closest('.customer_info_content').find('.editlayer').attr("idlayer");
					if(id=='detail'){
						$ctrl.edit=1;
						$ctrl.detail=$ctrl.detailC;
					}else if(id=='agent'){
						$ctrl.agent=1;
						$ctrl.buyInfoContract=$ctrl.buyInfoContractC;
					}
					
					
					$(_this).parent('.btn-operation').prev().show();
					$(_this).parent('.btn-operation').hide();
					
					$("#"+id+"_layer").hide();
					$("#"+id).show();
				}
				
			}
			$(document).scope().$apply();
		})
	}])
	
	.service('draftDetailService' , ['$http' , function($http){
		//报成交之后回调
		 this.callOutInterface = function (conId) {
	            return $http.get(basePath + '/sign/contractSales/callOutInterface' , {params : {conId : conId}}).then(function (response) {
	                return response.data;
	            });
	       };
		this.getcontractApproval=function (conId) {
            return $http.get(basePath + '/sign/contractSales/ContractApprovalAllHistory' , {params : {conId : conId,viewType :0}}).then(function (response) {
                return response.data;
            });
        };
		/*this.getcostdetails =function (conId) {
            return $http.get(basePath + '/finance/cost/detail' , {params : {contractId : conId}}).then(function (response) {
                return response.data;
            });
        };*/
		 // 调用后台开始打印
        this.startPrint = function (conId) {
            return $http.get(basePath + '/sign/lease/printPDF' , {params : {conId : conId}}).then(function (response) {
                return response.data;
            });
        };
		this.getClinchDeal=function(data){
			return $http.get(basePath + '/sign/contractSales/submitClinchDeal' , {params: {contractId: conId}}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getInvalid=function(data){
			return $http.get(basePath + '/sign/contractSales/submitInvalid' , {params: {contractId: conId}}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getCancellations=function(data){
			return $http.get(basePath + '/sign/contractSales/submitCancellations' , {params: {contractId: conId}}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getBaseContract = function(data){
			return $http.get(basePath + '/sign/baseContract' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getBuyInfoContract= function(data){
			return $http.get(basePath + '/sign/buyInfoContract' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getContractStatus= function(data){
			return $http.get(basePath + '/sign/contractSales/getContractStatus' , {params :data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
		this.getServiceChage = function(data){
			return $http.get(basePath + '/sign/contractSales/getServiceChage' , {params :data}).then(function(response){
				return response.data;
			});
		}
		this.setYibiaoyishuquery=function(data){
			return $http.get(basePath + '/sign/contractSalesInterface/setYibiaoyishu' ,{params: data}).then(function(response){
				console.log(response);
				return response.data;
			});
		}
        /**
         * 补充协议
         * @param conId
         */
        this.getSupplAgrtListByConId = function (conId) {
            return $http.get(basePath + '/contract/supplagrt/getConSupplAgrtList',{params: {conId: conId,businessType: 2}}).then(function (response) {
                return response.data;
            })
        };
		 /**
         * 查询流程动作列表
         * @param tmpId
         */
        this.queryWorkFlowButton = function (tmpId,pageType) {
            return $http.get(basePath + '/workflow/selectShowLabelBytemplateId', {params: {templateId: tmpId,pageType:pageType}})
                .then(function (response) {
                    return response.data;
                })
        };

        /**
         * 执行流程动作
         * @param path 流程 mvc 地址
         * @param params 参数
         */
        this.doWorkFlowAction = function (path, params) {
            return $http.get(basePath + '/sign/lease/' + path, {params: params})
                .then(function (response) {
                    return response.data;
                });
        };
        /**
         * 获取创建工作流审批人
         */
        this.workFlowDoJob = function (postData, paramsData) {
            return $http.post(basePath + '/workflow/doJob', postData, {
                params: paramsData
            }).then(function (response) {
                return response.data;
            })
        };
        /**
         * 获取创建工作流审批人
         *//*
        this.getCreateWorkFlowUsers = function (conId) {
            return $http.get(basePath + '/sign/lease/getCreateWorkFlowUsers', {params: {conId: conId}})
                .then(function (response) {
                    return response.data;
                })
        };*/
       /* *//**
         * 获取流程流转审批人
         *//*
        this.getHandleWorkFlowUsers = function (taskId) {
            return $http.get(basePath + '/sign/lease/getHandleWorkFlowUsers', {params: {taskId: taskId}})
                .then(function (response) {
                    return response.data;
                })
        };
        *//**
         * 租赁合同打印审批
         *//*
        this.handleWorkFlow = function (taskId, userId, conId, isEnd) {
            return $http.get(basePath + '/sign/lease/handleWorkFlow', {
                params: {
                    taskId: taskId,
                    userId: userId,
                    conId: conId,
                    isEnd: isEnd
                }
            }).then(function (response) {
                return response.data;
            })
        };*/
        /**
         * 驳回起草人-不终止任务
         */
        this.toJumpFirstNode = function (taskId, createUserId, conId) {
            return $http.get(basePath + '/sign/lease/toJumpFirstNode', {
                params: {
                    taskId: taskId,
                    createUserId: createUserId,
                    conId: conId
                }
            }).then(function (response) {
                return response.data;
            })
        };

        /**
         * 合同打印审核提交
         * @param conId
         * @param userId
         */
        this.createWorkFlow = function (conId, userId) {
            return $http.get(basePath + '/sign/contractSales/createWorkFlow', {
                params: {
                    conId: conId,
                    userId: userId
                }
            }).then(function (response) {
                return response.data;
            });
        };
	}])
//	.filter("jsonDate", function($filter) {
//	   return function(input, format) {
//		   console.log('input ' , input);
//	        //先得到时间戳
//	        var timestamp = Date.parse(input);
//	
//	        //转成指定格式
//	        return $filter("date")(timestamp, format);
//	   } 
//	})
	/*.component('signWorkFlowUserLayer', {
        template: '<div class="ibox-content">\n    <table id="J_phone_dataTable"\n           class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th>选择</th>\n            <th>用户姓名</th>\n            <th>用户部门</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat="user in $ctrl.users" ng-click="$ctrl.userId = user.userId">\n            <td><input type="radio" ng-value="user.userId" ng-model="$ctrl.userId" name="users"></td>\n            <td>{{::user.userName}}</td>\n            <td>{{::user.userDept}}</td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n                ',
        controller: ['$element', function ($element) {
            var $ctrl = this;
            $ctrl.$start = function ($defer, users, title, defaultUserId) {
                $ctrl.userId = defaultUserId || null;
                $ctrl.users = users;
                commonContainer.modal(title, $element, function (id) {
                    if (!$ctrl.userId) {
                        return layer.alert('请选择一个用户');
                    }
                    $defer.resolve($ctrl.userId);
                    layer.close(id);
                }, {cancel: $defer.reject, btn2: $defer.reject, btns: ['确定', '取消']});
            };
        }]
    });*/
	
	
		
	
	
	
	angular.bootstrap(document , ['draft_detail']);
}(window));
