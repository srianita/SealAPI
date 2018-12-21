<?php
	define("SEAL_FONTSIZE",				12);
	define("SEAL_FONTFAMILY",			"font/chunkfive.regular.ttf");

	define("SEAL_WATERMARK_PADDING",	8);

	function SealCode(){
		$ret = strtolower(Generate(20));
		$flag = true;

		while($flag){
			$record = SQLQuery(
				"SELECT COUNT(0) AS `count` " .
				"FROM `seal` " .
				"WHERE `seal`.`code` LIKE '" . fSQL($ret) . "'"
			);

			if(intval($record[0]["count"]) == 0){
				$flag = false;
			}else{
				$ret = strtolower(Generate(20));
			}
		}

		return $ret;
	}

	function SealResult($Account, &$Replica, &$Watermark, $Domain, $Code, $Mime, $Extension, $URL, $Identify){
		$record = SQLQuery(
			"SELECT " .
				"`_seal`.`mime`, " .
				"`_seal`.`url`, " .
				"`_seal`.`replica_url`, " .
				"`_seal`.`replica_path`, " .
				"`_seal`.`watermark_url`, " .
				"`_seal`.`watermark_path`, " .
				"`_seal`.`time` " .
			"FROM `_seal` " .
			"WHERE `_seal`.`identify` LIKE '" . fSQL($Identify) . "' " .
			"LIMIT 1"
		);

		if(count($record) > 0){
			if(DIRECTORY_SEPARATOR != "/"){
				$replica_path = str_replace("/", DIRECTORY_SEPARATOR, $record[0]["replica_path"]);
				$watermark_path = str_replace("/", DIRECTORY_SEPARATOR, $record[0]["watermark_path"]);
			}else{
				$replica_path = $record[0]["replica_path"];
				$watermark_path = $record[0]["watermark_path"];
			}

			$ret = array(
				"mime" => $record[0]["mime"],
				"url" => $Domain . $record[0]["url"],
				"replica" => array(
					"url" => $Domain . $record[0]["replica_url"],
					"md5" => md5_file($replica_path),
					"sha1" => sha1_file($replica_path)
				),
				"watermark" => array(
					"url" => $Domain . $record[0]["watermark_url"],
					"md5" => md5_file($watermark_path),
					"sha1" => sha1_file($watermark_path)
				),
				"time" => $record[0]["time"]
			);
		}else{
			$buffer = SQLExecute(
				"INSERT INTO `seal`(`account`, `code`, `mime`, `extension`, `identify`, `time`) " .
				"VALUES(" .
					$Account . ", " .
					"'" . fSQL($Code) . "', " .
					"'" . fSQL($Mime) . "', " .
					"'" . fSQL($Extension) . "', " .
					"'" . fSQL($Identify) . "', " .
					"NOW()" .
				")"
			);

			if($buffer["affect"] > 0){
				$replica_url = $Domain . "/file/" . $Code . "-replica." . $Extension;
				$watermark_url = $Domain . "/file/" . $Code . "-watermark." . $Extension;
				$replica_path = "file" . DIRECTORY_SEPARATOR . $Code . "-replica." . $Extension;
				$watermark_path = "file" . DIRECTORY_SEPARATOR . $Code . "-watermark." . $Extension;

				switch($Extension){
					case "png":
						imagepng($Replica, $replica_path);
						imagepng($Watermark, $watermark_path);
						break;
					case "jpg":
						imagejpeg($Replica, $replica_path);
						imagejpeg($Watermark, $watermark_path);
						break;
					case "bmp":
						imagebmp($Replica, $replica_path);
						imagebmp($Watermark, $watermark_path);
						break;
				}

				$ret = array(
					"mime" => $Mime,
					"url" => $URL,
					"replica" => array(
						"url" => $replica_url,
						"md5" => md5_file($replica_path),
						"sha1" => sha1_file($replica_path)
					),
					"watermark" => array(
						"url" => $watermark_url,
						"md5" => md5_file($watermark_path),
						"sha1" => sha1_file($watermark_path)
					),
					"time" => "1970-01-01 00:00:00"
				);
			}else{
				APICode(API_CODE_INERNAL_ERROR);
				$ret = null;
			}
		}

		return $ret;
	}

	function SealThread($Account, $Upload){
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
					$code = SealCode();
					$identify = array();
					$trustseal_url = $domain . "/trustseal/" . $code;
					$trustseal_char = str_split($trustseal_url);
					$trustseal_length = count($trustseal_char);

					$width = imagesx($image);
					$height = imagesy($image);

					$replica = imagecreatetruecolor($width, $height);
					imagealphablending($replica, false);
					imagesavealpha($replica, true);

					$watermark = imagecreatetruecolor($width, $height);
					imagealphablending($watermark, false);
					imagesavealpha($watermark, true);

					for($top = 0; $top < $height; $top++){
						for($left = 0; $left < $width; $left++){
							$color = imagecolorat($image, $left, $top) & 0xFFFFFF;
							array_push($identify, $color);
							$red = ($color >> 16) & 0xFF;
							$green = ($color >> 8) & 0xFF;
							$blue = $color & 0xFF;

							$pointer = $left + ($top * $width);
							$alpha = ($pointer < $trustseal_length ? ord($trustseal_char[$pointer]) : 0);

							$replica_color = imagecolorallocatealpha($replica, $red, $green, $blue, $alpha);
							$watermark_color = imagecolorallocatealpha($watermark, $red, $green, $blue, $alpha);

							imagesetpixel($replica, $left, $top, $replica_color);
							imagesetpixel($watermark, $left, $top, $watermark_color);

							imagecolordeallocate($replica, $replica_color);
							imagecolordeallocate($watermark, $watermark_color);
						}
					}

					$color = imagecolorallocate($watermark, 0x7F, 0x7F, 0x7F);
					$box = imagettfbbox(SEAL_FONTSIZE, 0, SEAL_FONTFAMILY, $trustseal_url);
					imagettftext(
						$watermark, SEAL_FONTSIZE, 0,
						($width - (($box[2] - $box[0]) + SEAL_WATERMARK_PADDING)),
						($height - (($box[1] - $box[7]) + SEAL_WATERMARK_PADDING)),
						$color, SEAL_FONTFAMILY, $trustseal_url
					);
					imagecolordeallocate($watermark, $color);

					$result = SealResult(
						$Account, $replica, $watermark,
						$domain, $code, $mime,
						$map[$mime], $trustseal_url,
						sha1(json_encode($identify))
					);

					if(is_array($result)){
						$ret[$data["name"]] = $result;
					}

					imagedestroy($replica);
					imagedestroy($watermark);
					imagedestroy($image);
				}
			}else{
				APIMessage($data["name"] . "(" . $mime . "): Unsupported Mime Type", API_MESSAGE_WARNING);
			}
		}

		return $ret;
	}
?>