function printhistory(){
	var str='';
	jsonGetAjax(
			basePath + '/sign/signthecontract/printhistory',{
				"conId":conid,
			},function(result){
				$("#J_printhistoryTable tbody").empty();
				for(var i=0;i<result.data.printhistorylist.length;i++){
					 	str+='<tr>'
					 		str+='<td>'+(i+1)+'</td>'
					 		str+='<td>'+result.data.printhistorylist[i].type+'</td>'
					 		str+='<td>'+result.data.printhistorylist[i].contractCode+'</td>'
					 		str+='<td>'+result.data.printhistorylist[i].shopName+'</td>'
					 		str+='<td><a onclick="getUserStaffInfo('+result.data.printhistorylist[i].userId+')">'+result.data.printhistorylist[i].userName+'</a></td>'
					 		str+='<td>'+result.data.printhistorylist[i].crtDttm+'</td>'
					 		str+='<td>'+result.data.printhistorylist[i].printCount+'</td>'
					 		str+='</tr>'
						 
				 }
				$("#J_printhistoryTable tbody").append(str);
				
			}
	)
}