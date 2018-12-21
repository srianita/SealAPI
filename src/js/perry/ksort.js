if(typeof(window['ksort']) == 'undefined'){
	window['ksort'] = function(Data){
		var
			ret,
			cache = {}, buffer = [],
			key, index, count;

		if(typeof(Data) == 'object'){
			for(key in Data){
				buffer.push(key);
			}

			buffer.sort();
			buffer.forEach(function(key){
				cache[key] = Data[key];
			});

			Data = cache;
			ret = true;
		}else{
			ret = false;
		}

		return ret;
	};
};

if(typeof(window['krsort']) == 'undefined'){
	window['krsort'] = function(Data){
		var
			ret,
			cache = {}, buffer = [],
			key, index, count;

		if(typeof(Data) == 'object'){
			for(key in Data){
				buffer.push(key);
			}

			buffer.sort();
			buffer.reverse();
			buffer.forEach(function(key){
				cache[key] = Data[key];
			});

			Data = cache;
			ret = true;
		}else{
			ret = false;
		}

		return ret;
	};
};