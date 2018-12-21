if(typeof(window['htmlspecialchars']) == 'undefined'){
	window['htmlspecialchars'] = function(str){
		str = def_parameter(str, '');
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};
};