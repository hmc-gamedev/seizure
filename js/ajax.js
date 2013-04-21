//ajax library
AJAX = new function() {
	//keeps track of things are requested before the server sends back a session ID
	this.stack = [];
	
	//request a session ID from the server at src
	this.getID = function(src, func) {
		var XMLHttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		XMLHttp.onreadystatechange = function() {
			try {
				if(XMLHttp.readyState == 4) {
					if(XMLHttp.status == 200) {
						//LIB.addValue('info','innerHTML',XMLHttp.responseText);
						//alert(XMLHttp.responseText);
						var ret = LIB.decode(XMLHttp.responseText);
						LIB.setValue('SID','value',ret['id']);
						LIB.setValue('word','value',ret['word']);
						//LIB.addValue('info','innerHTML',ret['id']+'<br />');
						//LIB.addValue('info','innerHTML',ret['word']+'<br />');
						for(i in AJAX.stack)
							AJAX.sendRequest(AJAX.stack[i][0],AJAX.stack[i][1],AJAX.stack[i][2]);
						if(func)
							func();
					}
                    else
                    {
                        alert("Server error");
                    }
				}
			} catch(e) {
				alert(e);
			}
		};
		XMLHttp.open("GET",src+"?S",true);
		// alert(src+"?S");
		XMLHttp.send();
	};
	this.returnID = function(src) {
		var XMLHttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		XMLHttp.onreadystatechange = function() {};
		XMLHttp.open("GET",src+"?s"+LIB.getValue('SID','value'),false);
		XMLHttp.send();
	}
	//sends a request to src with passing args to the server, func is the called with the return values
	//and mem as arguments
	this.sendRequest = function(src, args, func, mem) {
		if(LIB.getValue('SID','value') === "")
			return AJAX.stack.push([src,args,func]);
		var XMLHttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		
		var eargs = LIB.encode(args);
		//alert(eargs);
		//the request needs to be broken up
		//I'm not actually sure what the length can safely be since
		//browsers are so damn inconsistent.
		if(eargs.length > 100) {
			XMLHttp.onreadystatechange = function() {
				try {
					if(XMLHttp.readyState == 4) {
						if(XMLHttp.status == 200)
							AJAX.breakRequest(src,eargs,func,mem,XMLHttp.responseText);
                        else
                            alert("Server error");
					}
				} catch(e) {
					alert("send request :" + e);
				}
			};
			//LIB.addValue("info",'innerHTML',src+"?X"+LIB.getValue('SID','value')+'<br>');
			XMLHttp.open("GET",src+"?X"+LIB.getValue('SID','value'),true);
			XMLHttp.send();
		} else {
			if(func) {
				XMLHttp.onreadystatechange = function() {
					try {
						if(XMLHttp.readyState == 4) {
							if(XMLHttp.status == 200)
								if(func)
								{
									//alert(XMLHttp.responseText);
									func(LIB.decode(XMLHttp.responseText),mem);
								}
							else
								alert("Server error");//AJAX.sendRequest(src,args,func,mem);
						}
					} catch(e) {
						alert("send request2 :" + e);
					}
				};
			}
			//LIB.addValue("info",'innerHTML',src+"?"+eargs+'<br>');
			XMLHttp.open("GET",src+"?"+eargs,true);
			XMLHttp.send();
		}
		
	};
	
	//helper function for sending broken up requests
	this.breakRequest = function(src, eargs, func, mem, qid) {
		var XMLHttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		if(eargs.length == 0) {
			if(func) {
				XMLHttp.onreadystatechange = function() {
					try {
						if(XMLHttp.readyState == 4) {
							if(XMLHttp.status == 200)
								if(func)
								{
									//alert(XMLHttp.responseText);
									func(LIB.decode(XMLHttp.responseText),mem);
								}
							else
								alert("Server error");//AJAX.sendRequest(src,args,func,mem);
						}
					} catch(e) {
						alert("break request :" + e);
					}
				};
			}
			//LIB.addValue("info",'innerHTML',src+"?Z"+LIB.getValue('SID','value')+"Z"+qid+'<br>');
			XMLHttp.open("GET",src+"?Z"+LIB.getValue('SID','value')+"Z"+qid,true);
			XMLHttp.send();
		} else {
			var l = (50 > eargs.length ? eargs.length : 50);
			XMLHttp.onreadystatechange = function() {
				try {
					if(XMLHttp.readyState == 4) {
						if(XMLHttp.status == 200)
							AJAX.breakRequest(src,eargs.substring(l),func,mem,qid);
                        else
                            alert("Server error");
					}
				} catch(e) {
					alert("break request2 :" + e);
				}
			};
			//LIB.addValue("info",'innerHTML',src+"?Y"+LIB.getValue('SID','value')+"Y"+qid+"Y"+eargs.substring(0,l)+'<br>');
			XMLHttp.open("GET",src+"?Y"+LIB.getValue('SID','value')+"Y"+qid+"Y"+eargs.substring(0,l),true);
			XMLHttp.send();
		}
	};
};