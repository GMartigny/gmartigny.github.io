function firstTime(){
	document.getElementById("cache").style.display = "";
	document.getElementById("bulle").style.display = "";
}

function connect(really){
	if(really){
		addMess("info", "Bienvenue sur le chat.");
	}
	
	var xhr = getXHR();
	if(really) var tmp = pseudo + " vient de se connecter.";
	else var tmp = pseudo + " s'est déconnecté.";
	
	xhr.open("POST", "bd.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("connecte=" + really + "&act=addmess&pseudo=info&mess=" + tmp);
}

function start(done){
	if(!done) pseudo = document.getElementById("pseudo").value;
	
	if(pseudo != ""){
		document.getElementById("cache").style.display = "none";
		document.getElementById("bulle").style.display = "none";
		document.getElementById("coucou").innerHTML = "Salut " + pseudo + "!";
		setPseudo();
		
		var arr = tab.getElementsByClassName("line");
		colo(arr, pseudo);
	}
}

function colo(arr, match){
	for(var i=0;i<arr.length;i++){
		var tmp = arr[i].classList;
		if(tmp.contains(match.toLowerCase())){
			arr[i].classList.remove("you");
			arr[i].classList.add("me");
		}
		else{
			arr[i].classList.remove("me");
			arr[i].classList.add("you");
		}
	}
}

function setPseudo(){
	var expire = new Date();
	
	expire.setDate(expire.getDate() + 10);
	
	var c_value = escape(pseudo) + "; expires=" + expire.toUTCString();
	
	document.cookie = "pseudo=" + c_value;
}

function getPseudo(){
	deb = document.cookie.indexOf("pseudo=");
	if (deb >= 0) {
		deb += "pseudo".length + 1;
		fin = document.cookie.indexOf(";",deb);
		if (fin < 0) fin = document.cookie.length;
		pseudo = unescape(document.cookie.substring(deb,fin));
		return true;
	}
	else{
		return false;
	}
}

function getXHR(){
	var xhr = null;

	if(window.XMLHttpRequest || window.ActiveXObject){
		if(window.ActiveXObject){
			try{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e){
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		else{
			xhr = new XMLHttpRequest(); 
		}
	}
	else{
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest ...");
		return null;
	}
	
	return xhr;
}

function chat(mess){

	if(mess.value != "\n"){
		var xhr = getXHR();
		var tmp = mess.value;
		mess.value = "";
		
		tmp = escapeHtml(tmp);
		xhr.open("POST", "bd.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("act=addmess&pseudo=" + pseudo + "&mess=" + encodeURIComponent(tmp));
	}
	else{
		mess.value = "";
	}
}

function escapeHtml(str) {
	//str = str.replace(/&/g, "&amp;");
	
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/"/g, "&quot;");
	str = str.replace(/'/g, "&#039;");
	return str;
}

function addMess(p, m){
	var tr = document.createElement("tr");
	
	tr.style.opacity = "0";
	
	tr.classList.add("line");
	tr.classList.add(p.toLowerCase());
	if(p === pseudo){
		tr.classList.add("me");
	}
	else{
		tr.classList.add("you");
	}
	var tdp = document.createElement("td");
	tdp.innerHTML = "[" + p + "]";
	var tdm = document.createElement("td");
	tdm.classList.add("mess");
	tdm.innerHTML = m;
	
	tr.appendChild(tdp);
	tr.appendChild(tdm);
	tab.appendChild(tr);
	
	document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
	
	tr.style.opacity = "0.98";
	null;
}

function checkNew(){
	var xhr = getXHR();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			if(xhr.responseText != "no"){
				var res = JSON.parse(xhr.responseText);
				for(var i=0;i<res.length;i++){
					addMess(res[i].pseudo, res[i].message);
					last = res[i].num;
					nouveau = true;
					if(out) title.innerHTML = "Nouveau message";
				}
			}
		}
	};

	xhr.open("POST", "bd.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("act=refresh&last=" + last);
}

function changePseudo(div){
	div.onclick = "";
	
	var inp = document.createElement("input");
	inp.type = "text";
	inp.value = pseudo;
	inp.onkeyup = function(e){
		var evt = (e) ? e : ((window.event) ? window.event : null);
		
		if(evt){
			var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if(key == 13){
			
				var xhr = getXHR();
				var mess = pseudo + " s'appelle maintenant " + this.value + ".";
				xhr.open("POST", "bd.php", true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send("act=addmess&pseudo=info&mess=" + encodeURIComponent(mess));
				
				pseudo = encodeURIComponent(this.value);
				div.onclick = function(){ changePseudo(this) };
				start(true);
			}
		}
	};
	
	inp.onblur = function(){
		document.getElementById("coucou").innerHTML = "Salut " + pseudo + "!";
		div.onclick = function(){ changePseudo(this) };
	}
	
	div.innerHTML = "";
	div.appendChild(inp);
	inp.focus();
}