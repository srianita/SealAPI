<?php
	include("include.php");

	function TrustSealInput($Text, $Value, $Type, $Append = "", $ID = ""){
		$uid = "uid" . strtolower(Generate());

		return "<div class=\"input-group mb-3\">" .
			"<div class=\"input-group-prepend\">" .
				"<span class=\"input-group-text\" id=\"" . $uid . "\">" . $Text . "</span>" .
			"</div>" .
			"<input" .
				($ID != "" ? " id=\"" . $ID . "\"" : "") .
				" class=\"form-control\"" .
				" type=\"" . $Type . "\"" .
				" value=\"" . $Value . "\"" .
				" aria-label=\"" . $Text . "\"" .
				" aria-describedby=\"" . $uid . "\"" .
				" readonly />" .
			($Append != "" ? "<div class=\"input-group-append\">" . $Append . "</div>" : "") .
		"</div>";
	}

	SQLThread(function(){
		$record = SQLQuery(
			"SELECT " .
				"`_trustseal`.`fullname`, " .
				"`_trustseal`.`organization`, " .
				"`_trustseal`.`unit`, " .
				"`_trustseal`.`email`, " .

				"`_trustseal`.`country`, " .
				"`_trustseal`.`state`, " .
				"`_trustseal`.`location`, " .

				"`_trustseal`.`mime`, " .
				"`_trustseal`.`time`, " .

				"`_trustseal`.`replica_url`, " .
				"`_trustseal`.`replica_path`, " .
				"`_trustseal`.`watermark_url`, " .
				"`_trustseal`.`watermark_path` " .
			"FROM `_trustseal` " .
			"WHERE `_trustseal`.`code` LIKE '" . fSQL((isset($_GET["code"]) ? $_GET["code"] : "")) . "' " .
			"LIMIT 1"
		);

		if(count($record) > 0){
			$data = $record[0];
			$domain = (isset($_SERVER["REQUEST_SCHEME"]) ? $_SERVER["REQUEST_SCHEME"] . "://" : "//") .
				(isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : "localhost");

			$style = array();
			GetExtension($style, "css", "css");

			$script = array(
				"js" . DIRECTORY_SEPARATOR . "dependency" . DIRECTORY_SEPARATOR . "jquery-3.3.1.min.js",
				"js" . DIRECTORY_SEPARATOR . "dependency" . DIRECTORY_SEPARATOR . "popper.min.js",
				"js" . DIRECTORY_SEPARATOR . "dependency" . DIRECTORY_SEPARATOR . "bootstrap.min.js"
			);
			GetExtension($script, "js" . DIRECTORY_SEPARATOR . "dependency", "js");
			GetExtension($script, "js" . DIRECTORY_SEPARATOR . "perry", "js");
			GetExtension($script, "js" . DIRECTORY_SEPARATOR . "pneuma", "js");
			GetExtension($script, "js", "js");

			$replica = getimagesize($data["replica_path"]);
			$watermark = getimagesize($data["watermark_path"]);


			echo(
"<!DOCTYPE html>" .
"<html>" .
	"<head>" .
"<meta charset=\"utf-8\" />" .
"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\" />" .

implode("", array_map(function($data){
	return "<link rel=\"stylesheet\" href=\"/" . str_replace("\\", "/", $data) . "\" />";
}, $style)) .

implode("", array_map(function($data){
	return "<script script=\"javascript\" src=\"/" . str_replace("\\", "/", $data) . "\" defer></script>";
}, $script)) .

"<title>Trust Seal</title>" .
	"</head>" .
	"<body>" .
"<div class=\"container-fluid trustseal\">" .
	"<div class=\"card mt-3 mb-3\">" .
		"<h5 class=\"card-header\">Profile</h5>" .
		"<div class=\"card-body\">" .
			"<div class=\"row\">" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Fullname", $data["fullname"], "text") .
					TrustSealInput("Organization", $data["organization"], "text") .
					TrustSealInput("Organization Unit", $data["unit"], "text") .
					TrustSealInput(
						"E-mail", $data["email"], "email",
						"<a class=\"btn btn-primary\" href=\"mailto:" . $data["email"] . "\">" .
							"<i class=\"fas fa-envelope\"></i>" .
						"</a>"
					) .
				"</div>" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Country", $data["country"], "text") .
					TrustSealInput("State", $data["state"], "text") .
					TrustSealInput("Location", $data["location"], "text") .
				"</div>" .
			"</div>" .
		"</div>" .
	"</div>" .

	"<div class=\"card mb-3\">" .
		"<h5 class=\"card-header\">Seal</h5>" .
		"<div class=\"card-body\">" .
			"<div class=\"row\">" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Mime Type", $data["mime"], "text") .
				"</div>" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Time", $data["time"], "text") .
				"</div>" .
			"</div>" .
		"</div>" .
	"</div>" .

	"<div class=\"card mb-3\">" .
		"<h5 class=\"card-header\">Replica</h5>" .
		"<div class=\"card-body\">" .
			"<div class=\"row\">" .
				"<div class=\"col-md-12\">" .
					TrustSealInput(
						"URL", $domain . $data["replica_url"], "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#replica_url');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"replica_url"
					) .
				"</div>" .
			"</div>" .
			"<div class=\"row\">" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Mime Type", mime_content_type($data["replica_path"]), "text") .
					TrustSealInput("Resolution", (isset($replica[0]) ? $replica[0] : 0) . " x " . (isset($replica[1]) ? $replica[1] : 0), "text") .
					TrustSealInput("File Size", filesize($data["replica_path"]), "text") .
					TrustSealInput("Modified Time", date(DATE_RFC822, filemtime($data["replica_path"])), "text") .
					TrustSealInput(
						"MD5", md5_file($data["replica_path"]), "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#replica_md5');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"replica_md5"
					) .
					TrustSealInput(
						"SHA1", sha1_file($data["replica_path"]), "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#replica_sha1');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"replica_sha1"
					) .
				"</div>" .
				"<div class=\"col-md-6\">" .
					"<img class=\"img-thumbnail\" src=\"" . $data["replica_url"] . "\" />" .
				"</div>" .
			"</div>" .
		"</div>" .
	"</div>" .

	"<div class=\"card mb-3\">" .
		"<h5 class=\"card-header\">Watermark</h5>" .
		"<div class=\"card-body\">" .
			"<div class=\"row\">" .
				"<div class=\"col-md-12\">" .
					TrustSealInput(
						"URL", $domain . $data["watermark_url"], "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#watermark_url');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"watermark_url"
					) .
				"</div>" .
			"</div>" .
			"<div class=\"row\">" .
				"<div class=\"col-md-6\">" .
					TrustSealInput("Mime Type", mime_content_type($data["watermark_path"]), "text") .
					TrustSealInput("Resolution", (isset($watermark[0]) ? $watermark[0] : 0) . " x " . (isset($watermark[1]) ? $watermark[1] : 0), "text") .
					TrustSealInput("File Size", filesize($data["watermark_path"]), "text") .
					TrustSealInput("Modified Time", date(DATE_RFC822, filemtime($data["watermark_path"])), "text") .
					TrustSealInput(
						"MD5", md5_file($data["watermark_path"]), "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#watermark_md5');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"watermark_md5"
					) .
					TrustSealInput(
						"SHA1", sha1_file($data["watermark_path"]), "text",
						"<button class=\"btn btn-info\" onClick=\"CopyInput('#watermark_sha1');\">" .
							"<i class=\"fas fa-copy\"></i>" .
						"</button>",
						"watermark_sha1"
					) .
				"</div>" .
				"<div class=\"col-md-6\">" .
					"<img class=\"img-thumbnail\" src=\"" . $data["watermark_url"] . "\" />" .
				"</div>" .
			"</div>" .
		"</div>" .
	"</div>" .
"</div>" .
	"</body>" .
"</html>"
			);
		}else{
			response_code(404);
		}
	});

?>