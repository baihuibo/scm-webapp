function viewattachedcontract(){
	var str;
	jsonGetAjax(
			basePath + '/sign/signthecontract/viewattachedcontract',{
				"conId":conid,
			},function(result){
				$("#J_subdataTable tbody").empty();
				for(var i=0;i<result.data.subsidiarylist.length;i++){
					var performanceContractNum=result.data.subsidiarylist[i].performanceContractNum;
					var brokerageContractNum=result.data.subsidiarylist[i].brokerageContractNum;
					 	str+='<tr>'
					 		str+='<td>'+(i+1)+'</td>'
					 		str+='<td><a href="../signthecontract/contractdetail.htm?conId='+result.data.subsidiarylist[i].conId+'" target="_blank">'+result.data.subsidiarylist[i].contractCode+'</a></td>'
							 	if(result.data.subsidiarylist[i].subsidiaryContractType==1){
							 		str+='<td>履约合同</td>'
							 		str+='<td><a href="../signthecontract/appointdetail.htm?subsidiaryContractId='+result.data.subsidiarylist[i].subsidiaryContractId+'&conId='+result.data.subsidiarylist[i].conId+'" target="_blank">'+performanceContractNum+'</a></td>'
							 	}else if(result.data.subsidiarylist[i].subsidiaryContractType==2){		
							 		str+='<td>居间合同</td>'
							 		str+='<td><a href="../signthecontract/betweendetail.htm?subsidiaryContractId='+result.data.subsidiarylist[i].subsidiaryContractId+'&conId='+result.data.subsidiarylist[i].conId+'" target="_blank">'+brokerageContractNum+'</a></td>'
							 	}
						 		str+='<td>'+result.data.subsidiarylist[i].deptName+'</td>'
						 		str+='<td><a onclick="getUserStaffInfo('+result.data.subsidiarylist[i].inputUser+')">'+result.data.subsidiarylist[i].inputName+'</a></td>'
						 		if(result.data.subsidiarylist[i].contractStatus==undefined){
						 			str+='<td>-</td>'
						 		}else{
						 			str+='<td>'+result.data.subsidiarylist[i].contractStatus+'</td>'
						 		}
						 		str+='<td>'+result.data.subsidiarylist[i].lastuptDttm+'</td>'
						 str+='</tr>'
						 
				 }
				$("#J_subdataTable tbody").append(str);
				
			}
	)
}
