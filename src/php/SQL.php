<?php
	function fSQL($hAlloc = ""){
		$ret = $hAlloc;

		foreach(array(
			"\\" => "\\\\",
			"\0" => "\\0",
			"\n" => "\\n",
			"\r" => "\\r",
			"'" => "\\'",
			"\"" => "\\\""
		) as $search => $replace){
			$ret = str_replace($search, $replace, $ret);
		}

		return $ret;
	}

	function SQLThread($Callback){
		$ret = false;
		if(is_callable($Callback)){
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT);

			if($mysqli->connect_errno){
				error_log("SQLThread: " . $mysqli->connect_error);
			}else{
				$ret = true;
				$_SESSION["sql"] = $mysqli;
				$Callback();
				$mysqli->close();
				unset($_SESSION["sql"]);
			}
		}

		return $ret;
	}

	function SQLQuery($Command){
		$ret = array();

		if($result = $_SESSION["sql"]->query($Command)){
			$ret = $result->fetch_all(MYSQLI_ASSOC);
			$result->close();
		}else{
			error_log("SQLQuery(" . $Command . "): " . $_SESSION["sql"]->error);
		}

		return $ret;
	}

	function SQLExecute($Command){
		$_SESSION["sql"]->query($Command);

		if($_SESSION["sql"]->errno){
			$ret = array("error" => true, "effect" => 0, "insert" => 0);
			error_log("SQLExecute(" . $Command . "): " . $_SESSION["sql"]->error);
		}else{
			$ret = array(
				"error" => false,
				"affect" => $_SESSION["sql"]->affected_rows,
				"insert" => $_SESSION["sql"]->insert_id
			);
		}

		return $ret;
	}
?>