//Name:PHForm JavaScript
//Author:Peng

/*Ajax based on httprequester*/

function PHForm(){
	this.apost = function(StrSignal, RequestData, Callback) {
		if (StrSignal != null) {
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					Callback(xmlhttp.responseText);
				} else {
					return "Error:!200 !4";
				}
			}
			xmlhttp.open("POST", StrSignal, true);
			xmlhttp.send(RequestData);
		} else {
			return "StrSignal == empty";
		}
	}
	this.aget = function(StrSignal, Callback) {
		if (StrSignal != null) {
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					Callback(xmlhttp.responseText);
				} else {
					return "Error:!200 !4";
				}
			}
			xmlhttp.open("GET", StrSignal, true);
			xmlhttp.send();
		} else {
			return "StrSignal == empty";
		}
	}
	
	this.post = function(StrSignal, RequestData) {
		if (StrSignal != null) {
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("POST", StrSignal, false);
			xmlhttp.send(RequestData);
			return xmlhttp.responseText;
		} else {
			return "StrSignal == empty";
		}
	}
	this.get = function(StrSignal) {
		if (StrSignal != null) {
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("GET", StrSignal, false);
			xmlhttp.send();
			return xmlhttp.responseText;
		} else {
			return "StrSignal == empty";
		}
	}

	this.lpost = function(signal,data,callback){
		return PHForm_POSTFrom(signal,data,callback);
	}
	this.lget = function(signal,callback){
		return PHForm_GETFrom(signal,callback);
	}
	this.lstop = function(id){
		PHForm_Stop(id);
	}

	this.maskid = function(Id, buffer_object) {
		var reg = /\{\{.{1,}?\}\}/ig;
		if (buffer_object.name == "" || buffer_object.name == undefined) {
			buffer_object.name = document.getElementById(Id).innerHTML;
		}
		var code = buffer_object.name;
		var result = code.match(reg);
		for (var i = 0; i < result.length; i++) {
			var VarName = result[i].replace(/\{|\}/ig, "");
			var got = WebZ_Send_GET(VarName);
			if (got != "") {
				code = code.replace(result[i], got);
			}
		}
		document.getElementById(Id).innerHTML = code;
	}
	
	this.maskvar = function(str, buffer_object) {
		var reg = /\{\{.{1,}?\}\}/ig;
		if (buffer_object.name == "" || buffer_object.name == undefined) {
			buffer_object.name = str;
		}
		var code = buffer_object.name;
		var result = code.match(reg);
		for (var i = 0; i < result.length; i++) {
			var VarName = result[i].replace(/\{|\}/ig, "");
			var got = WebZ_Send_GET(VarName);
			if (got != "") {
				code = code.replace(result[i], got);
			}
		}
		return code;
	}
}

/*Create message easily*/
function Maker() {
	var PHForm_TempData = "";
	this.add = function (name, content) {
		PHForm_TempData += (name + "=" + content + "&");
	}
	this.get = function () {
		var ret = PHForm_TempData.substr(0, PHForm_TempData.length - 1);
		PHForm_TempData = "";
		return ret;
	}
}

/*Funcionts about security*/
function Algorithm(){
	this.CAEncode = function(src, key) {
		let text = new Array();
		for (var i = 0; i < src.length; i++) {
			text.push(src[i]);
		}
		let len = text.length;
		let pwdlen = (key.length - 1);
		let index = 0;
		for (var i = 0; i < len; i++) {
			text[i] = String.fromCharCode(parseInt(src.charCodeAt(i)) + parseInt(key.charCodeAt(index)));
			if (index < pwdlen) {
				index++;
			} else {
				index = 0;
			}
		}
		return text.toString().replace(/,/ig, "");
	}
	
	this.CADecode = function(src, key) {
		let text = new Array();
		for (var i = 0; i < src.length; i++) {
			text.push(src[i]);
		}
		let len = text.length;
		let pwdlen = (key.length - 1);
		let index = 0;
		for (var i = 0; i < len; i++) {
			text[i] = String.fromCharCode(parseInt(src.charCodeAt(i)) - parseInt(key.charCodeAt(index)));
			if (index < pwdlen) {
				index++;
			} else {
				index = 0;
			}
		}
		return text.toString().replace(/,/ig, "");
	}
}

/*web shor socket communicateion of full duplex, based on HTTPRequester*/
function WebShortSocket() {
	var _id;
	var _off;
	var recvlong_id;
	var ph=new PHForm();
	this.new = function () {
		return parseInt(ph.get("PHForm_WSS_Create_Socket"));
	}
	this.delete = function (socket_id) {
		var ph=new PHForm();
		var maker = new Maker();
		maker.add("id", socket_id);
		ph.post("PHForm_WSS_Stop_Socket", maker.get());
	}
	this.bind = function (socket_id, buffer_off) {
		_id = socket_id;
		_off = buffer_off;
	}
	this.send = function (data) {
		var ph=new PHForm();
		var maker = new Maker();
		maker.add("id", _id);
		maker.add("off", _off);
		maker.add("data", data);
		ph.post("PHForm_WSS_Send", maker.get());
	}
	this.recv = function () {
		var ph=new PHForm();
		var maker = new Maker();
		maker.add("id", _id);
		maker.add("off", _off);
		var temp = ph.post("PHForm_WSS_Recv", maker.get());
		return temp;
	}
	this.arecv = function (callback) {
		var ph=new PHForm();
		var maker = new Maker();
		maker.add("id", _id);
		maker.add("off", _off);
		ph.apost("PHForm_WSS_Recv", maker.get(), callback);
	}
	this.lrecv = function (callback) {
		var maker = new Maker();
		maker.add("id", _id);
		maker.add("off", _off);
		recvlong_id = PHForm_POSTFrom("PHForm_WSS_Recv", maker.get(), callback);
	}
	this.lstop = function (callback) {
		PHForm_Stop(recvlong_id);
	}
}

/*Not user codes*/
/*the format of callback is: function anyname(receved_data);*/
let PHForm_getform_isgot = new Array();
function PHForm_GETFrom(signal, callback) {
	PHForm_getform_isgot.push(true);
	var index = PHForm_getform_isgot.length - 1;
	var id = setInterval(function () {
		if (PHForm_getform_isgot[index] == true) {
			PHForm_getform_isgot[index] = false;
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					callback(xmlhttp.responseText);
					PHForm_getform_isgot[index] = true;
				} else {
					return "Error:Socket_Status!=4 or 200";
				}
			}
			xmlhttp.open("GET", signal, true);
			xmlhttp.setRequestHeader("PHForm-Message", "PHForm-Socket");
			xmlhttp.send();
		}
	}, 50);
	return id;
}

function PHForm_POSTFrom(signal, data, callback) {
	PHForm_getform_isgot.push(true);
	var index = PHForm_getform_isgot.length - 1;
	var id = setInterval(function () {
		console.log(index);
		if (PHForm_getform_isgot[index] == true) {
			PHForm_getform_isgot[index] = false;
			var xmlhttp;
			if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					callback(xmlhttp.responseText);
					PHForm_getform_isgot[index] = true;
				} else {
					return "Error:Socket_Status!=4 or 200";
				}
			}
			xmlhttp.open("POST", signal, true);
			xmlhttp.setRequestHeader("PHForm-Message", "PHForm-Socket");
			xmlhttp.send(data);
		}
	}, 50);
	return id;
}

function PHForm_Stop(id) {
	clearInterval(id);
}