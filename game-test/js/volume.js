var slider = {};
var dragated = false;
var startingDrag = 0;

function initVolume(){
	var elms = getByClass("vol_inner");
	for(var i=0;i<elms.length;++i){
		var el = elms[i];
		var start = el.getAttribute("data-start");
		if(start < 0) start = 0;
		else if(1 < start) start = 1;
		el.style.left = (start * 100) + "%";
		slider[el.id] = el;
		
		el.addEvent("mousedown", function(e){
			dragSlider(this, true, e);
		},false);
		el.parentNode.addEvent("click", function(){
			
		}, false);
	}
	window.addEvent("mouseup", function(e){
		dragSlider(this, false, e);
	}, false);
	window.addEvent("mousemove", moveSlider, false);
}
initVolume();

function dragSlider(elm, isDrag, event){
	event.preventDefault();
	if(isDrag){
		dragated = elm;
		startingDrag = event.clientX;
		document.body.style.cursor = "e-resize";
	}
	else{
		dragated = false;
		document.body.style.cursor = "auto";
	}
}

function moveSlider(event){
	if(dragated){
		var pos = (event.clientX - dragated.parentNode.offsetLeft - 1)/(dragated.parentNode.clientWidth - 2);
		if(pos < 0) pos = 0;
		else if(1 < pos) pos = 1;
		setVolumePos(dragated, pos);
	}
}

function setVolumePos(elm, pos){
	elm.style.left = pos*100 + "%";
	media[elm.id].volume = pos;
}