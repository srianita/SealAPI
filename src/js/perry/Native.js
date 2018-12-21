if(typeof(window['ClipboardCopy']) == 'undefined'){
	window['ClipboardCopy'] = function(Value){
		Value = def_parameter(Value, '');

		var ret = false, buffer, temp;

		if(window.clipboardData){
			window.clipboardData.setData('Text', Value);
			ret = true;
		}else if(window.hasOwnProperty('document')){
			buffer = window['document'].activeElement;
			temp = window['document'].createElement('textarea');
			temp.style.opacity = 0;
			temp.value = Value;
			window['document'].body.appendChild(temp);
			temp.select();
			ret = window['document'].execCommand('copy');
			window['document'].body.removeChild(temp);
			if(buffer.hasOwnProperty('select')){ buffer.select(); }
		}

		return ret;
	};
};

if(typeof(window['ClipboardPaste']) == 'undefined'){
	window['ClipboardPaste'] = function(){
		var ret = '', buffer, temp;

		if(window.clipboardData){
			ret = window.clipboardData.getData('Text');
		}else if(window.hasOwnProperty('document')){
			buffer = window['document'].activeElement;
			temp = window['document'].createElement('textarea');
			temp.style.opacity = 0;
			window['document'].body.appendChild(temp);
			temp.select();

			if(window['document'].execCommand('paste')){
				ret = temp.Value;
			}else{
				console.warn('ClipboardPaste has been disabled!');
			}

			window['document'].body.removeChild(temp);
			if(buffer.hasOwnProperty('select')){ buffer.select(); }
		}

		return ret;
	};
};

if(typeof(window['Generate']) == 'undefined'){
	window['Generate'] = function(Length){
		Length = def_parameter(Length, 8);

		var ret = '', rnd, index;

		for(index = 0; index < Length; index++){
			rnd = Math.floor(Math.random() * 36);
			ret += String.fromCharCode(rnd < 10 ? rnd + 48 : rnd + 55);
		}

		return ret;
	};
};

if(typeof(window['GenerateA']) == 'undefined'){
	window['GenerateA'] = function(Length){
		Length = def_parameter(Length, 8);

		var ret = '', index;

		for(index = 0; index < Length; index++){
			ret += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
		}

		return ret;
	};
};

if(typeof(window['GenerateX']) == 'undefined'){
	window['GenerateX'] = function(Length){
		Length = def_parameter(Length, 8);

		var ret = '', index;

		for(index = 0; index < Length; index++){
			ret += String.fromCharCode(Math.floor(Math.random() * 10) + 48);
		}

		return ret;
	};
};

if(typeof(window['GetHash']) == 'undefined'){
	window['GetHash'] = function(Key, Default){
		Key = def_parameter(Key, '');
		Default = def_parameter(Default, '');

		var
			ret = Default,
			hash = window.location.hash,
			buffer, data, index, count;

		if(hash.substring(0, 1) == '#'){
			hash = hash.substring(1);
		}

		hash.split('&').forEach(function(data){
			buffer = data.split('=');
			if(Key == decodeURI(buffer[0])){
				ret = decodeURI(buffer.slice(1).join('='));
				index = count;
			}
		});

		return ret;
	};
};

if(typeof(window['GetValue']) == 'undefined'){
	window['GetValue'] = function(Key, Default){
		Default = def_parameter(Default, '');

		var ret = Default, type;

		if($(Key).exists()){
			type = GetType(Key);
			switch(type){
				case 'script':	case 'img':	case 'iframe':
					ret = GetAttr(Key, 'src');
					break;

				case 'style':	case 'a':
					ret = GetAttr(Key, 'href');
					break;

				case 'radio':
					$(Key).each(function(index, value){
						if($(this).is(":checked")){
							ret = GetAttr(this, 'value');
						}
					});
					break;
				case 'checkbox':
					if($(Key).is(":checked")){
						ret = GetAttr(Key, 'value');
					}
					break;
				case 'select':
					if($(Key).hasAttr('multiple')){
						ret = [];
						$(Key).find('option:selected').each(function(){
							ret.push(GetAttr(this, 'value'));
						});
					}else{
						$(Key).find('option:selected').each(function(){
							ret = GetAttr(this, 'value');
						});
					}
					break;

				case 'button':	case 'reset':	case 'submit':
				case 'color':	case 'email':	case 'password':	case 'search':	case 'tel':	case 'text':	case 'url':
				case 'date':	case 'datetime-local':	case 'month':	case 'time':	case 'week':
				case 'file':	case 'hidden':
					ret = $(Key).val();
					break;

				case 'number':	case 'range':
					ret = ConvStrToDouble($(Key).val());
					break;
				case 'textarea':
					ret = (
						$(Key).hasClass('trumbowyg-textarea') ?
						$(Key).trumbowyg('html') : $(Key).val()
					);
					break;

				default:
					ret = GetAttr(Key, 'value');
					break;
			}
		}

		return ret;
	};
};

