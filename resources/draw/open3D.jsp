<%@page import="com.ERP5I5J.Entity.Resource.SessionUsers"%>
<%@ page contentType="text/html;charset=utf-8" %>

<%
	String housesId = request.getParameter("houseid");
	String sectionId = request.getParameter("sectionid");
    SessionUsers user = (SessionUsers) session.getAttribute("RUNDATA_USER");
	String userId = user.USERSID + "";
    String actionType = request.getParameter("actionType");
    try{
        Integer.parseInt(sectionId);
        Integer.parseInt(housesId);
    } catch(Exception e) {
        RequestDispatcher rd = request.getRequestDispatcher("../common/error_close.jsp");
        request.setAttribute("message", "非法访问，请重新登录ERP！");
        rd.forward(request, response);
        return;	
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>3D</title>
<script src="js/swfobject.js" type="text/javascript"></script>
<script>
var flashvars = {
	HousesId: "<%=housesId%>",
	SectionId: "<%=sectionId%>",
	UserId: "<%=userId%>",
	hostname: top.location.hostname,
	path: ""
};
var params = {
	menu: "false",
	scale: "noScale",
	allowFullscreen: "true",
	allowScriptAccess: "always",
	bgcolor: "",
	wmode: "direct" // can cause issues with FP settings & webcam
};
var attributes = {
	id:"House3D"
};
swfobject.embedSWF(
	"House3D.swf", 
	"altContent", "100%", "100%", "10.0.0", 
	"expressInstall.swf", 
	flashvars, params, attributes);
</script>
<style>
	html, body { height:100%; overflow:hidden; }
	body { margin:0; }
</style>
</head>
<body bgcolor="#0f3193">
	<div id="altContent">
		<h1>House3D</h1>
		<p><a href="http://www.adobe.com/go/getflashplayer">Get Adobe Flash player</a></p>
	</div>
</body>
</html>