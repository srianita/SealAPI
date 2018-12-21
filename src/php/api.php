<?php
	define("API_CODE_SUCCESS",			0x00);
	define("API_CODE_BAD_REQUEST",		0x01);
	define("API_CODE_UNAUTHORIZED",		0x02);
	define("API_CODE_METHOD_INVALID",	0x04);
	define("API_CODE_METHOD_EXCEPTION",	0x08);
	define("API_CODE_DATA_INVALID",		0x10);
	define("API_CODE_INERNAL_ERROR",	0x20);
	define("API_CODE_FATAL_ERROR",		0xFF);

	define("API_MESSAGE_NONE",			0);
	define("API_MESSAGE_PRIMARY",		1);
	define("API_MESSAGE_INFO",			2);
	define("API_MESSAGE_WARNING",		3);
	define("API_MESSAGE_DANGER",		4);

	function APIInit($Code = API_CODE_NONE, $Result = null){
		$_SESSION["api_code"] = $Code;
		$_SESSION["api_result"] = $Result;
		$_SESSION["api_message"] = array();
	}

	function APICode($Code){
		$_SESSION["api_code"] = $Code;
	}

	function APIResult($Result){
		$_SESSION["api_result"] = $Result;
	}

	function APIMessage($Message, $Type = API_MESSAGE_NONE){
		array_push($_SESSION["api_message"], array(
			"type" => $Type,
			"text" => $Message
		));
	}

	function APIFlush(){
		$content = json_encode(array(
			"code" => $_SESSION["api_code"],
			"result" => $_SESSION["api_result"],
			"message" => $_SESSION["api_message"]
		));

		header("Content-type: application/json; charset=UTF-8");
		header("Content-Length: " . strlen($content));
		echo($content);
	}

	function APIReset(){
		$_SESSION["api_account"] = 0;
		$_SESSION["api_error"] = API_CODE_NONE;
		$_SESSION["api_message"] = array();

		if(isset($_SESSION["api_method"])){
			$buffer = array();
			foreach($_SESSION["api_method"] as $method => $privilege){
				if(function_exists($method)){
					$buffer[$method] = $privilege;
				}

				$_SESSION["api_method"] = $buffer;
			}
		}
	}

	function APISetMessage($Text, $Context, $Icon){
		array_push($_SESSION["api_message"], array(
			"text" => $Text,
			"context" => $Context,
			"icon" => $Icon
		));
	}

	function APIGetMessage(){
		return (isset($_SESSION["api_message"]) ? $_SESSION["api_message"] : array());
	}

	function APISetError($Error, $Message){
		$_SESSION["api_error"] = $_SESSION["api_error"] | $Error;
		APISetMessage($Message, NOTIFY_CONTEXT_DANGER, "fas fa-times-circle");
	}

	function APIGetError(){
		return (isset($_SESSION["api_error"]) ? $_SESSION["api_error"] : 0);
	}

	function APIMethods($Data){
		if(!isset($_SESSION["api_method"])){ $_SESSION["api_method"] = array(); }

		foreach($Data as $method => $privilege){
			if(function_exists($method)){
				$_SESSION["api_method"][$method] = $privilege;
			}
		}
	}

	function APIAuthorize($Token, $Method){
		$ret = false;

		if(isset($_SESSION["api_method"][$Method])){
			if($_SESSION["api_method"][$Method] == 0){
				$ret = true;
			}else{
				$record = SQLQuery(
					"SELECT " .
						"`account`.`handle`, " .
						"`account`.`privilege` " .
					"FROM `account` " .
					"WHERE `account`.`token` LIKE '" . fSQL($Token) . "'"
				);

				if(count($record) > 0){
					if((intval($record[0]["privilege"]) & $_SESSION["api_method"][$Method]) == $_SESSION["api_method"][$Method]){
						$_SESSION["api_account"] = intval($record[0]["handle"]);
						$ret = true;
					}else{
						APISetError(API_CODE_UNAUTHORIZED, "Unauthorized");
					}
				}else{
					APISetMessage("Invalid Account", NOTIFY_CONTEXT_WARNING, "fas fa-exclamation-triangle");
				}
			}
		}else{
			APISetError(API_CODE_METHOD_INVALID, "Invalid Method '" . $Method . "'");
		}

		return $ret;
	}

	function APIAccount(){
		return (isset($_SESSION["api_account"]) ? $_SESSION["api_account"] : 0);
	}
?>