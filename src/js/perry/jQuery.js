(function($){
	$.fn.extend({
		exists: function(){
			return (this.length > 0);
		},

		hasAttr: function(Key){
			Key = def_parameter(Key, '');
			var attr = $(this).attr(Key);
			return (typeof(attr) != 'undefined');
		},

		outerHTML : function(){
			return jQuery('<div />').append(this.eq(0).clone()).html();
		},

		removeAllAttributes: function(){
			this.each(function() {
				var hWnd = this, attributes = $.map(this.attributes, function (item) { return item.name; });
				$.each(attributes, function (i, item) { $(hWnd).removeAttr(item); });
			});

			return this;
		},

		removeStyle: function(Key){
			Key = def_parameter(Key, '');

			var
				start, end, buffer,
				style = $(this).attr('style');

			if(
				(style != '') &&
				(style != null) &&
				(style != 'undefined')
			) {
				start = style.indexOf(Key);
				if(start != -1) {
					end = style.indexOf(';', start + 1);
					if(end == -1) end = style.length;

					buffer = style.replace(style.slice(start, end + 1), '');
					$(this).attr('style', buffer);
				}
			}

			return this;
		}
	});
}(jQuery));