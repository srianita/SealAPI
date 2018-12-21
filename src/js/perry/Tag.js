if(typeof(window['FullSelector']) == 'undefined'){
	window['FullSelector'] = function(hWnd){
		var parent = ParentSelector(hWnd);
		return (parent != '' ? parent + ' > ' : '') + RealSelector(hWnd);
	};
};

if(typeof(window['GetAttr']) == 'undefined'){
	window['GetAttr'] = function(hWnd, Key, Default){
		Key = def_parameter(Key, '');
		Default = def_parameter(Default, '');

		var ret = Default;

		if($(hWnd).exists()){
			ret = ($(hWnd).hasAttr(Key) ? $(hWnd).attr(Key) : Default);
		}

		return ret;
	};
};

if(typeof(window['GetContent']) == 'undefined'){
	window['GetContent'] = function(hWnd, Default){
		Default = def_parameter(Default, '');
		return ($(hWnd).exists() ? $(hWnd).html() : Default);
	};
};

if(typeof(window['GetParent']) == 'undefined'){
	window['GetParent'] = function(hWnd, Parent){
		var ret = null, element, index, count;

		if($(hWnd).exists() && (typeof(Parent) != 'undefined')){
			element = $(hWnd).parents();
			count = element.length;
			for(index = 0; index < count; index++){
				if($(element[index]).is(Parent)){
					ret = element[index];
					index = count;
				}
			}
		}

		return ret;
	};
};

if(typeof(window['GetTag']) == 'undefined'){
	window['GetTag'] = function(hWnd){
		return ($(hWnd).exists() ? $(hWnd).prop('tagName').toLowerCase() : '');
	};
};

if(typeof(window['GetType']) == 'undefined'){
	window['GetType'] = function(hWnd){
		var ret = GetAttr(hWnd, 'type');
		return (ret != '' ? ret : GetTag(hWnd));
	};
};

if(typeof(window['ParentSelector']) == 'undefined'){
	window['ParentSelector'] = function(hWnd){
		var ret = [], index, parent = $(hWnd).parents();

		for(index = parent.length - 1; index >= 0; index--){
			ret.push(RealSelector(parent[index]));
		}

		return ret.join(' > ');
	};
};

if(typeof(window['RealSelector']) == 'undefined'){
	window['RealSelector'] = function(hWnd){
		var ret, tag, id, style, name;

		if($(hWnd).exists()){
			tag = $(hWnd).prop('tagName').toLowerCase();
			id = GetAttr(hWnd, 'id').trim();

			style = [];
			GetAttr(hWnd, 'class').split(' ').forEach(function(buffer){
				if(buffer != ''){
					style.push(buffer);
				}
			});

			name = GetAttr(hWnd, 'name').trim();
			ret = (tag != '' ? tag : '') +
				(id != '' ? '#' + id : '') +
				(style.length > 0 ? '.' + style.join('.') : '') +
				(name != '' ? '[name=' + name + ']' : '');
		}else{
			ret = '';
		}

		return ret;
	};
};

if(typeof(window['RemoveAttr']) == 'undefined'){
	window['RemoveAttr'] = function(hWnd, Key){
		Key = def_parameter(Key, '');

		if($(hWnd).exists()){
			$(hWnd).removeAttr(Key);
		}
	};
};

if(typeof(window['SetAttr']) == 'undefined'){
	window['SetAttr'] = function(hWnd, Key, Value){
		Key = def_parameter(Key, '');
		Value = def_parameter(Value, '');

		if($(hWnd).exists()){
			$(hWnd).attr(Key, Value);
		}
	};
};

if(typeof(window['SetContent']) == 'undefined'){
	window['SetContent'] = function(hWnd, Content){
		Content = def_parameter(Content, '');

		if($(hWnd).exists()){
			$(hWnd).html(Content);
		}
	};
};