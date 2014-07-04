<?php
header('Content-Type: text/html; charset=utf-8');
require_once("bd.php");
?>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<title>Chat</title>
</head>
<body>
<div id="coucou" onclick="changePseudo(this)">Salut !</div>
<div id="content">
	<div id="messages">
		<table>
			<tbody id="tab">
			<?php
			$mess = "";
			$mess = getMess();

			for($i=0;$i<count($mess);$i++){
			?>
			<tr class="line <?php echo strtolower($mess[$i]['pseudo']); ?> you">
				<td> [<?php echo $mess[$i]['pseudo']; ?>]</td>
				<td class="mess"><p><?php echo $mess[$i]['mess']; ?></p></td>
			</tr>
			<?php
			}
			?>
			</tbody>
		</table>
	</div>
	<div id="entree">
		<textarea id="text"></textarea>
	</div>
</div>
<div id="cache" style="display:none"></div>
<div id="bulle" style="display:none">
		Salut, je vois que c'est ta première visite.<br/>
		Alors bienvenue sur notre chat.<br/>
		Comme c'est la première, entre ton pseudo :<br/>
		<input type="text" maxlength="30" id="pseudo"/><input type="button" value="C'est parti !" onclick="start(false);connect(true);"/>
</div>
<script type="text/javascript" src="chat.js"></script>
<script>
var cont;
var tab;
var pseudo;
var text;
var last = <?php echo getLast(); ?>;
var out = false;
var nouveau = false;
var title = document.getElementsByTagName("title")[0];

window.onload = function(){
	cont = document.getElementById("content");
	tab = document.getElementById("tab");
	
	if(getPseudo()){
		start(true); // refresh pseudo
		connect(true);
	}
	else{
		firstTime();
	}
	
	text = document.getElementById("text");
	text.onkeyup = function(e){
		var evt = (e) ? e : ((window.event) ? window.event : null);
		
		if(evt){
			var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if(key == 13){
				e.preventDefault();
				chat(this);
			}
		}
	};
	
	document.getElementById("content").style.height = (document.height - 65) + "px";
	setInterval(checkNew, 1000);
};

window.onunload = function(){
	connect(false);
}

window.onresize = function(){
	document.getElementById("content").style.height = (document.height - 65) + "px";
}

window.onblur = function(){
	out = true;
}

window.onfocus = function(){
	out = false;
	title.innerHTML = "Chat";
	nouveau = false;
}
</script>
<style>
body, html{
	height : 100%;
	overflow : hidden;
	background-color : lightgrey;
	padding : 0;
	margin : 0;
}
#cache{
	position : absolute;
	top : 0; left : 0;
	height : 100%;
	width : 100%;
	background-color : grey;
	opacity : 0.5;
}
#bulle{
	position : absolute;
	width : 30%;
	top : 100px;
	left : 35%;
	padding : 10px;
	background-color : white;
	border : 2px outset gold;
	-moz-border-radius : 8px;
	-webkit-border-radius : 8px;
	-o-border-radius : 8px;
	border-radius : 8px;
}
#coucou{
	color : white;
	position : absolute;
	top : 5px;
	left : 10px;
}
#content{
	width : 90%;
	margin : 50px auto;
	padding : 10px;
	border : 2px outset gold;
	-moz-border-radius : 8px;
	-webkit-border-radius : 8px;
	-o-border-radius : 8px;
	border-radius : 8px;
	background-color : white;
}
#messages{
	height : 93%;
	overflow-y : auto;
	overflow-x : hidden;
}
#entree{
	height : 7%;
	margin-bottom : 5px;
}
#text{
	width : 100%;
	height : 100%;
}
table{
	border-collapse : collapse;
}
tr{
	-moz-transition : opacity 0.6s ease-in-out 0.2s;
	-webkit-transition : opacity 0.6s ease-in-out 0.2s;
	-o-transition : opacity 0.6s ease-in-out 0.2s;
	transition : opacity 0.6s ease-in-out 0.2s;
}
.mess{
	padding : 10px;
	width : 100%;
}
.me{ background-color : #BEEFEF; }
.you{ background-color : #FFFFA8; }
.info{ background-color : #EAD5FF; }
input[type="button"]{
	-moz-border-radius : 15px;
	-webkit-border-radius : 15px;
	-o-border-radius : 15px;
	border-radius : 15px;
}
</style>
</body>