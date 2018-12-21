function SealSubmit(){
	var
		form, data, files,
		index, count,
		dump = { 'seal': [], 'verify': [] };

	if($('#seal_form').valid()){
		$('#seal_submit').attr('disabled', true);

		form = GetForm('#seal_form');
		data = new FormData();
		files = $('#seal_image')[0].files;
		count = files.length;
		if(count == 1){
			dump.seal.push(files[0].name);
			data.append('seal', files[0]);
		}else{
			for(index = 0; index < count; index++){
				dump.seal.push(files[index].name);
				data.append('seal[]', files[index]);
			};
		}

		API(
			'#seal_analyze',
			form.token, data, dump,
			function(Result){
				$('#seal_submit').removeAttr('disabled');
			}
		);
	}

	return false;
};