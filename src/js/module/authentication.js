function AuthenticationSubmit(){
	if($('#authentication_form').valid()){
		$('#authentication_submit').attr('disabled', true);

		Auth(
			'#authentication_analyze',
			GetForm('#authentication_form'),
			function(Result){
				var
					token = (Result.hasOwnProperty('token') ? Result.token : ''),
					time = (Result.hasOwnProperty('time') ? Result.time : '1970-01-01 00:00:00'),
					message = [];

				if(token != ''){
					message.push('Token: ' + token);
				}

				if(time != '1970-01-01 00:00:00'){
					message.push('time: ' + time);
				}

				if(message.length > 0){
					alert(message.join('\n'));
				}

				$('#authentication_submit').removeAttr('disabled');
			}
		);
	}

	return false;
};