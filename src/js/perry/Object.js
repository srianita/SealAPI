if(typeof(window['ObjectDefault']) == 'undefined'){
	window['ObjectDefault'] = function(hObject, Default){
		hObject = def_parameter(hObject, {});
		Default = def_parameter(Default, {});

		var ret = {}, key;

		if(typeof(hObject) == 'object'){
			for(key in Default){
				ret[key] = (
					hObject.hasOwnProperty(key) ?
					(
						typeof(hObject[key]) == typeof(Default[key]) ?
						hObject[key] : Default[key]
					) : Default[key]
				);
			}
		}else{
			ret = Default;
		}

		return $.extend({}, ret);
	};
};

if(typeof(window['ObjectPrefix']) == 'undefined'){
	window['ObjectPrefix'] = function(hObject, Prefix){
		hObject = def_parameter(hObject, {});
		Prefix = def_parameter(Prefix, '');

		var ret = {}, match, length, key;

		if((typeof(hObject) == 'object') && (Prefix != '')){
			match = Prefix.trim() + '_';
			length = match.length;

			for(key in hObject){
				if(
					(key != Prefix) &&
					(key.substring(0, length) == match)
				){
					ret[key.substring(length)] = hObject[key];
				}
			}
		}

		return $.extend({}, ret);
	};
};