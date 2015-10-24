function setCook(nom, value){
	document.cookie = nom + "=" + value + ";path=/";
}

function getCook(nom){
	deb = document.cookie.indexOf(nom + "=");
	if (deb >= 0){
		deb += nom.length + 1;
		fin = document.cookie.indexOf(";",deb);
		if (fin < 0) fin = document.cookie.length
		return unescape(document.cookie.substring(deb,fin));
	}
	else{
		return 0;
	}
}

function clique(){
	setCook("clic", parseInt(getCook("clic"))+1);
}