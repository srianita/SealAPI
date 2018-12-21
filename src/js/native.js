function CopyInput(hWnd){
	var hDC = document.querySelector(hWnd);

	if(hDC){
		hDC.select();
		if(document.execCommand('copy')){
			Notify('Copy to Clipboard: ' + hDC.value, {
				'context': NOTIFY_CONTEXT_SUCCESS,
				'icon': 'fas fa-check-circle'
			});
		}
	}
};