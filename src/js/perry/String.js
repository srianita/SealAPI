// Normalize: Internet Explorer
if(typeof(String.prototype.trim) == 'undefined'){
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, '');
	};
};