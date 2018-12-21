if(typeof(window['ConvBytesToHex']) == 'undefined'){
	window['ConvBytesToHex'] = function(Bytes){
		Bytes = def_parameter(Bytes, []);

		var ret = '', pad = '00', buffer;

		if(typeof(Bytes) == 'string'){
			Bytes = Bytes.split('');
		}

		if(Array.isArray(Bytes)){
			Bytes.forEach(function(byte){
				switch(typeof(byte)){
					case 'string':
						if(byte.length > 0){
							buffer = (byte.charCodeAt(byte.length - 1) & 0xFF).toString(16);
							ret += pad.substring(0, 2 - buffer.length) + buffer;
						}
						break;
					case 'number':
						buffer = (byte & 0xFF).toString(16);
						ret += pad.substring(0, 2 - buffer.length) + buffer;
						break;
				}
			});
		}

		return ret.toUpperCase();
	};
};

if(typeof(window['ConvBytesToInt']) == 'undefined'){
	window['ConvBytesToInt'] = function(Bytes){
		Bytes = def_parameter(Bytes, []);

		var ret = 0;

		if(typeof(Bytes) == 'string'){
			Bytes = Bytes.split('');
		}

		if(Array.isArray(Bytes)){
			Bytes.forEach(function(byte){
				switch(typeof(byte)){
					case 'string':
						if(byte.length > 0){
							ret |= byte.charCodeAt(byte.length - 1) & 0xFF;
						}
						break;
					case 'number':
						ret |= byte & 0xFF;
						break;
				}
			});
		}

		return ret;
	};
};

if(typeof(window['ConvBytesToStr']) == 'undefined'){
	window['ConvBytesToStr'] = function(Bytes){
		Bytes = def_parameter(Bytes, []);

		var ret = '';

		if(typeof(Bytes) == 'string'){
			Bytes = Bytes.split('');
		}

		if(Array.isArray(Bytes)){
			Bytes.forEach(function(byte){
				switch(typeof(byte)){
					case 'string':
						if(byte.length > 0){
							ret += byte.substring(byte.length - 1);
						}
						break;
					case 'number':
						ret += String.fromCharCode(byte & 0xFF);
						break;
				}
			});
		}

		return ret;
	};
};

if(typeof(window['ConvDateToSTD']) == 'undefined'){
	window['ConvDateToSTD'] = function(hDate){
		hDate = def_parameter(hDate, -1);

		var ret = new Date();

		if(hDate != -1){
			ret.setTime(hDate * 1000);
		}

		return ret.getFullYear() + '-' +
			('0' + (ret.getMonth() + 1)).slice(-2) + '-' +
			('0' + ret.getDate()).slice(-2) + ' ' +
			('0' + ret.getHours()).slice(-2) + ':' +
			('0' + ret.getMinutes()).slice(-2) + ':' +
			('0' + ret.getSeconds()).slice(-2);
	};
};

if(typeof(window['ConvHexToBytes']) == 'undefined'){
	window['ConvHexToBytes'] = function(hAlloc, StringFormat){
		hAlloc = def_parameter(hAlloc, '');
		StringFormat = def_parameter(StringFormat, false);

		var ret = [], ascii, pointer, length;

		hAlloc = fHexa(hAlloc);
		if((hAlloc.length % 2) != 0){
			hAlloc = '0' + hAlloc;
		}

		length = hAlloc.length;
		for(pointer = 0; pointer < length; pointer += 2){
			ascii = parseInt(hAlloc.substring(pointer, (pointer + 2)), 16) & 0xFF;
			ret.push(StringFormat ? String.fromCharCode(ascii) : ascii);
		}

		return ret;
	};
};

if(typeof(window['ConvHexToInt']) == 'undefined'){
	window['ConvHexToInt'] = function(hAlloc, ArrayFormat){
		hAlloc = def_parameter(hAlloc, '');
		ArrayFormat = def_parameter(ArrayFormat, false);

		var
			ret,
			pointer, length,
			buffer, limit;

		hAlloc = fHexa(hAlloc);
		if((hAlloc.length % 2) != 0){
			hAlloc = '0' + hAlloc;
		}

		if(ArrayFormat){
			ret = [];
			length = hAlloc.length;

			for(pointer = 0; pointer < length; pointer += 8){
				limit = 8;
				buffer = length - (pointer + limit);
				if(buffer < 0){
					limit += buffer;
					buffer = 0;
				}

				ret.push(parseInt(hAlloc.substring(buffer, (buffer + limit)), 16) & 0xFFFFFFFF);
			}
		}else{
			ret = parseInt(hAlloc, 16);
		}

		return ret;
	};
};

if(typeof(window['ConvHexToStr']) == 'undefined'){
	window['ConvHexToStr'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');

		var ret = '', pointer, length;

		hAlloc = fHexa(hAlloc);
		if((hAlloc.length % 2) != 0){
			hAlloc = '0' + hAlloc;
		}

		length = hAlloc.length;
		for(pointer = 0; pointer < length; pointer += 2){
			ret += String.fromCharCode(parseInt(hAlloc.substring(pointer, (pointer + 2)), 16) & 0xFF);
		}

		return ret;
	};
};

