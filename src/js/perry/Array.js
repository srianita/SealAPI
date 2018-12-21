if(typeof(Array.prototype.unique) == 'undefined'){
	Array.prototype.unique = function(){
		return this.filter(function(Value, Index, self){
			return (self.indexOf(Value) === Index);
		});
	};
};

if(typeof(Array.prototype.rsort) == 'undefined'){
	Array.prototype.rsort = function(){
		this.sort();
		this.reverse();
	};
};