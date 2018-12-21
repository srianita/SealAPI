<?php
	include("include.php");

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
	GetExtension($script, "js" . DIRECTORY_SEPARATOR . "module", "js");
	GetExtension($script, "js", "js");

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

"<title>SealAPI</title>" .
	"</head>" .
	"<body>" .
"<div class=\"container-fluid\">" .
	"<div class=\"jumbotron text-white rounded bg-dark mt-3\">" .
		"<h1 class=\"font-italic\">SealAPI - Simple concept sealing digital image</h1>" .
		"<p class=\"text-justify\">" .
			"Don't argue with people who write with digital ink and pay by the kilowatt-hour. <br />" .
			"Controlling complexity is the essence of computer programming." .
		"</p>" .
	"</div>" .
	"<hr />" .
	NavTabs(array(
		"Introduction" => HtmlContent("introduction"),
		"Registration" => HtmlContent("registration"),
		"A. A. A." => HtmlContent("authentication"),
		"Sealing Image" => HtmlContent("seal"),
		"Verification" => HtmlContent("verify")
	)) .
"</div>" .
	"</body>" .
"</html>"
	);
?>