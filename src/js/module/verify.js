function VerifySubmit(){
	var
		form, data, files,
		index, count,
		dump = { 'seal': [], 'verify': [] };

	if($('#verify_form').valid()){
		$('#verify_submit').attr('disabled', true);

		form = GetForm('#verify_form');
		data = new FormData();
		files = $('#verify_image')[0].files;
		count = files.length;
		if(count == 1){
			dump.verify.push(files[0].name);
			data.append('verify', files[0]);
		}else{
			for(index = 0; index < count; index++){
				dump.verify.push(files[index].name);
				data.append('verify[]', files[index]);
			};
		}

		API(
			'#verify_analyze',
			form.token, data, dump,
			function(Result){
				$('#verify_submit').removeAttr('disabled');
			}
		);
	}

	return false;
};