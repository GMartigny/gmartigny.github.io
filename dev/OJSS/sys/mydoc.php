<?php
include_once("topbarre.html");

$doc = opendir("../doc/");

if($doc){
	echo "<ul>";
	while (($file = readdir($doc)) !== false){
		if($file !== "." && $file !== "..")
			echo "<li class='clickable'>$file</li>";
	}
	echo "</ul>";
	closedir($doc);
}