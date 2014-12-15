var es_allCarrousel = [];
var es_canBeLoaded = {IMG:1, AUDIO:1, VIDEO:1};

// set a single carrousel
function es_setCarrousel(elem){
	var chs = elem.children,
		l = chs.length,
		car = new Carrousel(elem);

	car.onload = elem.getAttribute("onload");

	for (var j=0;j<l;++j) {
		car.append(chs[0]);
	}
    return car;
}

// pseudo-object
function Carrousel(elem){
	this.element = elem;
	this.nbChild = elem.children.length;
	this.loaded = 0;

	this.current = 0;

	this.elW = elem.clientWidth;
	this.elH = elem.clientHeight;
	this.elR = this.elW/this.elH;

	this.orientation = elem.classList.contains("vertical")? "vertical":"horizontal";

	this.holder = document.createElement("div");
	this.holder.className = "holder";
	this.element.appendChild(this.holder);

	// add an element to the slider
	this.append = function(el){
		el.father = this;
		this.holder.appendChild(el);
		el.onload = function(){
			var r = this.width/this.height;
			if(r < this.father.elR){
				this.style.maxHeight = this.height*3 + "px";
				this.classList.add("overH");
				var w = this.offsetWidth;
				var h = this.father.holder.offsetHeight-this.offsetHeight;
				if(this.father.orientation == "horizontal") h -= 20;
				this.style.margin = (h)/2 + "px calc(50% - "+ (w/2) +"px)";
			}
			else{
				this.style.maxWidth = this.width*3 + "px";
				this.classList.add("overW");
				var w = this.father.holder.offsetWidth-this.offsetWidth;
				var h = this.father.holder.offsetHeight-this.offsetHeight;
				if(this.father.orientation == "horizontal") h -= 20;
				else w -= 20;
				this.style.margin =  (h)/2 +"px " + (w)/2 + "px";
			}

			// everythings loaded
			if(this.father.nbChild <= ++this.father.loaded){
				this.father.holder.style.opacity = 1;
				this.father.scroll();

				//@override onload method
				if(this.father.element.onload) this.father.element.onload();
			}
		};
		if(!es_canBeLoaded[el.nodeName]) el.onload();
	};

	// jump to previous
	this.previous = function(){
		if(--this.current < 0) this.current = 0;
		this.scroll();
	};
	// jump to next
	this.next = function(){
		if(this.nbChild-1 < ++this.current) this.current = this.nbChild-1;
		this.scroll();
	};
	// animate scroll
	this.scroll = function(){
		if(this.orientation == "horizontal"){
			this.holder.scrollLeft = this.element.offsetWidth*this.current;
		}
		else{
			this.holder.scrollTop = this.element.offsetHeight*this.current;
		}
	};

	// set side arrows
	this.before = document.createElement("div");
	this.before.father = this;
	this.before.className = "arrows before";
	this.before.onclick = function(){
		this.father.previous();
	};
	this.element.appendChild(this.before);

	this.after = document.createElement("div");
	this.after.father = this;
	this.after.className = "arrows after";
	this.after.onclick = function(){
		this.father.next();
	};
	this.element.appendChild(this.after);
}