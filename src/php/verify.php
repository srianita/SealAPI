<?php
	function VerifyThread($Upload){
		$ret = array();
		$domain = (isset($_SERVER["REQUEST_SCHEME"]) ? $_SERVER["REQUEST_SCHEME"] . "://" : "//") .
			(isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : "localhost");

		$map = array(
			"image/png" => "png",
			"image/jpg" => "jpg",
			"image/jpeg" => "jpg",
			"image/bmp" => "bmp"
		);

		foreach($Upload as $data){
			$mime = mime_content_type($data["tmp_name"]);

			if(isset($map[$mime])){
				switch($map[$mime]){
					case "png":
						$image = imagecreatefrompng($data["tmp_name"]);
						break;
					case "jpg":
						$image = imagecreatefromjpeg($data["tmp_name"]);
						break;
					case "bmp":
						$image = imagecreatefrombmp($data["tmp_name"]);
						break;
				}

				if($image){
					$width = imagesx($image);
					$height = imagesy($image);
					$trustseal = array();

					for($top = 0; $top < $height; $top++){
						for($left = 0; $left < $width; $left++){
							$color = imagecolorat($image, $left, $top);
							$alpha = ($color >> 24) & 0xFF;
							if($alpha == 0){
								$top = $height;
								$left = $width;
							}else{
								array_push($trustseal, chr($alpha));
							}
						}
					}

					$url = implode("", $trustseal);
					if($url == ""){
						APIMessage($data["name"] . ": Not Sealed Image", API_MESSAGE_WARNING);
					}else{
						if(filter_var($url, FILTER_VALIDATE_URL)){
							$ret[$data["name"]] = $url;
						}else{
							APIMessage($data["name"] . ": Invalid Sealed Image", API_MESSAGE_WARNING);
						}
					}

					imagedestroy($image);
				}
			}else{
				APIMessage($data["name"] . "(" . $mime . "): Unsupported Mime Type", API_MESSAGE_WARNING);
			}
		}

		return $ret;
	}
?>