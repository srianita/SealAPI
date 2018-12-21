<?php
	include("include.php");

	$data = ObjectDefault($_POST, array(
		"username" => "",
		"password" => "",
		"country" => "",
		"state" => "",
		"location" => "",
		"organization" => "",
		"unit" => "",
		"fullname" => "", // Common Name
		"email" => ""
	));

	APIInit(API_CODE_BAD_REQUEST, false);

	$empty = false;
	foreach($data as $key => $value){
		if(trim($value) == ""){
			$empty = true;
			APICode(API_CODE_BAD_REQUEST);
			APIMessage("'" . $key . "' is empty", API_MESSAGE_WARNING);
		}
	}

	$email = true;
	if(!filter_var($data["email"], FILTER_VALIDATE_EMAIL)){
		$email = false;
		APICode(API_CODE_DATA_INVALID);
		APIMessage("invalid email", API_MESSAGE_WARNING);
	}

	if($email && !$empty){
		SQLThread(function() use($data){
			$record = SQLQuery(
				"SELECT COUNT(0) AS `count` " .
				"FROM `account` " .
				"WHERE `account`.`username` LIKE '" . fSQL($data["username"]) . "'"
			);

			$account = intval($record[0]["count"]);
			if($account > 0){
				APICode(API_CODE_BAD_REQUEST);
				APIMessage("username already in used", API_MESSAGE_WARNING);
			}

			$record = SQLQuery(
				"SELECT COUNT(0) AS `count` " .
				"FROM `profile` " .
				"WHERE `profile`.`email` LIKE '" . fSQL($data["email"]) . "'"
			);

			$profile = intval($record[0]["count"]);
			if($profile > 0){
				APICode(API_CODE_BAD_REQUEST);
				APIMessage("email already in used", API_MESSAGE_WARNING);
			}

			if(($account == 0) && ($profile == 0)){
				$buffer = SQLExecute(
					"INSERT INTO `account`(`username`, `password`) " .
					"VALUES(" .
						"'" . fSQL($data["username"]) . "', " .
						"'" . base64_encode(sha1($data["password"], true)) . "'" .
					")"
				);

				if($buffer["insert"] > 0){
					$buffer = SQLExecute(
						"INSERT INTO `profile`(`account`, `country`, `state`, `location`, `organization`, `unit`, `common`, `email`) " .
						"VALUES(" .
							$buffer["insert"] . ", " .
							"'" . fSQL($data["country"]) . "', " .
							"'" . fSQL($data["state"]) . "', " .
							"'" . fSQL($data["location"]) . "', " .
							"'" . fSQL($data["organization"]) . "', " .
							"'" . fSQL($data["unit"]) . "', " .
							"'" . fSQL($data["fullname"]) . "', " .
							"'" . fSQL($data["email"]) . "'" .
						")"
					);

					if($buffer["affect"] > 0){
						APICode(API_CODE_SUCCESS);
						APIResult(true);
					}else{
						APICode(API_CODE_INERNAL_ERROR);
					}
				}else{
					APICode(API_CODE_INERNAL_ERROR);
				}
			}
		});
	}

	APIFlush();
?>