if(typeof(window['def_parameter']) != 'function'){
	window['def_parameter'] = function(Value, Default){
		return (typeof(Value) != 'undefined' ? Value : Default);
	}
};

if(typeof(window['def_option']) != 'function'){
	window['def_option'] = function(Value, Option, Default){
		var ret = Default;

		if(Array.isArray(Option)){
			if(Option.indexOf(Value) != -1){
				ret = Value;
			}
		}

		return ret;
	}
};