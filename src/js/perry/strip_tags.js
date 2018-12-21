if(typeof(window['strip_tags']) == 'undefined'){
	window['strip_tags'] = function(str, allowable_tags){
		str = def_parameter(str, '');
		allowable_tags = (((allowable_tags || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
		var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return str.replace(commentsAndPhpTags, '').replace(tags, function (wParam, lParam){
			return (allowable_tags.indexOf('<' + lParam.toLowerCase() + '>') > -1 ? wParam : '');
		});
	};
};