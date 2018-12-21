function RegistrationSubmit(){
	if($('#registration_form').valid()){
		$('#registration_submit').attr('disabled', true);

		Register(GetForm('#registration_form'), function(Result){
			if(Result){
				Notify('Registration Completed', {
					'context': NOTIFY_CONTEXT_SUCCESS,
					'icon': 'fas fa-check-circle'
				});

				ResetForm('#registration_form');
			}else{
				Notify('Registration Failed', {
					'context': NOTIFY_CONTEXT_WARNING,
					'icon': 'fas fa-exclamation-triangle'
				});
			}

			$('#registration_submit').removeAttr('disabled');
		});
	}

	return false;
};