<?php
	function Generate($Length = 8){
		$ret = "";

		for($pointer = 0; $pointer < $Length; $pointer++){
			$rnd = rand(0, 35);
			$ret .= chr($rnd < 10 ? $rnd + 48 : $rnd + 55);
		}

		return $ret;
	}

	function GetToken(){
		$header = apache_request_headers();
		$authorization = explode(" ", isset($header["Authorization"]) ? strtolower($header["Authorization"]) : (isset($header["authorization"]) ? strtolower($header["authorization"]) : ""), 2);
		return (count($authorization) > 1 ? $authorization[1] : "");
	}

	function FileNormalize($Data){
		$ret = array();

		if(is_array($Data["name"])){
			$count = count($Data["name"]);
			for($index = 0; $index < $count; $index++){
				$buffer = array();

				foreach(array("name", "type", "tmp_name", "error", "size") as $key){
					$buffer[$key] = $Data[$key][$index];
				}

				array_push($ret, $buffer);
			}
		}else{
			array_push($ret, $Data);
		}

		return $ret;
	}

	function ObjectDefault($hObject = array(), $Default = array()){
		$ret = array();

		if(is_array($hObject)){
			foreach($Default as $key => $value){
				if(isset($hObject[$key])){
					$wparam = gettype($hObject[$key]);
					if(($wparam == "integer") || ($wparam == "double")){
						$wparam = "number";
					}

					$lparam = gettype($value);
					if(($lparam == "integer") || ($lparam == "double")){
						$lparam = "number";
					}

					$ret[$key] = ($wparam == $lparam ? $hObject[$key] : $value);
				}else{
					$ret[$key] = $value;
				}
			}
		}else{
			$ret = $Default;
		}

		return $ret;
	}

	function GetExtension(&$Result, $Path, $Extension){
		if(is_dir($Path)){
			$Extension = strtolower($Extension);
			foreach(scandir($Path) as $scandir){
				$file = $Path . DIRECTORY_SEPARATOR . $scandir;
				if(
					is_file($file) && (!in_array($file, $Result)) &&
					(strtolower(pathinfo($file, PATHINFO_EXTENSION)) == $Extension)
				){
					array_push($Result, $file);
				}
			}
		}
	}

	function NavTabs($Data){
		$tablist = array();
		$tabcontent = array();
		$active = true;

		foreach($Data as $text => $content){
			$uid = strtolower("uid" . Generate());

			array_push($tablist, "<a" .
				" id=\"tablist-" . $uid . "\"" .
				" class=\"list-group-item list-group-item-action" . ($active ? " active" : "") . "\"" .
				" href=\"#tabcontent-" . $uid . "\"" .
				" role=\"tab\"" .
				" data-toggle=\"list\"" .
				">" . $text . "</a>"
			);

			array_push($tabcontent, "<div" .
				" id=\"tabcontent-" . $uid . "\"" .
				" class=\"tab-pane fade" . ($active ? " show active" : "") . "\"" .
				" role=\"tabpanel\"" .
				" aria-labelledby=\"tabcontent-" . $uid . "\"" .
				">" . $content . "</div>"
			);

			$active = false;
		}

		return "<div class=\"row\">" .
			"<div class=\"col-ms-4 col-md-3\">" .
				"<div class=\"list-group\" role=\"tablist\">" . implode("", $tablist) . "</div>" .
			"</div>" .
			"<div class=\"col-ms-8 col-md-9\">" .
				"<div class=\"tab-content\">" . implode("", $tabcontent) . "</div>" .
			"</div>" .
		"</div>";
	}

	function HtmlContent($Name){
		$file = "html" . DIRECTORY_SEPARATOR . $Name . ".html";
		$ret = (is_file($file) ? file_get_contents($file) : "");
		foreach(array("\t", "\n") as $search){
			$ret = str_replace($search, "", $ret);
		}

		return $ret;
	}
?>