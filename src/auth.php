<?php
	include("include.php");

	$data = ObjectDefault(
		array_merge(
			$_POST,
			json_decode(file_get_contents("php://input"), true)
		),
		array(
			"username" => "",
			"password" => ""
		)
	);

	APIInit(API_CODE_UNAUTHORIZED, false);

	if(($data["username"] != "") && ($data["password"] != "")){
		SQLThread(function() use($data){
			$username = fSQL($data["username"]);
			$password = base64_encode(sha1($data["password"], true));

			$record = SQLQuery(
				"SELECT " .
					"`_authentication`.`account`, " .
					"`_authentication`.`token`, " .
					"`_authentication`.`time` " .
				"FROM `_authentication` " .
				"WHERE " .
					"(`_authentication`.`username` LIKE '" . $username . "') AND " .
					"(`_authentication`.`password` LIKE '" . $password . "') " .
				"LIMIT 1"
			);

			if(count($record) > 0){
				if($record[0]["token"] == ""){
					$buffer = fSQL(strtolower(Generate(40)));

					SQLExecute(
						"INSERT INTO `authentication`(`account`, `token`, `time`) " .
						"VALUES(" .
							intval($record[0]["account"]) . ", " .
							"'" . $buffer . "', " .
							"DATE_ADD(NOW(), INTERVAL 3 HOUR)" .
						") ON DUPLICATE KEY UPDATE " .
							"`token` = '" . $buffer . "', " .
							"`time` = DATE_ADD(NOW(), INTERVAL 3 HOUR)"
					);

					$record = SQLQuery(
						"SELECT " .
							"`_authentication`.`token`, " .
							"`_authentication`.`time` " .
						"FROM `_authentication` " .
						"WHERE " .
							"(`_authentication`.`username` LIKE '" . $username . "') AND " .
							"(`_authentication`.`password` LIKE '" . $password . "') " .
						"LIMIT 1"
					);

					if(count($record) > 0){
						$token = $record[0]["token"];
						$time = $record[0]["time"];
					}else{
						$token = "";
						$time = "1970-01-01 00:00:00";
					}
				}else{
					$token = $record[0]["token"];
					$time = $record[0]["time"];
				}

				APICode(API_CODE_SUCCESS);
				APIResult(array("token" => $token, "time" => $time));
			}else{
				APIMessage("Invalid Account", API_MESSAGE_WARNING);
			}
		});
	}

	APIFlush();
?>