if(typeof(window['ConvIntToBytes']) == 'undefined'){
	window['ConvIntToBytes'] = function(Value, StringFormat){
		Value = def_parameter(Value, 0);
		StringFormat = def_parameter(StringFormat, false);

		var ret = [], ascii;

		for(ascii = 1; ascii <= Value; ascii++){
			if((ascii & Value) == ascii){
				ret.push(StringFormat ? String.fromCharCode(ascii & 0xFF) : ascii);
			}
		}

		return ret;
	};
};

if(typeof(window['ConvIntToHex']) == 'undefined'){
	window['ConvIntToHex'] = function(Value){
		Value = def_parameter(Value, 0);

		var ret = '';

		if(Array.isArray(Value)){
			Value.forEach(function(buffer){
				ret = ConvIntToHex(Value[index]) + ret;
			});
		}else{
			if(typeof(Value) == 'number'){
				ret = (Value & 0xFFFFFFFF).toString(16);
				if((ret.length % 2) != 0){
					ret = '0' + ret;
				}
			}
		}

		return ret.toUpperCase();
	};
};

if(typeof(window['ConvIntToStr']) == 'undefined'){
	window['ConvIntToStr'] = function(Value){
		Value = def_parameter(Value, 0);
		return (typeof(Value) == 'number' ? Value.toString() : '');
	};
};

if(typeof(window['ConvSTDToDate']) == 'undefined'){
	window['ConvSTDToDate'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');
		var ret = (hAlloc != '' ? new Date(hAlloc) : new Date());
		return Math.floor(ret.getTime() / 1000);
	};
};

if(typeof(window['ConvStrToBytes']) == 'undefined'){
	window['ConvStrToBytes'] = function(hAlloc, StringFormat){
		hAlloc = def_parameter(hAlloc, '');
		StringFormat = def_parameter(StringFormat, false);

		var ret = [], char, index, count = hAlloc.length;

		for(index = 0; index < count; index++){
			char = hAlloc.substring(index, (index + 1));
			ret.push(StringFormat ? char : char.charCodeAt(0) & 0xFF);
		}

		return ret;
	};
};

if(typeof(window['ConvStrToDouble']) == 'undefined'){
	window['ConvStrToDouble'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '0');

		var ret, buffer;

		switch(typeof(hAlloc)){
			case 'boolean':
				ret = (hAlloc ? 1 : 0);
				break;
			case 'number':
				ret = hAlloc;
				break;
			case 'string':
				buffer = fNumeric(hAlloc);
				ret = (buffer != '' ? parseFloat(buffer) : 0);
				break;
			default:
				ret = 0;
		}

		return ret;
	};
};

if(typeof(window['ConvStrToHex']) == 'undefined'){
	window['ConvStrToHex'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');

		var
			ret = '', pad = '00', buffer,
			index, count = hAlloc.length;

		for(index = 0; index < count; index++){
			buffer = (hAlloc.charCodeAt(index) & 0xFF).toString(16);
			ret += pad.substring(0, 2 - buffer.length) + buffer;
		}

		return ret.toUpperCase();
	};
};

if(typeof(window['ConvStrToInt']) == 'undefined'){
	window['ConvStrToInt'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '0');

		var ret, buffer;

		switch(typeof(hAlloc)){
			case 'boolean':
				ret = (hAlloc ? 1 : 0);
				break;
			case 'number':
				ret = hAlloc;
				break;
			case 'string':
				buffer = fNumeric(hAlloc);
				ret = (buffer != '' ? parseInt(buffer) : 0);
				break;
			default:
				ret = 0;
		}

		return ret;
	};
};

if(typeof(window['ConvUtf16To8']) == 'undefined'){
	window['ConvUtf16To8'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');

		var
			ret = '', buffer, pointer,
			length = hAlloc.length;

		for(pointer = 0; pointer < length; pointer++){
			buffer = hAlloc.charCodeAt(pointer);
			if((buffer >= 0x0001) && (buffer <= 0x007F)){
				ret += hAlloc.charAt(pointer);
			}else if(buffer > 0x07FF){
				ret += String.fromCharCode(0xE0 | ((buffer >> 12) & 0x0F)) +
					String.fromCharCode(0x80 | ((buffer >> 6) & 0x3F)) +
					String.fromCharCode(0x80 | ((buffer >> 0) & 0x3F));
			}else{
				ret += String.fromCharCode(0xC0 | ((buffer >> 6) & 0x1F)) +
					String.fromCharCode(0x80 | ((buffer >> 0) & 0x3F));
			}
		}

		return ret;
	};
};

if(typeof(window['ConvUtf8To16']) == 'undefined'){
	window['ConvUtf8To16'] = function(hAlloc){
		hAlloc = def_parameter(hAlloc, '');

		var
			ret = '', pointer = 0,
			length = hAlloc.length,
			byte1, byte2, byte3;

		while(pointer < length){
			byte1 = hAlloc.charCodeAt(pointer++);
			switch(byte1 >> 4){
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					ret += hAlloc.charAt(pointer-1);
					break;
				case 12: case 13:
					// 110x xxxx 10xx xxxx
					byte2 = hAlloc.charCodeAt(pointer++);
					ret += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx 10xx xxxx 10xx xxxx
					byte2 = hAlloc.charCodeAt(pointer++);
					byte3 = hAlloc.charCodeAt(pointer++);
					ret += String.fromCharCode(
						((byte1 & 0x0F) << 12) |
						((byte2 & 0x3F) << 6) |
						((byte3 & 0x3F) << 0)
					);
					break;
			}
		}

		return ret;
	};
};