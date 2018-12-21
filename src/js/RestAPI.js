var
	API_TOKEN = '';
	API_TIMEOUT = 30000;

function RestMessage(Data){
	if(Data.hasOwnProperty('message')){
		Data.message.forEach(function(data){
			if(data.hasOwnProperty('text')){
				switch((data.hasOwnProperty('type') ? data.type : 0)){
					case 1:
						console.log(data.text);
						Notify(data.text, {
							'context': NOTIFY_CONTEXT_PRIMARY,
							'icon': 'fas fa-check-circle'
						});
						break;
					case 2:
						console.log(data.text);
						Notify(data.text, {
							'context': NOTIFY_CONTEXT_INFO,
							'icon': 'fas fa-bell'
						});
						break;
					case 3:
						console.warn(data.text);
						Notify(data.text, {
							'context': NOTIFY_CONTEXT_WARNING,
							'icon': 'fas fa-exclamation-triangle'
						});
						break;
					case 4:
						console.error(data.text);
						Notify(data.text, {
							'context': NOTIFY_CONTEXT_DANGER,
							'icon': 'fas fa-times-circle'
						});
						break;
					default:
						console.debug(data.text);
						break;
				}
			}
		});
	}
};

function RestCallback(AddrPtr, Data){
	if(typeof(AddrPtr) == 'function'){
		AddrPtr((Data.hasOwnProperty('result') ? Data.result : null));
	}
};

function RestError(Caption, ResponseCode, Description){
	console.error(Caption + '(' + ResponseCode + '): ' + Description);

	Notify(ResponseCode + ' - ' + Description, {
		'context': NOTIFY_CONTEXT_DANGER,
		'icon': 'fas fa-times'
	});
};

function RestDump(hDC, Type, URL, Header, Data, File, CBSuccess, CBError){
	var
		request = ['curl -v -X ' + Type + ' ' + location.protocol + '//' + location.hostname + URL],
		multipart = Data instanceof FormData;

	$.ajax({
		'type': Type,
		'processData': !multipart,
		'contentType': (multipart ? false : 'application/json'),
		'url': URL,
		'headers': Header,
		'data': (multipart ? Data : JSON.stringify(Data)),
		'timeout': API_TIMEOUT,
		'success': function(content, status, xhr){
			RestDumpThread(hDC, Type, URL, Header, Data, File, content, xhr);
			CBSuccess(content, status, xhr);
		},
		'error': function(xhr, status, error){
			RestDumpThread(hDC, Type, URL, Header, Data, File, {}, xhr);
			CBError(xhr, status, error);
		}
	});
};

function RestDumpThread(hDC, Type, URL, Header, Data, File, Response, XHR){
	var
		request = ['curl -v -X ' + Type + ' ' + location.protocol + '//' + location.hostname + URL],
		multipart = Data instanceof FormData,
		key, index, count;

	for(key in Header){
		request.push('-H \'' + key + ': ' + Header[key] + '\'');
	}

	if(multipart){
		request.push('-H \'Content-Type: multipart/form-data\'');
		if(!$.isEmptyObject(File)){
			for(key in File){
				count = File[key].length;
				if(count == 1){
					request.push('-F \'' + key + '=@' + File[key][0] + '\'');
				}else{
					for(index = 0; index < count; index++){
						request.push('-F \'' + key + '[]=@' + File[key][index] + '\'');
					};
				}
			}
		}
	}else{
		request.push('-H \'Content-Type: application/json\'');
		if(!$.isEmptyObject(Data)){
			request.push('-d \'' + JSON.stringify(Data, null, 2) + '\'');
		}
	}

	$(hDC).html(
		'<div class="row">' +
			'<div class="col-md-6">' +
				'<h5 class="card-title">Request</h5>' +
				'<code><pre>' + request.join(' \\\n') + '</pre></code>' +
			'</div>' +
			'<div class="col-md-6">' +
				'<h5 class="card-title">Response (<strong>' + XHR.status.toString() + ' / ' + XHR.statusText + '</strong>)</h5>' +
				'<code><pre>' + JSON.stringify(Response, null, 2) + '</pre></code>' +
			'</div>' +
		'</div>'
	);
};

function Register(Data, Callback){
	$.ajax({
		'type': 'POST',
		'url': '/register',
		'data': Data,
		'timeout': API_TIMEOUT,
		'success': function(content, status, xhr){
			RestMessage(content);
			RestCallback(Callback, content);
		},
		'error': function(xhr, status, error){
			RestError('Register',  xhr.status.toString(), xhr.statusText);
		}
	});
};

function Auth(hDC, Data, Callback){
	RestDump(
		hDC, 'POST', '/auth', {}, Data, {},
		function(content, status, xhr){
			RestMessage(content);
			RestCallback(Callback, content);
		},
		function(xhr, status, error){
			RestError('Auth',  xhr.status.toString(), xhr.statusText);
		}
	);
};

function API(hDC, Token, Data, File, Callback){
	RestDump(
		hDC, 'POST', '/api',
		{ 'Authorization': 'Bearer ' + Token },
		Data, File,
		function(content, status, xhr){
			RestMessage(content);
			RestCallback(Callback, content);
		},
		function(xhr, status, error){
			RestError('API',  xhr.status.toString(), xhr.statusText);
		}
	);
};