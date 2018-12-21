var
	NOTIFY_CONTEXT_PRIMARY = 0,
	NOTIFY_CONTEXT_SECONDARY = 1,
	NOTIFY_CONTEXT_SUCCESS = 2,
	NOTIFY_CONTEXT_INFO = 3,
	NOTIFY_CONTEXT_WARNING = 4,
	NOTIFY_CONTEXT_DANGER = 5,
	NOTIFY_CONTEXT_LIGHT = 6,
	NOTIFY_CONTEXT_DARK = 7;

function Notify(Message, Data){
	var root, node, context;

	Message = def_parameter(Message, '');
	Data = ObjectDefault(
		def_parameter(Data, {}),
		{
			'context': NOTIFY_CONTEXT_PRIMARY,
			'icon': '',
			'timeout': 3000
		}
	);

	if(Message != ''){
		if(!$('div#notify').exists()){
			$('body').append('<div id="notify" />');
			$('div#notify').on('DOMSubtreeModified', function(){
				if($(this).children().length == 0){
					$(this).remove();
				}
			});
		}

		root = document.querySelector('div#notify');
		if(root){
			switch(def_option(Data.context, [NOTIFY_CONTEXT_PRIMARY, NOTIFY_CONTEXT_SECONDARY, NOTIFY_CONTEXT_SUCCESS, NOTIFY_CONTEXT_INFO, NOTIFY_CONTEXT_WARNING, NOTIFY_CONTEXT_DANGER, NOTIFY_CONTEXT_LIGHT, NOTIFY_CONTEXT_DARK], NOTIFY_CONTEXT_PRIMARY)){
				case NOTIFY_CONTEXT_SECONDARY:	context = 'alert-secondary';	break;
				case NOTIFY_CONTEXT_SUCCESS:	context = 'alert-success';		break;
				case NOTIFY_CONTEXT_INFO:		context = 'alert-info';			break;
				case NOTIFY_CONTEXT_WARNING:	context = 'alert-warning';		break;
				case NOTIFY_CONTEXT_DANGER:		context = 'alert-danger';		break;
				case NOTIFY_CONTEXT_LIGHT:		context = 'alert-light';		break;
				case NOTIFY_CONTEXT_DARK:		context = 'alert-dark';			break;
				default:						context = 'alert-primary';		break;
			}

			node = document.createElement('div');
			node.setAttribute('class', 'alert ' + context + ' fade show');
			node.setAttribute('role', 'alert');
			node.innerHTML = (Data.icon != '' ? '<i class="' + Data.icon + '"></i>' : '') +
				Message +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
					'<span aria-hidden="true">&times;</span>' +
				'</button>';

			root.appendChild(node);

			if(Data.timeout > 0){
				setTimeout(function(){
					try{
						node.parentNode.removeChild(node);
					}catch(error){
						console.warn('Notify', error);
					}
				}, Data.timeout);
			}
		}
	}
};