if(typeof(window['GetOption']) == 'undefined'){
	window['GetOption'] = function(Value, Enumerations, Default){
		Value = def_parameter(Value, '');
		Enumerations = def_parameter(Enumerations, []);
		Default = def_parameter(Default, '');
		return (Enumerations.indexOf(Value) != -1 ? Value : Default);
	};
};

if(typeof(window['MilliSecond']) == 'undefined'){
	window['MilliSecond'] = function(){
		return new Date().getTime();
	};
};

if(typeof(window['SetHash']) == 'undefined'){
	window['SetHash'] = function(Key, Value){
		Key = def_parameter(Key, '');
		Value = def_parameter(Value, '');

		var
			hash = window.location.hash,
			flag = true, data = [];

		if(hash.substring(0, 1) == '#'){
			hash = hash.substring(1);
		}

		hash.split('&').forEach(function(current){
			var
				buffer = current.split('='),
				temp = buffer.slice(1).join('=');

			if(Key == decodeURI(buffer[0])){
				temp = encodeURI(Value);
				flag = false;
			}

			if(buffer[0] != ''){
				data.push(buffer[0] + '=' + temp);
			}
		});

		if(flag){
			data.push(encodeURI(Key) + '=' + encodeURI(Value));
		}

		window.location.hash = data.join('&');
	};
};

if(typeof(window['SetValue']) == 'undefined'){
	window['SetValue'] = function(Key, Value){
		Value = def_parameter(Value, '');

		var type, index, count, buffer;

		if($(Key).exists()){
			type = GetType(Key);
			switch(type){
				case 'file':
					break;
				case 'script':	case 'img':	case 'iframe':
					SetAttr(Key, 'src', Value);
					break;

				case 'style':	case 'a':
					SetAttr(Key, 'href', Value);
					break;

				case 'radio':
					$(Key).each(function(){
						$(this).prop('checked', ($(this).val() == Value));
					});
					break;
				case 'checkbox':
					if(!Array.isArray(Value)){
						Value = [Value];
					}

					count = Value.length;
					for(index = 0; index < count; index++){
						if(typeof(Value[index]) == 'number'){
							Value[index] = Value[index].toString();
						}
					}

					$(Key).each(function(){
						$(this).prop('checked', (Value.indexOf($(this).val()) != -1));
					});
					break;
				case 'select':
					if(!Array.isArray(Value)){
						Value = [Value];
					}

					count = Value.length;
					for(index = 0; index < count; index++){
						if(typeof(Value[index]) == 'number'){
							Value[index] = Value[index].toString();
						}
					}

					$(Key).find('option').each(function(){
						$(this).prop('selected', (Value.indexOf($(this).val().toString()) != -1));
					});
					break;

				case 'button':	case 'reset':	case 'submit':
				case 'color':	case 'email':	case 'password':	case 'search':	case 'tel':	case 'text':	case 'url':
				case 'date':	case 'datetime-local':	case 'month':	case 'time':	case 'week':
				case 'number':	case 'range':
					$(Key).val(Value);
					break;

				case 'textarea':
					if($(Key).hasClass('trumbowyg-textarea')){
						$(Key).trumbowyg('html', Value);
					}else{
						$(Key).val(Value);
					}
					break;

				case 'hidden':
					if(!$(Key).hasAttr('value-reset')){
						SetAttr(Key, 'value-reset', $(Key).val());
					}
					$(Key).val(Value);
					break;

				default:
					SetAttr(Key, 'value', Value);
					break;
			}
		}
	};
};

if(typeof(window['UniqueID']) == 'undefined'){
	window['UniqueID'] = function(Attribute){
		Attribute = def_parameter(Attribute, 'id');

		var ret = 'UID' + GenerateX(), buffer;

		switch(Attribute){
			case 'id':
				buffer = '#' + ret;
				break;
			case 'class':
				buffer = '.' + ret;
				break;
			default:
				buffer = '[' + Attribute + '=' + ret + ']';
				break;
		}

		while($(buffer).exists()){
			ret = 'UID' + GenerateX();

			switch(Attribute){
				case 'id':
					buffer = '#' + ret;
					break;
				case 'class':
					buffer = '.' + ret;
					break;
				default:
					buffer = '[' + Attribute + '=' + ret + ']';
					break;
			}
		}

		return ret;
	};
};