$(function(){
	$("#J_cancel").click(function(){
		$(".J_recycleCount").val('')
		$(".J_differentReason").val('')
	})
		var str;
		jsonGetAjax(
				basePath + '/finance/collect/selectRecyclableReceiptListByBatchId',{
					},function(result){
					$("#J_dataTable tbody").empty();
					for(var i=0;i<result.data.length;i++){
					 	str+="<tr>"
						 		str+='<td><input name="btSelectItem" type="checkbox" class="list"><input name="receiptId" type="hidden" data-receiptId="'+result.data[i].receiptId+'" data-amount="'+result.data[i].amount+'" data-printCount="'+result.data[i].printCount+'" data-recycleCount="'+result.data[i].recycleCount+'"></td>'
						 		+'<td>'+result.data[i].receiptCode+'</td>'
						 		+'<td>'+result.data[i].contractCode+'</td>'
						 		+'<td>'+result.data[i].fundName+'</td>'
						 		+'<td>'+result.data[i].amount+'</td>'
						 		+'<td>'+result.data[i].payerName+'</td>'
						 		+'<td>'+result.data[i].createTime+'</td>'
						 		+'<td>'+result.data[i].approveStatus+'</td>'
						 		+'<td>'+result.data[i].printCount+'</td>'
						 		+'<td>'+result.data[i].recycleCount+'</td>'
						 		+'<td><input name="recycleCount" class="form-control J_recycleCount" id="J_recycleCount"></td>'
						 		+'<td><input name="differentReason" class="form-control J_differentReason" id="J_differentReason"></td>'
						 	+"</tr>"
					 }
					$("#J_dataTable tbody").append(str);
					
				}
		);
			
	$("#All").click(function(){ 	
		$(".list:checkbox").prop("checked",this.checked);
		var $subBox = $("input[name='btSelectItem']");
		 $("input[name='btSelectItem']").click(function(){
			 $("#All").prop("checked",$subBox.length == $("input[name='btSelectItem']:checked").length ? true : false);
	     });
	})

	$("#J_submit").click(function(){
		var array=[];
		var flag=1;
		if($("input[name=btSelectItem]:checked").length==0){  
			layer.alert("请选择可回收收据列表");
			return false;
		}
		$("input[name=btSelectItem]:checked").each(function(){
			var obj={};
			obj.recycleCount=Number($(this).closest("tr").find("td").eq(10).find("input").val());
			obj.differentReason=$(this).closest("tr").find("td").eq(11).find("input").val();
			obj.receiptId=$(this).next().attr("data-receiptId");
			obj.amount=$(this).next().attr("data-amount");
			obj.printCount=$(this).next().attr("data-printCount");
			array.push(obj)
			var recycleCount=$(this).closest("tr").find("td").eq(10).find("input").val();
			var recycleCount1=$(this).next().attr("data-recycleCount");
			var printCount=$(this).next().attr("data-printCount");
			var differentReason=$(this).closest("tr").find("td").eq(11).find("input").val();
			if($(this).closest("tr").find("td").eq(10).find("input").val()==''){
				flag=0; 
				layer.alert("请填写回收张数");
				return false;
			}
			if(isNaN($(this).closest("tr").find("td").eq(10).find("input").val())){
				flag=0; 
				layer.alert("回收张数请输入数字");
				return false;
			}
			if((Number(recycleCount)+Number(recycleCount1))>Number(printCount)){
				flag=0; 
				var count = Number(printCount) - Number(recycleCount1);
				layer.alert("回收张数不能大于" + count);
				return false;
			}else if((Number(recycleCount)+Number(recycleCount1))<Number(printCount)){
				if($(this).closest("tr").find("td").eq(11).find("input").val()==''){
					layer.alert("请填写差异原因");
					flag=0; 
					return false;
				}
			}
		})
		if(flag==1){
			jsonPostAjax(
				basePath + '/finance/collect/submitReceiptReturn',array,
				function(){
					layer.msg("成功");
					window.location.href=basePath +'/finance/receipt/returnList.htm'
				}
			)
		}
	})
})