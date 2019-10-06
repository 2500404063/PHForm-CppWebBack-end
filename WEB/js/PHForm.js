//Name:PHForm JavaScript
//Author:Peng

/*Ajax based on httprequester*/

function PHForm() {
	this.apost = function (StrSignal, RequestData, Callback) {
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
	this.aget = function (StrSignal, Callback) {
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
	this.post = function (StrSignal, RequestData) {
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
	this.get = function (StrSignal) {
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
	this.lpost = function (signal, data, callback) {
		return PHForm_POSTFrom(signal, data, callback);
	}
	this.lget = function (signal, callback) {
		return PHForm_GETFrom(signal, callback);
	}
	this.lstop = function (id) {
		PHForm_Stop(id);
	}
	this.maskid = function (Id, buffer_object) {
		var reg = /\{\{.{1,}?\}\}/ig;
		if (buffer_object.name == "" || buffer_object.name == undefined) {
			buffer_object.name = document.getElementById(Id).innerHTML;
		}
		var code = buffer_object.name;
		var result = code.match(reg);
		for (var i = 0; i < result.length; i++) {
			var VarName = result[i].replace(/\{|\}/ig, "");
			var got = PHForm_Send_GET(VarName);
			if (got != "") {
				code = code.replace(result[i], got);
			}
		}
		document.getElementById(Id).innerHTML = code;
	}
	this.maskvar = function (str, buffer_object) {
		var reg = /\{\{.{1,}?\}\}/ig;
		if (buffer_object.name == "" || buffer_object.name == undefined) {
			buffer_object.name = str;
		}
		var code = buffer_object.name;
		var result = code.match(reg);
		for (var i = 0; i < result.length; i++) {
			var VarName = result[i].replace(/\{|\}/ig, "");
			var got = PHForm_Send_GET(VarName);
			if (got != "") {
				code = code.replace(result[i], got);
			}
		}
		return code;
	}
}

/*Create message easily*/
function GetPost(items) {
	var result = "";
	for (let index = 0; index < items.length; index++) {
		result += items[index][0] + "=" + items[index][1] + "&";
	}
	return result.substr(0, result.length - 1);
}

/*Not user's codes*/
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
function PHForm_Send_GET(StrSignal) {
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