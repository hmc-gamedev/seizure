//basic library methods
var LIB = new function() {
	// wrapper methods, also throw a more reasonable error
	this.getValue = function(elem, member) {
		try {
			return document.getElementById(elem)[member];
		} catch(e) {
			if(e.toString() === "TypeError: document.getElementById(elem) is null")
				throw "TypeError: document.getElementById("+elem+") is null";
			throw e;
		}
	};
	this.setValue = function(elem, member, val) {
		try {
			document.getElementById(elem)[member] = val;
		} catch(e) {
			if(e.toString() === "TypeError: document.getElementById(elem) is null")
				throw "TypeError: document.getElementById("+elem+") is null";
			throw e;
		}
	};
	this.addValue = function(elem, member, val) {
		try {
			document.getElementById(elem)[member] += val;
		} catch(e) {
			if(e.toString() === "TypeError: document.getElementById(elem) is null")
				throw "TypeError: document.getElementById("+elem+") is null";
			throw e;
		}
	};
	
	// if you have javascript prototyping going on use this to make sure
	// you get an empty object
	this.empty = function() {
		var val = {};
		for(key in val)
			val[key] = undefined;
		return val;
	};
	this.handleError = function(e) {
		alert(e);
	};
	this.loadJS = function(filename) {
		var fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src",filename);
	};
	
	//encodes and decodes strings for sending them in query strings see php for
	//(a few) more details
	this.HEX = '0123456789ABCDEF';
	this.encode = function(obj) {
		if(typeof obj == "object") {
			var str = '';
			for(i in obj)
				str += 'Ggle' + LIB.encode(i) + 'Ll' +  LIB.encode(obj[i]).replace(/l/g,"ol");
			return str.substr(4);
		} else if(obj === null) {
			return 'N';
		} else if(obj === true) {
			return 'T';
		} else if(obj === false) {
			return 'f';
		} else if(typeof obj == "number") {
			return 'n'+obj.toString().replace(/./g,'A');
		} else {
			var str = '';
			for(var i = 0; i < obj.length; i++)
				str += LIB.HEX[Math.floor(obj.charCodeAt(i)/16)] + LIB.HEX[obj.charCodeAt(i)%16];
			return str;
		}
	};
	this.decode = function(str) {
		if(str.match(/Ll/)) {
			var str2 = str.split('Ggle');
			var out = LIB.empty();
			for(var i = 0; i < str2.length; i++) {
				var t = str2[i].split('Ll');
				out[LIB.decode(t[0])] = LIB.decode(t[1].replace(/ol/g,"l"));
			}
			return out;
		} else if(str === 'N') {
			return null;
		} else if(str === 'T') {
			return true;
		} else if(str === 'f') {
			return false;
		} else if(str[0] === 'n') {
			return eval(str.substring(1));
		}else {
			var out = '';
			for(var i = 0; i < str.length; i+=2)
				out += String.fromCharCode(LIB.HEX.indexOf(str[i])*16+LIB.HEX.indexOf(str[i+1]));
			return out;
		}
	};
	
	
};