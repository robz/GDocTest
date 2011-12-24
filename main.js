var OUTPUT_FILENAME = "data.txt";
var counter = 0;

var textarea, count, debug;
var postRequest;

function init() {
	textarea = document.getElementById("code");
	count = document.getElementById("counter");
	debug = document.getElementById("debug");
	postRequest = initPostRequest(OUTPUT_FILENAME, true);
	continuousGetFile(OUTPUT_FILENAME, placeText);
}

var prev = "";
function placeText(text) {
	if (text != prev) {
		textarea.value = text;
		prev = text;
	}
}

function writeBackText(text) {
	debug.innerHTML = text;
	postFile(OUTPUT_FILENAME, true, text, postRequest);
}

// should be async (it would be silly to do it syncr)
function continuousGetFile(filename, postfunct) {
	var ajaxRequest;

	if(window.XMLHttpRequest) 
		ajaxRequest = new XMLHttpRequest();
	else
		ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");

	// recursive step: 
	// (but another way to think about it is this 
	//	"resets the interrupt enable")
	var sendRequest = function() {
		ajaxRequest.open("GET", 
		filename+"?random="+(new Date()).getTime(), true);
		ajaxRequest.send();
	}

	ajaxRequest.onreadystatechange = function() {
		if (ajaxRequest.readyState==4 && ajaxRequest.status==200) {
			postfunct(ajaxRequest.responseText);
			
			counter++;
			count.innerHTML = "# of GETs so far: "+counter;
				
			setTimeout(sendRequest, 500);
		}
	}

	ajaxRequest.open("GET", filename+"?random="+(new Date()).getTime(), true);
	ajaxRequest.send();
}

function initPostRequest(filename, isAsync) {
	var ajaxRequest;
	if (window.XMLHttpRequest)
		ajaxRequest = new XMLHttpRequest();
	else
		ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
	if (isAsync) {
		// Call a function when the state changes.	
		ajaxRequest.onreadystatechange = function() {
			if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
				//alert(ajaxRequest.responseText);
			}
		}
	}
	return ajaxRequest;
}

function postFile(filename, isAsync, text, ajaxRequest) {
	var params = "text="+text+"&filename="+filename;
	ajaxRequest.open("POST","write.php",isAsync);
	ajaxRequest.setRequestHeader("Content-type",
		"application/x-www-form-urlencoded");
	ajaxRequest.send(params);
}

function getFile(filename, postfunct, isAsync) {
	var ajaxRequest;

	if(window.XMLHttpRequest) 
		ajaxRequest = new XMLHttpRequest();
	else
		ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");

	if (isAsync) {
		ajaxRequest.onreadystatechange = function() {
			if (ajaxRequest.readyState==4 && ajaxRequest.status==200) 
				postfunct(ajaxRequest.responseText);
		}
	}

	ajaxRequest.open("GET", filename, isAsync);
	ajaxRequest.send();
	
	if (!isAsync)
		postfunct(ajaxRequest.responseText);
}