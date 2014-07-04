<head>
<title>OJSS</title>
<style>
body{
	margin : 0;
	background : url(sys/back.png);
}

.icon{
	float : left;
	margin : 10px;
	border : 1px solid transparent;
	border-radius : 5px;
}
.icon:active{
	background : rgba(128, 255, 255, 0.2);
}
.icon span{
	font-weight : bold;
	color : white;
	display : block;
	text-align : center;
	text-shadow : 0 0 3px black;
	opacity : 0;
	transition : all linear 0.2s;
}
.icon:hover span{
	opacity : 1;
}

.frame{
	position : absolute;
	top : 10%;
	left : 20%;
	background : #FAFAFA;
	border : 2px outset grey;
	border-radius : 5px;
}
.clickable{
	cursor : pointer;
}
</style>
<script>
window.onload = function(){
	var ic = getByClass("icon");
	for(var i=0;i<ic.length;++i){
		ic[i].onclick = function(){ activate(this) };
	}
	ic[--i].click();
	
	fh = getById("frameHolder");
};

var frames = [];
var fh;

function activate(link){
	var act = link.getAttribute("action");
	get("sys/"+act+".php", function(content){
		if(content){
			newFrame(content);
		}
	});
}

function get(url, cb){
	var xhr = new XMLHttpRequest();
	xhr.open("get", url);
	xhr.callBack = cb;
	xhr.onload = function(){
		this.callBack(this.responseText);
	};
	xhr.send();
}

function newFrame(content){
	var nf = document.createElement("div");
	nf.className = "frame";
	nf.innerHTML = content;
	fh.appendChild(nf);
	frames.push(nf);
}

function getByClass(clas){
	return document.getElementsByClassName(clas);
}
function getById(id){
	return document.getElementById(id);
}
</script>
</head>
<body>
	<div id="desk">
		<div class="icon clickable" action="mydoc"><img src="sys/doc.png" /><span>Mes docs<span></div>
		<div id="frameHolder"></div>
	</div>
</body>