/*
if(typeof(window['gettype']) == 'undefined'){
	window['gettype'] = function(Variant){
		var ret = typeof(Variant);

		switch(ret){
			case 'object'
				if(Array.isArray(Variant)){
					ret = 'array';
				}else if(Variant == null){
					ret = 'null';
				}
				break;
			case 'number'
				if(Number.isInteger(Variant)){
					ret = 'integer';
				}else{
					ret = 'double';
				}
				break;
		}

		return ret;
	};
};
*/