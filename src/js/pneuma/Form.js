if(typeof(window['CopyForm']) == 'undefined'){
	window['CopyForm'] = function(hWnd, Name){
		Name = def_parameter(Name, '').trim();
		var ret = false, form;

		if($(hWnd).exists() && (Name != '') && document.queryCommandSupported('copy')){
			form = GetForm(hWnd);
			ret = (form.hasOwnProperty(Name) ? ClipboardCopy(form[Name]) : false);
		}

		return ret;
	};
};

if(typeof(window['GetForm']) == 'undefined'){
	window['GetForm'] = function(hWnd){
		var ret = {};

		if($(hWnd).exists()){
			if(GetTag(hWnd) == 'form'){
				$(hWnd).find('input[name]:not([disabled]), select[name]:not([disabled]), textarea[name]:not([disabled])').each(function(){
					ret[GetAttr(this, 'name')] = GetValue(this);
				});
			}
		}

		return ret;
	};
};

if(typeof(window['ResetForm']) == 'undefined'){
	window['ResetForm'] = function(hWnd){
		if($(hWnd).exists()){
			$(hWnd).each(function(index, value){
				if(GetTag(this) == 'form'){
					$(this).find('input[name][type=hidden]:not([disabled]):not([value-reset])').each(function(){
						SetAttr(this, 'value-reset', GetValue(this));
					});

					$(this)[0].reset();
					$(this).find('input[name][type=hidden]:not([disabled])').each(function(){
						SetValue(this, GetAttr(this, 'value-reset'));
					});
				}
			});
		}
	};
};

if(typeof(window['SetForm']) == 'undefined'){
	window['SetForm'] = function(hWnd, Data){
		Data = def_parameter(Data, {});

		if($(hWnd).exists() && (typeof(Data) == 'object')){
			if(GetTag(hWnd) == 'form'){
				$(hWnd).find('input[name]:not([disabled]), select[name]:not([disabled]), textarea[name]:not([disabled])').each(function(){
					var name = GetAttr(this, 'name');

					if(Data.hasOwnProperty(name)){
						SetValue(this, Data[name]);
					}
				});
			}
		}
	};
};

if(typeof(window['SubmitForm']) == 'undefined'){
	window['SubmitForm'] = function(hWnd){
		if($(hWnd).exists()){
			if(GetTag(hWnd) == 'form'){
				$(hWnd)[0].submit();
			}
		}
	};
};
