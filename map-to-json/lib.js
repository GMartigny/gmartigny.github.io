function getById(id){
	return document.getElementById(id);
}

function create(elm){
	return document.createElement(elm);
}

function c(mess){
	console.log(mess);
}

function getByClass(c, elm){
	elm = elm || document;
	if (!elm.getElementsByClassName){
		var elements = elm.getElementsByTagName('*'),
		i=0,
		nodeList = [],
		reg = new RegExp('(^|\\s)' + c + '(\\s|$)')

		for (i=0;i<elements.length;++i){
			if(elements[i].className.match(reg) !== null){
				nodeList.push(elements[i]);
			}
		}
		return nodeList;
	}
	else{
		return elm.getElementsByClassName(c);
	}
}