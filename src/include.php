<?php
	if(is_dir("php")){
		foreach(scandir("php") as $scandir){
			$file = "php" . DIRECTORY_SEPARATOR . $scandir;
			if(is_file($file) && (strtolower(pathinfo($file, PATHINFO_EXTENSION)) == "php")){
				include($file);
			}
		}
	}
?>