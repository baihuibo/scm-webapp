var res={};
var details;
(function(window){
	angular.module('sales_add' , ['base' , 'sign-common'])
	
	.controller('salesAddCtrl' , ['salesAddService', 'signUtil' , 'signService',function(salesAddService, signUtil , signService){
		var $ctrl = this;
		
		var from = signUtil.getSearchValue("from") - 1;
		$ctrl.serveObj = [2];
		$ctrl.discount_res=true;
		$ctrl.discount_resfun=function(){
			if($ctrl.serveObj.indexOf(1)>-1&&$ctrl.serveObj.indexOf(2)>-1){
				if(($("#ownBrokerageDiscount").val()>=10.00 || $("#ownBrokerageDiscount").val()==undefined)&&$("#ownPerformanceDiscount").val()>=10.00&&($("#cusBrokerageDiscount").val()>=10.00 || $("#cusBrokerageDiscount").val()==undefined)&&$("#cusPerformanceDiscount").val()>=10.00){
					$ctrl.discount_res=false;
				}else{
					$ctrl.discount_res=true;
				}
			}
			if($ctrl.serveObj.indexOf(1)>-1&&$ctrl.serveObj.indexOf(2)==-1){
				if(($("#ownBrokerageDiscount").val()>=10.00 || $("#ownBrokerageDiscount").val()==undefined)&&$("#ownPerformanceDiscount").val()>=10.00){
					$ctrl.discount_res=false;
				}else{
					$ctrl.discount_res=true;
				}
				
			}
			if($ctrl.serveObj.indexOf(2)>-1&&$ctrl.serveObj.indexOf(1)==-1){
				if(($("#cusBrokerageDiscount").val()>=10.00 || $("#cusBrokerageDiscount").val()==undefined)&&$("#cusPerformanceDiscount").val()>=10.00){
					$ctrl.discount_res=false;
				}else{
					$ctrl.discount_res=true;
				}
			}
		}

		$ctrl.getServiceChage =function(){	
			salesAddService.getServiceChage({'conId':conId}).then(function(result){
				if(result.code !== 0){
					return layer.alert(result.msg);
				}
				$ctrl.serviceChage = result.data;
				$ctrl.ownTotalReceivable = $ctrl.serviceChage.ownBrokerageReceivable + $ctrl.serviceChage.ownPerformanceReceivable;
				$ctrl.cusTotalReceivable = $ctrl.serviceChage.cusBrokerageReceivable+$ctrl.serviceChage.cusPerformanceReceivable
				console.log($ctrl.serviceChage);
			});
		};
		if (from!=-1) {
			$('#tab-' + (Number(from) + 1)).addClass('active');
			$(".nav-tabs li").eq(from).children(".taba").attr({
				"data-toggle" : "tab"
			});
			$(".nav-tabs li").eq(from).children(".taba").attr({
				"href" : "#tab-" + (from + 1)
			});
			$('#lease-add li:eq(' + from + ') a').tab('show');
			$(".nav-tabs li").each(function() {
				if ($(this).index() != from) {
					$(this).children(".taba").removeAttr("data-toggle");
					$(this).children(".taba").removeAttr("href");
				}
			});
			/*if(from==3){
				//salesAddService.getServiceChage({"conId":window.conId});
				$ctrl.getServiceChage();
			}*/
		} else {
			
			
			$('#tab-1').addClass('active');
			var cookieresult = window.localStorage ? localStorage
					.getItem("cookieresult") : Cookie.read("cookieresult");
			details = eval('(' + cookieresult + ')');
			console.log(details);
			$("#houseId").text(details.houseId);
			$("#clientId").text(details.clientId);
			$("#customerId").text(details.customerId);
			$("#houseId").attr("href",basePath +'/house/main/buydetail.htm?houseid='+details.houseId)
			$("#customerId").attr("href",basePath +'/customer/main/findbuyerclientbycustomerid.htm?customerId='+details.clientId)
			if (details.owner.length > 0) {
				var str = '';
				for (var i = 0; i < details.owner.length; i++) {
					
					str += '<tr><td>'

					str += '<div class="form-group">'
					str += '<input name="name" id="name'
							+ i
							+ '" class="form-control"  placeholder="请输入姓名"  required="" aria-required="true">'
					str += '</div>'
					str += '</td><td attr=' + details.owner[i].idCardTypeId + '>'
							+ details.owner[i].idCardTypeName + '<input type="hidden" name="idcardTypeCd" value=' + details.owner[i].idCardTypeId + '></td><td>'
							+ details.owner[i].idCard + '<input type="hidden" name="idcardNo" value=' + details.owner[i].idCard + '></td><td>'

					str += '<div class="form-group">'
					str += '<input name="adress" id="adress'
							+ i
							+ '" class="form-control"  placeholder="请输入通讯地址" >'
					str += '</div>'

					str += '</td>'
					str += '<td>'
					str += '<div class="form-group">'
					str += '<div class="col-sm-10">'
					str += '<input name="phone"  onmouseover="this.title=this.value" id="phone'
							+ i
							+ '" class="J_phone form-control" readonly="readonly" placeholder="请添加电话" >'
					str += '</div>'
					str += '<div class="col-sm-1">'
					str += '<a class="btn btn-white btn-bitbucket J_add_phone">  '
					str += '<i class="glyphicon glyphicon-plus"></i>'
					str += '</a>'
					str += '</div>'
					str += '</div>'
					str += '</td>'
					str += '</tr>'
				}
				$('#dataTableBuy tbody').append(str);
				var str1 = '';
				for (var i = 0; i < details.ownerAll.length; i++) {
					if(details.ownerAll[i].idCard){
						
					
					str1 += '<tr><td>'
					str1 += '<div class="form-group">'
					str1 += '<input name="name" id="namea'
							+ i
							+ '"  class="form-control"  placeholder="请输入姓名"  required="" aria-required="true">'
					str1 += '</div>'
					str1 += '</td><td attr=' + details.ownerAll[i].idCardTypeId + '>'
							+ details.ownerAll[i].idCardTypeName + '<input type="hidden" name="idcardTypeCd" value=' + details.ownerAll[i].idCardTypeId + '></td><td>'
							+ details.ownerAll[i].idCard + '<input type="hidden" name="idcardNo" value=' + details.ownerAll[i].idCard + '></td><td>'

					str1 += '<div class="form-group">'
					str1 += '<input name="warrantNumber"  id="warrantNumber'
							+ i
							+ '" class="form-control"  placeholder="请输入共有人权证号" >'

					str1 += '</div>'
					str1 += '</td>'
					str1 += '<td>'
					str1 += '<div class="form-group">'
					str1 += '<div class="col-sm-10">'

					str1 += '<input name="phone" id="phone'
							+ i
							+ '" class="J_phone form-control" readonly="readonly" placeholder="请添加电话"  onmouseover="this.title=this.value">'

					str1 += '</div>'
					str1 += '<div class="col-sm-1">'
					str1 += '<a class="btn btn-white btn-bitbucket J_add_phone">  '
					str1 += '<i class="glyphicon glyphicon-plus"></i>'
					str1 += '</a>'
					str1 += '</div>'
					str1 += '</div>'
					str1 += '</td>'
					str1 += '</tr>'
					}
				}
				$('#dataTableBuyAll tbody').append(str1);

				var str2 = '';
				for (var i = 0; i < details.customer.length; i++) {
					str2 += '<tr><td>'
					str2 += '<div class="form-group">'
					str2 += '<input name="name" id="nameb'
							+ i
							+ '"  class="form-control"  placeholder="请输入姓名"  required="" aria-required="true">'
					str2 += '</div>'
					str2 += '</td><td attr=' + details.owner[i].idCardTypeId + '>'
							+ details.customer[i].idCardTypeName + '<input type="hidden" name="idcardTypeCd" value=' + details.customer[i].idCardTypeId + '></td><td>'
							+ details.customer[i].idCard + '<input type="hidden" name="idcardNo" value=' + details.customer[i].idCard + '></td><td>'
					str2 += '<div class="form-group">'
					str2 += '<input name="adress"  id="adress'
							+ i
							+ '" class="form-control"  placeholder="请输入通讯地址" >'
					str2 += '</div>'
					str2 += '</td>'
					str2 += '<td>'
					str2 += '<div class="form-group">'
					str2 += '<div class="col-sm-10">'

					str2 += '<input name="phone" id="phone'
							+ i
							+ '" class="J_phone form-control" readonly="readonly" placeholder="请添加电话" onmouseover="this.title=this.value">'
					str2 += '</div>'

					str2 += '<div class="col-sm-1">'
					str2 += '<a class="btn btn-white btn-bitbucket J_add_phone">  '
					str2 += '<i class="glyphicon glyphicon-plus"></i>'
					str2 += '</a>'
					str2 += '</div>'
					str2 += '</div>'
					str2 += '</td>'
					str2 += '</tr>'
				}
				$('#dataTableClient tbody').append(str2);

				var str3 = '';
				for (var i = 0; i < details.customerAll.length; i++) {
					if(details.customerAll[i].idCard){
						
					
					str3 += '<tr><td>'
					str3 += '<div class="form-group">'
					str3 += '<input name="name" id="namec'
							+ i
							+ '"  class="form-control"  placeholder="请输入姓名"  required="" aria-required="true">'
					str3 += '</div>'
					str3 += '</td><td attr=' + details.customerAll[i].idCardTypeId + '>'
							+ details.customerAll[i].idCardTypeName + '<input type="hidden" name="idcardTypeCd" value=' + details.customerAll[i].idCardTypeId + '></td><td>'
							+ details.customerAll[i].idCard + '<input type="hidden" name="idcardNo" value=' + details.customerAll[i].idCard + '></td>'
					str3 += '<td>'
					str3 += '<div class="form-group">'
					str3 += '<div class="col-sm-10">'
					str3 += '<input name="phone"  id="phone'
							+ i
							+ '" class="J_phone form-control" readonly="readonly" placeholder="请添加电话"  onmouseover="this.title=this.value">'
					str3 += '</div>'
					str3 += '<div class="col-sm-1">'
					str3 += '<a class="btn btn-white btn-bitbucket J_add_phone">  '
					str3 += '<i class="glyphicon glyphicon-plus"></i>'
					str3 += '</a>'
					str3 += '</div>'
					str3 += '</div>'
					str3 += '</td>'
					str3 += '</tr>'
					}
				}
				$('#dataTableClientAll tbody').append(str3);
			}
		}
		$.fn.serializeJson = function() {
			var serializeObj = {};
			var array = this.serializeArray();
			var str = this.serialize();
			$(array).each(
					function() {
						if (serializeObj[this.name]) {
							if ($.isArray(serializeObj[this.name])) {
								serializeObj[this.name].push(this.value);
							} else {
								serializeObj[this.name] = [
										serializeObj[this.name], this.value ];
							}
						} else {
							serializeObj[this.name] = this.value;
						}
					});
			return serializeObj;
		};
		
		$ctrl.getBrokerageDiscount = function(start , end){
			if(!start){
				return 0;
			}
			return (start / end*10).toFixed(2);
		}
		$ctrl.getPlus=function(start , end){
			if(!start||!end){
				return 0;
			}
			return Number(start) + Number(end);
		};
		
		$ctrl.aloneGetPlus=function(start){
			if(!start){
				return 0;
			}
			return Number(start);
		};
		// 统一获取所有的keyCode 列表，并且绑定到 $ctrl
		[
		 'buildingCheck',// 房屋校验
		 'clientType',// 服务费收取对象
		 'discountReason', // 打折原因
		 'fullfiveGist',//满五年依据
		 'plannedUses',//房屋设计用途
		 'useingMode',//土地使用权获得方式
		 'houseProperty',//房屋性质
		 //'payTypeSign',//付款方式
		 'taxPayingParty',//增加新税费缴纳方
		 'noBatchLoan',//未批贷款解决方式
		 'buyHouseQualification',//购房资质
		].forEach(function(keyCode){
			signService.getTypes(keyCode).then(function(result){
				$ctrl[keyCode] = result.data;	
			});
		});
	}])
	
	.service('salesAddService' , ['$http' , function($http){
		this.getServiceChage = function(data){
			return $http.get(basePath + '/sign/contractSales/getServiceChage' , {params :data}).then(function(response){
				return response.data;
			});
		}
		/*this.service=function(){
			jsonPostAjax(basePath + '/sign/contractSales/savePaymentMethod', val, function(result) {
			
			},{
			});
			var ownBrokerageReceivable=$ctrl.serviceChage.ownBrokerageReceivable;
			var ownPerformanceReceivable=$ctrl.serviceChage.ownPerformanceReceivable;
			var cusBrokerageReceivable=$ctrl.serviceChage.cusBrokerageReceivable;
			var cusPerformanceReceivable=$ctrl.serviceChage.cusPerformanceReceivable;
			
			var ownTotalReceivable=ownBrokerageReceivable+ownPerformanceReceivable;
			var cusTotalReceivable=cusBrokerageReceivable+cusPerformanceReceivable;
			$("#ownBrokerageReceivable").val(ownBrokerageReceivable);
			$("#ownBrokerageReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(ownBrokerageReceivable));
			$("#ownPerformanceReceivable").val(ownPerformanceReceivable);
			$("#ownPerformanceReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(ownPerformanceReceivable));
			$("#ownTotalReceivable").val(ownTotalReceivable);
			$("#ownTotalReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(ownTotalReceivable));
			$("#cusBrokerageReceivable").val(cusBrokerageReceivable);
			$("#cusBrokerageReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(cusBrokerageReceivable));
			$("#cusPerformanceReceivable").val(cusPerformanceReceivable);
			$("#cusPerformanceReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(cusPerformanceReceivable));
			$("#cusTotalReceivable").val(cusTotalReceivable);
			$("#cusTotalReceivable").closest('.form-group').find('.color_red').text(
					'¥：' + convertCurrency(cusTotalReceivable));	
		}*/
	}]);
	
	
	angular.bootstrap(document , ['sales_add']);
}(window));