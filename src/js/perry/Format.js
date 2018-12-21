if(typeof(window['fAlphaNumeric']) == 'undefined'){
	window['fAlphaNumeric'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		return hAlloc.replace(/[^a-zA-Z0-9]+/g, '');
	};
};

if(typeof(window['fAlphabet']) == 'undefined'){
	window['fAlphabet'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		return hAlloc.replace(/[^a-zA-Z]+/g, '');
	};
};

if(typeof(window['fHexa']) == 'undefined'){
	window['fHexa'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		return hAlloc.toUpperCase().replace(/[^A-F0-9]+/g, '');
	};
};

if(typeof(window['fNumeric']) == 'undefined'){
	window['fNumeric'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		return hAlloc.replace(/[^0-9\.\-]+/g, '');
	};
};

if(typeof(window['fSymbol']) == 'undefined'){
	window['fSymbol'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		return hAlloc.replace(/[a-zA-Z0-9]+/g, '');
	};
};

if(typeof(window['fCurrency']) == 'undefined'){
	window['fCurrency'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');

		var ret = '', buffer;

		if(typeof(hAlloc) == 'number'){
			hAlloc = hAlloc.toString();
		}

		if(typeof(hAlloc) == 'string'){
			buffer = fNumeric(hAlloc).split('.');
			buffer[0] = buffer[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

			if(buffer.length > 1){
				ret = buffer[0] + ',' + ConvIntToStr(Math.round(ConvStrToDouble('0.' + buffer[1]) * 100));
			}else{
				ret = buffer[0] + ',00';
			}
		}

		return ret;
	};
};