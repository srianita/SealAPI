<?php
	include("include.php");

	$token = GetToken();
	$seal = (isset($_FILES["seal"]) ? FileNormalize($_FILES["seal"]) : array());
	$verify = (isset($_FILES["verify"]) ? FileNormalize($_FILES["verify"]) : array());

	APIInit(API_CODE_UNAUTHORIZED, false);

	if($token != ""){
		SQLThread(function() use($token, $seal, $verify){
			$record = SQLQuery(
				"SELECT `_authentication`.`account` " .
				"FROM `_authentication` " .
				"WHERE `_authentication`.`token` LIKE '" . fSQL($token) . "' " .
				"LIMIT 1"
			);

			if(count($record) > 0){
				$thread_seal = SealThread(intval($record[0]["account"]), $seal);
				$thread_verify = VerifyThread($verify);

				APICode((
					(count($thread_seal) > 0) ||
					(count($thread_verify) > 0) ?
					API_CODE_SUCCESS : API_CODE_BAD_REQUEST
				));

				APIResult(array(
					"seal" => $thread_seal,
					"verify" => $thread_verify
				));
			}else{
				APIMessage("Invalid Token", API_MESSAGE_WARNING);
			}
		});
	}

	APIFlush();
?>